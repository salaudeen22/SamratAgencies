const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('../config/logger');
const { sendEmail } = require('../config/email');
const { passwordResetEmail, emailVerificationEmail } = require('../utils/emailTemplates');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    if (user) {
      logger.info(`User registered successfully: ${user.email}`);

      // Generate verification token
      const verificationToken = user.getEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      // Send verification email
      const emailContent = emailVerificationEmail(user, verificationToken);
      const emailResult = await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      if (emailResult.success) {
        logger.info(`Verification email sent to: ${user.email}`);
      } else {
        logger.warn(`Failed to send verification email to: ${user.email}`);
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified,
        token: generateToken(user._id),
        message: 'Registration successful. Please check your email to verify your account.'
      });
    }
  } catch (error) {
    logger.error(`Registration failed: ${error.message}`, { error: error.stack });
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      // Check if email is verified (skip for Google OAuth users and admins)
      if (!user.isEmailVerified && user.authProvider === 'local' && !user.isAdmin) {
        logger.warn(`Login blocked - email not verified: ${user.email}`);
        return res.status(403).json({
          message: 'Please verify your email before logging in. Check your inbox for the verification link.',
          emailNotVerified: true,
          email: user.email
        });
      }

      logger.info(`User logged in successfully: ${user.email}`);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified,
        token: generateToken(user._id)
      });
    } else {
      logger.warn(`Failed login attempt for email: ${email}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { error: error.stack });
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google OAuth callback
exports.googleCallback = async (req, res) => {
  try {
    // Mark Google users as verified by default
    if (req.user && !req.user.isEmailVerified) {
      req.user.isEmailVerified = true;
      await req.user.save({ validateBeforeSave: false });
    }

    const token = generateToken(req.user._id);

    // Redirect to frontend with token (remove trailing slash if exists)
    const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
    res.redirect(`${frontendUrl}/auth/google/success?token=${token}`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
    res.redirect(`${frontendUrl}/login?error=authentication_failed`);
  }
};

// Forgot password - Send reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Check if user is using Google OAuth
    if (user.authProvider === 'google') {
      return res.status(400).json({
        message: 'This account uses Google authentication. Please sign in with Google.'
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create email template
    const emailContent = passwordResetEmail(user, resetToken);

    // Send email
    const emailResult = await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    if (!emailResult.success) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message: 'Email could not be sent. Please try again later.'
      });
    }

    res.json({
      success: true,
      message: 'Password reset email sent. Please check your email.'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Please provide token and new password' });
    }

    // Hash token from URL
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Generate new JWT token
    const jwtToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password reset successful',
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: jwtToken
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send verification email
exports.sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create email template
    const emailContent = emailVerificationEmail(user, verificationToken);

    // Send email
    const emailResult = await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    if (!emailResult.success) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message: 'Verification email could not be sent. Please try again later.'
      });
    }

    logger.info(`Verification email sent to: ${user.email}`);

    res.json({
      success: true,
      message: 'Verification email sent. Please check your email.'
    });

  } catch (error) {
    logger.error(`Send verification email error: ${error.message}`, { error: error.stack });
    res.status(500).json({ message: error.message });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Please provide verification token' });
    }

    // Hash token from URL
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    logger.info(`Email verified successfully: ${user.email}`);

    // Generate new JWT token
    const jwtToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Email verified successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
      token: jwtToken
    });

  } catch (error) {
    logger.error(`Email verification error: ${error.message}`, { error: error.stack });
    res.status(500).json({ message: error.message });
  }
};

// Resend verification email (public endpoint - no auth required)
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email address' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: 'If an account exists with this email, a verification link has been sent.'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: 'This email is already verified. You can login now.',
        alreadyVerified: true
      });
    }

    // Check if user is using Google OAuth
    if (user.authProvider === 'google') {
      return res.status(400).json({
        message: 'This account uses Google authentication and is already verified.'
      });
    }

    // Generate new verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create email template
    const emailContent = emailVerificationEmail(user, verificationToken);

    // Send email
    const emailResult = await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    if (!emailResult.success) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message: 'Verification email could not be sent. Please try again later.'
      });
    }

    logger.info(`Verification email resent to: ${user.email}`);

    res.json({
      success: true,
      message: 'Verification email sent. Please check your inbox.'
    });

  } catch (error) {
    logger.error(`Resend verification email error: ${error.message}`, { error: error.stack });
    res.status(500).json({ message: error.message });
  }
};
