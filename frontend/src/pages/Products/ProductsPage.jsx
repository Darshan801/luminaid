import { useState, useEffect, useCallback } from 'react'
import { getAllProducts } from '../../services/productService'
import ProductCard from '../../components/products/ProductCard'
import Pagination from '../../components/common/Pagination'

const ITEMS_PER_PAGE = 12

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
  
  // Temporary price inputs (not applied to filters yet)
  const [priceInputs, setPriceInputs] = useState({
    minPrice: '',
    maxPrice: ''
  })

  // Fetch products with filters and pagination
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query params
      const params = {
        page: pagination.page,
        limit: ITEMS_PER_PAGE,
        status: 'active'
      }

      // Add sorting
      if (sortBy === 'low-high') {
        params.sort = 'price'
      } else if (sortBy === 'high-low') {
        params.sort = '-price'
      } else if (sortBy === 'a-z') {
        params.sort = 'name'
      } else if (sortBy === 'z-a') {
        params.sort = '-name'
      } else if (sortBy === 'best-selling') {
        params.sort = '-reviewCount'
      } else if (sortBy === 'new-old') {
        params.sort = '-createdAt'
      } else if (sortBy === 'old-new') {
        params.sort = 'createdAt'
      } else {
        params.sort = '-featured,-createdAt'
      }

      // Add filters
      if (filters.bestFor.length > 0) {
        params.tags = filters.bestFor.join(',')
      }
      
      if (filters.features.length > 0) {
        params.tags = params.tags 
          ? `${params.tags},${filters.features.join(',')}` 
          : filters.features.join(',')
      }
      
      if (filters.lightColor.length > 0) {
        params.tags = params.tags 
          ? `${params.tags},${filters.lightColor.join(',')}` 
          : filters.lightColor.join(',')
      }

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
  const clearFilters = () => {
    setFilters({
      bestFor: [],
      features: [],
      lightColor: [],
      minPrice: '',
      maxPrice: ''
    })
    setPriceInputs({
      minPrice: '',
      maxPrice: ''
    })
    resetToFirstPage()
  }

  // Apply price filter
  const applyPriceFilter = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceInputs.minPrice,
      maxPrice: priceInputs.maxPrice
    }))
    resetToFirstPage()
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    resetToFirstPage()
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    return filters.bestFor.length + 
           filters.features.length + 
           filters.lightColor.length +
           (filters.minPrice ? 1 : 0) +
           (filters.maxPrice ? 1 : 0)
  }

  const bestFor = [
    'Gifting',
    'Camping',
    'Emergency Preparedness',
    'Travel',
    'Home/Garden',
    'Kids',
  ]

  const features = [
    'Charges Phones',
    'Twist-to-Inflate',
    'Magnets',
  ]

  const lightColors = [
    'White',
    'Warm White',
    'Red (Night Vision)',
    'Multi-Color',
  ]

  // Note: Filter counts are no longer accurate with server-side pagination
  // We'd need a separate API call to get accurate counts
  // For now, we'll hide the counts or show approximate
  const getFilterCount = () => {
    return '' // Could be enhanced with a dedicated count API
  }

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
                  {getActiveFilterCount() > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs font-bold text-brand-orange hover:text-brand-orange-dark
                               transition-colors duration-fast"
                    >
                      Clear ({getActiveFilterCount()})
                    </button>
                  )}
                </div>


                {/* Best For */}
                <div className="pb-6 mb-6">

                  <h3 className="text-sm font-bold text-gray-900 mb-4">
                    Best For
                  </h3>

                  <div className="space-y-3">

                    {bestFor.map((item) => (
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
                            className="w-4 h-4 rounded border-gray-300 text-brand-orange 
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

                    {features.map((item) => (
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
                            className="w-4 h-4 rounded border-gray-300 text-brand-orange 
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

                    {lightColors.map((item) => (
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
                            className="w-4 h-4 rounded border-gray-300 text-brand-orange 
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

                  <div className="space-y-3">
                    <div className="flex items-center bg-gray-50 rounded-soft px-3 py-2 
                                  focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-orange/20
                                  transition-all duration-fast">
                      <span className="text-sm text-gray-500 font-medium mr-2">
                        RS
                      </span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceInputs.minPrice}
                        onChange={(e) => setPriceInputs({...priceInputs, minPrice: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                        className="w-full text-sm outline-none bg-transparent
                                 placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex items-center justify-center text-xs text-gray-500 font-medium">
                      to
                    </div>

                    <div className="flex items-center bg-gray-50 rounded-soft px-3 py-2
                                  focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-orange/20
                                  transition-all duration-fast">
                      <span className="text-sm text-gray-500 font-medium mr-2">
                        RS
                      </span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceInputs.maxPrice}
                        onChange={(e) => setPriceInputs({...priceInputs, maxPrice: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                        className="w-full text-sm outline-none bg-transparent
                                 placeholder:text-gray-400"
                      />
                    </div>

                    <button
                      onClick={applyPriceFilter}
                      className="w-full bg-brand-orange text-white px-4 py-2.5 rounded-soft
                               text-sm font-bold tracking-wide
                               hover:bg-brand-orange-dark active:scale-95
                               transition-all duration-fast
                               disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!priceInputs.minPrice && !priceInputs.maxPrice}
                    >
                      Apply Price
                    </button>

                    {(filters.minPrice || filters.maxPrice) && (
                      <button
                        onClick={() => {
                          setFilters(prev => ({...prev, minPrice: '', maxPrice: ''}))
                          setPriceInputs({minPrice: '', maxPrice: ''})
                        }}
                        className="w-full text-xs font-bold text-gray-600 hover:text-brand-orange
                                 transition-colors duration-fast py-1"
                      >
                        Clear Price Filter
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