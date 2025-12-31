// Email header template with logo
const emailHeader = (title, subtitle = '') => {
  return `
    <div style="background-color: #1F2D38; padding: 40px 30px; text-align: center;">
      <img src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/email/samrat-agencies-logo.png" alt="Samrat Agencies" style="max-width: 180px; height: auto; margin-bottom: 20px;" />
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">${title}</h1>
      ${subtitle ? `<p style="color: #BDD7EB; margin: 12px 0 0 0; font-size: 16px;">${subtitle}</p>` : ''}
    </div>
  `;
};

// Email footer template
const emailFooter = () => `
  <div style="margin-top: 40px; padding: 30px; background-color: #E0EAF0; border-radius: 12px; text-align: center;">
    <p style="margin: 0 0 15px 0; color: #1F2D38; font-weight: 600; font-size: 16px;">Need Help?</p>
    <p style="margin: 0 0 8px 0;">
      <a href="tel:+919880914457" style="color: #895F42; text-decoration: none; font-weight: bold; font-size: 15px;">+91 98809 14457</a>
    </p>
    <p style="margin: 0;">
      <a href="tel:+919448075801" style="color: #895F42; text-decoration: none; font-weight: bold; font-size: 15px;">+91 94480 75801</a>
    </p>
  </div>

  <div style="margin-top: 30px; text-align: center; color: #94A1AB; font-size: 14px; line-height: 1.8;">
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F2D38;">Samrat Agencies</p>
    <p style="margin: 5px 0;">Babu Reddy Complex, 5 Begur Main Road, Hongasandra</p>
    <p style="margin: 5px 0;">Bommanahalli, Bengaluru, Karnataka 560114</p>
    <p style="margin: 20px 0 10px 0;">
      <a href="https://www.facebook.com/SamratAgenciesHongasandra" style="color: #895F42; text-decoration: none; margin: 0 8px; font-weight: 500;">Facebook</a>
      <span style="color: #BDD7EB;">•</span>
      <a href="https://www.google.com/maps/place/Samrat+Agencies" style="color: #895F42; text-decoration: none; margin: 0 8px; font-weight: 500;">Google Maps</a>
      <span style="color: #BDD7EB;">•</span>
      <a href="https://www.justdial.com" style="color: #895F42; text-decoration: none; margin: 0 8px; font-weight: 500;">JustDial</a>
    </p>
    <p style="margin: 15px 0 0 0; color: #94A1AB; font-size: 12px;">© ${new Date().getFullYear()} Samrat Agencies. All rights reserved.</p>
  </div>
`;

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
        <div style="background-color: #1F2D38; padding: 40px 30px; text-align: center;">
          <img src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/email/samrat-agencies-logo.png" alt="Samrat Agencies" style="max-width: 180px; height: auto; margin-bottom: 20px;" />
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Order Confirmed!</h1>
          <p style="color: #BDD7EB; margin: 12px 0 0 0; font-size: 16px;">Thank you for your order</p>
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
        <div style="background-color: #1F2D38; padding: 40px 30px; text-align: center;">
          <img src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/email/samrat-agencies-logo.png" alt="Samrat Agencies" style="max-width: 180px; height: auto; margin-bottom: 20px;" />
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Contact Form Submission</h1>
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
        <div style="background-color: #1F2D38; padding: 40px 30px; text-align: center;">
          <img src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/email/samrat-agencies-logo.png" alt="Samrat Agencies" style="max-width: 180px; height: auto; margin-bottom: 20px;" />
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Thank You!</h1>
          <p style="color: #BDD7EB; margin: 12px 0 0 0; font-size: 16px;">We've received your message</p>
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

// Password reset email template
const passwordResetEmail = (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  return {
    subject: 'Password Reset Request - Samrat Agencies',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2D38; margin: 0; padding: 20px; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">

          ${emailHeader('Password Reset Request', 'Reset your account password')}

          <div style="padding: 30px;">
            <p style="margin: 0 0 20px 0; color: #64748b; font-size: 15px;">Hi ${user.name},</p>
            <p style="margin: 0 0 20px 0; color: #64748b; font-size: 15px;">You recently requested to reset your password for your Samrat Agencies account. Click the button below to reset it.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #895F42; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(137, 95, 66, 0.2);">Reset Password</a>
            </div>

            <p style="margin: 20px 0 10px 0; color: #64748b; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; word-break: break-all; font-size: 13px; color: #475569; border-left: 3px solid #895F42;">${resetUrl}</p>

            <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: 600; font-size: 14px;">This link expires in 1 hour</p>
            </div>

            <p style="margin: 25px 0 0 0; color: #64748b; font-size: 14px;">If you did not request a password reset, please ignore this email or contact us if you have concerns.</p>

            ${emailFooter()}
          </div>
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
    `
  };
};

// Order status update email template
const orderStatusUpdateEmail = (order, newStatus) => {
  const statusMessages = {
    Processing: {
      title: 'Your Order is Being Processed',
      subtitle: 'We\'ve started preparing your order',
      message: 'Good news! We\'ve started processing your order and it will be ready for shipment soon.',
      color: '#3b82f6',
      icon: ''
    },
    Shipped: {
      title: 'Your Order Has Been Shipped',
      subtitle: 'Your package is on the way!',
      message: 'Your order is on its way! You can expect delivery soon.',
      color: '#8b5cf6',
      icon: ''
    },
    Delivered: {
      title: 'Your Order Has Been Delivered',
      subtitle: 'Enjoy your new products!',
      message: 'Your order has been successfully delivered. We hope you enjoy your purchase!',
      color: '#22c55e',
      icon: ''
    },
    Cancelled: {
      title: 'Your Order Has Been Cancelled',
      subtitle: 'Order cancellation notification',
      message: 'Your order has been cancelled.',
      color: '#ef4444',
      icon: ''
    }
  };

  const statusInfo = statusMessages[newStatus] || {
    title: `Order Status Update`,
    subtitle: `Status changed to ${newStatus}`,
    message: `Your order status has been updated to ${newStatus}.`,
    color: '#64748b',
    icon: ''
  };

  return {
    subject: `${statusInfo.title} - Order #${order._id.toString().slice(-8)}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2D38; margin: 0; padding: 20px; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">

          ${emailHeader(statusInfo.title, statusInfo.subtitle)}

          <div style="padding: 30px;">
            <p style="margin: 0 0 25px 0; color: #64748b; font-size: 15px; line-height: 1.6;">${statusInfo.message}</p>

            <!-- Status Badge -->
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 15px 30px; background-color: ${statusInfo.color}; color: white; border-radius: 8px; font-size: 18px; font-weight: 700; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                ${newStatus}
              </div>
            </div>

            <!-- Order Details -->
            <div style="background-color: #fafafa; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
              <h3 style="color: #1F2D38; margin: 0 0 15px 0; font-size: 16px; font-weight: 700;">Order Information</h3>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Order ID:</strong> #${order._id.toString().slice(-12)}</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Total Amount:</strong> <span style="color: #895F42; font-weight: 600;">₹${order.totalPrice?.toLocaleString('en-IN')}</span></p>
            </div>

            ${newStatus === 'Delivered' ? `
            <!-- Thank You Message -->
            <div style="background-color: #dcfce7; padding: 20px; border-radius: 12px; border-left: 4px solid #22c55e; margin-bottom: 25px;">
              <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 15px; font-weight: 700;">Thank you for your purchase!</h3>
              <p style="margin: 0; color: #14532d; font-size: 14px;">We hope you love your new products. If you have any issues or concerns, please don't hesitate to contact us.</p>
            </div>
            ` : ''}

            ${newStatus === 'Cancelled' ? `
            <!-- Cancellation Info -->
            <div style="background-color: #fee2e2; padding: 20px; border-radius: 12px; border-left: 4px solid #ef4444; margin-bottom: 25px;">
              <h3 style="color: #991b1b; margin: 0 0 10px 0; font-size: 15px; font-weight: 700;">Order Cancellation</h3>
              <p style="margin: 0 0 10px 0; color: #7f1d1d; font-size: 14px;">${order.cancellationReason || 'Your order has been cancelled.'}</p>
              ${order.isPaid ? '<p style="margin: 0; color: #7f1d1d; font-size: 14px;">Your refund will be processed within 5-7 business days.</p>' : ''}
            </div>
            ` : ''}

            ${emailFooter()}
          </div>
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
Total: ₹${order.totalPrice?.toLocaleString('en-IN')}

${newStatus === 'Cancelled' && order.cancellationReason ? `Cancellation Reason: ${order.cancellationReason}\n` : ''}

Need help? Call us: +91 98809 14457

Thank you for shopping with Samrat Agencies
    `
  };
};

// Return status update email template
const returnStatusUpdateEmail = (returnRequest, user) => {
  const statusConfig = {
    Approved: {
      title: 'Return Request Approved',
      message: 'Good news! Your return request has been approved.',
      color: '#22c55e',
      bgColor: '#dcfce7'
    },
    Rejected: {
      title: 'Return Request Update',
      message: 'We have reviewed your return request.',
      color: '#ef4444',
      bgColor: '#fee2e2'
    },
    'Picked Up': {
      title: 'Item Picked Up for Return',
      message: 'Your return item has been picked up successfully.',
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    Refunded: {
      title: 'Refund Processed',
      message: 'Your refund has been successfully processed!',
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    }
  };

  const config = statusConfig[returnRequest.status] || {
    title: `Return Request ${returnRequest.status}`,
    message: `Your return request status has been updated to ${returnRequest.status}.`,
    color: '#64748b',
    bgColor: '#f1f5f9'
  };

  return {
    subject: `${config.title} - Return #${returnRequest._id.toString().slice(-8)}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Return Status Update</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2D38; margin: 0; padding: 20px; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">

          ${emailHeader(config.title, config.message)}

          <div style="padding: 30px;">
            <p style="margin: 0 0 20px 0; color: #64748b; font-size: 15px;">Hi ${user.name},</p>

            <!-- Status Card -->
            <div style="background-color: ${config.bgColor}; padding: 20px; border-radius: 12px; border-left: 4px solid ${config.color}; margin-bottom: 25px;">
              <p style="margin: 0 0 8px 0; color: #1F2D38; font-weight: 600; font-size: 14px;">Current Status</p>
              <p style="margin: 0; color: ${config.color}; font-weight: 700; font-size: 20px;">${returnRequest.status}</p>
            </div>

            <!-- Return Details -->
            <div style="background-color: #fafafa; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
              <h3 style="color: #1F2D38; margin: 0 0 15px 0; font-size: 16px; font-weight: 700;">Return Details</h3>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Return ID:</strong> #${returnRequest._id.toString().slice(-12)}</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Order ID:</strong> #${returnRequest.order?._id?.toString().slice(-12) || 'N/A'}</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Refund Amount:</strong> <span style="color: #895F42; font-weight: 600;">₹${returnRequest.refundAmount?.toLocaleString('en-IN')}</span></p>
            </div>

            ${returnRequest.adminNotes ? `
            <!-- Admin Notes -->
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 15px; font-weight: 700;">Message from Admin</h3>
              <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">${returnRequest.adminNotes}</p>
            </div>
            ` : ''}

            ${returnRequest.isRefunded ? `
            <!-- Refund Info -->
            <div style="background-color: #dcfce7; padding: 20px; border-radius: 12px; border-left: 4px solid #22c55e; margin-bottom: 25px;">
              <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 15px; font-weight: 700;">Refund Processed</h3>
              <p style="margin: 0; color: #14532d; font-size: 14px;">Your refund of <strong>₹${returnRequest.refundAmount?.toLocaleString('en-IN')}</strong> has been processed on ${new Date(returnRequest.refundedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
              <p style="margin: 10px 0 0 0; color: #14532d; font-size: 13px; opacity: 0.9;">The amount will be credited to your original payment method within 5-7 business days.</p>
            </div>
            ` : ''}

            ${emailFooter()}
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Return Request ${returnRequest.status}

Hi ${user.name},

${config.message}

Return Details:
- Return ID: ${returnRequest._id}
- Order ID: ${returnRequest.order?._id || 'N/A'}
- Status: ${returnRequest.status}
- Refund Amount: ₹${returnRequest.refundAmount?.toLocaleString('en-IN')}

${returnRequest.adminNotes ? `Admin Notes: ${returnRequest.adminNotes}\n` : ''}
${returnRequest.isRefunded ? `Refund processed on: ${new Date(returnRequest.refundedAt).toLocaleDateString('en-IN')}\n` : ''}

Need help? Call us: +91 98809 14457

Thank you for shopping with Samrat Agencies
    `
  };
};

// Admin new order notification email template
const adminNewOrderNotificationEmail = (order, user) => {
  const itemsList = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return {
    subject: `New Order Received - Order #${order._id.toString().slice(-8)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #1F2D38; padding: 40px 30px; text-align: center;">
          <img src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/email/samrat-agencies-logo.png" alt="Samrat Agencies" style="max-width: 180px; height: auto; margin-bottom: 20px;" />
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Order Received!</h1>
          <p style="color: #BDD7EB; margin: 12px 0 0 0; font-size: 16px;">Action required - Process this order</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px;">
          <h2 style="color: #1F2D38; margin-top: 0;">Order Information</h2>
          <p><strong>Order ID:</strong> #${order._id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          <p><strong>Payment Status:</strong> <span style="color: ${order.isPaid ? '#22c55e' : '#f59e0b'}; font-weight: bold;">${order.isPaid ? 'Paid' : 'Pending'}</span></p>
          <p><strong>Order Status:</strong> <span style="background-color: #3b82f6; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px;">${order.status || 'Pending'}</span></p>
        </div>

        <div style="background-color: #dbeafe; padding: 20px; margin-top: 20px; border-radius: 5px; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1F2D38; margin-top: 0;">Customer Details</h3>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${user.email}" style="color: #895F42;">${user.email}</a></p>
          ${user.phone ? `<p><strong>Phone:</strong> <a href="tel:${user.phone}" style="color: #895F42;">${user.phone}</a></p>` : ''}
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
          ${order.discount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #22c55e;">
            <span>Discount:</span>
            <span>-₹${order.discount.toLocaleString('en-IN')}</span>
          </div>
          ` : ''}
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
          <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${order.shippingAddress.phone}" style="color: #895F42;">${order.shippingAddress.phone}</a></p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #dcfce7; border-radius: 5px; text-align: center; border-left: 4px solid #22c55e;">
          <h3 style="color: #166534; margin-top: 0;">Action Required</h3>
          <p style="margin: 10px 0; color: #14532d;">Please process this order and update the order status in the admin panel.</p>
          <p style="margin: 15px 0;">
            <a href="${process.env.FRONTEND_URL}/admin/orders" style="background-color: #895F42; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View Order in Admin Panel</a>
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #94A1AB; font-size: 14px;">
          <p style="margin: 5px 0;">This is an automated notification for administrators</p>
          <p style="margin: 5px 0; color: #1F2D38; font-weight: 600;">Samrat Agencies Admin Panel</p>
        </div>
      </body>
      </html>
    `,
    text: `
New Order Received - Order #${order._id}

Order Information:
- Order ID: #${order._id}
- Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
- Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
- Payment Status: ${order.isPaid ? 'Paid' : 'Pending'}
- Order Status: ${order.status || 'Pending'}

Customer Details:
- Name: ${user.name}
- Email: ${user.email}
${user.phone ? `- Phone: ${user.phone}` : ''}

Order Items:
${order.items.map(item => `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n')}

Order Summary:
Items Total: ₹${order.itemsPrice.toLocaleString('en-IN')}
Shipping: ₹${order.shippingPrice.toLocaleString('en-IN')}
Tax: ₹${order.taxPrice.toLocaleString('en-IN')}
${order.discount > 0 ? `Discount: -₹${order.discount.toLocaleString('en-IN')}\n` : ''}Total: ₹${order.totalPrice.toLocaleString('en-IN')}

Shipping Address:
${order.shippingAddress.name}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
${order.shippingAddress.country}
Phone: ${order.shippingAddress.phone}

Action Required:
Please process this order and update the order status in the admin panel.
View Order: ${process.env.FRONTEND_URL}/admin/orders

This is an automated notification for administrators.
    `
  };
};

// Email verification template
const emailVerificationEmail = (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  return {
    subject: 'Verify Your Email - Samrat Agencies',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2D38; margin: 0; padding: 20px; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">

          ${emailHeader('Welcome to Samrat Agencies!', 'Please verify your email address')}

          <div style="padding: 30px;">
            <p style="margin: 0 0 20px 0; color: #64748b; font-size: 15px;">Hi ${user.name},</p>
            <p style="margin: 0 0 20px 0; color: #64748b; font-size: 15px;">Thank you for registering with Samrat Agencies! We're excited to have you on board.</p>
            <p style="margin: 0 0 20px 0; color: #64748b; font-size: 15px;">To complete your registration and start shopping for quality furniture, please verify your email address by clicking the button below:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #895F42; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(137, 95, 66, 0.2);">Verify Email Address</a>
            </div>

            <p style="margin: 20px 0 10px 0; color: #64748b; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; word-break: break-all; font-size: 13px; color: #475569; border-left: 3px solid #895F42;">${verificationUrl}</p>

            <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: 600; font-size: 14px;">This link expires in 24 hours</p>
            </div>

            <div style="margin-top: 25px; padding: 20px; background-color: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 15px; font-weight: 700;">What's Next?</h3>
              <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">Once your email is verified, you can:</p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #1e3a8a; font-size: 14px;">
                <li>Browse our extensive furniture collection</li>
                <li>Add products to your wishlist</li>
                <li>Place orders and track them</li>
                <li>Get exclusive offers and updates</li>
              </ul>
            </div>

            <p style="margin: 25px 0 0 0; color: #64748b; font-size: 14px;">If you did not create this account, please ignore this email.</p>

            ${emailFooter()}
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to Samrat Agencies!

Hi ${user.name},

Thank you for registering with Samrat Agencies! We're excited to have you on board.

To complete your registration and start shopping for quality furniture, please verify your email address by clicking this link:
${verificationUrl}

This verification link will expire in 24 hours.

What's Next?
Once your email is verified, you can:
- Browse our extensive furniture collection
- Add products to your wishlist
- Place orders and track them
- Get exclusive offers and updates

If you did not create this account, please ignore this email.

Need help? Call us: +91 98809 14457

Samrat Agencies
    `
  };
};

// New ticket notification email template (to admin)
const newTicketNotificationEmail = (ticket, user) => {
  return {
    subject: `New Support Ticket #${ticket.ticketNumber} - ${ticket.subject}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Support Ticket</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2D38; margin: 0; padding: 20px; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">

          ${emailHeader('New Support Ticket', 'Customer needs assistance')}

          <div style="padding: 30px;">
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 15px; font-weight: 700;">Action Required</h3>
              <p style="margin: 0; color: #78350f; font-size: 14px;">A new support ticket has been created and requires your attention.</p>
            </div>

            <div style="background-color: #fafafa; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
              <h3 style="color: #1F2D38; margin: 0 0 15px 0; font-size: 16px; font-weight: 700;">Ticket Information</h3>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Ticket #:</strong> ${ticket.ticketNumber}</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Subject:</strong> ${ticket.subject}</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Category:</strong> ${ticket.category}</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Priority:</strong> <span style="color: ${ticket.priority === 'urgent' ? '#dc2626' : ticket.priority === 'high' ? '#f59e0b' : '#64748b'}; font-weight: 600;">${ticket.priority.toUpperCase()}</span></p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Status:</strong> ${ticket.status}</p>
            </div>

            <div style="background-color: #dbeafe; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 16px; font-weight: 700;">Customer Details</h3>
              <p style="margin: 5px 0; color: #1e3a8a; font-size: 14px;"><strong>Name:</strong> ${user.name}</p>
              <p style="margin: 5px 0; color: #1e3a8a; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${user.email}" style="color: #895F42;">${user.email}</a></p>
              ${user.phone ? `<p style="margin: 5px 0; color: #1e3a8a; font-size: 14px;"><strong>Phone:</strong> <a href="tel:${user.phone}" style="color: #895F42;">${user.phone}</a></p>` : ''}
            </div>

            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
              <h3 style="color: #1F2D38; margin: 0 0 10px 0; font-size: 16px; font-weight: 700;">Message</h3>
              <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${ticket.message}</p>
            </div>

            ${ticket.orderId ? `
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>Related Order:</strong> #${ticket.orderId}</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/admin/tickets" style="background-color: #895F42; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(137, 95, 66, 0.2);">View Ticket in Admin Panel</a>
            </div>

            ${emailFooter()}
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New Support Ticket #${ticket.ticketNumber}

Ticket Information:
- Ticket #: ${ticket.ticketNumber}
- Subject: ${ticket.subject}
- Category: ${ticket.category}
- Priority: ${ticket.priority.toUpperCase()}
- Status: ${ticket.status}

Customer Details:
- Name: ${user.name}
- Email: ${user.email}
${user.phone ? `- Phone: ${user.phone}` : ''}

Message:
${ticket.message}

${ticket.orderId ? `Related Order: #${ticket.orderId}` : ''}

View Ticket: ${process.env.FRONTEND_URL}/admin/tickets

Samrat Agencies
    `
  };
};

// Ticket reply notification email template (to customer)
const ticketReplyNotificationEmail = (ticket, reply, user) => {
  return {
    subject: `Reply to Your Support Ticket #${ticket.ticketNumber}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ticket Reply</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2D38; margin: 0; padding: 20px; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">

          ${emailHeader('Support Team Reply', `RE: ${ticket.subject}`)}

          <div style="padding: 30px;">
            <p style="margin: 0 0 20px 0; color: #64748b; font-size: 15px;">Hi ${user.name},</p>
            <p style="margin: 0 0 20px 0; color: #64748b; font-size: 15px;">Our support team has replied to your ticket.</p>

            <div style="background-color: #dcfce7; padding: 20px; border-radius: 12px; border-left: 4px solid #22c55e; margin-bottom: 25px;">
              <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 15px; font-weight: 700;">Ticket #${ticket.ticketNumber}</h3>
              <p style="margin: 0; color: #14532d; font-size: 14px;"><strong>Subject:</strong> ${ticket.subject}</p>
            </div>

            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
              <h3 style="color: #1F2D38; margin: 0 0 10px 0; font-size: 16px; font-weight: 700;">Support Team Response</h3>
              <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${reply.message}</p>
              <p style="margin: 15px 0 0 0; color: #64748b; font-size: 13px;">
                Replied by: ${reply.isAdmin ? 'Support Team' : user.name}<br>
                ${new Date(reply.createdAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/profile?tab=support" style="background-color: #895F42; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(137, 95, 66, 0.2);">View & Reply to Ticket</a>
            </div>

            <p style="margin: 25px 0 0 0; color: #64748b; font-size: 14px;">If you have any additional questions, please reply to the ticket or contact us directly.</p>

            ${emailFooter()}
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Support Team Reply

Hi ${user.name},

Our support team has replied to your ticket.

Ticket #${ticket.ticketNumber}
Subject: ${ticket.subject}

Support Team Response:
${reply.message}

Replied by: ${reply.isAdmin ? 'Support Team' : user.name}
${new Date(reply.createdAt).toLocaleString('en-IN')}

View & Reply: ${process.env.FRONTEND_URL}/profile?tab=support

If you have any additional questions, please reply to the ticket or contact us directly.

Need help? Call us: +91 98809 14457

Samrat Agencies
    `
  };
};

// Ticket status update notification email template
const ticketStatusUpdateEmail = (ticket, user) => {
  const statusConfig = {
    open: { color: '#3b82f6', bgColor: '#dbeafe', label: 'Open' },
    'in-progress': { color: '#f59e0b', bgColor: '#fef3c7', label: 'In Progress' },
    resolved: { color: '#22c55e', bgColor: '#dcfce7', label: 'Resolved' },
    closed: { color: '#64748b', bgColor: '#f1f5f9', label: 'Closed' }
  };

  const config = statusConfig[ticket.status] || statusConfig.open;

  return {
    subject: `Ticket #${ticket.ticketNumber} Status Updated: ${config.label}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ticket Status Update</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2D38; margin: 0; padding: 20px; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">

          ${emailHeader('Ticket Status Update', `Ticket #${ticket.ticketNumber}`)}

          <div style="padding: 30px;">
            <p style="margin: 0 0 20px 0; color: #64748b; font-size: 15px;">Hi ${user.name},</p>
            <p style="margin: 0 0 20px 0; color: #64748b; font-size: 15px;">Your support ticket status has been updated.</p>

            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 15px 30px; background-color: ${config.color}; color: white; border-radius: 8px; font-size: 18px; font-weight: 700; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                ${config.label}
              </div>
            </div>

            <div style="background-color: #fafafa; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
              <h3 style="color: #1F2D38; margin: 0 0 15px 0; font-size: 16px; font-weight: 700;">Ticket Details</h3>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Ticket #:</strong> ${ticket.ticketNumber}</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Subject:</strong> ${ticket.subject}</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong style="color: #1F2D38;">Category:</strong> ${ticket.category}</p>
            </div>

            ${ticket.status === 'resolved' ? `
            <div style="background-color: #dcfce7; padding: 20px; border-radius: 12px; border-left: 4px solid #22c55e; margin-bottom: 25px;">
              <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 15px; font-weight: 700;">Issue Resolved</h3>
              <p style="margin: 0; color: #14532d; font-size: 14px;">Your ticket has been marked as resolved. If you still need assistance, please reply to the ticket.</p>
            </div>
            ` : ''}

            ${ticket.status === 'closed' ? `
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; border-left: 4px solid #64748b; margin-bottom: 25px;">
              <h3 style="color: #334155; margin: 0 0 10px 0; font-size: 15px; font-weight: 700;">Ticket Closed</h3>
              <p style="margin: 0; color: #475569; font-size: 14px;">This ticket has been closed. If you need further assistance, please create a new ticket.</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/profile?tab=support" style="background-color: #895F42; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(137, 95, 66, 0.2);">View Ticket Details</a>
            </div>

            ${emailFooter()}
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Ticket Status Update

Hi ${user.name},

Your support ticket status has been updated to: ${config.label}

Ticket Details:
- Ticket #: ${ticket.ticketNumber}
- Subject: ${ticket.subject}
- Category: ${ticket.category}
- Status: ${config.label}

${ticket.status === 'resolved' ? 'Your ticket has been marked as resolved. If you still need assistance, please reply to the ticket.' : ''}
${ticket.status === 'closed' ? 'This ticket has been closed. If you need further assistance, please create a new ticket.' : ''}

View Ticket: ${process.env.FRONTEND_URL}/profile?tab=support

Need help? Call us: +91 98809 14457

Samrat Agencies
    `
  };
};

module.exports = {
  orderConfirmationEmail,
  passwordResetEmail,
  orderStatusUpdateEmail,
  returnStatusUpdateEmail,
  contactFormEmail,
  contactFormThankYouEmail,
  adminNewOrderNotificationEmail,
  emailVerificationEmail,
  newTicketNotificationEmail,
  ticketReplyNotificationEmail,
  ticketStatusUpdateEmail
};
