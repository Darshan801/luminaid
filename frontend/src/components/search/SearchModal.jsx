import { useEffect } from 'react';
import { X } from 'lucide-react';
import SearchBar from './SearchBar';

const SearchModal = ({ isOpen, onClose }) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl p-6 animate-slideDown">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close search"
        >
          <X size={20} />
        </button>

        <div className="mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Search Products</h2>
          <p className="text-sm text-gray-500 mt-1">
            Find your perfect LuminAID product
          </p>
        </div>

        <SearchBar onClose={onClose} autoFocus />
      </div>
    </div>
  );
};

export default SearchModal;
