import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';
import { CartContext } from './CartContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get cart context to refresh cart after login
  const cartContext = useContext(CartContext);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (authService.isAuthenticated()) {
          const response = await authService.getProfile();
          setUser(response.user);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        // Clear invalid token
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Register new user
   */
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.register(userData);
      setUser(response.user);
      
      // Refresh cart to associate guest cart with user
      if (cartContext?.refreshCart) {
        await cartContext.refreshCart();
      }
      
      return { success: true, user: response.user };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.login(credentials);
      setUser(response.user);
      
      // Refresh cart to merge guest cart with user cart
      if (cartContext?.refreshCart) {
        await cartContext.refreshCart();
      }
      
      return { success: true, user: response.user };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      // Still clear user even if request fails
      setUser(null);
      throw error;
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await authService.updateProfile(userData);
      setUser(response.user);
      
      return { success: true, user: response.user };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  /**
   * Update password
   */
  const updatePassword = async (passwordData) => {
    try {
      setError(null);
      const response = await authService.updatePassword(passwordData);
      
      return { success: true, message: response.message };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  /**
   * Request password reset
   */
  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await authService.forgotPassword(email);
      
      return { success: true, message: response.message };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (token, password) => {
    try {
      setError(null);
      const response = await authService.resetPassword(token, password);
      setUser(response.user);
      
      return { success: true, user: response.user };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
