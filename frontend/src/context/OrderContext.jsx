import { createContext, useState, useCallback } from 'react';
import orderService from '../services/orderService';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Fetch user orders
  const fetchUserOrders = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const result = await orderService.getMyOrders(page, pagination.limit);
      setOrders(result.orders);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  // Fetch single order
  const fetchOrderById = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await orderService.getOrderById(orderId);
      setCurrentOrder(result.order);
      return result.order;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Track order
  const trackOrder = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await orderService.getOrderTracking(orderId);
      return result.tracking;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tracking info');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel order
  const cancelOrder = useCallback(async (orderId, reason) => {
    try {
      setLoading(true);
      setError(null);
      const result = await orderService.cancelOrder(orderId, reason);
      
      // Update orders list
      setOrders(prev => prev.map(order => 
        order._id === orderId ? result.order : order
      ));
      
      // Update current order if it's the one being cancelled
      if (currentOrder?._id === orderId) {
        setCurrentOrder(result.order);
      }
      
      return result.order;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  // Fetch guest order
  const fetchGuestOrder = useCallback(async (orderNumber, email) => {
    try {
      setLoading(true);
      setError(null);
      const result = await orderService.getGuestOrder(orderNumber, email);
      setCurrentOrder(result.order);
      return result.order;
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== ADMIN FUNCTIONS ==========

  // Fetch all orders (admin)
  const fetchAllOrders = useCallback(async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await orderService.getAllOrders(page, 20, filters);
      setOrders(result.orders);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch pending payments (admin)
  const fetchPendingPayments = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const result = await orderService.getPendingPayments(page, 20);
      setOrders(result.orders);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending payments');
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify payment (admin)
  const verifyPayment = useCallback(async (orderId, approved, rejectionReason = null) => {
    try {
      setLoading(true);
      setError(null);
      const result = await orderService.verifyPayment(orderId, approved, rejectionReason);
      
      // Update orders list
      setOrders(prev => prev.map(order => 
        order._id === orderId ? result.order : order
      ));
      
      // Update current order
      if (currentOrder?._id === orderId) {
        setCurrentOrder(result.order);
      }
      
      return result.order;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify payment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  // Update order status (admin)
  const updateOrderStatus = useCallback(async (orderId, statusData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await orderService.updateOrderStatus(orderId, statusData);
      
      // Update orders list
      setOrders(prev => prev.map(order => 
        order._id === orderId ? result.order : order
      ));
      
      // Update current order
      if (currentOrder?._id === orderId) {
        setCurrentOrder(result.order);
      }
      
      return result.order;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  const value = {
    // State
    orders,
    currentOrder,
    loading,
    error,
    pagination,

    // Actions
    fetchUserOrders,
    fetchOrderById,
    trackOrder,
    cancelOrder,
    fetchGuestOrder,

    // Admin actions
    fetchAllOrders,
    fetchPendingPayments,
    verifyPayment,
    updateOrderStatus
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
