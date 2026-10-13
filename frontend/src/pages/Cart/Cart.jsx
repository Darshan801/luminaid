import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    isEmpty,
    itemCount,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useContext(CartContext);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeItem(itemId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Clear entire cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand-orange 
                     transition-colors duration-fast mb-4 font-medium"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Shopping Cart</h1>
          {!isEmpty && (
            <p className="text-gray-600 mt-2">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </div>

        {isEmpty ? (
          /* Empty Cart */
          <div className="bg-white rounded-soft shadow-medium p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Add some products to get started!</p>
            <Link
              to="/products"
              className="inline-block bg-brand-orange text-white px-8 py-3.5 font-bold rounded-soft
                       hover:bg-brand-orange-dark active:scale-95
                       transition-all duration-fast shadow-glow-sm hover:shadow-glow-md"
            >
              Shop Products
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-600 hover:text-red-800 font-medium
                           transition-colors duration-fast"
                >
                  Clear Cart
                </button>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-soft shadow-medium divide-y divide-gray-200">
                {cart.items?.map((item) => {
                  const product = item.product || item.productSnapshot;
                  const itemImage = product?.images?.[0]?.url || 
                                  product?.image || 
                                  '/images/placeholder-product.jpg';

                  return (
                    <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors duration-fast">
                      <div className="flex gap-4 md:gap-6">
                        
                        {/* Product Image */}
                        <Link 
                          to={`/products/${product?.slug || product?._id}`}
                          className="flex-shrink-0 group"
                        >
                          <img
                            src={itemImage}
                            alt={product?.name || 'Product'}
                            className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-soft bg-gray-100 
                                     group-hover:shadow-medium transition-shadow duration-fast"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between gap-4">
                            <div className="min-w-0 flex-grow">
                              <Link 
                                to={`/products/${product?.slug || product?._id}`}
                                className="text-lg font-bold text-gray-900 hover:text-brand-orange 
                                         transition-colors duration-fast block truncate"
                              >
                                {product?.name || 'Unknown Product'}
                              </Link>
                              {item.variant && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Variant: {item.variant}
                                </p>
                              )}
                              {product?.sku && (
                                <p className="text-xs text-gray-500 mt-1">
                                  SKU: {product.sku}
                                </p>
                              )}
                            </div>
                            
                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-lg font-bold text-gray-900">
                                RS {(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                RS {item.price.toFixed(2)} each
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center border border-gray-300 rounded-soft overflow-hidden
                                          hover:border-brand-orange transition-colors duration-fast">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                disabled={loading || item.quantity <= 1}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed 
                                         transition-colors duration-fast"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-2 min-w-[3rem] text-center font-bold border-x border-gray-300">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                disabled={loading}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed 
                                         transition-colors duration-fast"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={loading}
                              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 
                                       disabled:opacity-50 transition-colors duration-fast font-medium"
                            >
                              <Trash2 size={16} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-soft shadow-medium p-6 sticky top-24">
                <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">RS {subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount</span>
                      <span>-RS {discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? <span className="text-green-600">FREE</span> : `RS ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (estimated)</span>
                    <span className="font-semibold">RS {tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>RS {total.toFixed(2)}</span>
                </div>

                {subtotal > 0 && subtotal < 99 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-soft p-4 mb-6">
                    <p className="text-sm text-blue-800 font-medium">
                      Add <strong>RS {(99 - subtotal).toFixed(2)}</strong> more for FREE shipping!
                    </p>
                  </div>
                )}

                <button
                  className="w-full bg-brand-orange text-white py-4 px-6 font-bold rounded-soft 
                           hover:bg-brand-orange-dark active:scale-95
                           transition-all duration-fast mb-3
                           shadow-glow-sm hover:shadow-glow-md"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block w-full text-center border border-gray-300 text-gray-700 py-3.5 px-6 
                           font-bold rounded-soft hover:border-brand-orange hover:text-brand-orange
                           active:scale-95
                           transition-all duration-fast"
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                      </div>
                      <span className="font-medium">Free shipping over RS 99</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                      </div>
                      <span className="font-medium">Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                      </div>
                      <span className="font-medium">Easy returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
