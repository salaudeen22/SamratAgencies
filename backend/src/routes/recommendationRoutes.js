const express = require('express');
const router = express.Router();
const {
  getSimilarProducts,
  getFrequentlyBoughtTogether,
  getCartBasedRecommendations,
  getCompleteTheLook,
  getTrendingProducts,
  getNewArrivals
} = require('../controllers/recommendationController');

// Public routes
router.get('/similar/:productId', getSimilarProducts);
router.get('/frequently-bought/:productId', getFrequentlyBoughtTogether);
router.post('/cart-based', getCartBasedRecommendations);
router.get('/complete-look/:productId', getCompleteTheLook);
router.get('/trending', getTrendingProducts);
router.get('/new-arrivals', getNewArrivals);

module.exports = router;
