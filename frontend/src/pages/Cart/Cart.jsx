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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-red transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
          {!isEmpty && (
            <p className="text-gray-600 mt-2">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </div>

        {isEmpty ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link
              to="/products"
              className="inline-block bg-primary-red text-white px-8 py-3 font-bold hover:bg-red-700 transition-colors"
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
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-lg shadow-sm divide-y">
                {cart.items?.map((item) => {
                  const product = item.product || item.productSnapshot;
                  const itemImage = product?.images?.[0]?.url || 
                                  product?.image || 
                                  '/images/placeholder-product.jpg';

                  return (
                    <div key={item._id} className="p-6">
                      <div className="flex gap-4">
                        
                        {/* Product Image */}
                        <Link 
                          to={`/products/${product?.slug || product?._id}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={itemImage}
                            alt={product?.name || 'Product'}
                            className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <Link 
                                to={`/products/${product?.slug || product?._id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-primary-red transition-colors"
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
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                disabled={loading || item.quantity <= 1}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                disabled={loading}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={loading}
                              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
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
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (estimated)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {subtotal > 0 && subtotal < 99 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      Add <strong>${(99 - subtotal).toFixed(2)}</strong> more for FREE shipping!
                    </p>
                  </div>
                )}

                <button
                  className="w-full bg-primary-red text-white py-4 px-6 font-bold rounded hover:bg-red-700 transition-colors mb-3"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block w-full text-center border-2 border-gray-300 text-gray-700 py-3 px-6 font-bold rounded hover:border-gray-400 transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Free shipping over $99</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Easy returns</span>
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
