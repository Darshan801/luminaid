const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMyOrders,
  getOrderById,
  getOrderTracking,
  cancelOrder,
  getGuestOrder,
  getAllOrders,
  getPendingPayments,
  verifyPayment,
  updateOrderStatus
} = require('../controllers/orderController');

// Public routes
router.get('/guest/:orderNumber', getGuestOrder);

// Protected routes (require authentication)
router.use(protect);

// Customer routes
router.get('/my-orders', getMyOrders);
router.get('/:orderId', getOrderById);
router.get('/:orderId/tracking', getOrderTracking);
router.put('/:orderId/cancel', cancelOrder);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.get('/admin/pending-payments', authorize('admin'), getPendingPayments);
router.post('/:orderId/verify-payment', authorize('admin'), verifyPayment);
router.put('/:orderId/status', authorize('admin'), updateOrderStatus);

module.exports = router;
