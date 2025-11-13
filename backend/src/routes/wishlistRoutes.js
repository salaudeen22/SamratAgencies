const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistStatus
} = require('../controllers/wishlistController');

// All routes require authentication
router.use(auth);

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', getWishlist);

// @route   POST /api/wishlist
// @desc    Add product to wishlist
// @access  Private
router.post('/', addToWishlist);

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/:productId', removeFromWishlist);

// @route   DELETE /api/wishlist
// @desc    Clear entire wishlist
// @access  Private
router.delete('/', clearWishlist);

// @route   GET /api/wishlist/check/:productId
// @desc    Check if product is in wishlist
// @access  Private
router.get('/check/:productId', checkWishlistStatus);

module.exports = router;
