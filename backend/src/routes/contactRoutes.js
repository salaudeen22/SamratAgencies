const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  submitContactForm,
  getAllMessages,
  getMessageById,
  markAsRead,
  deleteMessage
} = require('../controllers/contactController');

// Public route
router.post('/', submitContactForm);

// Admin routes
router.get('/admin/messages', auth, adminAuth, getAllMessages);
router.get('/admin/messages/:id', auth, adminAuth, getMessageById);
router.patch('/admin/messages/:id/read', auth, adminAuth, markAsRead);
router.delete('/admin/messages/:id', auth, adminAuth, deleteMessage);

module.exports = router;
