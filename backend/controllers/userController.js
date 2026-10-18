const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = '-createdAt',
      role,
      isActive,
      search
    } = req.query;

    // Build query
    const query = {};

    // Role filter
    if (role && role !== 'all') {
      query.role = role;
    }

    // Active status filter
    if (isActive !== undefined && isActive !== 'all') {
      query.isActive = isActive === 'true';
    }

    // Text search (name or email)
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(query)
      .select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: users
    });
  } catch (error) {
    logger.error('Get All Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

/**
 * @desc    Get single user by ID (admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires')
      .populate('wishlist', 'name price images');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get User By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

/**
 * @desc    Update user (admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      isActive,
      isEmailVerified,
      notes
    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent updating own role or status
    if (req.user.id === req.params.id) {
      if (role && role !== user.role) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change your own role'
        });
      }
      if (isActive !== undefined && isActive !== user.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change your own active status'
        });
      }
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (isEmailVerified !== undefined) user.isEmailVerified = isEmailVerified;
    if (notes !== undefined) user.notes = notes;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    logger.error('Update User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

/**
 * @desc    Delete user (admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting own account
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Prevent deleting other admins
    if (user.role === 'admin' || user.role === 'superadmin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin accounts'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

/**
 * @desc    Get user statistics (admin only)
 * @route   GET /api/users/stats
 * @access  Private/Admin
 */
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'superadmin'] } });

    // Users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Customer tier breakdown
    const customerTiers = await User.aggregate([
      { $match: { role: 'customer' } },
      {
        $project: {
          tier: {
            $switch: {
              branches: [
                { case: { $gte: ['$totalSpent', 500] }, then: 'platinum' },
                { case: { $gte: ['$totalSpent', 250] }, then: 'gold' },
                { case: { $gte: ['$totalSpent', 100] }, then: 'silver' }
              ],
              default: 'bronze'
            }
          }
        }
      },
      { $group: { _id: '$tier', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        admins: adminUsers,
        newThisMonth: newUsers,
        customerTiers: customerTiers.reduce((acc, tier) => {
          acc[tier._id] = tier.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    logger.error('Get User Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
};
