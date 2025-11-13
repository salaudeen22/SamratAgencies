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
