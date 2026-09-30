import { createContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cartService';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemCount, setItemCount] = useState(0);

  // Fetch cart on mount
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart();
      setCart(cartData);
      setItemCount(cartData?.itemCount || 0);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError(err.message);
      // Initialize empty cart on error
      setCart({ items: [], subtotal: 0, total: 0, itemCount: 0 });
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1, variant = null) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.addToCart(productId, quantity, variant);
      setCart(updatedCart);
      setItemCount(updatedCart?.itemCount || 0);
      return { success: true, cart: updatedCart };
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      return removeItem(itemId);
    }

    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.updateCartItem(itemId, quantity);
      setCart(updatedCart);
      setItemCount(updatedCart?.itemCount || 0);
      return { success: true, cart: updatedCart };
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.removeFromCart(itemId);
      setCart(updatedCart);
      setItemCount(updatedCart?.itemCount || 0);
      return { success: true, cart: updatedCart };
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const emptyCart = await cartService.clearCart();
      setCart(emptyCart);
      setItemCount(0);
      return { success: true };
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Apply discount code
  const applyDiscount = async (code) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.applyDiscount(code);
      setCart(updatedCart);
      return { success: true, cart: updatedCart };
    } catch (err) {
      console.error('Failed to apply discount:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove discount code
  const removeDiscount = async () => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.removeDiscount();
      setCart(updatedCart);
      return { success: true, cart: updatedCart };
    } catch (err) {
      console.error('Failed to remove discount:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Refresh cart (useful after login or external changes)
  const refreshCart = async () => {
    await fetchCart();
  };

  const value = {
    // State
    cart,
    loading,
    error,
    itemCount,
    
    // Cart info
    isEmpty: !cart || cart.items?.length === 0,
    subtotal: cart?.subtotal || 0,
    discount: cart?.discount || 0,
    tax: cart?.tax || 0,
    shipping: cart?.shipping || 0,
    total: cart?.total || 0,
    
    // Actions
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyDiscount,
    removeDiscount,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
