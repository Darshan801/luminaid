import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Accessibility, Truck, ThumbsUp, Shield, Play, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import backgroundImage from '../../assets/images/From_Darkness_to_Golden_Light.webp'
import disasterResponseBg from '../../assets/images/Lumen_Rewards_Page.jpg?url'
import ProductCard from '../../components/products/ProductCard'
import { get } from '../../services/api'
import { productTypes } from '../../data/categories'
import { testimonials } from '../../data/testimonials'
import { pressLogos } from '../../data/press'
import { partners } from '../../data/partners'

// Using local SVG placeholders to avoid external requests
const createPlaceholderSVG = (text, width, height, bgColor = '#f5f5f5') => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#999">${text}</text>
    </svg>
  `)}`
}

const storyVideoThumb = createPlaceholderSVG('Story Video', 800, 450, '#2b2b2b')
const worldMap = createPlaceholderSVG('World Map', 800, 400)

// ============================================================================
// CONSTANTS
// ============================================================================

const CAUSES = ['Disaster Relief', 'Allocate as Needed', 'Refugee Relief']
const AMOUNTS = [20, 10, 50, 100]

const HELP_ITEMS = [
  {
    title: 'Disaster Relief',
    body: 'Lights sponsored for disaster relief are distributed to families affected by disasters through our humanitarian partners, sent to areas of greatest need following wildfires, hurricanes, earthquakes, and more.',
  },
  {
    title: 'Refugee Relief (Ukraine)',
    body: 'Our current focus for this impact area is the crisis in Ukraine. LuminAID solar lanterns and phone chargers allow families to illuminate shelters, contact loved ones, and improve safety.',
  },
  {
    title: 'Allocate as Needed',
    body: 'We use this fund to send lights wherever they will have the greatest impact — from rural villages without electricity to community healthcare projects.',
  },
]

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const TrustBadges = () => (
  <section className="py-12 px-8 bg-gray-light">
    <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
      <div className="flex flex-col items-center gap-3">
        <Truck size={36} className="text-black" />
        <p className="font-bold text-black text-[15px]">Free US Shipping RS 99+</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <ThumbsUp size={36} className="text-black" />
        <p className="font-bold text-black text-[15px]">10,000+ Reviews</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Shield size={36} className="text-black" />
        <p className="font-bold text-black text-[15px]">Off-Grid Guarantee</p>
      </div>
    </div>
  </section>
)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Home = () => {
  // State Management
  const [cause, setCause] = useState(CAUSES[0])
  const [amount, setAmount] = useState(AMOUNTS[0])
  const [openHelp, setOpenHelp] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [bestsellers, setBestsellers] = useState([])
  const [categories, setCategories] = useState([])
  const [latestReviews, setLatestReviews] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingBestsellers, setLoadingBestsellers] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)

  // Fetch featured products (Top Picks)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true)
        const response = await get('/products/featured')
        if (response.success) {
          setFeaturedProducts(response.data.slice(0, 4))
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  // Fetch bestsellers
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoadingBestsellers(true)
        const response = await get('/products/bestsellers')
        if (response.success) {
          setBestsellers(response.data.slice(0, 4))
        }
      } catch (error) {
        console.error('Failed to fetch bestsellers:', error)
      } finally {
        setLoadingBestsellers(false)
      }
    }
    fetchBestsellers()
  }, [])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get('/products/categories/list')
        if (response.success) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Fallback to static categories
        setCategories(productTypes.map(type => type.name))
      }
    }
    fetchCategories()
  }, [])

  // Fetch latest reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true)
        const response = await get('/reviews/latest?limit=9')
        if (response.success && response.data.length > 0) {
          const formattedReviews = response.data.map(review => ({
            id: review._id,
            author: review.user 
              ? `${review.user.firstName} ${review.user.lastName.charAt(0)}.` 
              : review.authorName,
            rating: review.rating,
            text: review.comment,
            title: review.title,
            product: review.product?.name || 'Product',
            productImage: review.product?.images?.[0]?.url || review.product?.images?.[0],
            verified: review.isVerifiedPurchase,
            date: new Date(review.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })
          }))
          setLatestReviews(formattedReviews)
        } else {
          setLatestReviews([])
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
        setLatestReviews([])
      } finally {
        setLoadingReviews(false)
      }
    }
    fetchReviews()
  }, [])

  // Give Light Images
  const giveLightImages = [
    '/images/products/0196-150_Max_QI_product_image.jpg',
    '/images/products/PLTNRProductImage_sizerelative_withphone_lightgraybackground.jpg',
    '/images/products/StringLightatSunset.jpg',
    '/images/products/Accessories.jpg',
    '/images/products/SurvivorThumbnai.jpg',
    '/images/products/0196-150_Max_QI_product_image.jpg',
  ]
  const [selectedGiveLightImage, setSelectedGiveLightImage] = useState(giveLightImages[0])

  // Reviews Carousel State
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState('next') // Track direction for slide animation
  const reviewsPerPage = 3

  // Total pages for carousel
  const totalReviewPages = Math.ceil(latestReviews.length / reviewsPerPage)

  // Auto-scroll carousel every 6 seconds (standard e-commerce timing)
  useEffect(() => {
    if (latestReviews.length <= reviewsPerPage) return; // Don't auto-scroll if only one page

    const intervalId = setInterval(() => {
      handleNextReviews()
    }, 6000) // 6 seconds - gives users time to read reviews

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [latestReviews.length, reviewsPerPage, totalReviewPages, currentReviewIndex])

  // Handlers with transition
  const handleNextReviews = () => {
    if (isTransitioning) return; // Prevent multiple clicks during transition
    
    setDirection('next')
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentReviewIndex((prev) => {
        const nextIndex = prev + 1
        return nextIndex >= totalReviewPages ? 0 : nextIndex
      })
      setIsTransitioning(false)
    }, 600) // Slightly longer for smoother feel
  }

  const handlePrevReviews = () => {
    if (isTransitioning) return; // Prevent multiple clicks during transition
    
    setDirection('prev')
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentReviewIndex((prev) => {
        const prevIndex = prev - 1
        return prevIndex < 0 ? totalReviewPages - 1 : prevIndex
      })
      setIsTransitioning(false)
    }, 600)
  }

  // Computed Values
  const visibleReviews = latestReviews.slice(
    currentReviewIndex * reviewsPerPage, 
    (currentReviewIndex * reviewsPerPage) + reviewsPerPage
  )
  const spotlightTestimonial = testimonials[0]

  return (
    <div className="w-full">{/* ============================================================================ */}
      {/* ============================================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--hero relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="hero__media-wrapper absolute inset-0">
          <img 
            src={backgroundImage} 
            alt="LuminAID outdoor adventure" 
            className="hero__image w-full h-full object-cover" 
          />
          <div className="hero__overlay absolute inset-0 bg-black/20" />
        </div>

        {/* Content Container */}
        <div className="hero__content-wrapper relative max-w-[1280px] w-full mx-auto px-8 py-16 flex items-center justify-center">
          <div className="hero__content-box max-w-[420px] px-12 py-14 space-y-5 text-center border border-white/60 rounded-lg shadow-md">
            {/* Reviews Badge */}
            <div className="hero__reviews flex items-center justify-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#E8C441" stroke="#E8C441" />)}
              </div>
              <span className="text-[11px] font-bold text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">10,000+ 5-STAR REVIEWS</span>
            </div>

            {/* Heading */}
            <h1 className="hero__heading text-[32px] font-heading font-bold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Gear Up for Adventure
            </h1>

            {/* Description */}
            <div className="hero__text text-white text-[15px] leading-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <p>
                Light up fall nights with <Link to="/products/power-lanterns" className="underline underline-offset-2 hover:text-primary-orange transition-colors">Power Lanterns</Link>,{' '}
                <Link to="/products/solar-lights" className="underline underline-offset-2 hover:text-primary-orange transition-colors">String Lights</Link>, and{' '}
                <Link to="products/accessories" className="underline underline-offset-2 hover:text-primary-orange transition-colors">Outdoor Gear</Link>!
              </p>
            </div>

            {/* CTA Button */}
            <div className="hero__button-wrapper pt-3">
              <Link 
                to="/products" 
                className="inline-block bg-primary-red hover:bg-primary-orange text-white font-bold px-7 py-3 text-xs tracking-widest transition-colors rounded shadow-lg"
              >
                SHOP BESTSELLERS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* PRESS QUOTE & LOGOS SECTION - Redesigned */}
      {/* ============================================================================ */}
      
      <section className="section-py bg-warm-paper">
        <div className="container max-w-content mx-auto text-center">
          {/* Quote Block */}
          <div className="max-w-3xl mx-auto mb-12 md:mb-16">
            <p className="text-title-sm md:text-title-lg font-bold text-charcoal 
                        tracking-tight mb-4 leading-snug">
              "The combination of the phone charger and the lantern has been a lifesaver."
            </p>
            <p className="text-body-sm text-muted-neutral">
              — REI, <em>Best Camping Lanterns</em>
            </p>
          </div>

          {/* Logo Strip - Refined */}
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 max-w-5xl mx-auto">
            {pressLogos.map((press) => (
              <img 
                key={press.name} 
                src={press.logo} 
                alt={`${press.name} logo`} 
                className="h-10 md:h-12 object-contain opacity-60 grayscale 
                         hover:opacity-100 hover:grayscale-0
                         transition-all duration-normal"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* TRUST BADGES SECTION - Redesigned */}
      {/* ============================================================================ */}
      
      <section className="py-12 md:py-16 bg-white">
        <div className="container max-w-content mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <Truck size={28} className="text-brand-orange" />
              </div>
              <p className="font-bold text-charcoal text-body-md">Free US Shipping RS 99+</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <ThumbsUp size={28} className="text-brand-orange" />
              </div>
              <p className="font-bold text-charcoal text-body-md">10,000+ Reviews</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <Shield size={28} className="text-brand-orange" />
              </div>
              <p className="font-bold text-charcoal text-body-md">Off-Grid Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* TOP PICKS SECTION - Redesigned */}
      {/* ============================================================================ */}
      
      <section className="section-py-lg bg-white">
        <div className="container max-w-content mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-heading-sm md:text-heading-lg font-display font-bold text-charcoal mb-4">
              Our Top Picks for Fall
            </h2>
            <p className="text-body-md text-muted-neutral max-w-2xl mx-auto">
              Curated essentials for your next adventure
            </p>
          </div>

          {/* Product Grid */}
          {loadingProducts ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 
                            border-4 border-brand-orange border-t-transparent mb-4"></div>
              <p className="text-body-md text-muted-neutral">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12 md:mt-16">
            <Link 
              to="/products" 
              className="inline-flex items-center justify-center
                       bg-brand-orange text-white font-bold 
                       px-10 py-4 text-body-sm
                       rounded-soft shadow-medium
                       hover:bg-brand-red hover:shadow-glow-md
                       active:scale-[0.98]
                       transition-all duration-normal
                       uppercase tracking-wider"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* SHOP BY PRODUCT TYPE SECTION - Redesigned */}
      {/* ============================================================================ */}
      
      <section className="section-py-lg bg-warm-paper">
        <div className="container max-w-content mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-heading-sm md:text-heading-lg font-display font-bold text-charcoal mb-4">
              Shop by Product Type
            </h2>
            <p className="text-body-md text-muted-neutral max-w-2xl mx-auto">
              Find the perfect light for every adventure
            </p>
          </div>

          {/* Product Type Grid - Centered */}
          <div className="flex flex-wrap items-start justify-center gap-10 md:gap-12 max-w-5xl mx-auto">
            {productTypes.map((type) => (
              <div key={type.title} className="text-center w-44 md:w-48 group">
                {/* Circle Image */}
                <Link 
                  to={type.link} 
                  className="block w-44 h-44 md:w-48 md:h-48 mx-auto mb-5 rounded-full overflow-hidden 
                           shadow-soft hover:shadow-medium transition-all duration-normal"
                >
                  <img 
                    src={type.icon} 
                    alt={type.title} 
                    className="w-full h-full object-cover group-hover:scale-110 
                             transition-transform duration-slow" 
                  />
                </Link>

                {/* Title */}
                <h3 className="font-bold text-charcoal text-title-sm mb-3 
                             group-hover:text-brand-orange transition-colors duration-fast">
                  {type.title}
                </h3>

                {/* Description */}
                <p className="text-body-sm text-muted-neutral leading-relaxed mb-5 px-2 min-h-[60px]">
                  {type.description}
                </p>

                {/* CTA Button */}
                <Link 
                  to={type.link} 
                  className="inline-flex items-center justify-center
                           bg-brand-orange text-white font-bold text-label-lg
                           px-6 py-2.5 rounded-soft
                           hover:bg-brand-red hover:shadow-glow-sm
                           active:scale-[0.98]
                           transition-all duration-fast
                           uppercase tracking-wide"
                >
                  Shop Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* GIVE LIGHT BANNER SECTION - Redesigned */}
      {/* ============================================================================ */}
      
      <section className="relative py-20 md:py-28 text-center text-white overflow-hidden">
        {/* Background Media */}
        <div className="absolute inset-0">
          <img 
            src={disasterResponseBg} 
            alt="Volunteers helping disaster relief families" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/50 to-charcoal/60" />
        </div>

        {/* Content */}
        <div className="relative container max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-label-lg font-bold tracking-widest mb-4 md:mb-6 text-brand-orange">
            GIVE LIGHT, GET LIGHT
          </p>
          <h2 className="text-heading-md md:text-heading-xl font-display font-bold mb-6 md:mb-8 leading-tight">
            Support Disaster Response
          </h2>
          <p className="text-body-md md:text-body-lg leading-relaxed mb-5 max-w-3xl mx-auto">
            We work with our nonprofit partners to provide <strong>safe light and power to families impacted by natural disasters</strong>. 
            Recent responses have included the LA Wildfires, Hurricane Helene in North Carolina, and Hurricane Milton in Florida.
          </p>
          <p className="text-body-md md:text-body-lg leading-relaxed mb-10 max-w-3xl mx-auto">
            Help us provide solar lanterns and phone chargers with a Give Light sponsorship:
          </p>
          <Link 
            to="/give-light" 
            className="inline-flex items-center justify-center
                     bg-white text-brand-orange font-bold 
                     px-10 py-4 text-body-sm md:text-body-md
                     rounded-soft shadow-strong
                     hover:bg-brand-orange hover:text-white hover:shadow-glow-lg
                     active:scale-[0.98]
                     transition-all duration-normal
                     uppercase tracking-wider"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* GIVE LIGHT PRODUCT WIDGET SECTION - Redesigned */}
      {/* ============================================================================ */}
      
      <section className="section-py-lg bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          
            {/* Product Gallery */}
            <div className="space-y-5">
              {/* Main Image */}
              <div className="bg-warm-paper rounded-soft overflow-hidden shadow-medium aspect-square">
                <img 
                  src={selectedGiveLightImage} 
                  alt="Give Light donation product" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-6 gap-3">
                {giveLightImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedGiveLightImage(img)}
                    className={`border-2 rounded-soft overflow-hidden aspect-square
                             transition-all duration-fast focus-ring ${
                      selectedGiveLightImage === img 
                        ? 'border-brand-orange shadow-glow-sm' 
                        : 'border-gray-200 hover:border-brand-orange'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Give Light option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-heading-sm md:text-heading-md font-display font-bold text-charcoal mb-3">
                  Give Light
                </h3>
                <p className="text-title-lg md:text-heading-sm text-brand-orange font-bold">
                  RS {amount.toFixed(2)}
                </p>
              </div>

              {/* Cause Selector */}
              <div>
                <label className="block text-body-md font-bold text-charcoal mb-3">
                  Cause:
                </label>
                <select
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  className="w-full border border-gray-300 rounded-soft px-4 py-3 
                           text-body-md text-charcoal
                           hover:border-gray-400 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20
                           transition-colors duration-fast cursor-pointer bg-white"
                >
                  {CAUSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Amount Selector */}
              <div>
                <label className="block text-body-md font-bold text-charcoal mb-3">
                  Amount:
                </label>
                <select
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-soft px-4 py-3 
                           text-body-md text-charcoal
                           hover:border-gray-400 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20
                           transition-colors duration-fast cursor-pointer bg-white"
                >
                  {AMOUNTS.map((a) => <option key={a} value={a}>RS {a}</option>)}
                </select>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full bg-brand-orange text-white font-bold py-4 
                               rounded-soft shadow-medium
                               hover:bg-brand-red hover:shadow-glow-md
                               active:scale-[0.98]
                               transition-all duration-normal
                               text-body-sm uppercase tracking-wider">
                Add to Cart
              </button>

              {/* Help Link */}
              <p className="text-body-sm text-muted-neutral text-center">
                <Link to="/support/contact" 
                      className="underline hover:text-brand-orange transition-colors duration-fast">
                  Need help?
                </Link>
              </p>

              {/* Accordion */}
              <div className="divide-y divide-gray-100 border-t border-gray-100 pt-4">
                {HELP_ITEMS.map((item, i) => (
                  <div key={item.title}>
                    <button
                      onClick={() => setOpenHelp(openHelp === i ? null : i)}
                      className="w-full flex items-center justify-between py-4 text-left 
                               font-bold text-charcoal text-body-md 
                               hover:text-brand-orange transition-colors duration-fast
                               focus-ring rounded-soft"
                    >
                      {item.title}
                      <ChevronDown 
                        size={20} 
                        className={`flex-shrink-0 transition-transform duration-fast ${
                          openHelp === i ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    {openHelp === i && (
                      <p className="pb-5 text-body-sm text-muted-neutral leading-relaxed 
                                  animate-fade-in">
                        {item.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Shipping Notice */}
              <p className="text-body-sm font-bold text-center text-charcoal 
                          pt-6 border-t border-gray-100">
                FREE U.S. Shipping over RS 99!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* REVIEWS SECTION - Redesigned */}
      {/* ============================================================================ */}
      
      <section className="section-py-lg bg-warm-paper">
        <div className="container max-w-content mx-auto">
          
          {/* Reviews Heading */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={32} fill="#F59E0B" stroke="#F59E0B" />
              ))}
            </div>
            <h2 className="text-heading-md md:text-heading-lg font-display font-bold text-charcoal">
              10,000+ 5-Star Reviews
            </h2>
          </div>

          {/* Testimonial Spotlight */}
          {spotlightTestimonial && (
            <div className="max-w-5xl mx-auto mb-16 md:mb-20">
              <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 md:gap-8 bg-white rounded-medium shadow-medium overflow-hidden">
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={spotlightTestimonial.image} 
                    alt="" 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Quote Content */}
                <div className="bg-warm-paper px-8 md:px-12 py-10 md:py-12 flex flex-col justify-center">
                  <div className="text-7xl md:text-8xl font-serif text-brand-orange/20 leading-none mb-4">
                    "
                  </div>
                  <p className="text-body-lg md:text-title-sm text-charcoal leading-relaxed font-medium mb-6">
                    {spotlightTestimonial.text}
                  </p>
                  <p className="text-body-sm text-muted-neutral font-semibold">
                    — {spotlightTestimonial.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Latest Reviews Carousel */}
          <div className="border-t border-gray-200 pt-12">
            {/* Carousel Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h3 className="text-title-lg md:text-heading-sm font-bold text-charcoal">
                Latest Reviews
              </h3>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-body-sm text-charcoal">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" stroke="#F59E0B" />
                    ))}
                  </div>
                  <span className="font-bold">5426 Reviews</span>
                </span>
                {!loadingReviews && latestReviews.length > reviewsPerPage && (
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePrevReviews}
                      aria-label="Previous reviews" 
                      disabled={currentReviewIndex === 0}
                      className="p-2 border-2 border-gray-200 rounded-soft 
                               hover:border-brand-orange hover:text-brand-orange
                               disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-inherit
                               active:scale-95
                               transition-all duration-fast focus-ring"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={handleNextReviews}
                      aria-label="Next reviews"
                      disabled={currentReviewIndex >= totalReviewPages - 1}
                      className="p-2 border-2 border-gray-200 rounded-soft 
                               hover:border-brand-orange hover:text-brand-orange
                               disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-inherit
                               active:scale-95
                               transition-all duration-fast focus-ring"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Review Cards */}
            <div className="relative overflow-hidden">
              {loadingReviews ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 
                                border-4 border-brand-orange border-t-transparent mb-4"></div>
                  <p className="text-body-md text-muted-neutral">Loading reviews...</p>
                </div>
              ) : visibleReviews.length > 0 ? (
                <div 
                  className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ease-out ${
                    isTransitioning 
                      ? direction === 'next' 
                        ? 'opacity-0 transform translate-x-24 blur-[2px]' 
                        : 'opacity-0 transform -translate-x-24 blur-[2px]'
                      : 'opacity-100 transform translate-x-0 blur-0'
                  }`}
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {visibleReviews.map((review, index) => (
                    <div 
                      key={review.id} 
                      className="bg-white border border-gray-100 rounded-soft p-6 
                                shadow-soft hover:shadow-medium transition-all duration-300"
                      style={{
                        transitionDelay: isTransitioning ? '0ms' : `${index * 50}ms`
                      }}
                    >
                      {/* Rating & Date */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="#E8C441" stroke="#E8C441" />
                          ))}
                        </div>
                        {review.date && (
                          <span className="review-card__date text-xs text-gray-400">
                            {review.date}
                          </span>
                        )}
                      </div>
                      
                      {/* Review Text */}
                      <p className="review-card__text text-sm text-gray-700 leading-relaxed mb-4 min-h-[80px] line-clamp-4">
                        {review.text}
                      </p>
                      
                      {/* Product & Author */}
                      <div className="review-card__footer flex items-start gap-3 pt-3 border-t border-gray-100">
                        <img 
                          src={review.productImage} 
                          alt={review.product} 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          className="review-card__product-image w-16 h-16 object-cover bg-gray-100 flex-shrink-0 rounded" 
                        />
                        <div className="review-card__meta flex-1 min-w-0">
                          <p className="review-card__author text-sm font-bold text-black mb-0.5">
                            {review.author}
                          </p>
                          <p className="review-card__product text-xs text-gray-500 truncate">
                            {review.product}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-body-md text-muted-neutral">No reviews available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* LUMINAID STORY SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--story py-20 px-6 md:px-8 bg-brand-red-secondary text-center text-white">
        {/* Section Label */}
        <p className="story__label text-xs-caps text-white/80 mb-4">
          THE LUMINAID STORY
        </p>
        
        {/* Heading */}
        <h2 className="story__heading text-4xl md:text-5xl font-heading font-bold mb-12 max-w-4xl mx-auto leading-tight">
          Our Mission is to Make Safe, Sustainable Light Available to All
        </h2>
        
        {/* Video Player */}
        <div className="story__video-wrapper relative max-w-3xl mx-auto rounded-soft overflow-hidden cursor-pointer group shadow-glow-lg
                      hover:shadow-glow-xl transition-all duration-normal">
          <img 
            src={storyVideoThumb} 
            alt="LuminAID founders Andrea Sreshta and Anna Stork" 
            className="story__video-thumbnail w-full object-cover" 
          />
          
          {/* Overlay with Play Button */}
          <div className="story__video-overlay absolute inset-0 bg-black/20 
                        flex items-center justify-center
                        transition-all duration-normal group-hover:bg-black/30">
            <div className="story__play-button w-20 h-20 rounded-full 
                          bg-white/90 backdrop-blur-sm
                          flex items-center justify-center 
                          transform group-hover:scale-110 
                          transition-transform duration-normal
                          shadow-glow-md">
              <Play size={32} className="text-brand-red-secondary ml-1" fill="currentColor" />
            </div>
          </div>
          
          {/* Founder Labels */}
          <div className="story__founder story__founder--left absolute bottom-6 left-6 text-left
                        bg-black/40 backdrop-blur-sm px-4 py-2 rounded-soft">
            <p className="story__founder-name text-lg md:text-xl font-bold mb-0.5">Andrea Sreshta</p>
            <p className="story__founder-title text-xs md:text-sm text-white/90">Co-founder</p>
          </div>
          <div className="story__founder story__founder--right absolute bottom-6 right-6 text-right
                        bg-black/40 backdrop-blur-sm px-4 py-2 rounded-soft">
            <p className="story__founder-name text-lg md:text-xl font-bold mb-0.5">Anna Stork</p>
            <p className="story__founder-title text-xs md:text-sm text-white/90">Co-founder</p>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* WHO WE WORK WITH SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--partners py-20 px-6 md:px-8 bg-white text-center">
        {/* Section Label */}
        <p className="partners__label text-xs-caps text-gray-600 mb-10">
          WHO WE WORK WITH
        </p>
        
        {/* Partner Logos */}
        <div className="partners__logo-strip flex flex-wrap items-center justify-center gap-12 md:gap-16 max-w-[1000px] mx-auto mb-16">
          {partners.map((partner) => (
            <img 
              key={partner.name} 
              src={partner.logo} 
              alt={`${partner.name} logo`} 
              className="partners__logo h-8 object-contain opacity-50 grayscale 
                       hover:opacity-100 hover:grayscale-0
                       transition-all duration-normal" 
            />
          ))}
        </div>
        
        {/* Heading */}
        <h2 className="partners__heading text-3xl md:text-4xl lg:text-5xl 
                     font-heading font-bold text-gray-900 
                     max-w-3xl mx-auto mb-10 leading-tight">
          We're proud to be trusted by nonprofits operating in over 100 countries.
        </h2>
        
        {/* CTA Button */}
        <Link 
          to="/give-light" 
          className="partners__button inline-block 
                   bg-brand-red-secondary text-white 
                   font-bold text-sm px-10 py-3.5 rounded-soft
                   hover:bg-brand-red-dark 
                   active:scale-95
                   transition-all duration-fast
                   tracking-wide shadow-soft hover:shadow-glow-md
                   mb-16"
        >
          GET INVOLVED
        </Link>
        
        {/* World Map */}
        <div className="partners__map-wrapper max-w-3xl mx-auto">
          <img 
            src={worldMap} 
            alt="Map of countries where LuminAID partners operate" 
            className="partners__map w-full rounded-soft shadow-soft" 
          />
        </div>
      </section>

      <TrustBadges />

    </div>
  )
}

export default Home
