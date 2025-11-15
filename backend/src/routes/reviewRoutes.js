const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', auth, createReview);
router.put('/:reviewId', auth, updateReview);
router.delete('/:reviewId', auth, deleteReview);

module.exports = router;
