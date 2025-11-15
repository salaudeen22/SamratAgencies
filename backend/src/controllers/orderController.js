const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const { orderConfirmationEmail, orderStatusUpdateEmail } = require('../utils/emailTemplates');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      gstAmount,
      deliveryCharge,
      discount
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Calculate items price (subtotal before GST and delivery)
    const itemsPrice = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice: itemsPrice,
      taxPrice: gstAmount || 0,
      shippingPrice: deliveryCharge || 0,
      discount: discount || 0,
      totalPrice: totalAmount
    });

    // Clear user cart after order is created
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], totalPrice: 0 }
    );

    // Get user email for sending confirmation
    const user = await User.findById(req.user.id);

    // Send order confirmation email
    if (user && user.email) {
      const emailContent = orderConfirmationEmail(order);
      await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order to paid
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order (User can cancel their own orders)
exports.cancelOrder = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Only allow cancellation of Pending or Processing orders
    if (!['Pending', 'Processing'].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot cancel order with status: ${order.status}. Only Pending or Processing orders can be cancelled.`
      });
    }

    // Update order status to Cancelled
    order.status = 'Cancelled';
    order.cancellationReason = cancellationReason || 'Cancelled by customer';
    order.cancelledBy = req.user.id;
    order.cancelledAt = Date.now();

    // Add to status history
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: Date.now(),
      note: cancellationReason || 'Cancelled by customer',
      updatedBy: req.user.id
    });

    const updatedOrder = await order.save();

    // Send cancellation email
    if (order.user && order.user.email) {
      const emailContent = orderStatusUpdateEmail(updatedOrder, 'Cancelled');
      await sendEmail({
        to: order.user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });
    }

    res.json({
      message: 'Order cancelled successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
