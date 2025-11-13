require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing email configuration...');
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Password:', process.env.EMAIL_PASSWORD ? '***' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET');
console.log('Email Host:', process.env.EMAIL_HOST);
console.log('Email Port:', process.env.EMAIL_PORT);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify connection
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Email configuration error:', error);
  } else {
    console.log('✅ Server is ready to send emails');

    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email from Samrat Agencies',
      text: 'This is a test email to verify the email configuration is working.',
      html: '<h1>Test Email</h1><p>This is a test email to verify the email configuration is working.</p>'
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log('❌ Error sending test email:', error);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
      }
      process.exit(0);
    });
  }
});
