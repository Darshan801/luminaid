import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, SlidersHorizontal, TrendingUp, Package } from 'lucide-react';
import { get } from '../../services/api';

const SearchSidebar = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sort: '-createdAt'
  });

  const categories = [
    'Power Lanterns',
    'String Lights',
    'Accessories',
    'Bundles',
    'Gifts',
    'Donation'
  ];

  // Popular searches (you can make this dynamic from backend)
  const popularSearches = [
    'Solar Lantern',
    'String Lights',
    'Power Bank',
    'Waterproof',
    'USB Rechargeable'
  ];

  // Auto-focus input when sidebar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 150);
    }
  }, [isOpen]);

  // Handle opening animation
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready, then trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Prevent body scroll when sidebar is open and prevent page shift
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Prevent body scroll and compensate for scrollbar
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      setIsClosing(false);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.trim().length < 2) {
        setProducts([]);
        setTotalResults(0);
        return;
      }

      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          q: searchTerm,
          page: 1,
          limit: 8, // Show only 8 results in sidebar
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
          )
        });

        const response = await get('/products/search?' + queryParams.toString());

        if (response.success) {
          setProducts(response.data);
          setTotalResults(response.total);
        }
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 400);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filters]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500); // Match animation duration (changed from 300ms to 500ms)
  };

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
    handleClose();
  };

  const handleViewAllResults = () => {
    if (searchTerm.trim()) {
      const queryParams = new URLSearchParams({
        q: searchTerm,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });
      navigate(`/search?${queryParams.toString()}`);
      handleClose();
    }
  };

  const handlePopularSearchClick = (term) => {
    setSearchTerm(term);
  };

  const handleClear = () => {
    setSearchTerm('');
    setProducts([]);
    setTotalResults(0);
    inputRef.current?.focus();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sort: '-createdAt'
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value, index) => value !== '' && (index !== 4 || value !== '-createdAt')
  );

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-500 ease-in-out ${
          isAnimating && !isClosing ? 'opacity-50 backdrop-blur-sm' : 'opacity-0'
        }`}
        onClick={handleClose}
        style={{ 
          pointerEvents: isAnimating && !isClosing ? 'auto' : 'none'
        }}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-in-out ${
          isAnimating && !isClosing ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 transition-all duration-500 delay-100 ${
          isAnimating && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Search className="text-primary-red" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Search Products</h2>
              <p className="text-xs text-gray-500">Find your perfect LuminAID</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className={`p-6 border-b border-gray-200 transition-all duration-500 delay-150 ${
          isAnimating && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary-red" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-12 pr-20 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none focus:ring-2 focus:ring-red-100 transition-all duration-200"
              autoComplete="off"
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchTerm && (
                <button
                  onClick={handleClear}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                  aria-label="Clear search"
                >
                  <X className="text-gray-400" size={16} />
                </button>
              )}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  showFilters || hasActiveFilters
                    ? 'bg-primary-red text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                }`}
                aria-label="Toggle filters"
              >
                <SlidersHorizontal size={16} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filter Badge */}
          {hasActiveFilters && (
            <div className="mt-3 flex items-center justify-between animate-slideDown">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-red rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">Filters active</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-red hover:underline font-medium transition-all duration-200 hover:scale-105"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel (Collapsible) */}
        <div className={`border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white overflow-hidden transition-all duration-500 ease-in-out ${
          showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="p-6 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
              {/* Category Filter */}
              <div className="animate-slideDown">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="animate-slideDown" style={{ animationDelay: '50ms' }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-1/2 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-red-100 transition-all duration-200"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-1/2 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-red-100 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="animate-slideDown" style={{ animationDelay: '100ms' }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-white"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Highest Rated</option>
                  <option value="-purchaseCount">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary-red" size={32} />
            </div>
          )}

          {/* No Search Term - Show Popular Searches */}
          {!searchTerm && !isLoading && (
            <div className={`p-6 transition-all duration-500 delay-200 ${
              isAnimating && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <TrendingUp className="text-yellow-600" size={18} />
                </div>
                <h3 className="font-semibold text-gray-900">Popular Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={term}
                    onClick={() => handlePopularSearchClick(term)}
                    className="px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-primary-red hover:to-red-600 hover:text-white text-gray-700 rounded-full text-sm transition-all duration-300 hover:scale-105 hover:shadow-md font-medium animate-slideDown"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && searchTerm && products.length > 0 && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4 animate-slideDown">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Package className="text-green-600" size={18} />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {totalResults} {totalResults === 1 ? 'Result' : 'Results'}
                  </h3>
                </div>
                {totalResults > 8 && (
                  <button
                    onClick={handleViewAllResults}
                    className="text-sm text-primary-red hover:underline"
                  >
                    View all →
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {products.map((product, index) => (
                  <button
                    key={product._id}
                    onClick={() => handleProductClick(product.slug)}
                    className="w-full flex items-start gap-4 p-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent rounded-xl transition-all duration-300 text-left group hover:shadow-md hover:scale-[1.02] animate-slideDown"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="text-gray-400" size={28} />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 group-hover:text-primary-red transition-colors line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {product.category}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-bold text-primary-red">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                        {product.rating > 0 && (
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            ⭐ {product.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* View All Button */}
              {totalResults > products.length && (
                <button
                  onClick={handleViewAllResults}
                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-primary-red to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-[1.02] animate-slideDown"
                >
                  View All {totalResults} Results →
                </button>
              )}
            </div>
          )}

          {/* No Results */}
          {!isLoading && searchTerm && searchTerm.length >= 2 && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <Search className="text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Try different keywords or{' '}
                {hasActiveFilters && 'remove some filters'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-primary-red text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Search Term Too Short */}
          {!isLoading && searchTerm && searchTerm.length < 2 && (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <Search className="text-gray-300 mb-4" size={48} />
              <p className="text-gray-600 text-center">
                Type at least 2 characters to search
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchSidebar;
