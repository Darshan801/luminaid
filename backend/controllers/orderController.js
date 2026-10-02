const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    Get user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
exports.getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.getUserOrders(req.user.id, page, limit);
    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:orderId
 * @access  Private
 */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.product', 'name slug images')
      .populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    // Allow if: admin, or user owns the order, or order email matches user email (for guest orders that were later associated)
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
    const isOwner = order.user && order.user.toString() === req.user.id;
    const isEmailMatch = order.customerEmail.toLowerCase() === req.user.email.toLowerCase();
    
    if (!isAdmin && !isOwner && !isEmailMatch) {
      console.log('[getOrderById] Authorization failed:', {
        userRole: req.user.role,
        userId: req.user.id,
        userEmail: req.user.email,
        orderUser: order.user,
        orderEmail: order.customerEmail,
        isAdmin,
        isOwner,
        isEmailMatch
      });
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

/**
 * @desc    Get order tracking info
 * @route   GET /api/orders/:orderId/tracking
 * @access  Private
 */
exports.getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.user?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      tracking: {
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        carrier: order.carrier,
        shippedAt: order.shippedAt,
        estimatedDelivery: order.estimatedDelivery,
        deliveredAt: order.deliveredAt
      }
    });
  } catch (error) {
    console.error('Get order tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tracking info'
    });
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:orderId/cancel
 * @access  Private
 */
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.user?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Cancel order
    await order.cancelOrder(reason);

    // Restore inventory
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product && product.trackInventory) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to cancel order'
    });
  }
};

/**
 * @desc    Get guest order by order number and email
 * @route   GET /api/orders/guest/:orderNumber
 * @access  Public
 */
exports.getGuestOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const order = await Order.getOrderByNumberAndEmail(orderNumber, email);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get guest order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// ==================== ADMIN ONLY ROUTES ====================

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/orders/admin/all
 * @access  Private/Admin
 */
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;
    const search = req.query.search;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { orderNumber: new RegExp(search, 'i') },
        { customerEmail: new RegExp(search, 'i') }
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

/**
 * @desc    Get pending payment orders (admin)
 * @route   GET /api/orders/admin/pending-payments
 * @access  Private/Admin
 */
exports.getPendingPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const orders = await Order.getPendingPaymentOrders(page, limit);
    const total = await Order.countDocuments({ paymentStatus: 'pending_verification' });

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get pending payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending payments'
    });
  }
};

/**
 * @desc    Verify payment (approve or reject)
 * @route   POST /api/orders/:orderId/verify-payment
 * @access  Private/Admin
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { approved, rejectionReason } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentStatus !== 'pending_verification') {
      return res.status(400).json({
        success: false,
        message: 'Order payment already processed'
      });
    }

    if (!order.paymentScreenshot) {
      return res.status(400).json({
        success: false,
        message: 'Payment screenshot not uploaded'
      });
    }

    if (approved) {
      // Approve payment
      await order.markAsVerified(req.user.id);

      // Note: Inventory already reserved when order was created
      // User stats will be updated by post-save hook

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order
      });
    } else {
      // Reject payment
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required'
        });
      }

      await order.markAsRejected(req.user.id, rejectionReason);

      // Restore inventory
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product && product.trackInventory) {
          product.stock += item.quantity;
          await product.save();
        }
      }

      res.status(200).json({
        success: true,
        message: 'Payment rejected',
        order
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
};

/**
 * @desc    Update order status (admin)
 * @route   PUT /api/orders/:orderId/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, carrier, notes } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status === 'shipped') {
      if (!trackingNumber || !carrier) {
        return res.status(400).json({
          success: false,
          message: 'Tracking number and carrier are required'
        });
      }
      await order.markAsShipped(trackingNumber, carrier);
    } else if (status === 'delivered') {
      await order.markAsDelivered();
    } else if (status === 'processing') {
      order.status = 'processing';
      await order.save();
    }

    if (notes) {
      order.internalNotes = notes;
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};
