import api from './api';

const orderService = {
  // Get user's orders
  getMyOrders: async (page = 1, limit = 10) => {
    return await api.get(`/orders/my-orders?page=${page}&limit=${limit}`);
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    return await api.get(`/orders/${orderId}`);
  },

  // Get order tracking info
  getOrderTracking: async (orderId) => {
    return await api.get(`/orders/${orderId}/tracking`);
  },

  // Cancel order
  cancelOrder: async (orderId, reason) => {
    return await api.put(`/orders/${orderId}/cancel`, { reason });
  },

  // Get guest order
  getGuestOrder: async (orderNumber, email) => {
    return await api.get(`/orders/guest/${orderNumber}?email=${email}`);
  },

  // ========== ADMIN ONLY ==========

  // Get all orders (admin)
  getAllOrders: async (page = 1, limit = 20, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    return await api.get(`/orders/admin/all?${params}`);
  },

  // Get pending payments (admin)
  getPendingPayments: async (page = 1, limit = 20) => {
    return await api.get(`/orders/admin/pending-payments?page=${page}&limit=${limit}`);
  },

  // Verify payment (admin)
  verifyPayment: async (orderId, approved, rejectionReason = null) => {
    return await api.post(`/orders/${orderId}/verify-payment`, {
      approved,
      rejectionReason
    });
  },

  // Update order status (admin)
  updateOrderStatus: async (orderId, statusData) => {
    return await api.put(`/orders/${orderId}/status`, statusData);
  }
};

export default orderService;
