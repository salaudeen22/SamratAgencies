const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const { getSettings, updateSettings } = require('../controllers/settingsController');

// Public route - get settings
router.get('/', getSettings);

// Admin routes
router.put('/', auth, adminAuth, updateSettings);

module.exports = router;
