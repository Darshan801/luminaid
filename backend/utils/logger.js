/**
 * Logger utility for production-safe logging
 * 
 * Usage:
 * - logger.info() - Development only logs
 * - logger.error() - Always logged (errors should be tracked)
 * - logger.warn() - Always logged (warnings are important)
 * - logger.debug() - Development only, verbose logs
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = {
  /**
   * Info level logs - only in development
   * Use for general information, debugging, flow tracking
   */
  info: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Error level logs - always logged
   * Use for errors that need tracking
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Warning level logs - always logged
   * Use for potential issues, deprecated features
   */
  warn: (...args) => {
    console.warn(...args);
  },

  /**
   * Debug level logs - only in development
   * Use for verbose debugging, data inspection
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Success level logs - only in development
   * Use for successful operations
   */
  success: (...args) => {
    if (isDevelopment) {
      console.log('[SUCCESS]', ...args);
    }
  }
};

module.exports = logger;
