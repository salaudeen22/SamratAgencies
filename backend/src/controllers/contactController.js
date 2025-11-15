const Contact = require('../models/Contact');
const { sendEmail } = require('../config/email');
const { contactFormEmail, contactFormThankYouEmail } = require('../utils/emailTemplates');

// Handle contact form submission
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: 'Please provide name, email, subject, and message'
      });
    }

    // Save to database
    const contactMessage = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    });

    const formData = {
      name,
      email,
      phone,
      subject,
      message
    };

    // Send email to business owner
    const adminEmailContent = contactFormEmail(formData);
    const adminEmailResult = await sendEmail({
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: adminEmailContent.subject,
      html: adminEmailContent.html,
      text: adminEmailContent.text
    });

    if (!adminEmailResult.success) {
      return res.status(500).json({
        message: 'Failed to send your message. Please try again later.'
      });
    }

    // Send thank you email to customer
    const customerEmailContent = contactFormThankYouEmail(formData);
    await sendEmail({
      to: email,
      subject: customerEmailContent.subject,
      html: customerEmailContent.html,
      text: customerEmailContent.text
    });

    res.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
};

// Admin: Get all contact messages
exports.getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status === 'read') {
      query.isRead = true;
    } else if (status === 'unread') {
      query.isRead = false;
    }

    const skip = (page - 1) * limit;

    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Contact.countDocuments(query);

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Admin: Get single message
exports.getMessageById = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ message: 'Failed to fetch message' });
  }
};

// Admin: Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Failed to mark message as read' });
  }
};

// Admin: Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};
