const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  addProductImages,
  removeProductImage,
  searchProducts
} = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/', auth, adminAuth, createProduct);
router.put('/:id', auth, adminAuth, updateProduct);
router.delete('/:id', auth, adminAuth, deleteProduct);

// Image management routes
router.post('/:id/images', auth, adminAuth, addProductImages);
router.delete('/:id/images', auth, adminAuth, removeProductImage);

module.exports = router;
