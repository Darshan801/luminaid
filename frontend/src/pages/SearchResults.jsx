import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { get } from '../services/api';
import ProductCard from '../components/products/ProductCard';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Search and filter states
  const query = searchParams.get('q') || '';
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || '-createdAt'
  });

  // Available categories
  const categories = [
    'Power Lanterns',
    'String Lights',
    'Accessories',
    'Bundles',
    'Gifts',
    'Donation'
  ];

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Build query string
        const queryParams = new URLSearchParams({
          q: query,
          page: currentPage,
          limit: 12,
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
          )
        });

        const response = await get('/products/search?' + queryParams.toString());

        if (response.success) {
          setProducts(response.data);
          setTotalPages(response.pages);
          setTotalResults(response.total);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load search results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage, filters]);

  // Update URL when filters change
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    const params = { q: query };
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    
    setSearchParams(params);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    updateFilters({ ...filters, [key]: value });
  };

  // Clear all filters
  const clearFilters = () => {
    updateFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sort: '-createdAt'
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(
    (value, index) => value !== '' && (index !== 4 || value !== '-createdAt')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-[1280px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results
              </h1>
              {query && (
                <p className="text-gray-600 mt-1">
                  {isLoading ? (
                    'Searching...'
                  ) : (
                    <>
                      {totalResults} result{totalResults !== 1 ? 's' : ''} for "
                      <span className="font-semibold">{query}</span>"
                    </>
                  )}
                </p>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="bg-primary-red text-white text-xs rounded-full px-2 py-0.5">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-red text-white text-sm rounded-full">
                  {filters.category}
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="hover:bg-red-700 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              {filters.minRating && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-red text-white text-sm rounded-full">
                  {filters.minRating}+ stars
                  <button
                    onClick={() => handleFilterChange('minRating', '')}
                    className="hover:bg-red-700 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-red text-white text-sm rounded-full">
                  ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                  <button
                    onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }}
                    className="hover:bg-red-700 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-primary-red underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${
              showFilters ? 'block' : 'hidden'
            } lg:col-span-1`}
          >
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-red hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat}
                        onChange={() =>
                          handleFilterChange('category', filters.category === cat ? '' : cat)
                        }
                        className="text-primary-red focus:ring-primary-red"
                      />
                      <span className="text-sm text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-red"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-red"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.minRating === rating.toString()}
                        onChange={() =>
                          handleFilterChange(
                            'minRating',
                            filters.minRating === rating.toString() ? '' : rating.toString()
                          )
                        }
                        className="text-primary-red focus:ring-primary-red"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        {rating}+ ⭐
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-red"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Highest Rated</option>
                  <option value="-purchaseCount">Most Popular</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-red" size={40} />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-primary-red hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : !query ? (
              <div className="text-center py-20">
                <Search className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 text-lg">Enter a search term to find products</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Search className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters
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
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-primary-red text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 py-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
