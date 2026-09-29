/**
 * Image Helper Utility
 * 
 * This utility provides consistent image path handling across the application.
 * All images should be stored in /public/images/ for production compatibility.
 * 
 * Usage:
 *   import { getProductImage, getAboutImage } from '@/utils/imageHelper'
 *   <img src={getProductImage('titan.jpg')} alt="Titan" />
 */

// Base path for images (relative to public folder)
const BASE_IMAGE_PATH = '/images';

/**
 * Get product image path
 * @param {string} filename - Image filename
 * @returns {string} Full image path
 */
export const getProductImage = (filename) => {
  return `${BASE_IMAGE_PATH}/products/${filename}`;
};

/**
 * Get about/company image path
 * @param {string} filename - Image filename
 * @returns {string} Full image path
 */
export const getAboutImage = (filename) => {
  return `${BASE_IMAGE_PATH}/about/${filename}`;
};

/**
 * Get press/testimonial logo path
 * @param {string} filename - Image filename
 * @returns {string} Full image path
 */
export const getPressImage = (filename) => {
  return `${BASE_IMAGE_PATH}/press/${filename}`;
};

/**
 * Get logo path
 * @param {string} filename - Image filename
 * @returns {string} Full image path
 */
export const getLogoImage = (filename) => {
  return `${BASE_IMAGE_PATH}/logos/${filename}`;
};

/**
 * Get icon path
 * @param {string} filename - Image filename
 * @returns {string} Full image path
 */
export const getIconImage = (filename) => {
  return `${BASE_IMAGE_PATH}/icons/${filename}`;
};

/**
 * Get generic image path (for any custom location)
 * @param {string} path - Relative path from /images/
 * @returns {string} Full image path
 */
export const getImage = (path) => {
  return `${BASE_IMAGE_PATH}/${path}`;
};

/**
 * Get placeholder image
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Placeholder text
 * @returns {string} Placeholder image URL
 */
export const getPlaceholderImage = (width = 400, height = 400, text = 'No Image') => {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
};

/**
 * Check if image path is external (CDN, Cloudinary, etc.)
 * @param {string} path - Image path
 * @returns {boolean} True if external URL
 */
export const isExternalImage = (path) => {
  return path?.startsWith('http://') || path?.startsWith('https://') || path?.startsWith('//');
};

/**
 * Get optimized image path (handles both local and external images)
 * @param {string} path - Image path (can be local or external)
 * @param {string} fallback - Fallback image
 * @returns {string} Optimized image path
 */
export const getOptimizedImage = (path, fallback = null) => {
  if (!path) {
    return fallback || getPlaceholderImage();
  }
  
  if (isExternalImage(path)) {
    return path;
  }
  
  // If path starts with /images/, it's already formatted
  if (path.startsWith('/images/')) {
    return path;
  }
  
  // If path starts with /, use as is (public folder)
  if (path.startsWith('/')) {
    return path;
  }
  
  // Otherwise, assume it's in products folder
  return getProductImage(path);
};

/**
 * Get image alt text helper
 * @param {string} productName - Product name
 * @param {string} suffix - Optional suffix (e.g., 'front view', 'in use')
 * @returns {string} SEO-friendly alt text
 */
export const getImageAlt = (productName, suffix = '') => {
  const base = productName || 'Product';
  return suffix ? `${base} - ${suffix}` : base;
};

// Export all functions as default object
export default {
  getProductImage,
  getAboutImage,
  getPressImage,
  getLogoImage,
  getIconImage,
  getImage,
  getPlaceholderImage,
  isExternalImage,
  getOptimizedImage,
  getImageAlt
};
