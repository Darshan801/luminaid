import { useState, useEffect, useCallback, useMemo } from 'react'
import { getAllProducts } from '../../services/productService'
import ProductCard from '../../components/products/ProductCard'
import Pagination from '../../components/common/Pagination'

const ITEMS_PER_PAGE = 12
const PRICE_DEBOUNCE_MS = 600

// Custom debounce hook
const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const MAX_PRICE = 10000

const ProductsPage = () => {
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    bestFor: [],
    features: [],
    lightColor: [],
    minPrice: '',
    maxPrice: ''
  })
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  })
  
  // Price range slider state (immediate update for UI)
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE])
  
  // Debounced price range for API calls
  const debouncedPriceRange = useDebouncedValue(priceRange, PRICE_DEBOUNCE_MS)
  
  // Update filters when debounced price range changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      minPrice: debouncedPriceRange[0] > 0 ? debouncedPriceRange[0].toString() : '',
      maxPrice: debouncedPriceRange[1] < MAX_PRICE ? debouncedPriceRange[1].toString() : ''
    }))
    // Reset to first page when price changes
    setPagination(prev => prev.page === 1 ? prev : { ...prev, page: 1 })
  }, [debouncedPriceRange])

  // Fetch products with filters and pagination - memoized to prevent unnecessary recreations
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query params
      const params = {
        page: pagination.page,
        limit: ITEMS_PER_PAGE,
        status: 'active,out-of-stock' // Show both active and out-of-stock products
      }

      // Add sorting
      const sortMap = {
        'low-high': 'price',
        'high-low': '-price',
        'a-z': 'name',
        'z-a': '-name',
        'best-selling': '-reviewCount',
        'new-old': '-createdAt',
        'old-new': 'createdAt',
        'featured': '-featured,-createdAt'
      }
      params.sort = sortMap[sortBy] || '-featured,-createdAt'

      // Add tag filters efficiently
      const allTags = [
        ...filters.bestFor,
        ...filters.features,
        ...filters.lightColor
      ]
      if (allTags.length > 0) {
        params.tags = allTags.join(',')
      }

      // Add price filters
      if (filters.minPrice) {
        params.minPrice = filters.minPrice
      }

      if (filters.maxPrice) {
        params.maxPrice = filters.maxPrice
      }

      const response = await getAllProducts(params)
      
      setProducts(response.data || [])
      setPagination({
        page: response.page || 1,
        totalPages: response.pages || 1,
        total: response.total || 0
      })
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products. Please try again.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [pagination.page, sortBy, filters])

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pagination.page])

  // Reset to page 1 when filters or sort change
  const resetToFirstPage = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Toggle filter checkbox
  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category]
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
      
      return { ...prev, [category]: updated }
    })
    resetToFirstPage()
  }

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      bestFor: [],
      features: [],
      lightColor: [],
      minPrice: '',
      maxPrice: ''
    })
    setPriceRange([0, MAX_PRICE])
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  // Handle price range change - only updates UI state, debounce handles API calls
  const handlePriceChange = useCallback((index, value) => {
    setPriceRange(prevRange => {
      const newRange = [...prevRange]
      newRange[index] = Math.max(0, Math.min(Number(value), MAX_PRICE))
      
      // Ensure min doesn't exceed max
      if (index === 0 && newRange[0] > newRange[1]) {
        newRange[0] = newRange[1]
      }
      // Ensure max doesn't go below min
      if (index === 1 && newRange[1] < newRange[0]) {
        newRange[1] = newRange[0]
      }
      
      return newRange
    })
  }, [])

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    resetToFirstPage()
  }

  // Get active filter count - memoized
  const activeFilterCount = useMemo(() => {
    return filters.bestFor.length + 
           filters.features.length + 
           filters.lightColor.length +
           (filters.minPrice ? 1 : 0) +
           (filters.maxPrice ? 1 : 0)
  }, [filters])

  // Memoize filter options
  const filterOptions = useMemo(() => ({
    bestFor: [
      'Gifting',
      'Camping',
      'Emergency Preparedness',
      'Travel',
      'Home/Garden',
      'Kids',
    ],
    features: [
      'Charges Phones',
      'Twist-to-Inflate',
      'Magnets',
    ],
    lightColors: [
      'White',
      'Warm White',
      'Red (Night Vision)',
      'Multi-Color',
    ]
  }), [])

  return (
    <div className="w-full bg-gray-50">

      {/* Collection Header */}
      <section className="w-full py-12 md:py-16 bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Solar Lanterns
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of solar-powered lighting solutions
          </p>
        </div>
      </section>


      {/* Collection Content */}
      <section className="w-full py-12">

        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">


            {/* Filters Sidebar */}
            <aside className="hidden lg:block">

              <div className="sticky top-24 bg-white rounded-soft border border-gray-200 p-6 
                            max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-custom">

                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold uppercase text-gray-900 tracking-wide">
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs font-bold text-brand-orange hover:text-brand-orange-dark
                               transition-colors duration-fast"
                    >
                      Clear ({activeFilterCount})
                    </button>
                  )}
                </div>


                {/* Best For */}
                <div className="pb-6 mb-6">

                  <h3 className="text-sm font-bold text-gray-900 mb-4">
                    Best For
                  </h3>

                  <div className="space-y-3">

                    {filterOptions.bestFor.map((item) => (
                      <label
                        key={item}
                        className="flex items-center justify-between text-sm text-gray-700 cursor-pointer 
                                 hover:text-brand-orange transition-colors duration-fast group"
                      >

                        <div className="flex items-center gap-3">

                          <input
                            type="checkbox"
                            checked={filters.bestFor.includes(item)}
                            onChange={() => toggleFilter('bestFor', item)}
                            className="w-4 h-4 rounded border-gray-300 bg-white accent-brand-orange
                                     focus:ring-brand-orange focus:ring-1 cursor-pointer"
                          />

                          <span className="group-hover:text-brand-orange transition-colors duration-fast">
                            {item}
                          </span>

                        </div>

                        {/* Filter counts removed for server-side pagination */}

                      </label>
                    ))}

                  </div>

                </div>


                {/* Features */}
                <div className="pb-6 mb-6">

                  <h3 className="text-sm font-bold text-gray-900 mb-4">
                    Features
                  </h3>

                  <div className="space-y-3">

                    {filterOptions.features.map((item) => (
                      <label
                        key={item}
                        className="flex items-center justify-between text-sm text-gray-700 cursor-pointer 
                                 hover:text-brand-orange transition-colors duration-fast group"
                      >

                        <div className="flex items-center gap-3">

                          <input
                            type="checkbox"
                            checked={filters.features.includes(item)}
                            onChange={() => toggleFilter('features', item)}
                            className="w-4 h-4 rounded border-gray-300 bg-white accent-brand-orange
                                     focus:ring-brand-orange focus:ring-1 cursor-pointer"
                          />

                          <span className="group-hover:text-brand-orange transition-colors duration-fast">
                            {item}
                          </span>

                        </div>

                        {/* Filter counts removed for server-side pagination */}

                      </label>
                    ))}

                  </div>

                </div>


                {/* Light Color */}
                <div className="pb-6 mb-6">

                  <h3 className="text-sm font-bold text-gray-900 mb-4">
                    Light Color
                  </h3>

                  <div className="space-y-3">

                    {filterOptions.lightColors.map((item) => (
                      <label
                        key={item}
                        className="flex items-center justify-between text-sm text-gray-700 cursor-pointer 
                                 hover:text-brand-orange transition-colors duration-fast group"
                      >

                        <div className="flex items-center gap-3">

                          <input
                            type="checkbox"
                            checked={filters.lightColor.includes(item)}
                            onChange={() => toggleFilter('lightColor', item)}
                            className="w-4 h-4 rounded border-gray-300 bg-white accent-brand-orange
                                     focus:ring-brand-orange focus:ring-1 cursor-pointer"
                          />

                          <span className="group-hover:text-brand-orange transition-colors duration-fast">
                            {item}
                          </span>

                        </div>

                        {/* Filter counts removed for server-side pagination */}

                      </label>
                    ))}

                  </div>

                </div>


                {/* Price */}
                <div>

                  <h3 className="text-sm font-bold text-gray-900 mb-4">
                    Price Range
                  </h3>

                  <div className="space-y-6">
                    {/* Glowing Price Slider */}
                    <div className="relative px-1">
                      {/* Track */}
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        {/* Active glowing track */}
                        <div
                          className="absolute h-full rounded-full transition-all duration-300"
                          style={{
                            left: `${(priceRange[0] / MAX_PRICE) * 100}%`,
                            right: `${100 - (priceRange[1] / MAX_PRICE) * 100}%`,
                            background: `linear-gradient(to right, 
                              rgba(249, 115, 22, ${0.3 + (priceRange[0] / MAX_PRICE) * 0.4}), 
                              rgba(249, 115, 22, ${0.4 + (priceRange[1] / MAX_PRICE) * 0.6}))`,
                            boxShadow: `0 0 ${8 + (priceRange[1] / MAX_PRICE) * 20}px rgba(249, 115, 22, ${0.3 + (priceRange[1] / MAX_PRICE) * 0.5}),
                                       inset 0 1px 2px rgba(255, 255, 255, 0.5)`
                          }}
                        />
                      </div>

                      {/* Min Thumb */}
                      <input
                        type="range"
                        min="0"
                        max={MAX_PRICE}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(0, e.target.value)}
                        className="price-slider-thumb"
                        style={{
                          '--glow-intensity': `${0.3 + (priceRange[0] / MAX_PRICE) * 0.5}`,
                          '--glow-size': `${8 + (priceRange[0] / MAX_PRICE) * 12}px`
                        }}
                      />

                      {/* Max Thumb */}
                      <input
                        type="range"
                        min="0"
                        max={MAX_PRICE}
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(1, e.target.value)}
                        className="price-slider-thumb"
                        style={{
                          '--glow-intensity': `${0.4 + (priceRange[1] / MAX_PRICE) * 0.6}`,
                          '--glow-size': `${10 + (priceRange[1] / MAX_PRICE) * 15}px`
                        }}
                      />
                    </div>

                    {/* Price Display */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Min Price
                          </label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium pointer-events-none z-10">
                              ₨
                            </span>
                            <input
                              type="number"
                              min="0"
                              max={priceRange[1]}
                              value={priceRange[0]}
                              onChange={(e) => handlePriceChange(0, e.target.value)}
                              placeholder="0"
                              className="w-full bg-white rounded-lg pl-7 pr-3 py-3 text-sm font-medium 
                                       text-gray-900 border border-gray-300
                                       focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30
                                       transition-all duration-fast placeholder:text-gray-400
                                       [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                        </div>

                        <span className="text-xs text-gray-500 font-medium pb-3">to</span>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Max Price
                          </label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium pointer-events-none z-10">
                              ₨
                            </span>
                            <input
                              type="number"
                              min={priceRange[0]}
                              max={MAX_PRICE}
                              value={priceRange[1]}
                              onChange={(e) => handlePriceChange(1, e.target.value)}
                              placeholder={MAX_PRICE.toString()}
                              className="w-full bg-white rounded-lg pl-7 pr-3 py-3 text-sm font-medium 
                                       text-gray-900 border border-gray-300
                                       focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30
                                       transition-all duration-fast placeholder:text-gray-400
                                       [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                      <button
                        onClick={clearFilters}
                        className="w-full text-xs font-bold text-gray-600 hover:text-brand-orange
                                 transition-colors duration-fast py-1"
                      >
                        Reset Price Range
                      </button>
                    )}
                  </div>

                </div>

              </div>

            </aside>


            {/* Products Area */}
            <div>

              {/* Collection Controls */}
              <div className="flex items-center justify-between bg-white rounded-soft border border-gray-200 px-6 py-4 mb-8">

                <p className="text-sm font-medium text-gray-700">
                  <span className="font-bold text-gray-900">{pagination.total}</span> products
                  {products.length > 0 && (
                    <span className="ml-2 text-gray-500">
                      (Showing {products.length} on this page)
                    </span>
                  )}
                </p>


                <div className="flex items-center gap-3">

                  <label
                    htmlFor="sort"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sort by
                  </label>

                  <select
                    id="sort"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-gray-50 rounded-soft px-3 py-2 text-sm font-medium 
                             focus:outline-none focus:bg-white
                             transition-colors duration-fast cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="relevant">Most relevant</option>
                    <option value="best-selling">Best selling</option>
                    <option value="a-z">Alphabetically, A-Z</option>
                    <option value="z-a">Alphabetically, Z-A</option>
                    <option value="low-high">Price, low to high</option>
                    <option value="high-low">Price, high to low</option>
                    <option value="old-new">Date, old to new</option>
                    <option value="new-old">Date, new to old</option>
                  </select>

                </div>

              </div>


              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

                {loading ? (
                  <div className="col-span-full text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center py-20 bg-white rounded-soft border border-gray-200 p-8">
                    <p className="text-red-600 font-medium mb-6">{error}</p>
                    <button 
                      onClick={fetchProducts}
                      className="bg-brand-orange text-white px-8 py-3 rounded-soft font-bold
                               hover:bg-brand-orange-dark active:scale-95
                               transition-all duration-fast"
                    >
                      Retry
                    </button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="col-span-full text-center py-20 bg-white rounded-soft border border-gray-200 p-8">
                    <p className="text-gray-600 text-lg font-medium">No products found</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                )}

              </div>

              {/* Pagination */}
              {!loading && !error && products.length > 0 && (
                <div className="bg-white rounded-soft border border-gray-200 px-6 py-4">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* Get More Gift Ideas */}
      <section className="w-full py-16 md:py-20 bg-white">

        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-10">
            Get More Gift Ideas
          </h2>

          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-soft h-64 
                        flex items-center justify-center shadow-medium">

            <p className="text-sm text-gray-400 font-medium">
              Promotional content / images
            </p>

          </div>

        </div>

      </section>


      {/* Save With Multipacks */}
      <section className="w-full bg-gradient-to-br from-orange-50 to-red-50 py-16 md:py-20">

        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">

            <div className="bg-white aspect-video rounded-soft flex items-center justify-center shadow-medium overflow-hidden">

              {/*
              <img
                src={multipackImage}
                alt="LuminAID multipacks"
                className="w-full h-full object-cover"
              />
              */}

              <p className="text-sm text-gray-400 font-medium">
                Multipack Image
              </p>

            </div>


            <div className="max-w-[550px]">

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-5">
                Save With Multipacks
              </h2>

              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-8">
                Stock up on your favorite LuminAID lights and save with
                multipacks made for adventures, emergencies, and everyday use.
              </p>

              <a
                href="/bundles/titan"
                className="inline-flex bg-brand-orange text-white px-8 py-3.5 rounded-soft
                         text-sm font-bold tracking-wide
                         hover:bg-brand-orange-dark active:scale-95
                         transition-all duration-fast
                         shadow-glow-sm hover:shadow-glow-md"
              >
                SHOP MULTIPACKS
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* Shop Curated Bundles */}
      <section className="w-full py-16 md:py-20 bg-gray-50">

        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-10">
            Shop Curated Bundles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              'Survival Bundle',
              'Halloween Bundle',
              'Power Outage Bundle',
              'Shark Tank Bundle',
            ].map((bundle) => (
              <div
                key={bundle}
                className="bg-white aspect-square rounded-soft flex items-center justify-center 
                         shadow-soft hover:shadow-medium
                         transition-all duration-normal
                         group cursor-pointer overflow-hidden"
              >

                {/*
                <img
                  src={bundle.image}
                  alt={bundle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-normal"
                />
                */}

                <p className="text-sm text-gray-400 font-medium">
                  {bundle}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

    </div>
  )
}

export default ProductsPage