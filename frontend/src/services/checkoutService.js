import api from './api';

const checkoutService = {
  // Validate cart before checkout
  validateCart: async () => {
    console.log('[checkoutService] Calling validateCart API...');
    try {
      const response = await api.post('/checkout/validate-cart');
      console.log('[checkoutService] validateCart response:', response);
      // api.post already returns the parsed data object
      // Backend returns: { success: true, valid: true, cart: {...}, issues: [] }
      return response;
    } catch (error) {
      console.error('[checkoutService] validateCart error:', error);
      throw error;
    }
  },

  // Calculate totals with shipping and tax
  calculateTotals: async (shippingMethod, state) => {
    const response = await api.post('/checkout/calculate-totals', {
      shippingMethod,
      state
    });
    // Backend returns: { success: true, totals: {...} }
    return response;
  },

  // Get payment QR code details
  getPaymentQR: async () => {
    const response = await api.get('/checkout/payment-qr');
    // Backend returns: { success: true, paymentDetails: {...} }
    return response;
  },

  // Create order
  createOrder: async (orderData) => {
    const response = await api.post('/checkout/create-order', orderData);
    // Backend returns: { success: true, message: '...', order: {...} }
    return response;
  },

  // Upload payment screenshot
  uploadPaymentProof: async (orderId, file) => {
    const formData = new FormData();
    formData.append('screenshot', file);

    // Don't set Content-Type - browser will set it automatically with boundary
    const response = await api.post(`/checkout/upload-payment-proof/${orderId}`, formData);
    // Backend returns: { success: true, message: '...', order: {...} }
    return response;
  }
};

export default checkoutService;
