const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin', 'superadmin'));

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private/Admin
router.get('/stats', getUserStats);

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', deleteUser);

module.exports = router;
