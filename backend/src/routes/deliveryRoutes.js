const express = require('express');
const router = express.Router();
const {
  calculateDeliveryCharge,
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone,
  checkPincode
} = require('../controllers/deliveryZoneController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.post('/calculate', calculateDeliveryCharge);
router.get('/check/:pincode', checkPincode);

// Admin routes
router.get('/zones', auth, adminAuth, getAllZones);
router.get('/zones/:id', auth, adminAuth, getZoneById);
router.post('/zones', auth, adminAuth, createZone);
router.put('/zones/:id', auth, adminAuth, updateZone);
router.delete('/zones/:id', auth, adminAuth, deleteZone);

module.exports = router;
