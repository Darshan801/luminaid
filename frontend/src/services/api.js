/**
 * Base API configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - API response
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Removed verbose logging 
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Check if body is FormData
  const isFormData = options.body instanceof FormData;
  
  const config = {
    ...options,
    headers: {
      // Don't set Content-Type for FormData - browser will set it with boundary
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }), // Add token if exists
      ...options.headers,
    },
    credentials: 'include', // Important for cookies (guest cart)
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Removed verbose logging 

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    // Only log actual errors in development
    if (process.env.NODE_ENV === 'development' && error.message !== 'Cart is empty') {
      console.error('[API] Error:', error);
    }
    throw error;
  }
};

/**
 * GET request
 */
export const get = (endpoint, options = {}) => {
  return apiRequest(endpoint, {
    method: 'GET',
    ...options,
  });
};

/**
 * POST request
 */
export const post = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    // Only stringify if body is not FormData
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...options,
  });
};

/**
 * PUT request
 */
export const put = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...options,
  });
};

/**
 * DELETE request
 */
export const del = (endpoint, options = {}) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
    ...options,
  });
};

export default {
  get,
  post,
  put,
  delete: del,
  apiRequest,
};