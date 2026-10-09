import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrder';

const OrderPendingPage = () => {
  const { orderId } = useParams();
  const { fetchOrderById, currentOrder, loading } = useOrder();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId).then(setOrder);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Your payment is pending verification
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Order Details
            </h2>
            {order && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Total:</span>
                  <span className="font-semibold text-gray-900">RS {order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Verification
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* What Happens Next */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              What happens next?
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Our team will review your payment screenshot</li>
              <li>Verification typically takes 1-2 business days</li>
              <li>You'll receive an email confirmation once verified</li>
              <li>Your order will then be processed and shipped</li>
            </ol>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 mb-1">
                Important Note
              </h3>
              <p className="text-sm text-yellow-700">
                Please save your order number for tracking purposes. You can check your order status in your account or contact our support team if you have any questions.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders/my-orders"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Need help? {' '}
            <Link to="/support" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderPendingPage;
