import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="breadcrumb py-4 px-6 md:px-8 bg-white border-b border-gray-100">
        <div className="container max-w-content mx-auto">
          <nav className="text-body-sm text-muted-neutral">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal font-medium">Search</span>
            {query && (
              <>
                <span className="mx-2">/</span>
                <span className="text-charcoal font-medium">"{query}"</span>
              </>
            )}
          </nav>
        </div>
      </section>

      {/* Search Header */}
      <div className="bg-gradient-to-b from-warm-paper to-white border-b border-gray-100">
        <div className="container max-w-content mx-auto px-6 md:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-heading-md md:text-heading-lg font-display font-bold text-charcoal mb-2">
                Search Results
              </h1>
              {query && (
                <p className="text-body-md text-muted-neutral">
                  {isLoading ? (
                    'Searching...'
                  ) : (
                    <>
                      {totalResults} result{totalResults !== 1 ? 's' : ''} for{' '}
                      <span className="font-semibold text-charcoal">"{query}"</span>
                    </>
                  )}
                </p>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 
                       px-6 py-3 border border-gray-200 rounded-soft 
                       bg-white hover:bg-warm-paper hover:border-brand-orange
                       transition-all duration-fast
                       text-body-md font-semibold text-charcoal"
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-brand-orange text-white text-label-sm rounded-full px-2 py-0.5 ml-1">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-body-sm text-muted-neutral">Active filters:</span>
              
              {filters.category && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 
                               bg-brand-orange text-white text-body-sm rounded-soft
                               font-medium">
                  {filters.category}
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="hover:bg-brand-red rounded-full p-0.5 transition-colors duration-fast"
                    aria-label="Remove category filter"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              {filters.minRating && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 
                               bg-brand-orange text-white text-body-sm rounded-soft
                               font-medium">
                  {filters.minRating}+ stars
                  <button
                    onClick={() => handleFilterChange('minRating', '')}
                    className="hover:bg-brand-red rounded-full p-0.5 transition-colors duration-fast"
                    aria-label="Remove rating filter"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 
                               bg-brand-orange text-white text-body-sm rounded-soft
                               font-medium">
                  RS {filters.minPrice || '0'} - RS {filters.maxPrice || '∞'}
                  <button
                    onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }}
                    className="hover:bg-brand-red rounded-full p-0.5 transition-colors duration-fast"
                    aria-label="Remove price filter"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              <button
                onClick={clearFilters}
                className="text-body-sm text-muted-neutral hover:text-brand-orange 
                         underline transition-colors duration-fast ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container max-w-content mx-auto px-6 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${
              showFilters ? 'block' : 'hidden'
            } lg:col-span-1`}
          >
            <div className="bg-warm-paper border border-gray-100 rounded-soft p-6 
                          sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-custom">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-charcoal text-body-lg">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-body-sm text-brand-orange hover:underline font-semibold"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-charcoal text-body-md mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat}
                        onChange={() =>
                          handleFilterChange('category', filters.category === cat ? '' : cat)
                        }
                        className="text-brand-orange focus:ring-brand-orange w-4 h-4"
                      />
                      <span className="text-body-sm text-charcoal group-hover:text-brand-orange 
                                     transition-colors duration-fast">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-charcoal text-body-md mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-soft 
                             text-body-sm text-charcoal placeholder:text-muted-neutral
                             focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20
                             transition-colors duration-fast"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-soft 
                             text-body-sm text-charcoal placeholder:text-muted-neutral
                             focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20
                             transition-colors duration-fast"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-charcoal text-body-md mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer group">
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
                        className="text-brand-orange focus:ring-brand-orange w-4 h-4"
                      />
                      <span className="text-body-sm text-charcoal flex items-center gap-1 
                                     group-hover:text-brand-orange transition-colors duration-fast">
                        {rating}+ ⭐
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h3 className="font-semibold text-charcoal text-body-md mb-3">Sort By</h3>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-soft 
                           text-body-sm text-charcoal bg-white
                           focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20
                           transition-colors duration-fast cursor-pointer"
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
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-brand-orange mb-4" size={40} />
                <p className="text-body-md text-muted-neutral">Searching...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <X className="text-red-600" size={32} />
                </div>
                <p className="text-body-lg text-charcoal font-semibold mb-2">Something went wrong</p>
                <p className="text-body-md text-red-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center gap-2
                           bg-brand-orange text-white font-bold 
                           px-8 py-3 text-body-md
                           rounded-soft shadow-medium
                           hover:bg-brand-red hover:shadow-glow-md
                           active:scale-[0.98]
                           transition-all duration-normal"
                >
                  Try Again
                </button>
              </div>
            ) : !query ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-warm-paper flex items-center justify-center mx-auto mb-6">
                  <Search className="text-muted-neutral" size={40} />
                </div>
                <h3 className="text-heading-sm font-display font-bold text-charcoal mb-2">
                  Start Your Search
                </h3>
                <p className="text-body-md text-muted-neutral">
                  Enter a search term to find products
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-warm-paper flex items-center justify-center mx-auto mb-6">
                  <Search className="text-muted-neutral" size={40} />
                </div>
                <h3 className="text-heading-sm font-display font-bold text-charcoal mb-2">
                  No Products Found
                </h3>
                <p className="text-body-md text-muted-neutral mb-8">
                  Try adjusting your search or filters
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center justify-center gap-2
                             bg-brand-orange text-white font-bold 
                             px-8 py-3 text-body-md
                             rounded-soft shadow-medium
                             hover:bg-brand-red hover:shadow-glow-md
                             active:scale-[0.98]
                             transition-all duration-normal"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center justify-center gap-2
                               px-4 py-2 border border-gray-200 rounded-soft 
                               bg-white hover:bg-warm-paper hover:border-brand-orange
                               disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white
                               transition-all duration-fast text-body-sm font-semibold"
                    >
                      <ChevronLeft size={18} />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex gap-2">
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
                              className={`w-10 h-10 rounded-soft transition-all duration-fast
                                       text-body-sm font-semibold ${
                                currentPage === page
                                  ? 'bg-brand-orange text-white shadow-glow-sm'
                                  : 'bg-white border border-gray-200 text-charcoal hover:bg-warm-paper hover:border-brand-orange'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="w-10 h-10 flex items-center justify-center text-muted-neutral">
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
                      className="inline-flex items-center justify-center gap-2
                               px-4 py-2 border border-gray-200 rounded-soft 
                               bg-white hover:bg-warm-paper hover:border-brand-orange
                               disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white
                               transition-all duration-fast text-body-sm font-semibold"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={18} />
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
