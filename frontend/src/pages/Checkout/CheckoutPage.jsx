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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Redirecting to cart...</p>
        </div>
      </div>
    );
  }

  if (cartLoading || !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Cart is empty, redirecting...</p>
        </div>
      </div>
    );
  }

  if (!initialized && !redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  const steps = ['Shipping', 'Payment', 'Upload Proof'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${index <= currentStep 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                  {index + 1}
                </div>
                <div className={`ml-2 text-sm font-medium 
                  ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-4 
                    ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} 
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

