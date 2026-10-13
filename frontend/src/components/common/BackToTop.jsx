import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToTop, hasScrolledDown } from '../../utils/scrollHelpers';

/**
 * BackToTop Component
 * 
 * Floating button that appears when user scrolls down
 * Essential for e-commerce sites with long product listings
 */

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(hasScrolledDown(300));
    };

    // Check on mount
    toggleVisibility();

    // Add scroll listener
    window.addEventListener('scroll', toggleVisibility);

    // Cleanup
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      onClick={() => scrollToTop()}
      className={`fixed bottom-6 right-6 z-40
                 w-12 h-12 rounded-full
                 bg-brand-orange text-white
                 flex items-center justify-center
                 shadow-glow-md hover:shadow-glow-lg
                 hover:bg-brand-orange-dark
                 active:scale-95
                 transition-all duration-fast
                 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2
                 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      aria-label="Back to top"
    >
      <ArrowUp size={24} strokeWidth={2.5} />
    </button>
  );
};

export default BackToTop;
