const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
  handleRazorpayWebhook,
  processRefund,
  getRefundStatus
} = require('../controllers/paymentController');
const { auth, adminAuth } = require('../middleware/auth');

// Get Razorpay key
router.get('/razorpay/key', getRazorpayKey);

// Create Razorpay order
router.post('/razorpay/order', auth, createRazorpayOrder);

// Verify Razorpay payment
router.post('/razorpay/verify', auth, verifyRazorpayPayment);

// Razorpay webhook (no auth - Razorpay will call this)
router.post('/razorpay/webhook', handleRazorpayWebhook);

// Process refund (admin only)
router.post('/refund', auth, adminAuth, processRefund);

// Get refund status
router.get('/refund/:orderId', auth, getRefundStatus);

module.exports = router;
