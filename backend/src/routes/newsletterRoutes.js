const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  subscribe,
  unsubscribe,
  getAllSubscribers
} = require('../controllers/newsletterController');

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin routes
router.get('/subscribers', auth, adminAuth, getAllSubscribers);

module.exports = router;
