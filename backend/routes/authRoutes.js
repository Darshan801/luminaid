const express = require('express');
const router = express.Router();

// Import controllers
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail
} = require('../controllers/authController');

// Import middleware
const { protect } = require('../middleware/auth');

// Import validators
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateDetailsValidation,
  updatePasswordValidation
} = require('../middleware/validators');

/**
 * Public routes
 */

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, login);

// @route   POST /api/auth/forgotpassword
// @desc    Send password reset email
// @access  Public
router.post('/forgotpassword', forgotPasswordValidation, forgotPassword);

// @route   PUT /api/auth/resetpassword/:resettoken
// @desc    Reset password using token
// @access  Public
router.put('/resetpassword/:resettoken', resetPasswordValidation, resetPassword);

// @route   GET /api/auth/verify-email/:token
// @desc    Verify user email
// @access  Public
router.get('/verify-email/:token', verifyEmail);

/**
 * Protected routes (require authentication)
 */

// @route   POST /api/auth/logout
// @desc    Logout user and clear cookie
// @access  Private
router.post('/logout', protect, logout);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/updatedetails
// @desc    Update user details
// @access  Private
router.put('/updatedetails', protect, updateDetailsValidation, updateDetails);

// @route   PUT /api/auth/updatepassword
// @desc    Update password
// @access  Private
router.put('/updatepassword', protect, updatePasswordValidation, updatePassword);

module.exports = router;
