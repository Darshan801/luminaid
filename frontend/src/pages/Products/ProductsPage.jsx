import { useState, useEffect } from 'react'
import { getAllProducts } from '../../services/productService'
import ProductCard from '../../components/products/ProductCard'

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

  // Fetch products on mount and when filters change
  useEffect(() => {
    fetchProducts()
  }, [sortBy, filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query params
      const params = {
        status: 'active'
      }

      // Add sort
      if (sortBy === 'low-high') params.sort = 'price'
      else if (sortBy === 'high-low') params.sort = '-price'
      else if (sortBy === 'a-z') params.sort = 'name'
      else if (sortBy === 'z-a') params.sort = '-name'
      else if (sortBy === 'best-selling') params.sort = '-reviewCount'
      else params.sort = '-featured,-bestseller,-createdAt'

      // Add price filters
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice

      const response = await getAllProducts(params)
      setProducts(response.data || [])
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
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

  const getFilterCount = (key, value) => {
    return products.filter((product) =>
      product[key]?.includes(value)
    ).length
  }

  return (
    <div className="w-full bg-white">

      {/* Collection Header */}
      <section className="w-full py-12 md:py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Solar Lanterns
        </h1>
      </section>


      {/* Collection Content */}
      <section className="w-full">

        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">


            {/* Filters Sidebar */}
            <aside className="hidden lg:block">

              <div className="sticky top-24">

                <h2 className="text-sm font-bold uppercase mb-7">
                  Filters
                </h2>


                {/* Best For */}
                <div className="pb-7 border-b border-gray-200">

                  <h3 className="text-sm font-bold mb-5">
                    Best For
                  </h3>

                  <div className="space-y-4">

                    {bestFor.map((item) => (
                      <label
                        key={item}
                        className="flex items-center justify-between text-sm text-gray-700 cursor-pointer"
                      >

                        <div className="flex items-center gap-3">

                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-black"
                          />

                          <span>
                            {item}
                          </span>

                        </div>

                        <span className="text-gray-400">
                          ({getFilterCount('bestFor', item)})
                        </span>

                      </label>
                    ))}

                  </div>

                </div>


                {/* Features */}
                <div className="py-7 border-b border-gray-200">

                  <h3 className="text-sm font-bold mb-5">
                    Features
                  </h3>

                  <div className="space-y-4">

                    {features.map((item) => (
                      <label
                        key={item}
                        className="flex items-center justify-between text-sm text-gray-700 cursor-pointer"
                      >

                        <div className="flex items-center gap-3">

                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-black"
                          />

                          <span>
                            {item}
                          </span>

                        </div>

                        <span className="text-gray-400">
                          ({getFilterCount('features', item)})
                        </span>

                      </label>
                    ))}

                  </div>

                </div>


                {/* Light Color */}
                <div className="py-7 border-b border-gray-200">

                  <h3 className="text-sm font-bold mb-5">
                    Light Color
                  </h3>

                  <div className="space-y-4">

                    {lightColors.map((item) => (
                      <label
                        key={item}
                        className="flex items-center justify-between text-sm text-gray-700 cursor-pointer"
                      >

                        <div className="flex items-center gap-3">

                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-black"
                          />

                          <span>
                            {item}
                          </span>

                        </div>

                        <span className="text-gray-400">
                          ({getFilterCount('lightColor', item)})
                        </span>

                      </label>
                    ))}

                  </div>

                </div>


                {/* Price */}
                <div className="py-7">

                  <h3 className="text-sm font-bold mb-5">
                    Price
                  </h3>

                  <div className="flex items-center gap-2">

                    <div className="flex items-center border border-gray-300 px-3 py-2">

                      <span className="text-sm text-gray-500">
                        $
                      </span>

                      <input
                        type="number"
                        placeholder="0"
                        className="w-16 pl-2 text-sm outline-none"
                      />

                    </div>

                    <span className="text-sm text-gray-500">
                      to
                    </span>

                    <div className="flex items-center border border-gray-300 px-3 py-2">

                      <span className="text-sm text-gray-500">
                        $
                      </span>

                      <input
                        type="number"
                        placeholder="448"
                        className="w-16 pl-2 text-sm outline-none"
                      />

                    </div>

                  </div>

                </div>

              </div>

            </aside>


            {/* Products Area */}
            <div>

              {/* Collection Controls */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-8">

                <p className="text-sm text-gray-500">
                  {products.length} products
                </p>


                <div className="flex items-center gap-2">

                  <label
                    htmlFor="sort"
                    className="text-sm text-gray-600"
                  >
                    Sort by
                  </label>

                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-sm font-medium outline-none cursor-pointer"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-12">

                {loading ? (
                  <div className="col-span-full text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center py-20">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                      onClick={fetchProducts}
                      className="bg-primary-red text-white px-6 py-2 hover:bg-red-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="col-span-full text-center py-20">
                    <p className="text-gray-600 text-lg">No products found</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                )}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Get More Gift Ideas */}
      <section className="w-full py-16 md:py-20">

        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            Get More Gift Ideas
          </h2>

          <div className="bg-gray-100 h-64 flex items-center justify-center">

            <p className="text-sm text-gray-400">
              Promotional content / images
            </p>

          </div>

        </div>

      </section>


      {/* Save With Multipacks */}
      <section className="w-full bg-gray-100 py-16 md:py-20">

        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div className="bg-white aspect-video flex items-center justify-center">

              {/*
              <img
                src={multipackImage}
                alt="LuminAID multipacks"
                className="w-full h-full object-cover"
              />
              */}

              <p className="text-sm text-gray-400">
                Image
              </p>

            </div>


            <div className="max-w-[550px]">

              <h2 className="text-3xl md:text-4xl font-bold mb-5">
                Save With Multipacks
              </h2>

              <p className="text-base md:text-lg leading-7 text-gray-600 mb-7">
                Stock up on your favorite LuminAID lights and save with
                multipacks made for adventures, emergencies, and everyday use.
              </p>

              <a
                href="/bundles/titan"
                className="inline-flex bg-black text-white px-7 py-3 text-sm font-semibold hover:bg-primary-red transition-colors"
              >
                SHOP MULTIPACKS
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* Shop Curated Bundles */}
      <section className="w-full py-16 md:py-20">

        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            Shop Curated Bundles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {[
              'Survival Bundle',
              'Halloween Bundle',
              'Power Outage Bundle',
              'Shark Tank Bundle',
            ].map((bundle) => (
              <div
                key={bundle}
                className="bg-gray-100 aspect-square flex items-center justify-center"
              >

                {/*
                <img
                  src={bundle.image}
                  alt={bundle.name}
                  className="w-full h-full object-cover"
                />
                */}

                <p className="text-sm text-gray-400">
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