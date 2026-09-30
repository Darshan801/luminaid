/**
 * Product API Service
 * 
 * Handles all product-related API calls to the backend
 */

import { get } from './api';

/**
 * Get all products with filters
 * @param {object} params - Query parameters
 * @returns {Promise} Products data
 */
export const getAllProducts = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    const response = await get(endpoint);
    return response;
  } catch (error) {
    console.error('Get All Products Error:', error);
    throw error;
  }
};

/**
 * Get single product by ID or slug
 * @param {string} identifier - Product ID or slug
 * @returns {Promise} Product data
 */
export const getProduct = async (identifier) => {
  try {
    const response = await get(`/products/${identifier}`);
    return response.data;
  } catch (error) {
    console.error('Get Product Error:', error);
    throw error;
  }
};

/**
 * Get featured products
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} Featured products
 */
export const getFeaturedProducts = async (limit = 4) => {
  try {
    const response = await get(`/products?featured=true&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Get Featured Products Error:', error);
    throw error;
  }
};

/**
 * Get bestseller products
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} Bestseller products
 */
export const getBestsellerProducts = async (limit = 4) => {
  try {
    const response = await get(`/products?bestseller=true&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Get Bestseller Products Error:', error);
    throw error;
  }
};

/**
 * Search products
 * @param {string} query - Search query
 * @param {object} filters - Additional filters
 * @returns {Promise} Search results
 */
export const searchProducts = async (query, filters = {}) => {
  try {
    const params = { search: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    const response = await get(`/products?${queryString}`);
    return response;
  } catch (error) {
    console.error('Search Products Error:', error);
    throw error;
  }
};

/**
 * Get products by category
 * @param {string} category - Category name
 * @param {object} params - Query parameters
 * @returns {Promise} Products in category
 */
export const getProductsByCategory = async (category, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString 
      ? `/products?category=${category}&${queryString}` 
      : `/products?category=${category}`;
    const response = await get(endpoint);
    return response;
  } catch (error) {
    console.error('Get Products By Category Error:', error);
    throw error;
  }
};

/**
 * Get all categories
 * @returns {Promise} Categories list
 */
export const getCategories = async () => {
  try {
    const response = await get('/products/categories/list');
    return response.data;
  } catch (error) {
    console.error('Get Categories Error:', error);
    throw error;
  }
};

/**
 * Check product stock
 * @param {string} productId - Product ID
 * @param {number} quantity - Desired quantity
 * @returns {Promise} Stock availability
 */
export const checkStock = async (productId, quantity = 1) => {
  try {
    const response = await get(`/products/${productId}/stock?quantity=${quantity}`);
    return response.data;
  } catch (error) {
    console.error('Check Stock Error:', error);
    throw error;
  }
};

export default {
  getAllProducts,
  getProduct,
  getFeaturedProducts,
  getBestsellerProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
  checkStock,
};
