const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, getProfile, googleCallback, forgotPassword, resetPassword, sendVerificationEmail, verifyEmail, resendVerificationEmail } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Email verification routes
router.post('/send-verification-email', auth, sendVerificationEmail);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail); // Public endpoint

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleCallback
);

module.exports = router;
