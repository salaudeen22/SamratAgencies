const Return = require('../models/Return');
const Order = require('../models/Order');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const { returnStatusUpdateEmail } = require('../utils/emailTemplates');

// Create return request
exports.createReturn = async (req, res) => {
  try {
    const {
      orderId,
      items,
      returnReason,
      returnDescription,
      images,
      pickupAddress
    } = req.body;

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if order is delivered
    if (order.status !== 'Delivered') {
      return res.status(400).json({ message: 'Can only return delivered orders' });
    }

    // Check if there's already an active return request for this order
    const existingReturn = await Return.findOne({
      order: orderId,
      status: { $in: ['Pending', 'Approved', 'Picked Up'] }
    });

    if (existingReturn) {
      return res.status(400).json({
        message: 'A return request for this order is already pending. Please wait for it to be resolved.'
      });
    }

    // Calculate refund amount
    const refundAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const returnRequest = await Return.create({
      order: orderId,
      user: req.user.id,
      items,
      returnReason,
      returnDescription,
      images: images || [],
      pickupAddress,
      refundAmount
    });

    res.status(201).json({
      message: 'Return request created successfully',
      return: returnRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user returns
exports.getUserReturns = async (req, res) => {
  try {
    const returns = await Return.find({ user: req.user.id })
      .populate('order')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get return by ID
exports.getReturnById = async (req, res) => {
  try {
    const returnRequest = await Return.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('order')
      .populate('items.product');

    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    // Check if user owns this return or is admin
    if (returnRequest.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(returnRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all returns (Admin only)
exports.getAllReturns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const returns = await Return.find(filter)
      .populate('user', 'name email phone')
      .populate('order')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Return.countDocuments(filter);

    res.json({
      returns,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update return status (Admin only)
exports.updateReturnStatus = async (req, res) => {
  try {
    const { status, adminNotes, refundMethod } = req.body;

    const returnRequest = await Return.findById(req.params.id);

    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    returnRequest.status = status;
    if (adminNotes) returnRequest.adminNotes = adminNotes;
    if (refundMethod) returnRequest.refundMethod = refundMethod;

    if (status === 'Refunded') {
      returnRequest.isRefunded = true;
      returnRequest.refundedAt = Date.now();
    }

    await returnRequest.save();

    // Send email notification to user
    const user = await User.findById(returnRequest.user);
    if (user && user.email) {
      const emailContent = returnStatusUpdateEmail(returnRequest, user);
      await sendEmail({
        to: user.email,
        ...emailContent
      });
    }

    res.json({
      message: 'Return status updated successfully',
      return: returnRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel return (User)
exports.cancelReturn = async (req, res) => {
  try {
    const returnRequest = await Return.findById(req.params.id);

    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    // Check if user owns this return
    if (returnRequest.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Can only cancel pending returns
    if (returnRequest.status !== 'Pending') {
      return res.status(400).json({ message: 'Can only cancel pending returns' });
    }

    returnRequest.status = 'Cancelled';
    await returnRequest.save();

    res.json({
      message: 'Return cancelled successfully',
      return: returnRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
