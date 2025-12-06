const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  downloadInvoice
} = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/', auth, getUserOrders);
router.get('/all', auth, adminAuth, getAllOrders);
router.get('/:id', auth, getOrderById);
router.get('/:id/invoice', auth, downloadInvoice);
router.put('/:id/pay', auth, updateOrderToPaid);
router.put('/:id/cancel', auth, cancelOrder);
router.put('/:id/status', auth, adminAuth, updateOrderStatus);

module.exports = router;
