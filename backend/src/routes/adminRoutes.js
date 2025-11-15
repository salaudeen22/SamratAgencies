const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
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

// Get dashboard statistics with date range filtering
router.get('/stats', async (req, res) => {
  try {
    const { dateRange, startDate, endDate } = req.query;

    // Calculate date filter
    let dateFilter = {};
    if (dateRange) {
      const now = new Date();
      let start;

      switch (dateRange) {
        case 'week':
          start = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          start = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          start = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          start = null;
      }

      if (start) {
        dateFilter = { createdAt: { $gte: start } };
      }
    } else if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments(dateFilter);
    const totalUsers = await User.countDocuments(dateFilter);

    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true, ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const pendingOrders = await Order.countDocuments({ status: 'Pending', ...dateFilter });
    const processingOrders = await Order.countDocuments({ status: 'Processing', ...dateFilter });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped', ...dateFilter });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered', ...dateFilter });

    // Stock status
    const inStockProducts = await Product.countDocuments({ stock: { $gt: 10 } });
    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    const recentOrders = await Order.find(dateFilter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Top selling products with proper lookup
    const topProducts = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          itemName: { $first: '$items.name' },
          itemImage: { $first: '$items.image' },
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
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productId: '$_id',
          // Use item name if available, fallback to product name, then "Deleted Product"
          name: {
            $cond: {
              if: { $and: [{ $ne: ['$itemName', null] }, { $ne: ['$itemName', ''] }] },
              then: '$itemName',
              else: { $ifNull: ['$productInfo.name', 'Deleted Product'] }
            }
          },
          category: { $ifNull: ['$productInfo.category', null] },
          // Use item image if available, fallback to product image
          image: {
            $cond: {
              if: { $and: [{ $ne: ['$itemImage', null] }, { $ne: ['$itemImage', ''] }] },
              then: '$itemImage',
              else: {
                $cond: {
                  if: { $gt: [{ $size: { $ifNull: ['$productInfo.images', []] } }, 0] },
                  then: { $arrayElemAt: ['$productInfo.images.url', 0] },
                  else: ''
                }
              }
            }
          },
          totalSold: 1,
          revenue: 1
        }
      }
    ]);

    // New customers (users registered in the date range)
    const newCustomers = await User.countDocuments(dateFilter);

    // ============ NEW ENHANCED METRICS ============

    // 1. Average Order Value (AOV)
    const revenue = totalRevenue[0]?.total || 0;
    const avgOrderValue = totalOrders > 0 ? Math.round(revenue / totalOrders) : 0;

    // 2. Revenue by Payment Method
    const paymentMethodStats = await Order.aggregate([
      { $match: { isPaid: true, ...dateFilter } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    // 3. Sales by City (Top 10)
    const salesByCity = await Order.aggregate([
      { $match: { isPaid: true, ...dateFilter } },
      {
        $group: {
          _id: '$shippingAddress.city',
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    // 4. Sales by State (Top 10)
    const salesByState = await Order.aggregate([
      { $match: { isPaid: true, ...dateFilter } },
      {
        $group: {
          _id: '$shippingAddress.state',
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    // 5. Category Performance
    const Category = require('../models/Category');
    const categoryPerformance = await Order.aggregate([
      { $match: { isPaid: true, ...dateFilter } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productData'
        }
      },
      { $unwind: { path: '$productData', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$productData.category',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          categoryId: '$_id',
          name: { $ifNull: ['$categoryInfo.name', 'Uncategorized'] },
          totalSold: 1,
          revenue: 1,
          orders: 1
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    // 6. Return Rate
    const Return = require('../models/Return');
    const totalReturns = await Return.countDocuments(dateFilter);
    const returnRate = totalOrders > 0 ? ((totalReturns / totalOrders) * 100).toFixed(2) : 0;

    // 7. Repeat Customer Rate
    const repeatCustomerData = await Order.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$user', orderCount: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          repeatCustomers: {
            $sum: { $cond: [{ $gt: ['$orderCount', 1] }, 1, 0] }
          }
        }
      }
    ]);

    const repeatCustomerRate = repeatCustomerData[0]
      ? ((repeatCustomerData[0].repeatCustomers / repeatCustomerData[0].totalCustomers) * 100).toFixed(2)
      : 0;

    // 8. Revenue Trend (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueTrend = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          revenue: 1,
          orders: 1
        }
      }
    ]);

    // 9. Today's Sales
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todaySales = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: todayStart, $lte: todayEnd }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      }
    ]);

    const todayRevenue = todaySales[0]?.revenue || 0;
    const todayOrders = todaySales[0]?.orders || 0;

    // 10. Previous Period Comparison (for growth calculation)
    let previousPeriodFilter = {};
    if (dateRange) {
      const now = new Date();
      let prevStart, prevEnd;

      switch (dateRange) {
        case 'week':
          prevEnd = new Date(now.setDate(now.getDate() - 7));
          prevStart = new Date(prevEnd);
          prevStart.setDate(prevStart.getDate() - 7);
          break;
        case 'month':
          prevEnd = new Date(now.setMonth(now.getMonth() - 1));
          prevStart = new Date(prevEnd);
          prevStart.setMonth(prevStart.getMonth() - 1);
          break;
        case 'year':
          prevEnd = new Date(now.setFullYear(now.getFullYear() - 1));
          prevStart = new Date(prevEnd);
          prevStart.setFullYear(prevStart.getFullYear() - 1);
          break;
      }

      if (prevStart && prevEnd) {
        previousPeriodFilter = {
          createdAt: { $gte: prevStart, $lte: prevEnd }
        };
      }
    }

    const previousRevenue = previousPeriodFilter.createdAt ? await Order.aggregate([
      { $match: { isPaid: true, ...previousPeriodFilter } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]) : [];

    const prevRevenue = previousRevenue[0]?.total || 0;
    const revenueGrowth = prevRevenue > 0
      ? (((revenue - prevRevenue) / prevRevenue) * 100).toFixed(2)
      : 0;

    // ============ ADDITIONAL METRICS ============

    // 11. Cart Abandonment Rate
    const totalCarts = await Cart.countDocuments(dateFilter);
    const cartAbandonmentRate = totalCarts > 0 && totalOrders > 0
      ? (((totalCarts - totalOrders) / totalCarts) * 100).toFixed(2)
      : 0;

    // 12. Order Cancellation Rate
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled', ...dateFilter });
    const cancellationRate = totalOrders > 0
      ? ((cancelledOrders / totalOrders) * 100).toFixed(2)
      : 0;

    // 13. Average Delivery Time (in days) - for delivered orders
    const deliveredOrdersWithTime = await Order.find({
      status: 'Delivered',
      deliveredAt: { $exists: true },
      ...dateFilter
    }).select('createdAt deliveredAt');

    let avgDeliveryTime = 0;
    if (deliveredOrdersWithTime.length > 0) {
      const totalDeliveryDays = deliveredOrdersWithTime.reduce((sum, order) => {
        const days = Math.ceil((order.deliveredAt - order.createdAt) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
      avgDeliveryTime = (totalDeliveryDays / deliveredOrdersWithTime.length).toFixed(1);
    }

    // 14. Coupon Usage Statistics
    const Coupon = require('../models/Coupon');
    const couponUsage = await Coupon.aggregate([
      {
        $project: {
          code: 1,
          usedCount: 1,
          discountType: 1,
          discountValue: 1,
          totalSaved: {
            $reduce: {
              input: '$usageHistory',
              initialValue: 0,
              in: { $add: ['$$value', '$$this.discountApplied'] }
            }
          }
        }
      },
      { $sort: { usedCount: -1 } },
      { $limit: 5 }
    ]);

    const totalCouponUsage = await Coupon.aggregate([
      {
        $group: {
          _id: null,
          totalUsed: { $sum: '$usedCount' },
          totalSavings: {
            $sum: {
              $reduce: {
                input: '$usageHistory',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.discountApplied'] }
              }
            }
          }
        }
      }
    ]);

    const ordersWithCoupons = totalOrders > 0 && totalCouponUsage[0]
      ? ((totalCouponUsage[0].totalUsed / totalOrders) * 100).toFixed(2)
      : 0;

    // 15. Active Support Tickets
    const Ticket = require('../models/Ticket');
    const activeSupportTickets = await Ticket.countDocuments({
      status: { $in: ['open', 'in-progress'] }
    });

    // 16. Gross Profit (Revenue - Discount)
    const totalDiscount = await Order.aggregate([
      { $match: { isPaid: true, ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$discount' } } }
    ]);
    const grossProfit = revenue - (totalDiscount[0]?.total || 0);
    const grossProfitMargin = revenue > 0
      ? ((grossProfit / revenue) * 100).toFixed(2)
      : 0;

    res.json({
      // Original metrics
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: revenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      inStockProducts,
      lowStockProducts,
      outOfStockProducts,
      newCustomers,
      recentOrders,
      topProducts,

      // New enhanced metrics
      avgOrderValue,
      paymentMethodStats,
      salesByCity,
      salesByState,
      categoryPerformance,
      returnRate: parseFloat(returnRate),
      totalReturns,
      repeatCustomerRate: parseFloat(repeatCustomerRate),
      revenueTrend,
      todayRevenue,
      todayOrders,
      revenueGrowth: parseFloat(revenueGrowth),
      previousPeriodRevenue: prevRevenue,

      // Additional new metrics
      cartAbandonmentRate: parseFloat(cartAbandonmentRate),
      totalCarts,
      cancelledOrders,
      cancellationRate: parseFloat(cancellationRate),
      avgDeliveryTime: parseFloat(avgDeliveryTime),
      couponUsage,
      totalCouponUsage: totalCouponUsage[0] || { totalUsed: 0, totalSavings: 0 },
      ordersWithCoupons: parseFloat(ordersWithCoupons),
      activeSupportTickets,
      grossProfit,
      grossProfitMargin: parseFloat(grossProfitMargin)
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
