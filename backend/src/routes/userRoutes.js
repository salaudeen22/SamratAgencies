const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser
} = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

router.put('/profile', auth, updateProfile);
router.get('/', auth, adminAuth, getAllUsers);
router.get('/:id', auth, adminAuth, getUserById);
router.delete('/:id', auth, adminAuth, deleteUser);

module.exports = router;
