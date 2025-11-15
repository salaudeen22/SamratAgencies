const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const { orderStatusUpdateEmail } = require('../utils/emailTemplates');

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

module.exports = router;
