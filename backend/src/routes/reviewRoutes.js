const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewStatus,
  adminDeleteReview
} = require('../controllers/reviewController');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', auth, createReview);
router.put('/:reviewId', auth, updateReview);
router.delete('/:reviewId', auth, deleteReview);

// Admin routes
router.get('/admin/all', auth, adminAuth, getAllReviews);
router.patch('/admin/:reviewId/status', auth, adminAuth, updateReviewStatus);
router.delete('/admin/:reviewId', auth, adminAuth, adminDeleteReview);

module.exports = router;
