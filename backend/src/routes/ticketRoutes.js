const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const { newTicketNotificationEmail, ticketReplyNotificationEmail, ticketStatusUpdateEmail } = require('../utils/emailTemplates');
const logger = require('../config/logger');

// @route   POST /api/tickets
// @desc    Create a new support ticket
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { subject, message, priority, category, relatedOrder } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const ticketData = {
      user: req.user.id,
      subject,
      category: category || 'general',
      priority: priority || 'medium',
      messages: [{
        sender: 'customer',
        message
      }]
    };

    // Only add relatedOrder if it's provided and not empty
    if (relatedOrder && relatedOrder.trim() !== '') {
      ticketData.relatedOrder = relatedOrder;
    }

    const ticket = new Ticket(ticketData);

    await ticket.save();
    await ticket.populate('user', 'name email phone');

    // Send email notification to admin
    try {
      const adminUsers = await User.find({ isAdmin: true });
      const ticketData = {
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        message: ticket.messages[0].message,
        orderId: ticket.relatedOrder
      };

      const emailContent = newTicketNotificationEmail(ticketData, ticket.user);

      // Send to all admins
      for (const admin of adminUsers) {
        await sendEmail({
          to: admin.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });
      }

      logger.info(`New ticket notification sent to admins: ${ticket.ticketNumber}`);
    } catch (emailError) {
      logger.error(`Failed to send ticket notification email: ${emailError.message}`);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Failed to create ticket', error: error.message });
  }
});

// @route   GET /api/tickets
// @desc    Get user's tickets
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const tickets = await Ticket.find(filter)
      .populate('user', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Ticket.countDocuments(filter);

    res.json({
      tickets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
  }
});

// @route   GET /api/tickets/:id
// @desc    Get single ticket details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user owns the ticket or is admin
    if (ticket.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Failed to fetch ticket', error: error.message });
  }
});

// @route   POST /api/tickets/:id/messages
// @desc    Add message to ticket
// @access  Private
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user owns the ticket or is admin
    if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const newMessage = {
      sender: req.user.isAdmin ? 'admin' : 'customer',
      message
    };

    ticket.messages.push(newMessage);

    // Update status to in-progress if admin replies to open ticket
    if (req.user.isAdmin && ticket.status === 'open') {
      ticket.status = 'in-progress';
    }

    await ticket.save();
    await ticket.populate('user', 'name email');

    // Send email notification if admin replied to customer
    if (req.user.isAdmin) {
      try {
        const emailContent = ticketReplyNotificationEmail(ticket, newMessage, ticket.user);

        await sendEmail({
          to: ticket.user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });

        logger.info(`Ticket reply notification sent to customer: ${ticket.user.email} for ticket ${ticket.ticketNumber}`);
      } catch (emailError) {
        logger.error(`Failed to send ticket reply notification email: ${emailError.message}`);
        // Don't fail the request if email fails
      }
    }

    res.json({
      message: 'Message added successfully',
      ticket
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Failed to add message', error: error.message });
  }
});

// ============ ADMIN ROUTES ============

// @route   GET /api/tickets/admin/all
// @desc    Get all tickets (admin)
// @access  Private/Admin
router.get('/admin/all', auth, adminAuth, async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    const tickets = await Ticket.find(filter)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Ticket.countDocuments(filter);

    res.json({
      tickets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
  }
});

// @route   PUT /api/tickets/admin/:id/status
// @desc    Update ticket status (admin)
// @access  Private/Admin
router.put('/admin/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Send email notification to customer about status change
    try {
      const emailContent = ticketStatusUpdateEmail(ticket, ticket.user);

      await sendEmail({
        to: ticket.user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      logger.info(`Ticket status update notification sent to customer: ${ticket.user.email} for ticket ${ticket.ticketNumber}`);
    } catch (emailError) {
      logger.error(`Failed to send ticket status update notification email: ${emailError.message}`);
      // Don't fail the request if email fails
    }

    res.json({
      message: 'Ticket status updated successfully',
      ticket
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
});

// @route   PUT /api/tickets/admin/:id/priority
// @desc    Update ticket priority (admin)
// @access  Private/Admin
router.put('/admin/:id/priority', auth, adminAuth, async (req, res) => {
  try {
    const { priority } = req.body;

    if (!priority || !['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return res.status(400).json({ message: 'Valid priority is required' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    ).populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({
      message: 'Ticket priority updated successfully',
      ticket
    });
  } catch (error) {
    console.error('Update priority error:', error);
    res.status(500).json({ message: 'Failed to update priority', error: error.message });
  }
});

// @route   PUT /api/tickets/admin/:id/assign
// @desc    Assign ticket to admin (admin)
// @access  Private/Admin
router.put('/admin/:id/assign', auth, adminAuth, async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({
      message: 'Ticket assigned successfully',
      ticket
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({ message: 'Failed to assign ticket', error: error.message });
  }
});

// @route   DELETE /api/tickets/admin/:id
// @desc    Delete ticket (admin)
// @access  Private/Admin
router.delete('/admin/:id', auth, adminAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ message: 'Failed to delete ticket', error: error.message });
  }
});

module.exports = router;
