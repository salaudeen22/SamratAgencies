const express = require('express');
const router = express.Router();
const {
  createReturn,
  getUserReturns,
  getReturnById,
  getAllReturns,
  updateReturnStatus,
  cancelReturn
} = require('../controllers/returnController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createReturn);
router.get('/', auth, getUserReturns);
router.get('/all', auth, adminAuth, getAllReturns);
router.get('/:id', auth, getReturnById);
router.put('/:id/status', auth, adminAuth, updateReturnStatus);
router.put('/:id/cancel', auth, cancelReturn);

module.exports = router;
