const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
  handleRazorpayWebhook
} = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// Get Razorpay key
router.get('/razorpay/key', getRazorpayKey);

// Create Razorpay order
router.post('/razorpay/order', auth, createRazorpayOrder);

// Verify Razorpay payment
router.post('/razorpay/verify', auth, verifyRazorpayPayment);

// Razorpay webhook (no auth - Razorpay will call this)
router.post('/razorpay/webhook', handleRazorpayWebhook);

module.exports = router;
