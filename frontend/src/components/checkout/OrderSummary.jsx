import { useCart } from '../../hooks/useCart';
import { useCheckout } from '../../hooks/useCheckout';

const OrderSummary = () => {
  const { cart } = useCart();
  const { totals: checkoutTotals } = useCheckout();

  console.log('[OrderSummary] cart:', cart);
  console.log('[OrderSummary] checkoutTotals:', checkoutTotals);

  if (!cart || !cart.items || cart.items.length === 0) return null;

  // Use cart totals (which are calculated by backend) as primary source
  // Fall back to checkoutTotals if cart totals aren't available
  const safeTotals = {
    subtotal: cart.subtotal ?? checkoutTotals?.subtotal ?? 0,
    discount: cart.discount ?? checkoutTotals?.discount ?? 0,
    shipping: cart.shipping ?? checkoutTotals?.shipping ?? 0,
    tax: cart.tax ?? checkoutTotals?.tax ?? 0,
    total: cart.total ?? checkoutTotals?.total ?? 0
  };

  console.log('[OrderSummary] Using totals:', safeTotals);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <div key={item._id} className="flex space-x-3">
            <div className="relative">
              <img
                src={item.productSnapshot?.images?.[0] || item.productSnapshot?.image || '/placeholder-product.png'}
                alt={item.productSnapshot?.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.productSnapshot?.name}
              </p>
              {item.variant && (
                <p className="text-xs text-gray-500">{item.variant}</p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                ${(item.price || 0).toFixed(2)} × {item.quantity}
              </p>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${(safeTotals.subtotal || 0).toFixed(2)}</span>
        </div>

        {safeTotals.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="text-green-600">-${(safeTotals.discount || 0).toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {safeTotals.shipping === 0 ? 'TBD' : `$${(safeTotals.shipping || 0).toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${(safeTotals.tax || 0).toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-semibold">
          <span className="text-gray-900">Total</span>
          <span className="text-blue-600">${(safeTotals.total || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Secure Checkout
      </div>
    </div>
  );
};

export default OrderSummary;
