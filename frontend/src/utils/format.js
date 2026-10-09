/**
 * Format a number as currency (RS)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `RS ${amount.toFixed(2)}`;
};

/**
 * Format a date to readable string
 * @param {Date|string} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
};

/**
 * Format a date with time
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Format a number with commas
 * @param {number} number - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};
