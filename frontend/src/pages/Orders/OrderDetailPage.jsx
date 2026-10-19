import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrder';
import { formatCurrency } from '../../utils/format';
import { ChevronRight, ChevronLeft, Package, MapPin, Truck, Phone, AlertCircle, Printer, HelpCircle, Calendar, CreditCard } from 'lucide-react';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentOrder, loading, error, fetchOrderById, cancelOrder } = useOrder();
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);

  const handleImageError = (itemIndex) => {
    setImageErrors(prev => ({ ...prev, [itemIndex]: true }));
  };

  const getProductImage = (item, index) => {
    // Try multiple image sources
    if (imageErrors[index]) {
      return null; // Don't show broken image
    }
    
    return item.image || item.product?.images?.[0] || null;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pending_verification: 'bg-orange-100 text-orange-800 border-orange-200',
      verified: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const canCancelOrder = currentOrder?.status === 'pending' || currentOrder?.status === 'processing';

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Order Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    };
    return labels[status] || status;
  };

  const getPaymentStatusLabel = (status) => {
    const labels = {
      pending: 'Payment Pending',
      pending_verification: 'Awaiting Verification',
      verified: 'Payment Verified',
      rejected: 'Payment Rejected',
      completed: 'Payment Complete',
      refunded: 'Refunded'
    };
    return labels[status] || status.replace(/_/g, ' ');
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) return;

    setCancelling(true);
    try {
      await cancelOrder(orderId, cancelReason);
      setShowCancelModal(false);
      // Refresh order details
      fetchOrderById(orderId);
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading && !currentOrder) {
    return (
      <div className="min-h-screen bg-warm-paper py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-orange border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="min-h-screen bg-warm-paper py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-soft border border-gray-200 shadow-medium p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The order you\'re looking for doesn\'t exist or you don\'t have permission to view it.'}</p>
            <button
              onClick={() => navigate('/orders/my-orders')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-soft
                       font-bold hover:bg-brand-orange-dark active:scale-95
                       transition-all duration-fast shadow-glow-sm hover:shadow-glow-md"
            >
              <ChevronLeft size={18} />
              Back to My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-paper py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Breadcrumb & Back Button */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">
              Home
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <Link to="/orders/my-orders" className="hover:text-brand-orange transition-colors duration-fast">
              My Orders
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">Order #{currentOrder.orderNumber}</span>
          </nav>
          <button
            onClick={() => navigate('/orders/my-orders')}
            className="flex items-center gap-2 text-brand-orange hover:text-brand-orange-dark font-bold
                     transition-colors duration-fast group"
          >
            <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition-transform duration-fast" />
            Back to My Orders
          </button>
        </div>

        {/* Order Header Card */}
        <div className="bg-white rounded-soft border border-gray-200 shadow-medium p-6 md:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl md:text-2xl font-heading font-bold text-gray-900">
                  Order #{currentOrder.orderNumber}
                </h1>
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar size={14} />
                Placed on {formatDate(currentOrder.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-soft text-xs font-bold border ${getStatusColor(currentOrder.status)}`}>
                <Package size={14} />
                {getStatusLabel(currentOrder.status)}
              </span>
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-soft text-xs font-bold border ${getPaymentStatusColor(currentOrder.paymentStatus)}`}>
                <CreditCard size={14} />
                {getPaymentStatusLabel(currentOrder.paymentStatus)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
          {/* Left Column - Order Items & Addresses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-soft border border-gray-200 shadow-medium p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package size={20} className="text-brand-orange" />
                Order Items
              </h2>
              <div className="space-y-4">
                {currentOrder.items.map((item, index) => {
                  const productImage = getProductImage(item, index);
                  
                  return (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-soft border border-gray-200
                                                     hover:border-brand-orange hover:shadow-soft
                                                     transition-all duration-fast">
                      <div className="flex-shrink-0">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-soft shadow-soft"
                            onError={() => handleImageError(index)}
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-soft flex items-center justify-center shadow-soft">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base mb-1">{item.name}</h3>
                        {item.variant && (
                          <p className="text-xs text-gray-500 mb-1">
                            <span className="font-medium">Variant:</span> {item.variant}
                          </p>
                        )}
                        {item.sku && (
                          <p className="text-xs text-gray-500 mb-2">
                            <span className="font-medium">SKU:</span> {item.sku}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-600">
                            <span className="font-medium">Qty:</span> {item.quantity}
                          </span>
                          <span className="text-gray-600">
                            <span className="font-medium">Price:</span> {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(item.subtotal || (item.quantity * item.price))}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-soft border border-gray-200 shadow-medium p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-brand-orange" />
                Delivery Address
              </h2>
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-soft">
                <p className="font-bold text-gray-900 text-base mb-3">{currentOrder.shippingAddress.fullName}</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  {currentOrder.shippingAddress.email && (
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {currentOrder.shippingAddress.email}
                    </p>
                  )}
                  {currentOrder.shippingAddress.phone && (
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {currentOrder.shippingAddress.phone}
                    </p>
                  )}
                  <p className="mt-3">{currentOrder.shippingAddress.addressLine1}</p>
                  {currentOrder.shippingAddress.addressLine2 && (
                    <p>{currentOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {currentOrder.shippingAddress.city}
                    {currentOrder.shippingAddress.state && `, ${currentOrder.shippingAddress.state}`}
                    {currentOrder.shippingAddress.zipCode && ` ${currentOrder.shippingAddress.zipCode}`}
                  </p>
                  <p className="font-medium">{currentOrder.shippingAddress.country}</p>
                </div>

                {/* Payment Screenshot Section */}
                {currentOrder.paymentScreenshot && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                      <CreditCard size={16} className="text-brand-orange" />
                      Payment Proof
                    </h3>
                    <div className="bg-white rounded-soft border border-gray-300 p-3">
                      <img
                        src={currentOrder.paymentScreenshot}
                        alt="Payment Proof"
                        className="w-full h-auto rounded-soft shadow-soft cursor-pointer hover:shadow-medium transition-shadow duration-fast"
                        onClick={() => window.open(currentOrder.paymentScreenshot, '_blank')}
                        title="Click to view full size"
                      />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Click image to view full size
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tracking Information */}
            {currentOrder.trackingNumber && (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-soft shadow-medium p-6 md:p-8 text-white">
                <h2 className="text-lg md:text-xl font-heading font-bold mb-6 flex items-center gap-2">
                  <Truck size={20} />
                  Package Tracking
                </h2>
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-soft space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Tracking Number:</span>
                    <span className="font-mono font-bold text-lg">{currentOrder.trackingNumber}</span>
                  </div>
                  {currentOrder.carrier && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Carrier:</span>
                      <span className="font-semibold">{currentOrder.carrier}</span>
                    </div>
                  )}
                  {currentOrder.shippedAt && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Shipped:</span>
                      <span>{formatDate(currentOrder.shippedAt)}</span>
                    </div>
                  )}
                  {currentOrder.estimatedDelivery && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Est. Delivery:</span>
                      <span>{formatDate(currentOrder.estimatedDelivery)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-soft border border-gray-200 shadow-medium p-6">
                <h2 className="text-lg md:text-xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-brand-orange" />
                  Summary
                </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">{formatCurrency(currentOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">
                    {currentOrder.shipping !== undefined && currentOrder.shipping !== null 
                      ? formatCurrency(currentOrder.shipping) 
                      : formatCurrency(0)}
                  </span>
                </div>
                {currentOrder.tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-bold text-gray-900">{formatCurrency(currentOrder.tax)}</span>
                  </div>
                )}
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-bold">-{formatCurrency(currentOrder.discount)}</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-heading font-bold text-gray-900">Total</span>
                    <span className="text-xl font-heading font-bold text-brand-orange">{formatCurrency(currentOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {currentOrder.status === 'pending' && currentOrder.paymentStatus === 'pending' && (
                  <Link
                    to={`/orders/pending/${currentOrder._id}`}
                    className="block w-full px-6 py-3 bg-brand-orange text-white text-center rounded-soft
                             font-bold hover:bg-brand-orange-dark active:scale-95
                             transition-all duration-fast shadow-glow-sm hover:shadow-glow-md"
                  >
                    Complete Payment
                  </Link>
                )}
                {canCancelOrder && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="block w-full px-6 py-3 bg-red-500 text-white text-center rounded-soft
                             font-bold hover:bg-red-600 active:scale-95
                             transition-all duration-fast shadow-soft hover:shadow-medium"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-gray-300 
                           text-gray-700 text-center rounded-soft font-bold
                           hover:bg-gray-50 hover:border-brand-orange hover:text-brand-orange
                           transition-all duration-fast"
                >
                  <Printer size={18} />
                  Print Order
                </button>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-soft border border-orange-200 shadow-soft p-6">
              <h3 className="font-heading font-bold text-gray-900 mb-3 flex items-center gap-2">
                <HelpCircle size={20} className="text-brand-orange" />
                Need Help?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                If you have any questions about your order, please contact our support team.
              </p>
              <Link
                to="/support/contact"
                className="block w-full px-4 py-2.5 bg-white text-brand-orange text-center rounded-soft
                         font-bold hover:bg-gray-50 transition-colors duration-fast shadow-soft border border-orange-200"
              >
                Contact Support
              </Link>
            </div>

            {/* Email Notifications Info */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-soft border border-green-200 shadow-soft p-6">
              <h3 className="font-heading font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Updates
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                You'll receive email notifications at: <strong className="text-gray-900">{currentOrder.customerEmail}</strong>
              </p>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Order confirmation sent</span>
                </div>
                {currentOrder.paymentStatus === 'pending_verification' && (
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Payment pending notification sent</span>
                  </div>
                )}
                {currentOrder.paymentStatus === 'verified' && (
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Payment verified notification sent</span>
                  </div>
                )}
                {currentOrder.status === 'shipped' && (
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Shipping notification sent</span>
                  </div>
                )}
                {currentOrder.status === 'delivered' && (
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Delivery confirmation sent</span>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-soft shadow-strong p-8 max-w-md w-full transform transition-all">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Cancel Order</h2>
              <p className="text-gray-600">This action cannot be undone. Please provide a reason for cancellation.</p>
            </div>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-soft p-4 mb-6
                       focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20
                       transition-all duration-fast"
              rows="4"
              placeholder="Please tell us why you're cancelling this order..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-soft
                         font-bold hover:bg-gray-50 transition-all duration-fast
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling || !cancelReason.trim()}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-soft
                         font-bold hover:bg-red-600 active:scale-95 transition-all duration-fast
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
