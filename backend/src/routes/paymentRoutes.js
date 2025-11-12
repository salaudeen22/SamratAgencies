const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey
} = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// Get Razorpay key
router.get('/razorpay/key', getRazorpayKey);

// Create Razorpay order
router.post('/razorpay/order', auth, createRazorpayOrder);

// Verify Razorpay payment
router.post('/razorpay/verify', auth, verifyRazorpayPayment);

module.exports = router;
