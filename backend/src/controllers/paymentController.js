const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const { paymentSuccessEmail, paymentFailedEmail } = require('../utils/emailTemplates');
const logger = require('../config/logger');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Razorpay payment
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update order status
      const order = await Order.findById(orderId).populate('user', 'name email');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'success',
        razorpay_order_id,
        razorpay_signature,
      };

      await order.save();

      // Send payment success email to customer
      if (order.user && order.user.email) {
        try {
          const payment = {
            id: razorpay_payment_id,
            amount: order.totalPrice * 100,
            method: 'Online Payment'
          };

          const emailContent = paymentSuccessEmail(order, payment);
          await sendEmail({
            to: order.user.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
          });

          logger.info(`Payment success email sent to ${order.user.email} for order ${order._id}`);
        } catch (emailError) {
          logger.error(`Failed to send payment success email: ${emailError.message}`);
          // Don't fail the request if email fails
        }
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Razorpay key for frontend
exports.getRazorpayKey = async (req, res) => {
  try {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Razorpay Webhook Handler
exports.handleRazorpayWebhook = async (req, res) => {
  try {
    // Verify webhook signature
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      logger.error('Razorpay webhook secret not configured');
      return res.status(500).json({ message: 'Webhook secret not configured' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      logger.warn('Invalid webhook signature received');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    logger.info(`Razorpay webhook received: ${event}`);

    // Handle different webhook events
    switch (event) {
      case 'payment.authorized':
      case 'payment.captured':
        await handlePaymentSuccess(payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailure(payload.payment.entity);
        break;

      case 'refund.created':
      case 'refund.processed':
        await handleRefund(payload.refund.entity);
        break;

      case 'order.paid':
        logger.info(`Order paid: ${payload.order.entity.id}`);
        break;

      default:
        logger.info(`Unhandled webhook event: ${event}`);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(`Webhook error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Helper: Handle successful payment
async function handlePaymentSuccess(payment) {
  try {
    const orderId = payment.notes?.orderId;

    if (!orderId) {
      logger.warn(`Payment ${payment.id} has no associated order ID`);
      return;
    }

    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      logger.error(`Order ${orderId} not found for payment ${payment.id}`);
      return;
    }

    // Update order payment status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: payment.id,
      status: payment.status,
      method: payment.method,
      amount: payment.amount / 100,
      captured_at: payment.captured_at
    };

    await order.save();

    // Send payment success email to customer
    if (order.user && order.user.email) {
      try {
        const emailContent = paymentSuccessEmail(order, payment);
        await sendEmail({
          to: order.user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });

        logger.info(`Payment success email sent to ${order.user.email} for order ${order._id}`);
      } catch (emailError) {
        logger.error(`Failed to send payment success email: ${emailError.message}`);
      }
    }

    logger.info(`Payment ${payment.id} processed successfully for order ${order._id}`);
  } catch (error) {
    logger.error(`Error handling payment success: ${error.message}`);
  }
}

// Helper: Handle failed payment
async function handlePaymentFailure(payment) {
  try {
    const orderId = payment.notes?.orderId;

    if (!orderId) {
      logger.warn(`Failed payment ${payment.id} has no associated order ID`);
      return;
    }

    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      logger.error(`Order ${orderId} not found for failed payment ${payment.id}`);
      return;
    }

    // Update order with payment failure info
    order.paymentResult = {
      id: payment.id,
      status: 'failed',
      method: payment.method,
      error_code: payment.error_code,
      error_description: payment.error_description
    };

    await order.save();

    // Send payment failure email to customer
    if (order.user && order.user.email) {
      try {
        const emailContent = paymentFailedEmail(order, payment);
        await sendEmail({
          to: order.user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });

        logger.info(`Payment failure email sent to ${order.user.email} for order ${order._id}`);
      } catch (emailError) {
        logger.error(`Failed to send payment failure email: ${emailError.message}`);
      }
    }

    logger.info(`Payment ${payment.id} failed for order ${order._id}: ${payment.error_description}`);
  } catch (error) {
    logger.error(`Error handling payment failure: ${error.message}`);
  }
}

// Helper: Handle refund
async function handleRefund(refund) {
  try {
    const paymentId = refund.payment_id;

    // Find order by payment ID
    const order = await Order.findOne({ 'paymentResult.id': paymentId }).populate('user', 'name email');

    if (!order) {
      logger.warn(`Order not found for refund on payment ${paymentId}`);
      return;
    }

    // Update order with refund information
    if (!order.refundInfo) {
      order.refundInfo = {};
    }

    order.refundInfo = {
      id: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
      created_at: refund.created_at,
      processed_at: refund.processed_at
    };

    await order.save();

    logger.info(`Refund ${refund.id} processed for order ${order._id}, amount: ₹${refund.amount / 100}`);
  } catch (error) {
    logger.error(`Error handling refund: ${error.message}`);
  }
}
