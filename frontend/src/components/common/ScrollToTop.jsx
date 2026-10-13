import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * ScrollToTop Component with  Scroll Restoration
 * 
 * E-commerce optimized scroll behavior:
 * - Forward navigation: Scroll to top (clean slate for new page)
 * - Back button: Restore exact previous position (user can continue browsing)
 * 
 * Strategy:
 *  ProductCard saves scroll position on click (the accurate position)
 * ScrollToTop doesn't overwrite during navigation (preserves click position)
 * Back button restores the preserved position
 */

// Store scroll positions in memory - persists across component re-renders
const scrollPositions = new Map();

// Track if we just navigated (to prevent overwriting saved position)
let justNavigated = false;

const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathRef = useRef('');
  const scrollRestoredRef = useRef(false);

  useEffect(() => {
    const currentPath = location.pathname + location.search;

    // Mark that we just navigated (prevents scroll handler from overwriting)
    justNavigated = true;
    setTimeout(() => { justNavigated = false; }, 1000);

    // DON'T save position here - it's already saved by ProductCard on click
    // or by the scroll handler during normal browsing
    
    // Reset scroll restoration flag
    scrollRestoredRef.current = false;

    // Handle scroll based on navigation type
    if (navigationType === 'POP') {
      // Back/forward button - restore position
      const savedPosition = parseInt(sessionStorage.getItem(`scroll_${currentPath}`) || '0', 10);
      
      // Wait for content to load before restoring scroll
      const restore = () => {
        if (scrollRestoredRef.current) return;
        
        // Wait until DOM is ready and content has height
        const checkAndRestore = () => {
          const bodyHeight = document.body.scrollHeight;
          const viewportHeight = window.innerHeight;
          
          // Check if content is loaded (body is tall enough for scroll position)
          if (bodyHeight > savedPosition + viewportHeight || savedPosition === 0) {
            window.scrollTo(0, savedPosition);
            scrollRestoredRef.current = true;
          } else {
            // Content still loading, try again
            setTimeout(checkAndRestore, 100);
          }
        };
        
        // Start checking after a small delay to let React render
        setTimeout(checkAndRestore, 100);
      };
      
      restore();
    } else {
      // Normal navigation (PUSH/REPLACE) - scroll to top immediately
      window.scrollTo(0, 0);
      scrollRestoredRef.current = true;
    }

    prevPathRef.current = currentPath;
  }, [location, navigationType]);

  // Save scroll position continuously as user scrolls (but not immediately after navigation)
  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      // Don't overwrite position if we just navigated (ProductCard already saved it)
      if (justNavigated) return;
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentPath = location.pathname + location.search;
        const currentScroll = window.scrollY;
        scrollPositions.set(currentPath, currentScroll);
        sessionStorage.setItem(`scroll_${currentPath}`, currentScroll.toString());
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  return null;
};

export default ScrollToTop;
