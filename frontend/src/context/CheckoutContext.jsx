import { createContext, useState, useCallback, useRef } from 'react';
import checkoutService from '../services/checkoutService';
import { useCart } from '../hooks/useCart';

export const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const { cart, clearCart } = useCart();
  
  const [currentStep, setCurrentStep] = useState(0); // 0: shipping, 1: payment QR, 2: upload proof
  const [shippingAddress, setShippingAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentQRData, setPaymentQRData] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use ref to prevent double execution in Strict Mode
  const initializingRef = useRef(false);

  // Initialize checkout
  const initializeCheckout = useCallback(async () => {
    // Prevent double execution
    if (initializingRef.current) {
      console.log('[initializeCheckout] Already initializing, skipping...');
      // Return the last known state instead of false
      return initializingRef.current === 'success';
    }
    
    initializingRef.current = 'inProgress';
    
    try {
      console.log('[initializeCheckout] Starting checkout initialization...');
      setLoading(true);
      setError(null);

      // Validate cart
      console.log('[initializeCheckout] Calling validateCart...');
      const validationResult = await checkoutService.validateCart();
      console.log('[initializeCheckout] Validation result:', validationResult);
      
      if (!validationResult.valid) {
        // If cart is empty or has issues, return false to trigger redirect
        console.log('[initializeCheckout] Cart validation failed, redirecting...');
        initializingRef.current = 'failed';
        return false;
      }

      console.log('[initializeCheckout] Cart validation succeeded!');

      // Calculate initial totals
      try {
        console.log('[initializeCheckout] Calculating initial totals...');
        const result = await checkoutService.calculateTotals('standard', null);
        setTotals(result.totals);
        console.log('[initializeCheckout] Totals calculated:', result.totals);
      } catch (err) {
        console.log('[initializeCheckout] Failed to calculate totals:', err.message);
        // Silently fail for totals calculation
      }
      
      initializingRef.current = 'success';
      console.log('[initializeCheckout] Initialization complete - SUCCESS');
      return true;
    } catch (err) {
      // Any error (including empty cart) should trigger redirect
      console.error('[initializeCheckout] Initialization failed with error:', err);
      initializingRef.current = 'failed';
      return false;
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies - only run when explicitly called

  // Calculate totals
  const calculateTotals = useCallback(async () => {
    try {
      setLoading(true);
      const result = await checkoutService.calculateTotals(shippingMethod, shippingAddress?.state);
      setTotals(result.totals);
    } catch (err) {
      console.log('Calculate totals error:', err);
      // Silently fail for calculate totals
    } finally {
      setLoading(false);
    }
  }, [shippingMethod, shippingAddress?.state]); // Only depend on method and state

  // Update shipping address
  const updateShippingAddress = useCallback((address) => {
    setShippingAddress(address);
    if (sameAsShipping) {
      setBillingAddress(address);
    }
  }, [sameAsShipping]);

  // Update billing address
  const updateBillingAddress = useCallback((address) => {
    setBillingAddress(address);
  }, []);

  // Update shipping method
  const updateShippingMethod = useCallback(async (method) => {
    setShippingMethod(method);
    // Recalculate totals
    try {
      const result = await checkoutService.calculateTotals(method, shippingAddress?.state);
      setTotals(result.totals);
    } catch (err) {
      console.error('Failed to update totals:', err);
    }
  }, [shippingAddress]);

  // Get payment QR code
  const getPaymentQR = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await checkoutService.getPaymentQR();
      setPaymentQRData(result.paymentDetails);
      return result.paymentDetails;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get payment QR code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create order
  const createOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const orderData = {
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        sameAsShipping,
        shippingMethod
      };

      const result = await checkoutService.createOrder(orderData);
      setOrderId(result.order._id);
      
      return result.order;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [shippingAddress, billingAddress, sameAsShipping, shippingMethod]);

  // Upload payment screenshot
  const uploadPaymentScreenshot = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);

      if (!orderId) {
        throw new Error('Order not created yet');
      }

      const result = await checkoutService.uploadPaymentProof(orderId, file);
      setPaymentScreenshot(result.order.paymentScreenshot);
      
      // Clear cart after successful upload
      // clearCart(); // Uncomment when cart clearing is needed
      
      return result.order;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload payment proof');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Navigation
  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 2));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  // Reset checkout
  const reset = useCallback(() => {
    setCurrentStep(0);
    setShippingAddress(null);
    setBillingAddress(null);
    setSameAsShipping(true);
    setShippingMethod('standard');
    setPaymentQRData(null);
    setOrderId(null);
    setPaymentScreenshot(null);
    setTotals({
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0
    });
    setError(null);
  }, []);

  const value = {
    // State
    cart,
    currentStep,
    shippingAddress,
    billingAddress,
    sameAsShipping,
    shippingMethod,
    paymentQRData,
    orderId,
    paymentScreenshot,
    totals,
    loading,
    error,

    // Actions
    initializeCheckout,
    calculateTotals,
    updateShippingAddress,
    updateBillingAddress,
    setSameAsShipping,
    updateShippingMethod,
    getPaymentQR,
    createOrder,
    uploadPaymentScreenshot,
    nextStep,
    prevStep,
    goToStep,
    reset
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};
