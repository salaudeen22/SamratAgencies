const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getAllCoupons,
  getActiveCoupons,
  getCouponById,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponStats,
  useCoupon
} = require('../controllers/couponController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/active', getActiveCoupons);

// Customer routes (requires authentication)
router.post('/validate', auth, validateCoupon);

// Admin routes
router.post('/', auth, adminAuth, createCoupon);
router.get('/', auth, adminAuth, getAllCoupons);
router.get('/:id', auth, adminAuth, getCouponById);
router.put('/:id', auth, adminAuth, updateCoupon);
router.delete('/:id', auth, adminAuth, deleteCoupon);
router.get('/:id/stats', auth, adminAuth, getCouponStats);

// Order processing route (when coupon is actually used)
router.post('/:id/use', auth, useCoupon);

module.exports = router;
