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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Scan QR Code to Pay</h2>

      <div className="space-y-6">
        {/* Order Amount */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600 mb-1">Total Amount to Pay</p>
          <p className="text-4xl font-bold text-blue-600">
            RS {safeTotals.total.toFixed(2)}
          </p>
        </div>

        {/* QR Code Display */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <img
                src={qrDetails?.qrCodeUrl || '/images/payment/bank-qr-code.svg'}
                alt="Payment QR Code"
                className="w-64 h-64 object-contain border-4 border-gray-200 rounded-lg"
              />
            </div>

            {/* Bank Details */}
            {qrDetails && (
              <div className="w-full max-w-md space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Bank Name:</span>
                  <span className="font-semibold">{qrDetails.bankName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Account Name:</span>
                  <span className="font-semibold">{qrDetails.accountName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-semibold">{qrDetails.accountNumber}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Important Instructions
              </h3>
              {qrDetails?.instructions && (
                <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                  {qrDetails.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <button
            onClick={prevStep}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Back to Shipping
          </button>

          <button
            onClick={handleContinue}
            disabled={loading || isCreatingOrder}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingOrder ? 'Creating Order...' : loading ? 'Processing...' : 'I\'ve Made the Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRStep;

