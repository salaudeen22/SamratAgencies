// Order confirmation email template
const orderConfirmationEmail = (order) => {
  const itemsList = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return {
    subject: `Order Confirmation - Order #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #1F2D38; padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Order Confirmed!</h1>
          <p style="color: #E5EFF3; margin: 10px 0 0 0;">Thank you for your order</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px;">
          <h2 style="color: #1F2D38; margin-top: 0;">Order Details</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          <p><strong>Payment Status:</strong> ${order.isPaid ? 'Paid' : 'Pending'}</p>
        </div>

        <div style="margin-top: 30px;">
          <h3 style="color: #1F2D38;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background-color: #895F42; color: white;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #1F2D38; margin-top: 0;">Order Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Items Total:</span>
            <span>₹${order.itemsPrice.toLocaleString('en-IN')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Shipping:</span>
            <span>₹${order.shippingPrice.toLocaleString('en-IN')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Tax:</span>
            <span>₹${order.taxPrice.toLocaleString('en-IN')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 2px solid #895F42; padding-top: 10px; margin-top: 10px; font-weight: bold; font-size: 18px;">
            <span>Total:</span>
            <span style="color: #895F42;">₹${order.totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #1F2D38; margin-top: 0;">Shipping Address</h3>
          <p style="margin: 5px 0;"><strong>${order.shippingAddress.name}</strong></p>
          <p style="margin: 5px 0;">${order.shippingAddress.address}</p>
          <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
          <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #E0EAF0; border-radius: 5px; text-align: center;">
          <p style="margin: 0; color: #1F2D38;">Need help with your order?</p>
          <p style="margin: 10px 0 0 0;">
            <a href="tel:+919880914457" style="color: #895F42; text-decoration: none; font-weight: bold;">Call us: +91 98809 14457</a>
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #94A1AB; font-size: 14px;">
          <p>Thank you for shopping with Samrat Agencies</p>
          <p style="margin: 5px 0;">Babu Reddy Complex, Begur Main Road, Hongasandra</p>
          <p style="margin: 5px 0;">Bommanahalli, Bengaluru, Karnataka 560114</p>
          <p style="margin: 15px 0;">
            <a href="https://www.facebook.com/SamratAgenciesHongasandra" style="color: #895F42; text-decoration: none; margin: 0 10px;">Facebook</a> |
            <a href="https://www.google.com/maps/place/Samrat+Agencies" style="color: #895F42; text-decoration: none; margin: 0 10px;">Google Maps</a>
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
Order Confirmation - Order #${order._id}

Thank you for your order!

Order Details:
- Order ID: ${order._id}
- Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}
- Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
- Payment Status: ${order.isPaid ? 'Paid' : 'Pending'}

Order Items:
${order.items.map(item => `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n')}

Order Summary:
Items Total: ₹${order.itemsPrice.toLocaleString('en-IN')}
Shipping: ₹${order.shippingPrice.toLocaleString('en-IN')}
Tax: ₹${order.taxPrice.toLocaleString('en-IN')}
Total: ₹${order.totalPrice.toLocaleString('en-IN')}

Shipping Address:
${order.shippingAddress.name}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
${order.shippingAddress.country}
Phone: ${order.shippingAddress.phone}

Need help? Call us: +91 98809 14457

Thank you for shopping with Samrat Agencies
    `
  };
};

// Password reset email template
const passwordResetEmail = (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  return {
    subject: 'Password Reset Request - Samrat Agencies',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #1F2D38; padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Password Reset Request</h1>
        </div>

        <div style="padding: 30px 20px;">
          <p>Hi ${user.name},</p>
          <p>You recently requested to reset your password for your Samrat Agencies account. Click the button below to reset it.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #895F42; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>

          <p>Or copy and paste this link into your browser:</p>
          <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; word-break: break-all;">${resetUrl}</p>

          <p style="margin-top: 30px;"><strong>This password reset link will expire in 1 hour.</strong></p>

          <p>If you did not request a password reset, please ignore this email or contact us if you have concerns.</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #E0EAF0; border-radius: 5px; text-align: center;">
          <p style="margin: 0; color: #1F2D38;">Need help?</p>
          <p style="margin: 10px 0 0 0;">
            <a href="tel:+919880914457" style="color: #895F42; text-decoration: none; font-weight: bold;">Call us: +91 98809 14457</a>
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #94A1AB; font-size: 14px;">
          <p>Samrat Agencies</p>
          <p style="margin: 5px 0;">Babu Reddy Complex, Begur Main Road, Hongasandra</p>
          <p style="margin: 5px 0;">Bommanahalli, Bengaluru, Karnataka 560114</p>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset Request

Hi ${user.name},

You recently requested to reset your password for your Samrat Agencies account.

Reset your password by clicking this link:
${resetUrl}

This password reset link will expire in 1 hour.

If you did not request a password reset, please ignore this email or contact us if you have concerns.

Need help? Call us: +91 98809 14457

Samrat Agencies
Babu Reddy Complex, Begur Main Road, Hongasandra
Bommanahalli, Bengaluru, Karnataka 560114
    `
  };
};

// Contact form submission email template
const contactFormEmail = (formData) => {
  return {
    subject: `New Contact Form Submission from ${formData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #1F2D38; padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">New Contact Form Submission</h1>
        </div>

        <div style="padding: 30px 20px;">
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #1F2D38; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${formData.email}" style="color: #895F42;">${formData.email}</a></p>
            ${formData.phone ? `<p><strong>Phone:</strong> <a href="tel:${formData.phone}" style="color: #895F42;">${formData.phone}</a></p>` : ''}
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <h3 style="color: #1F2D38; margin-top: 0;">Subject</h3>
            <p>${formData.subject}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #1F2D38; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${formData.message}</p>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #E0EAF0; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #1F2D38;">
              <strong>Submitted on:</strong> ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New Contact Form Submission

Contact Information:
Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}

Subject: ${formData.subject}

Message:
${formData.message}

Submitted on: ${new Date().toLocaleString('en-IN')}
    `
  };
};

// Thank you email to customer after contact form submission
const contactFormThankYouEmail = (formData) => {
  return {
    subject: 'Thank you for contacting Samrat Agencies',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #1F2D38; padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Thank You!</h1>
          <p style="color: #E5EFF3; margin: 10px 0 0 0;">We've received your message</p>
        </div>

        <div style="padding: 30px 20px;">
          <p>Hi ${formData.name},</p>
          <p>Thank you for contacting Samrat Agencies. We have received your message and will get back to you as soon as possible, typically within 24 hours.</p>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 30px 0;">
            <h3 style="color: #1F2D38; margin-top: 0;">Your Message</h3>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p style="margin-top: 15px; white-space: pre-wrap;">${formData.message}</p>
          </div>

          <p>If your inquiry is urgent, please feel free to call us directly at:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="tel:+919880914457" style="background-color: #895F42; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">+91 98809 14457</a>
          </p>

          <p>You can also visit our showroom:</p>
          <div style="background-color: #E0EAF0; padding: 20px; border-radius: 5px; text-align: center;">
            <p style="margin: 5px 0;"><strong>Samrat Agencies</strong></p>
            <p style="margin: 5px 0;">Babu Reddy Complex, Begur Main Road, Hongasandra</p>
            <p style="margin: 5px 0;">Bommanahalli, Bengaluru, Karnataka 560114</p>
            <p style="margin: 15px 0;">
              <a href="https://www.google.com/maps/place/Samrat+Agencies" style="color: #895F42; text-decoration: none; font-weight: bold;">Get Directions →</a>
            </p>
            <p style="margin: 5px 0; color: #1F2D38;">Mon-Sun: 8:00 AM - 10:30 PM</p>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #94A1AB; font-size: 14px;">
          <p>Thank you for choosing Samrat Agencies</p>
          <p style="margin: 15px 0;">
            <a href="https://www.facebook.com/SamratAgenciesHongasandra" style="color: #895F42; text-decoration: none; margin: 0 10px;">Facebook</a> |
            <a href="https://www.google.com/maps/place/Samrat+Agencies" style="color: #895F42; text-decoration: none; margin: 0 10px;">Google Maps</a>
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
Thank You for Contacting Samrat Agencies

Hi ${formData.name},

Thank you for contacting Samrat Agencies. We have received your message and will get back to you as soon as possible, typically within 24 hours.

Your Message:
Subject: ${formData.subject}
${formData.message}

If your inquiry is urgent, please call us directly at: +91 98809 14457

You can also visit our showroom:
Samrat Agencies
Babu Reddy Complex, Begur Main Road, Hongasandra
Bommanahalli, Bengaluru, Karnataka 560114
Mon-Sun: 8:00 AM - 10:30 PM

Thank you for choosing Samrat Agencies
    `
  };
};

// Order status update email template
const orderStatusUpdateEmail = (order, newStatus) => {
  const statusMessages = {
    Processing: {
      title: 'Your Order is Being Processed',
      message: 'Good news! We\'ve started processing your order and it will be ready for shipment soon.',
      color: '#3B82F6'
    },
    Shipped: {
      title: 'Your Order Has Been Shipped',
      message: 'Your order is on its way! You can expect delivery soon.',
      color: '#8B5CF6'
    },
    Delivered: {
      title: 'Your Order Has Been Delivered',
      message: 'Your order has been successfully delivered. We hope you enjoy your purchase!',
      color: '#10B981'
    },
    Cancelled: {
      title: 'Your Order Has Been Cancelled',
      message: 'Your order has been cancelled. If you have any questions, please contact us.',
      color: '#EF4444'
    }
  };

  const statusInfo = statusMessages[newStatus] || {
    title: `Order Status Update: ${newStatus}`,
    message: `Your order status has been updated to ${newStatus}.`,
    color: '#6B7280'
  };

  return {
    subject: `Order Update: ${statusInfo.title} - Order #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: ${statusInfo.color}; padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">${statusInfo.title}</h1>
          <p style="color: #fff; margin: 10px 0 0 0; opacity: 0.9;">Order #${order._id}</p>
        </div>

        <div style="padding: 30px 20px;">
          <p style="font-size: 16px; color: #1F2D38;">${statusInfo.message}</p>

          <div style="background-color: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px;">
            <h2 style="color: #1F2D38; margin-top: 0; font-size: 18px;">Order Status</h2>
            <p style="margin: 10px 0;"><strong>Current Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold;">${newStatus}</span></p>
            <p style="margin: 10px 0;"><strong>Order ID:</strong> ${order._id}</p>
            <p style="margin: 10px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          ${newStatus === 'Delivered' ? `
            <div style="margin-top: 30px; padding: 20px; background-color: #D1FAE5; border-radius: 5px; border-left: 4px solid #10B981;">
              <h3 style="color: #065F46; margin-top: 0;">Thank you for your purchase!</h3>
              <p style="color: #065F46; margin: 10px 0;">We hope you love your new products. If you have any issues, please don't hesitate to contact us.</p>
            </div>
          ` : ''}

          ${newStatus === 'Cancelled' ? `
            <div style="margin-top: 30px; padding: 20px; background-color: #FEE2E2; border-radius: 5px; border-left: 4px solid #EF4444;">
              <h3 style="color: #991B1B; margin-top: 0;">Order Cancellation</h3>
              <p style="color: #991B1B; margin: 10px 0;">${order.cancellationReason || 'Your order has been cancelled.'}</p>
              ${order.isPaid ? '<p style="color: #991B1B; margin: 10px 0;">If you\'ve already paid, your refund will be processed within 5-7 business days.</p>' : ''}
            </div>
          ` : ''}

          <div style="margin-top: 30px;">
            <h3 style="color: #1F2D38; font-size: 16px;">Order Items</h3>
            ${order.items?.map(item => `
              <div style="padding: 15px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between;">
                <div>
                  <p style="margin: 0; font-weight: bold;">${item.name}</p>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Qty: ${item.quantity}</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            `).join('') || ''}
            <div style="padding: 15px; background-color: #f9f9f9; display: flex; justify-content: space-between; margin-top: 10px;">
              <p style="margin: 0; font-weight: bold; font-size: 16px;">Total:</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px; color: #895F42;">₹${order.totalPrice?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #E0EAF0; border-radius: 5px; text-align: center;">
          <p style="margin: 0; color: #1F2D38;">Need help with your order?</p>
          <p style="margin: 10px 0 0 0;">
            <a href="tel:+919880914457" style="color: #895F42; text-decoration: none; font-weight: bold;">Call us: +91 98809 14457</a>
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #94A1AB; font-size: 14px;">
          <p>Thank you for shopping with Samrat Agencies</p>
          <p style="margin: 5px 0;">Babu Reddy Complex, Begur Main Road, Hongasandra</p>
          <p style="margin: 5px 0;">Bommanahalli, Bengaluru, Karnataka 560114</p>
          <p style="margin: 15px 0;">
            <a href="https://www.facebook.com/SamratAgenciesHongasandra" style="color: #895F42; text-decoration: none; margin: 0 10px;">Facebook</a> |
            <a href="https://www.google.com/maps/place/Samrat+Agencies" style="color: #895F42; text-decoration: none; margin: 0 10px;">Google Maps</a>
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
${statusInfo.title}

Order #${order._id}

${statusInfo.message}

Order Status: ${newStatus}
Order ID: ${order._id}
Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}

${newStatus === 'Cancelled' && order.cancellationReason ? `Cancellation Reason: ${order.cancellationReason}\n` : ''}

Order Items:
${order.items?.map(item => `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n') || ''}

Total: ₹${order.totalPrice?.toLocaleString('en-IN')}

Need help? Call us: +91 98809 14457

Thank you for shopping with Samrat Agencies
    `
  };
};

module.exports = {
  orderConfirmationEmail,
  passwordResetEmail,
  contactFormEmail,
  contactFormThankYouEmail,
  orderStatusUpdateEmail
};
