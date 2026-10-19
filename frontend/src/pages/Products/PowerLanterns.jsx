import { useState, useEffect, useCallback } from 'react'
import { getAllProducts } from '../../services/productService'
import ProductCard from '../../components/products/ProductCard'
import Pagination from '../../components/common/Pagination'
import { Battery, Sun, Zap, Shield } from 'lucide-react'

const ITEMS_PER_PAGE = 12


const PowerLanterns = () => {
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  })

  // Fetch Power Lanterns products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        page: pagination.page,
        limit: ITEMS_PER_PAGE,
        category: 'Power Lanterns',
        status: 'active,out-of-stock' // Show both active and out-of-stock products
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

      console.log('Fetching Power Lanterns with params:', params)
      const response = await getAllProducts(params)
      console.log('Power Lanterns API Response:', response)
      
      setProducts(response.data || [])
      setPagination({
        page: response.page || 1,
        totalPages: response.pages || 1,
        total: response.total || 0
      })
    } catch (err) {
      console.error('Failed to fetch Power Lanterns:', err)
      setError('Failed to load products. Please try again.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [pagination.page, sortBy])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pagination.page])

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const scrollToProducts = (e) => {
    e.preventDefault()
    const element = document.getElementById('products')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="w-full bg-white">

      {/* Editorial Hero - Asymmetric Layout */}
      <section className="relative w-full overflow-hidden bg-warm-paper">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[500px] lg:min-h-[600px] py-12 lg:py-16">
            
            {/* Content Side */}
            <div className="order-2 lg:order-1 max-w-xl">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full shadow-soft">
                <Battery size={18} className="text-brand-orange" />
                <span className="text-label-lg font-bold text-charcoal tracking-wide">
                  POWER LANTERNS
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-display-md lg:text-display-lg font-display font-bold text-charcoal mb-6 leading-tight">
                Light & Power,
                <span className="block text-brand-orange">Wherever You Go</span>
              </h1>

              {/* Description */}
              <p className="text-body-lg text-muted-neutral leading-relaxed mb-8">
                Solar-powered lanterns that charge your devices and illuminate your adventures. 
                Combining portable lighting with reliable power in one compact, waterproof design.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#products"
                  onClick={scrollToProducts}
                  className="inline-flex items-center justify-center px-8 py-4 
                           bg-brand-orange text-white font-bold text-label-lg tracking-wide
                           rounded-soft shadow-soft hover:shadow-medium
                           hover:bg-brand-red active:scale-[0.98]
                           transition-all duration-fast focus-ring"
                >
                  Explore Power Lanterns
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 
                           bg-white text-brand-orange font-bold text-label-lg tracking-wide
                           rounded-soft border-2 border-brand-orange
                           hover:bg-brand-orange hover:text-white active:scale-[0.98]
                           transition-all duration-fast focus-ring"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Image Side - Asymmetric offset */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative lg:translate-y-8">
                {/* Warm glow effect behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-brand-red/20 
                              rounded-soft blur-3xl transform scale-110"></div>
                
                {/* Product Image */}
                <div className="relative bg-white rounded-soft shadow-medium overflow-hidden">
                  <img
                    src="/images/products/0196-150_Max_QI_product_image.jpg"
                    alt="PackLite Titan Power Lantern in use"
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Floating feature badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-soft shadow-strong p-6 
                              hidden lg:block max-w-[240px]">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-red 
                                  rounded-full flex items-center justify-center flex-shrink-0">
                      <Sun size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-charcoal text-title-sm mb-1">Solar Powered</p>
                      <p className="text-body-sm text-muted-neutral">Unlimited clean energy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Product Catalog - Priority Discovery */}
      <section id="products" className="section-py bg-gray-light">
        <div className="container-wide">
          
          {/* Section Header */}
          <div className="max-w-3xl mb-12">
            <h2 className="text-heading-lg font-display font-bold text-charcoal mb-4">
              Explore Power Lanterns
            </h2>
            <p className="text-body-lg text-muted-neutral">
              Each lantern combines powerful LED illumination with device charging capabilities, 
              all powered by integrated solar panels.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between 
                        gap-4 bg-white rounded-soft border border-gray-200 px-6 py-4 mb-8 shadow-soft">
            <p className="text-body-md text-muted-neutral">
              <span className="font-bold text-charcoal">{pagination.total}</span> {pagination.total === 1 ? 'product' : 'products'}
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label htmlFor="sort" className="text-body-sm font-medium text-muted-neutral whitespace-nowrap">
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSortChange}
                className="flex-1 sm:flex-initial bg-warm-paper rounded-soft px-4 py-2.5 text-body-sm font-medium 
                         text-charcoal border border-transparent
                         focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20
                         transition-all duration-fast cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="a-z">Name: A to Z</option>
                <option value="z-a">Name: Z to A</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="new-old">Newest First</option>
                <option value="old-new">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 
                              border-brand-orange border-t-transparent"></div>
                <p className="mt-6 text-body-lg text-muted-neutral font-medium">Loading products...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-20 bg-white rounded-soft border border-gray-200 p-12 shadow-soft">
                <Battery size={64} className="mx-auto mb-6 text-gray-300" strokeWidth={1.5} />
                <p className="text-body-lg text-red-600 font-medium mb-6">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="inline-flex items-center justify-center px-8 py-3 
                           bg-brand-orange text-white font-bold text-label-lg
                           rounded-soft hover:bg-brand-red active:scale-[0.98]
                           transition-all duration-fast focus-ring"
                >
                  Retry
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-soft border border-gray-200 p-12 shadow-soft">
                <Battery size={64} className="mx-auto mb-6 text-gray-300" strokeWidth={1.5} />
                <p className="text-heading-sm text-charcoal font-bold mb-3">No Products Available</p>
                <p className="text-body-md text-muted-neutral mb-6">
                  We're currently updating our Power Lanterns collection. Check back soon!
                </p>
                <a
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-3 
                           bg-brand-orange text-white font-bold text-label-lg
                           rounded-soft hover:bg-brand-red active:scale-[0.98]
                           transition-all duration-fast focus-ring"
                >
                  View All Products
                </a>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && products.length > 0 && pagination.totalPages > 1 && (
            <div className="bg-white rounded-soft border border-gray-200 px-6 py-5 shadow-soft">
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
      </section>

      {/* Practical Benefits - Editorial Layout */}
      <section className="section-py bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Image Side */}
            <div className="order-2 lg:order-1 lg:sticky lg:top-24">
              <div className="aspect-square rounded-soft overflow-hidden shadow-medium bg-warm-paper">
                <img
                  src="/images/products/Power_Lanterns_Circle.png"
                  alt="Power Lantern Features"
                  className="w-full h-full object-contain p-8"
                />
              </div>
            </div>

            {/* Content Side */}
            <div className="order-1 lg:order-2">
              <h2 className="text-heading-md lg:text-heading-lg font-display font-bold text-charcoal mb-8">
                Engineered For
                <span className="block text-brand-orange">Real Adventures</span>
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: Sun,
                    title: 'Solar Charging',
                    description: 'Integrated solar panels harness sunlight to power both the lantern and charge your devices, providing energy independence anywhere.'
                  },
                  {
                    icon: Battery,
                    title: 'High-Capacity Power',
                    description: 'Built-in batteries (4000-6000mAh) store enough energy to charge phones multiple times while providing hours of bright illumination.'
                  },
                  {
                    icon: Shield,
                    title: 'Waterproof & Durable',
                    description: 'IP67 waterproof rating means these lanterns can handle rain, splashes, and submersion up to 1 meter, built for harsh conditions.'
                  },
                  {
                    icon: Zap,
                    title: 'Multiple Light Modes',
                    description: 'Adjustable brightness levels (50-350 lumens) and specialized modes like red night vision let you optimize light and battery life.'
                  }
                ].map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-red 
                                    rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon size={22} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-title-md font-bold text-charcoal mb-1.5">
                          {benefit.title}
                        </h3>
                        <p className="text-body-md text-muted-neutral leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Use Cases - "Light in Motion" Storytelling */}
      <section className="section-py bg-gradient-to-b from-warm-paper to-white">
        <div className="container-wide">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-heading-lg font-display font-bold text-charcoal mb-4">
              Light Travels With You
            </h2>
            <p className="text-body-lg text-muted-neutral">
              From backcountry trails to emergency preparedness, Power Lanterns provide reliable light 
              and power when you need it most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Outdoor Adventures',
                description: 'Camping, hiking, and backpacking essentials. Lightweight, packable, and powerful enough to light your campsite and keep devices charged.',
                image: '/images/products/SurvivorThumbnai.jpg'
              },
              {
                title: 'Emergency Preparedness',
                description: 'Critical backup during power outages and emergencies. Solar recharging means unlimited runtime when the grid goes down.',
                image: '/images/products/0196-150_Max_QI_product_image.jpg'
              },
              {
                title: 'Remote Work & Travel',
                description: 'Stay productive anywhere. Power laptops, tablets, and phones while working off-grid or traveling to remote locations.',
                image: '/images/products/Power_Lanterns_Circle.png'
              }
            ].map((useCase, index) => (
              <div 
                key={index}
                className="bg-white rounded-soft overflow-hidden shadow-soft hover:shadow-medium
                         transition-all duration-normal group"
              >
                <div className="aspect-[4/3] overflow-hidden bg-warm-paper">
                  <img 
                    src={useCase.image} 
                    alt={useCase.title}
                    className="w-full h-full object-cover group-hover:scale-105 
                             transition-transform duration-slow"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-title-lg font-bold text-charcoal mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-body-md text-muted-neutral leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      
{/* How It Works — Living Light Circuit */}
<section
  id="how-it-works"
  className="living-light-section section-py relative overflow-hidden"
>
  {/* Ambient lighting */}
  <div className="living-light-ambient living-light-ambient--one" aria-hidden="true" />
  <div className="living-light-ambient living-light-ambient--two" aria-hidden="true" />

  <div className="container-wide relative z-10">
    <div className="max-w-3xl mx-auto text-center mb-16">
      <span className="living-light-eyebrow">
        <span className="living-light-status-dot" />
        POWERED BY THE SUN
      </span>

      <h2 className="text-heading-lg font-display font-bold text-charcoal mt-5 mb-4">
        Simple. Sustainable. Reliable.
      </h2>

      <p className="text-body-lg text-muted-neutral">
        From sunlight to stored energy to light on demand.
      </p>
    </div>

    <div className="living-light-grid">
      {/* STEP 1: SOLAR CAPTURE */}
      <article className="living-light-card living-light-card--solar">
        <div className="living-light-card-top">
          <span className="living-light-icon">
            <Sun size={27} strokeWidth={1.8} />
            <span className="solar-rays" aria-hidden="true" />
          </span>

          <span className="living-light-step">01</span>
        </div>

        <div className="living-light-copy">
          <span className="living-light-stage">CAPTURE</span>
          <h3>Charge with Solar</h3>
          <p>
            Place the lantern in direct sunlight. Integrated solar panels
            collect energy and begin charging the internal battery.
          </p>
        </div>

        {/* Decorative solar rays */}
        <div className="solar-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </article>

      {/* CONNECTOR 1 */}
      <div className="living-light-connector living-light-connector--one"
        aria-hidden="true">
        <span className="connector-track" />
        <span className="connector-energy" />
        <span className="connector-arrival" />
      </div>

      {/* STEP 2: ENERGY STORAGE */}
      <article className="living-light-card living-light-card--battery">
        <div className="living-light-card-top">
          <span className="living-light-icon battery-icon">
            <Battery size={28} strokeWidth={1.8} />
            <span className="battery-charge-flash" aria-hidden="true" />
          </span>

          <span className="living-light-step">02</span>
        </div>

        <div className="living-light-copy">
          <span className="living-light-stage">STORE</span>
          <h3>Store Energy</h3>
          <p>
            A rechargeable battery stores the collected solar energy,
            ready to power your adventures after sunset.
          </p>
        </div>

        {/* Decorative battery meter */}
        <div className="battery-meter" aria-hidden="true">
          <div className="battery-meter-track">
            <span className="battery-meter-fill" />
          </div>
          <span className="battery-meter-cap" />
        </div>
      </article>

      {/* CONNECTOR 2 */}
      <div className="living-light-connector living-light-connector--two"
        aria-hidden="true">
        <span className="connector-track" />
        <span className="connector-energy" />
        <span className="connector-arrival" />
      </div>

      {/* STEP 3: POWER ACTIVATION */}
      <article className="living-light-card living-light-card--power">
        <div className="living-light-card-top">
          <span className="living-light-icon power-icon">
            <Zap size={28} strokeWidth={1.8} />
            <span className="power-ripple power-ripple--one" />
            <span className="power-ripple power-ripple--two" />
          </span>

          <span className="living-light-step">03</span>
        </div>

        <div className="living-light-copy">
          <span className="living-light-stage">ILLUMINATE</span>
          <h3>Light &amp; Power On Demand</h3>
          <p>
            Activate bright LED illumination and use the USB output
            to charge compatible phones, tablets, and other devices.
          </p>
        </div>

        <div className="power-indicator" aria-hidden="true">
          <span className="power-indicator-dot" />
          READY WHEN YOU ARE
        </div>
      </article>
    </div>

    <p className="living-light-footnote">
      One simple cycle. Light that goes further.
    </p>
  </div>
</section>

      {/* Final CTA */}
      <section className="section-py bg-warm-paper relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl"></div>
        
        <div className="container-wide text-center relative z-10">
          
          <h2 className="text-heading-lg font-display font-bold text-charcoal mb-6">
            Power Your Next Adventure
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto mb-10 text-muted-neutral">
            Join thousands who trust LuminAID for reliable, sustainable light and power wherever life takes them.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#products"
              onClick={scrollToProducts}
              className="inline-flex items-center justify-center px-8 py-4 
                       bg-brand-orange text-white font-bold text-label-lg tracking-wide
                       rounded-soft shadow-soft hover:shadow-medium
                       hover:bg-brand-red hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-fast focus-ring"
            >
              Shop Power Lanterns
            </a>
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 
                       bg-white text-brand-orange font-bold text-label-lg tracking-wide
                       rounded-soft border-2 border-brand-orange shadow-soft
                       hover:bg-brand-orange hover:text-white hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-fast focus-ring"
            >
              View All Products
            </a>
          </div>

        </div>
      </section>

    </div>
  )
}

export default PowerLanterns
