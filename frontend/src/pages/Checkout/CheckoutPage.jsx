import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCheckout } from '../../hooks/useCheckout';
import { useCart } from '../../hooks/useCart';
import ShippingStep from './ShippingStep';
import PaymentQRStep from './PaymentQRStep';
import UploadProofStep from './UploadProofStep';
import OrderSummary from '../../components/checkout/OrderSummary';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useCart();
  const {
    currentStep,
    initializeCheckout,
    loading,
    error
  } = useCheckout();

  const [redirecting, setRedirecting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const initStartedRef = useRef(false); // Prevent any duplicate initialization

  useEffect(() => {
    // Skip if already started initialization (prevents all duplicates)
    if (initStartedRef.current) {
      return;
    }
    
    // Skip if cart is still loading
    if (cartLoading) {
      return;
    }
    
    // Skip if already redirecting
    if (redirecting) {
      return;
    }

    // Skip if already initialized
    if (initialized) {
      return;
    }
    
    // Mark as started immediately to prevent duplicates
    initStartedRef.current = true;

    // Initialize checkout when cart is ready
    const init = async () => {
      // Check if cart is empty on frontend
      if (!cart || !cart.items || cart.items.length === 0) {
        setRedirecting(true);
        navigate('/cart');
        return;
      }

      // Initialize checkout (validate with backend)
      const success = await initializeCheckout();
      // If initialization failed (e.g., cart is empty on backend), redirect to cart
      if (!success) {
        setRedirecting(true);
        navigate('/cart');
      } else {
        setInitialized(true);
      }
    };

    init();
  }, [cart, cartLoading]); // Removed navigate, initializeCheckout, redirecting, initialized from dependencies

  // Show redirecting or loading message
  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Redirecting to cart...</p>
        </div>
      </div>
    );
  }

  if (cartLoading || !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cart is empty, redirecting...</p>
        </div>
      </div>
    );
  }

  if (!initialized && !redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  const steps = ['Shipping', 'Payment', 'Upload Proof'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-center flex-wrap gap-2">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                {/* Step Circle */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                              font-bold text-sm
                              transition-all duration-normal
                  ${index <= currentStep 
                    ? 'bg-brand-orange border-brand-orange text-white shadow-glow-sm' 
                    : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                  {index + 1}
                </div>
                
                {/* Step Label */}
                <div className={`ml-2 text-sm font-bold transition-colors duration-fast
                  ${index <= currentStep ? 'text-brand-orange' : 'text-gray-500'}`}>
                  {step}
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`w-12 md:w-20 h-0.5 mx-3 md:mx-4 transition-all duration-normal
                    ${index < currentStep ? 'bg-brand-orange' : 'bg-gray-300'}`} 
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-soft font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-soft shadow-medium p-6 md:p-8">
              {currentStep === 0 && <ShippingStep />}
              {currentStep === 1 && <PaymentQRStep />}
              {currentStep === 2 && <UploadProofStep />}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-soft shadow-glow-lg p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-700 font-medium text-center">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

