const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const {
  orderStatusUpdateEmail,
  passwordResetEmail,
  orderConfirmationEmail,
  returnStatusUpdateEmail
} = require('../utils/emailTemplates');

// Admin middleware - all routes require auth and admin
router.use(auth);
router.use(adminAuth);

// ============ PRODUCTS MANAGEMENT ============

// Get all products with pagination and filters
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.availabilityType) filter.availabilityType = req.query.availabilityType;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new product
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// ============ ORDERS MANAGEMENT ============

// Get all orders with pagination
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order details
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, isDelivered, isPaid, note } = req.body;
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.status;

    // Track status history
    if (status && status !== order.status) {
      order.statusHistory.push({
        status,
        timestamp: Date.now(),
        note: note || `Status changed to ${status}`,
        updatedBy: req.user.id
      });
      order.status = status;

      if (status === 'Cancelled') {
        order.cancelledAt = Date.now();
        order.cancelledBy = req.user.id;
      }
    }

    if (isDelivered !== undefined) {
      order.isDelivered = isDelivered;
      if (isDelivered) order.deliveredAt = Date.now();
    }
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) {
        order.paidAt = Date.now();
      } else {
        order.paidAt = null;
      }
    }

    await order.save();

    // Send email notification if status changed
    if (status && status !== oldStatus && order.user && order.user.email) {
      try {
        const emailContent = orderStatusUpdateEmail(order, status);
        await sendEmail({
          to: order.user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order', error: error.message });
  }
});

// Cancel order
router.put('/orders/:id/cancel', async (req, res) => {
  try {
    const { cancellationReason, note } = req.body;
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered orders' });
    }

    order.status = 'Cancelled';
    order.cancellationReason = cancellationReason;
    order.cancelledBy = req.user.id;
    order.cancelledAt = Date.now();

    // Add to status history
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: Date.now(),
      note: note || cancellationReason || 'Order cancelled',
      updatedBy: req.user.id
    });

    await order.save();

    // Send email notification
    if (order.user && order.user.email) {
      try {
        const emailContent = orderStatusUpdateEmail(order, 'Cancelled');
        await sendEmail({
          to: order.user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
      }
    }

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(400).json({ message: 'Failed to cancel order', error: error.message });
  }
});

// Toggle payment status
router.put('/orders/:id/payment', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = !order.isPaid;
    if (order.isPaid) {
      order.paidAt = Date.now();
    } else {
      order.paidAt = null;
    }

    await order.save();
    res.json({ message: 'Payment status updated', order });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update payment status', error: error.message });
  }
});

// ============ USERS MANAGEMENT ============

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user admin status
router.put('/users/:id/admin', async (req, res) => {
  try {
    const { isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user', error: error.message });
  }
});

// ============ DASHBOARD STATISTICS ============

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const immediateProducts = await Product.countDocuments({ availabilityType: 'immediate' });
    const madeToOrderProducts = await Product.countDocuments({ availabilityType: 'made-to-order' });

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      }
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      deliveredOrders,
      immediateProducts,
      madeToOrderProducts,
      recentOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============ TEST EMAIL TEMPLATES ============

// Send test emails
router.post('/test-emails', async (req, res) => {
  try {
    const testEmail = 'salaudeensalu@gmail.com';
    const results = [];

    // Sample data for emails
    const sampleUser = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: testEmail
    };

    const sampleOrder = {
      _id: '507f1f77bcf86cd799439012',
      user: sampleUser,
      items: [
        {
          product: '507f1f77bcf86cd799439013',
          name: 'Premium Wooden Chair',
          quantity: 2,
          price: 4500
        },
        {
          product: '507f1f77bcf86cd799439014',
          name: 'Modern Dining Table',
          quantity: 1,
          price: 12000
        }
      ],
      shippingAddress: {
        name: 'Test User',
        address: 'Babu Reddy Complex, Begur Main Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560114',
        country: 'India',
        phone: '+91 98809 14457'
      },
      paymentMethod: 'cod',
      itemsPrice: 21000,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 21000,
      isPaid: false,
      isDelivered: false,
      status: 'Pending',
      createdAt: new Date()
    };

    const sampleReturn = {
      _id: '507f1f77bcf86cd799439015',
      order: sampleOrder,
      user: sampleUser._id,
      items: [
        {
          product: '507f1f77bcf86cd799439013',
          name: 'Premium Wooden Chair',
          quantity: 1,
          price: 4500
        }
      ],
      returnReason: 'defective',
      returnDescription: 'Product has manufacturing defects',
      refundAmount: 4500,
      status: 'Approved',
      adminNotes: 'Return approved. Pickup will be scheduled within 2 business days.',
      isRefunded: false,
      createdAt: new Date()
    };

    // 1. Order Confirmation Email
    try {
      const orderConfEmail = orderConfirmationEmail(sampleOrder);
      await sendEmail({
        to: testEmail,
        ...orderConfEmail
      });
      results.push({ type: 'Order Confirmation', status: 'sent' });
    } catch (error) {
      results.push({ type: 'Order Confirmation', status: 'failed', error: error.message });
    }

    // 2. Order Status Update - Processing
    try {
      const processingEmail = orderStatusUpdateEmail(sampleOrder, 'Processing');
      await sendEmail({
        to: testEmail,
        ...processingEmail
      });
      results.push({ type: 'Order Status - Processing', status: 'sent' });
    } catch (error) {
      results.push({ type: 'Order Status - Processing', status: 'failed', error: error.message });
    }

    // 3. Order Status Update - Shipped
    try {
      const shippedEmail = orderStatusUpdateEmail(sampleOrder, 'Shipped');
      await sendEmail({
        to: testEmail,
        ...shippedEmail
      });
      results.push({ type: 'Order Status - Shipped', status: 'sent' });
    } catch (error) {
      results.push({ type: 'Order Status - Shipped', status: 'failed', error: error.message });
    }

    // 4. Order Status Update - Delivered
    try {
      const deliveredEmail = orderStatusUpdateEmail(sampleOrder, 'Delivered');
      await sendEmail({
        to: testEmail,
        ...deliveredEmail
      });
      results.push({ type: 'Order Status - Delivered', status: 'sent' });
    } catch (error) {
      results.push({ type: 'Order Status - Delivered', status: 'failed', error: error.message });
    }

    // 5. Order Status Update - Cancelled
    try {
      const cancelledOrder = {
        ...sampleOrder,
        cancellationReason: 'Customer requested cancellation'
      };
      const cancelledEmail = orderStatusUpdateEmail(cancelledOrder, 'Cancelled');
      await sendEmail({
        to: testEmail,
        ...cancelledEmail
      });
      results.push({ type: 'Order Status - Cancelled', status: 'sent' });
    } catch (error) {
      results.push({ type: 'Order Status - Cancelled', status: 'failed', error: error.message });
    }

    // 6. Password Reset Email
    try {
      const resetEmail = passwordResetEmail(sampleUser, 'test-reset-token-123456');
      await sendEmail({
        to: testEmail,
        ...resetEmail
      });
      results.push({ type: 'Password Reset', status: 'sent' });
    } catch (error) {
      results.push({ type: 'Password Reset', status: 'failed', error: error.message });
    }

    // 7. Return Status - Approved
    try {
      const returnApprovedEmail = returnStatusUpdateEmail(sampleReturn, sampleUser);
      await sendEmail({
        to: testEmail,
        ...returnApprovedEmail
      });
      results.push({ type: 'Return Status - Approved', status: 'sent' });
    } catch (error) {
      results.push({ type: 'Return Status - Approved', status: 'failed', error: error.message });
    }

    // 8. Return Status - Refunded
    try {
      const refundedReturn = {
        ...sampleReturn,
        status: 'Refunded',
        isRefunded: true,
        refundedAt: new Date()
      };
      const returnRefundedEmail = returnStatusUpdateEmail(refundedReturn, sampleUser);
      await sendEmail({
        to: testEmail,
        ...returnRefundedEmail
      });
      results.push({ type: 'Return Status - Refunded', status: 'sent' });
    } catch (error) {
      results.push({ type: 'Return Status - Refunded', status: 'failed', error: error.message });
    }

    // 9. Return Status - Rejected
    try {
      const rejectedReturn = {
        ...sampleReturn,
        status: 'Rejected',
        adminNotes: 'Return request rejected as the product does not meet our return policy criteria.'
      };
      const returnRejectedEmail = returnStatusUpdateEmail(rejectedReturn, sampleUser);
      await sendEmail({
        to: testEmail,
        ...returnRejectedEmail
      });
      results.push({ type: 'Return Status - Rejected', status: 'sent' });
    } catch (error) {
      results.push({ type: 'Return Status - Rejected', status: 'failed', error: error.message });
    }

    // 10. Return Status - Picked Up
    try {
      const pickedUpReturn = {
        ...sampleReturn,
        status: 'Picked Up',
        adminNotes: 'Your item has been picked up and is being inspected.'
      };
      const returnPickedUpEmail = returnStatusUpdateEmail(pickedUpReturn, sampleUser);
      await sendEmail({
        to: testEmail,
        ...returnPickedUpEmail
      });
      results.push({ type: 'Return Status - Picked Up', status: 'sent' });
    } catch (error) {
      results.push({ type: 'Return Status - Picked Up', status: 'failed', error: error.message });
    }

    const successCount = results.filter(r => r.status === 'sent').length;
    const failCount = results.filter(r => r.status === 'failed').length;

    res.json({
      message: `Test emails sent to ${testEmail}`,
      summary: {
        total: results.length,
        sent: successCount,
        failed: failCount
      },
      results
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ message: 'Failed to send test emails', error: error.message });
  }
});

module.exports = router;
