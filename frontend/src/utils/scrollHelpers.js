/**
 * Scroll Helper Utilities
 * 
 * Provides smooth scroll functions for various use cases
 * Includes scroll position management for better UX
 */

/**
 * Scrolls to the top of the page smoothly
 * @param {string} behavior - 'smooth' or 'instant' (default: 'smooth')
 */
export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: behavior
  });
};

/**
 * Scrolls to a specific element by ID
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} offset - Optional offset from the top (default: 80 for fixed header)
 */
export const scrollToElement = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Checks if user has scrolled down more than specified pixels
 * @param {number} threshold - Scroll threshold in pixels (default: 300)
 * @returns {boolean}
 */
export const hasScrolledDown = (threshold = 300) => {
  return window.pageYOffset > threshold;
};

/**
 * Gets current scroll position
 * @returns {number} Current Y scroll position
 */
export const getCurrentScrollPosition = () => {
  return window.pageYOffset || document.documentElement.scrollTop;
};

/**
 * Saves scroll position for a specific key (like route path)
 * @param {string} key - Identifier for the scroll position (usually pathname)
 * @param {number} position - Scroll position to save (default: current position)
 */
export const saveScrollPosition = (key, position = null) => {
  const scrollPos = position !== null ? position : getCurrentScrollPosition();
  sessionStorage.setItem(`scroll_${key}`, scrollPos.toString());
};

/**
 * Retrieves saved scroll position for a specific key
 * @param {string} key - Identifier for the scroll position (usually pathname)
 * @returns {number|null} Saved scroll position or null if not found
 */
export const getSavedScrollPosition = (key) => {
  const saved = sessionStorage.getItem(`scroll_${key}`);
  return saved ? parseInt(saved, 10) : null;
};

/**
 * Restores scroll position for a specific key
 * @param {string} key - Identifier for the scroll position (usually pathname)
 * @param {string} behavior - 'smooth' or 'instant' (default: 'instant')
 * @returns {boolean} True if position was restored, false if not found
 */
export const restoreScrollPosition = (key, behavior = 'instant') => {
  const position = getSavedScrollPosition(key);
  if (position !== null) {
    window.scrollTo({
      top: position,
      left: 0,
      behavior: behavior
    });
    return true;
  }
  return false;
};

/**
 * Scrolls to top and then navigates (for programmatic navigation with scroll reset)
 * @param {function} navigateFunction - React Router's navigate function
 * @param {string} path - The path to navigate to
 */
export const scrollAndNavigate = (navigateFunction, path) => {
  scrollToTop('instant');
  navigateFunction(path);
};
