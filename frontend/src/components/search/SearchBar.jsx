import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { get } from '../../services/api';

const SearchBar = ({ onClose, autoFocus = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Auto-focus input when component mounts
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await get('/products/search/suggestions?q=' + encodeURIComponent(searchTerm) + '&limit=5');
        
        if (response.success) {
          setSuggestions(response.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
      setSearchTerm('');
      if (onClose) onClose();
    }
  };

  const handleSuggestionClick = (slug) => {
    navigate(`/product/${slug}`);
    setShowSuggestions(false);
    setSearchTerm('');
    if (onClose) onClose();
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Search 
            className="absolute left-4 text-gray-400 pointer-events-none" 
            size={20} 
          />
          
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Search for products, categories..."
            className="w-full pl-12 pr-24 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-red focus:outline-none transition-colors"
            aria-label="Search products"
            autoComplete="off"
          />

          <div className="absolute right-2 flex items-center gap-2">
            {isLoading && (
              <Loader2 className="text-gray-400 animate-spin" size={20} />
            )}
            
            {searchTerm && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="text-gray-400" size={18} />
              </button>
            )}

            <button
              type="submit"
              className="px-4 py-1.5 bg-primary-red text-white rounded-md hover:bg-red-700 transition-colors font-medium"
              disabled={!searchTerm.trim()}
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Suggestions
            </div>
            
            {suggestions.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSuggestionClick(product.slug)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.category}
                  </div>
                </div>

                <Search className="text-gray-400 flex-shrink-0" size={16} />
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
            <button
              onClick={handleSearch}
              className="text-sm text-primary-red hover:text-red-700 font-medium flex items-center gap-2"
            >
              <Search size={14} />
              View all results for "{searchTerm}"
            </button>
          </div>
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && searchTerm.trim().length >= 2 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-6 text-center">
          <Search className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-gray-600">No products found for "{searchTerm}"</p>
          <p className="text-sm text-gray-500 mt-1">Try different keywords</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
