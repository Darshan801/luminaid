/**
 * Cart API Service
 * 
 * Handles all cart-related API calls to the backend
 */

import { get, post, put, del } from './api';

/**
 * Get current cart
 * @returns {Promise} Cart data
 */
export const getCart = async () => {
  try {
    const response = await get('/cart');
    return response.data;
  } catch (error) {
    console.error('Get Cart Error:', error);
    throw error;
  }
};

/**
 * Get cart item count
 * @returns {Promise} Item count
 */
export const getCartCount = async () => {
  try {
    const response = await get('/cart/count');
    return response.data.count;
  } catch (error) {
    console.error('Get Cart Count Error:', error);
    return 0;
  }
};

/**
 * Add item to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @param {string} variant - Product variant (optional)
 * @returns {Promise} Updated cart
 */
export const addToCart = async (productId, quantity = 1, variant = null) => {
  try {
    const response = await post('/cart/items', {
      productId,
      quantity,
      variant,
    });
    return response.data;
  } catch (error) {
    console.error('Add to Cart Error:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise} Updated cart
 */
export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Update Cart Item Error:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise} Updated cart
 */
export const removeFromCart = async (itemId) => {
  try {
    const response = await del(`/cart/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Remove from Cart Error:', error);
    throw error;
  }
};

/**
 * Clear entire cart
 * @returns {Promise} Empty cart
 */
export const clearCart = async () => {
  try {
    const response = await del('/cart');
    return response.data;
  } catch (error) {
    console.error('Clear Cart Error:', error);
    throw error;
  }
};

/**
 * Apply discount code
 * @param {string} code - Discount code
 * @returns {Promise} Updated cart with discount
 */
export const applyDiscount = async (code) => {
  try {
    const response = await post('/cart/discount', { code });
    return response.data;
  } catch (error) {
    console.error('Apply Discount Error:', error);
    throw error;
  }
};

/**
 * Remove discount code
 * @returns {Promise} Updated cart without discount
 */
export const removeDiscount = async () => {
  try {
    const response = await del('/cart/discount');
    return response.data;
  } catch (error) {
    console.error('Remove Discount Error:', error);
    throw error;
  }
};

/**
 * Merge guest cart with user cart (after login)
 * @returns {Promise} Merged cart
 */
export const mergeCart = async () => {
  try {
    const response = await post('/cart/merge');
    return response.data;
  } catch (error) {
    console.error('Merge Cart Error:', error);
    throw error;
  }
};

export default {
  getCart,
  getCartCount,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyDiscount,
  removeDiscount,
  mergeCart,
};
