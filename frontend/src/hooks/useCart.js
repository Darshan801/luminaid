import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/**
 * Custom hook to access cart context
 * 
 * @returns {object} Cart context value
 * 
 * @example
 * const { cart, addToCart, itemCount } = useCart();
 * 
 * // Add item to cart
 * await addToCart(productId, quantity);
 * 
 * // Check if cart is empty
 * if (isEmpty) {
 *   console.log('Cart is empty');
 * }
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

export default useCart;
