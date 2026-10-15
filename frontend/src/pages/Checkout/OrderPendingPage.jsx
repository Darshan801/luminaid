import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrder';
import { Clock, CheckCircle, Package, AlertTriangle, ChevronRight } from 'lucide-react';

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
      <div className="min-h-screen bg-warm-paper flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-paper py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full 
                        bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300 mb-6 shadow-soft">
            <Clock size={40} className="text-yellow-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3">
            Order Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Your payment is pending verification
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-soft border border-gray-200 shadow-medium p-6 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
              Order Details
            </h2>
            {order && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Order Number:</span>
                  <span className="font-bold text-gray-900">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Order Total:</span>
                  <span className="font-bold text-gray-900">RS {order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-soft text-xs font-bold uppercase
                               bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Pending Verification
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* What Happens Next */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 p-5 rounded-r-soft">
            <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle size={18} />
              What happens next?
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Our team will review your payment screenshot</li>
              <li>Verification typically takes 1-2 business days</li>
              <li>You'll receive an email confirmation once verified</li>
              <li>Your order will then be processed and shipped</li>
            </ol>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-300 rounded-soft p-6 mb-6 shadow-soft">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle size={24} className="text-yellow-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-yellow-900 mb-2">
                Important Note
              </h3>
              <p className="text-sm text-yellow-800 leading-relaxed">
                Please save your order number for tracking purposes. You can check your order status in your account or contact our support team if you have any questions.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/orders/my-orders"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-orange text-white rounded-soft
                     font-bold hover:bg-brand-orange-dark active:scale-95
                     transition-all duration-fast shadow-glow-sm hover:shadow-glow-md"
          >
            <Package size={20} />
            View My Orders
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 
                     bg-white rounded-soft font-bold
                     hover:bg-gray-50 hover:border-brand-orange hover:text-brand-orange
                     transition-all duration-fast"
          >
            Continue Shopping
            <ChevronRight size={20} />
          </Link>
        </div>

        {/* Contact Support */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Need help? {' '}
            <Link to="/support" className="text-brand-orange hover:text-brand-orange-dark font-bold transition-colors duration-fast">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderPendingPage;
