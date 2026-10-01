/**
 * Authentication Service
 * Handles all auth-related API calls
 */

import { get, post, put } from './api';

const AUTH_ENDPOINT = '/auth';

/**
 * Register a new user
 */
export const register = async (userData) => {
  try {
    const response = await post(`${AUTH_ENDPOINT}/register`, userData);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 */
export const login = async (credentials) => {
  try {
    const response = await post(`${AUTH_ENDPOINT}/login`, credentials);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    
    await post(`${AUTH_ENDPOINT}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    return { success: true };
  } catch (error) {
    // Clear token even if request fails
    localStorage.removeItem('token');
    throw error;
  }
};

/**
 * Get current user profile
 */
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await get(`${AUTH_ENDPOINT}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile details
 */
export const updateProfile = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await put(`${AUTH_ENDPOINT}/updatedetails`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user password
 */
export const updatePassword = async (passwordData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await put(`${AUTH_ENDPOINT}/updatepassword`, passwordData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Update token if new one is provided
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (email) => {
  try {
    const response = await post(`${AUTH_ENDPOINT}/forgotpassword`, { email });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await put(`${AUTH_ENDPOINT}/resetpassword/${token}`, { password });
    
    // Store new token
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get stored token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  isAuthenticated,
  getToken,
};
