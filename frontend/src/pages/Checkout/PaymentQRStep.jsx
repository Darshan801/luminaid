import { useEffect, useState } from 'react';
import { useCheckout } from '../../hooks/useCheckout';
import { useCart } from '../../hooks/useCart';

const PaymentQRStep = () => {
  const {
    totals: checkoutTotals,
    getPaymentQR,
    createOrder,
    nextStep,
    prevStep,
    paymentQRData,
    orderId,
    loading
  } = useCheckout();
  
  const { cart } = useCart();

  const [qrDetails, setQRDetails] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Use cart totals (calculated by backend) as primary source
  const safeTotals = {
    subtotal: cart?.subtotal ?? checkoutTotals?.subtotal ?? 0,
    discount: cart?.discount ?? checkoutTotals?.discount ?? 0,
    shipping: cart?.shipping ?? checkoutTotals?.shipping ?? 0,
    tax: cart?.tax ?? checkoutTotals?.tax ?? 0,
    total: cart?.total ?? checkoutTotals?.total ?? 0
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        // Get QR code details if not already loaded
        if (!paymentQRData) {
          const qrData = await getPaymentQR();
          setQRDetails(qrData);
        } else {
          setQRDetails(paymentQRData);
        }

        // Don't create order here - it will be created when user proceeds to upload proof
        // This is because we need shipping address which is filled in step 1
      } catch (error) {
        console.error('Failed to initialize payment:', error);
      }
    };

    initialize();
  }, []);

  const handleContinue = async () => {
    try {
      setIsCreatingOrder(true);
      // Create order now if not already created (with shipping address from step 1)
      if (!orderId && !orderCreated) {
        await createOrder();
        setOrderCreated(true);
        }
      nextStep();
    } catch (error) {
      console.error('[PaymentQRStep] Failed to create order:', error);
      // Allow user to proceed anyway - they can try uploading proof
      // The upload proof step will handle order creation if needed
      alert('Note: Order creation will be completed when you upload payment proof. You can proceed.');
      nextStep();
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-6">
        Scan QR Code to Pay
      </h2>

      <div className="space-y-6">
        {/* Order Amount */}
        <div className="bg-gradient-to-br from-brand-orange to-brand-orange-dark 
                      rounded-soft p-6 text-center shadow-glow-md">
          <p className="text-sm text-white/90 mb-2 font-medium">Total Amount to Pay</p>
          <p className="text-4xl md:text-5xl font-bold text-white">
            RS {safeTotals.total.toFixed(2)}
          </p>
        </div>

        {/* QR Code Display */}
        <div className="bg-white border border-gray-200 rounded-soft p-6 md:p-8 shadow-medium">
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <img
                src={qrDetails?.qrCodeUrl || '/images/payment/bank-qr-code.svg'}
                alt="Payment QR Code"
                className="w-64 h-64 object-contain border-4 border-gray-200 rounded-soft shadow-soft"
              />
            </div>

            {/* Bank Details */}
            {qrDetails && (
              <div className="w-full max-w-md space-y-2 text-sm">
                <div className="flex justify-between py-3 border-b-2 border-gray-200">
                  <span className="text-gray-600 font-medium">Bank Name:</span>
                  <span className="font-bold text-gray-900">{qrDetails.bankName}</span>
                </div>
                <div className="flex justify-between py-3 border-b-2 border-gray-200">
                  <span className="text-gray-600 font-medium">Account Name:</span>
                  <span className="font-bold text-gray-900">{qrDetails.accountName}</span>
                </div>
                <div className="flex justify-between py-3 border-b-2 border-gray-200">
                  <span className="text-gray-600 font-medium">Account Number:</span>
                  <span className="font-bold text-gray-900">{qrDetails.accountNumber}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-soft p-4 shadow-soft">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-yellow-900 mb-2">
                Important Instructions
              </h3>
              {qrDetails?.instructions && (
                <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                  {qrDetails.instructions.map((instruction, index) => (
                    <li key={index} className="leading-relaxed">{instruction}</li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-6">
          <button
            onClick={prevStep}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-soft 
                     hover:border-gray-400 hover:bg-gray-50
                     active:scale-98
                     transition-all duration-fast
                     focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Back to Shipping
          </button>

          <button
            onClick={handleContinue}
            disabled={loading || isCreatingOrder}
            className="px-8 py-3 bg-brand-orange text-white font-bold rounded-soft 
                     hover:bg-brand-orange-dark 
                     active:scale-95
                     transition-all duration-fast 
                     shadow-glow-sm hover:shadow-glow-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
          >
            {isCreatingOrder ? 'Creating Order...' : loading ? 'Processing...' : 'I\'ve Made the Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRStep;

