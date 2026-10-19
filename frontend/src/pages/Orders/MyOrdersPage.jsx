import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrder';
import { formatCurrency } from '../../utils/format';
import { ChevronRight, Package, Calendar, CreditCard } from 'lucide-react';

const MyOrdersPage = () => {
  const { orders, loading, error, pagination, fetchUserOrders } = useOrder();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchUserOrders(currentPage);
  }, [currentPage, fetchUserOrders]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      processing: 'text-blue-700 bg-blue-50 border-blue-200',
      shipped: 'text-purple-700 bg-purple-50 border-purple-200',
      delivered: 'text-green-700 bg-green-50 border-green-200',
      cancelled: 'text-red-700 bg-red-50 border-red-200',
      refunded: 'text-gray-700 bg-gray-50 border-gray-200'
    };
    return colors[status] || 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFilteredOrders = () => {
    if (activeFilter === 'all') return orders;
    return orders.filter(order => order.status === activeFilter);
  };

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
    return counts;
  };

  if (loading && !orders.length) {
    return (
      <div className="min-h-screen bg-warm-paper py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-orange border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-warm-paper py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-soft border border-gray-200 shadow-medium p-8">
            <div className="bg-red-50 border border-red-200 rounded-soft p-6 text-red-800">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">Error Loading Orders</span>
              </div>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();
  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-warm-paper py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">
              Home
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">My Orders</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage all your orders</p>
        </div>

        {/* Email Notifications Banner */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-soft p-4 mb-6 shadow-soft">
          <div className="flex items-start gap-3">
            <svg className="flex-shrink-0 w-5 h-5 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-green-900 mb-1">Email Notifications Active</h3>
              <p className="text-sm text-green-800">
                You'll receive email updates for all order status changes including payment verification, shipping updates, and delivery confirmations.
              </p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-soft border border-gray-200 shadow-medium p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full 
                            flex items-center justify-center mb-6 border-2 border-orange-200">
                <Package size={48} className="text-brand-orange" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">No Orders Yet</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Start your journey with us! Browse our collection and place your first order.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange text-white rounded-soft
                         font-bold hover:bg-brand-orange-dark active:scale-95
                         transition-all duration-fast shadow-glow-sm hover:shadow-glow-md"
              >
                <Package size={20} />
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-soft border border-gray-200 shadow-medium overflow-hidden">
            {/* Filters/Tabs */}
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-5 py-2.5 rounded-soft font-bold text-sm transition-all duration-fast ${
                    activeFilter === 'all'
                      ? 'bg-brand-orange text-white shadow-glow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-brand-orange hover:text-brand-orange'
                  }`}
                >
                  All Orders ({statusCounts.all})
                </button>
                <button
                  onClick={() => setActiveFilter('pending')}
                  className={`px-5 py-2.5 rounded-soft font-bold text-sm transition-all duration-fast ${
                    activeFilter === 'pending'
                      ? 'bg-brand-orange text-white shadow-glow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-brand-orange hover:text-brand-orange'
                  }`}
                >
                  Pending ({statusCounts.pending})
                </button>
                <button
                  onClick={() => setActiveFilter('delivered')}
                  className={`px-5 py-2.5 rounded-soft font-bold text-sm transition-all duration-fast ${
                    activeFilter === 'delivered'
                      ? 'bg-brand-orange text-white shadow-glow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-brand-orange hover:text-brand-orange'
                  }`}
                >
                  Delivered ({statusCounts.delivered})
                </button>
                <button
                  onClick={() => setActiveFilter('cancelled')}
                  className={`px-5 py-2.5 rounded-soft font-bold text-sm transition-all duration-fast ${
                    activeFilter === 'cancelled'
                      ? 'bg-brand-orange text-white shadow-glow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-brand-orange hover:text-brand-orange'
                  }`}
                >
                  Cancelled ({statusCounts.cancelled})
                </button>
              </div>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 text-sm">
              <div className="col-span-5">Order</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Orders List */}
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50 transition-colors"
                >
                  {/* Order Info - Mobile/Desktop */}
                  <div className="col-span-12 md:col-span-5">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {order.items[0]?.image || order.items[0]?.product?.images?.[0] ? (
                          <img
                            src={order.items[0]?.image || order.items[0]?.product?.images?.[0]}
                            alt={order.items[0]?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '';
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-base">
                          {order.items[0]?.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {order.items.length > 1 && `+${order.items.length - 1} more item${order.items.length - 1 > 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date - Desktop only */}
                  <div className="hidden md:flex md:col-span-2 items-center text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </div>

                  {/* Status */}
                  <div className="col-span-6 md:col-span-2 flex items-center">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-soft text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="col-span-6 md:col-span-2 flex items-center md:justify-end">
                    <span className="text-base md:text-lg font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="col-span-12 md:col-span-1 flex items-center md:justify-end">
                    <Link
                      to={`/orders/${order._id}`}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-1 
                               px-6 py-2.5 bg-brand-orange text-white rounded-soft
                               text-sm font-bold
                               hover:bg-brand-orange-dark active:scale-95
                               transition-all duration-fast shadow-soft hover:shadow-medium"
                    >
                      View
                      <ChevronRight size={16} />
                    </Link>
                  </div>

                  {/* Mobile Date */}
                  <div className="md:hidden col-span-12 text-xs text-gray-500 -mt-2">
                    Placed on {formatDate(order.createdAt)}
                  </div>
                </div>
              ))}
            </div>

            {/* No results */}
            {filteredOrders.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Package size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg font-medium">
                  No {activeFilter !== 'all' ? activeFilter : ''} orders found
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-3 px-6 py-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2.5 bg-white text-gray-700 rounded-soft border border-gray-300
                           hover:bg-gray-50 hover:border-brand-orange hover:text-brand-orange
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
                           disabled:hover:border-gray-300 disabled:hover:text-gray-700
                           transition-all duration-fast font-bold text-sm"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(Math.min(pagination.pages, 5))].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-soft font-bold text-sm transition-all duration-fast ${
                          currentPage === pageNum
                            ? 'bg-brand-orange text-white shadow-glow-sm'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-brand-orange hover:text-brand-orange'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                  disabled={currentPage === pagination.pages}
                  className="px-6 py-2.5 bg-white text-gray-700 rounded-soft border border-gray-300
                           hover:bg-gray-50 hover:border-brand-orange hover:text-brand-orange
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
                           disabled:hover:border-gray-300 disabled:hover:text-gray-700
                           transition-all duration-fast font-bold text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
