const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  getUserById,
  deleteUser
} = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

router.put('/profile', auth, updateProfile);
router.get('/addresses', auth, getAddresses);
router.post('/addresses', auth, addAddress);
router.put('/addresses/:addressId', auth, updateAddress);
router.delete('/addresses/:addressId', auth, deleteAddress);

router.get('/', auth, adminAuth, getAllUsers);
router.get('/:id', auth, adminAuth, getUserById);
router.delete('/:id', auth, adminAuth, deleteUser);

module.exports = router;
