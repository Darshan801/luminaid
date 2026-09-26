import { useState } from 'react'
import { Star, Accessibility, Truck, ThumbsUp, Shield, Play, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import backgroundImage from '../../assets/images/background.webp?url'
import disasterResponseBg from '../../assets/images/Lumen_Rewards_Page.jpg?url'
// TODO: Add these images to src/assets/images/
// import storyVideoThumb from '../../assets/images/story-video-thumb.jpg?url'
// import worldMap from '../../assets/images/world-map.png?url'
const storyVideoThumb = 'https://via.placeholder.com/800x450/2b2b2b/ffffff?text=Add+story-video-thumb.jpg'
const worldMap = 'https://via.placeholder.com/800x400/f5f5f5/cccccc?text=Add+world-map.png'
import Card from '../../components/common/Card'
import { featuredProducts } from '../../data/products'
import { productTypes } from '../../data/categories'
import { testimonials } from '../../data/testimonials'
import { pressLogos } from '../../data/press'
import { partners } from '../../data/partners'
import { latestReviews } from '../../data/reviews'

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
        <p className="font-bold text-black text-[15px]">Free US Shipping $99+</p>
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

  // Give Light Images
  const giveLightImages = [
    '/src/assets/images/products/0196-150_Max_QI_product_image.jpg',
    '/src/assets/images/products/PLTNRProductImage_sizerelative_withphone_lightgraybackground.jpg',
    '/src/assets/images/products/StringLightatSunset.jpg',
    '/src/assets/images/products/Accessories.jpg',
    '/src/assets/images/products/SurvivorThumbnai.jpg',
    '/src/assets/images/products/0196-150_Max_QI_product_image.jpg',
  ]
  const [selectedGiveLightImage, setSelectedGiveLightImage] = useState(giveLightImages[0])

  // Reviews Carousel State
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const reviewsPerPage = 3

  // Handlers
  const handleNextReviews = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentReviewIndex((prev) =>
        prev + reviewsPerPage >= latestReviews.length ? 0 : prev + reviewsPerPage
      )
      setIsTransitioning(false)
    }, 300)
  }

  const handlePrevReviews = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentReviewIndex((prev) =>
        prev - reviewsPerPage < 0 ? Math.max(0, latestReviews.length - reviewsPerPage) : prev - reviewsPerPage
      )
      setIsTransitioning(false)
    }, 300)
  }

  // Computed Values
  const visibleReviews = latestReviews.slice(currentReviewIndex, currentReviewIndex + reviewsPerPage)
  const spotlightTestimonial = testimonials[0]

  return (
    <div className="w-full">{/* ============================================================================ */}
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
        <div className="hero__content-wrapper relative max-w-[1280px] w-full mx-auto px-8 py-16">
          <div className="hero__content-box bg-primary-orange max-w-[420px] px-12 py-14 space-y-5 text-center rounded-sm shadow-2xl ml-20">
            {/* Reviews Badge */}
            <div className="hero__reviews flex items-center justify-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#E8C441" stroke="#E8C441" />)}
              </div>
              <span className="text-[11px] font-bold text-white tracking-widest">10,000+ 5-STAR REVIEWS</span>
            </div>

            {/* Heading */}
            <h1 className="hero__heading text-[32px] font-heading font-bold text-white leading-tight">
              Gear Up for Adventure
            </h1>

            {/* Description */}
            <div className="hero__text text-white text-[15px] leading-7">
              <p>
                Light up fall nights with <a href="/collections/power-lanterns" className="underline underline-offset-2 hover:text-gray-100">Power Lanterns</a>,{' '}
                <a href="/products/solar-string-light" className="underline underline-offset-2 hover:text-gray-100">String Lights</a>, and{' '}
                <a href="/collections/accessories" className="underline underline-offset-2 hover:text-gray-100">Outdoor Gear</a>!
              </p>
            </div>

            {/* CTA Button */}
            <div className="hero__button-wrapper pt-3">
              <a 
                href="/collections/solar-lanterns" 
                className="inline-block bg-primary-red hover:bg-red-700 text-white font-bold px-7 py-3 text-xs tracking-widest transition-colors rounded shadow-lg"
              >
                SHOP BESTSELLERS
              </a>
            </div>
          </div>
        </div>

        {/* Accessibility Button */}
        <button 
          aria-label="Accessibility options" 
          className="accessibility-button fixed bottom-16 right-5 z-40 w-9 h-9 rounded-full bg-[#1e6fd9] text-white border-2 border-white ring-2 ring-[#1e6fd9] flex items-center justify-center hover:bg-[#1557b0] transition-colors"
        >
          <Accessibility size={20} />
        </button>
      </section>

      {/* ============================================================================ */}
      {/* PRESS QUOTE & LOGOS SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--press py-16 px-8 bg-gray-light text-center">
        <div className="max-w-[1280px] mx-auto">
          {/* Quote Block */}
          <div className="press__quote-block max-w-[900px] mx-auto mb-12">
            <p className="press__quote text-[15px] font-bold text-black tracking-wide mb-3 uppercase">
              "The combination of the phone charger and the lantern has been a lifesaver."
            </p>
            <p className="press__attribution text-[13px] text-gray-dark">
              — REI, <em>Best Camping Lanterns</em>
            </p>
          </div>

          {/* Logo Strip */}
          <div className="press__logo-strip flex flex-wrap items-center justify-center gap-20 max-w-[1100px] mx-auto">
            {pressLogos.map((press, index) => (
              <img 
                key={press.name} 
                src={press.logo} 
                alt={`${press.name} logo`} 
                className={`press__logo object-contain opacity-090 grayscale ${
                  index === 0 ? 'h-14' : 'h-11'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* TOP PICKS SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--top-picks py-20 px-8 bg-white">
        <div className="max-w-[1280px] mx-auto">
          {/* Section Header */}
          <h2 className="top-picks__heading text-[32px] font-heading font-bold text-black text-center mb-14">
            Our Top Picks for Fall
          </h2>

          {/* Product Grid */}
          <div className="top-picks__grid grid grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 4).map((product) => (
              <Card key={product.id} hoverable clickable padding="none" className="product-card group">
                {/* Product Image */}
                <div className="product-card__image-wrapper relative overflow-hidden bg-gray-100 rounded-t">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-card__image w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  {product.badge && (
                    <span className="product-card__badge absolute top-3 left-3 bg-primary-red text-white text-[10px] font-bold px-2.5 py-1.5 rounded uppercase tracking-wide">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="product-card__content p-5">
                  <h3 className="product-card__title text-[15px] font-bold text-black mb-2 group-hover:text-primary-red transition-colors">
                    {product.name}
                  </h3>
                  <p className="product-card__price text-[15px] text-gray-dark">
                    ${product.price} USD
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="top-picks__button-wrapper text-center mt-14">
            <a 
              href="/collections/gifts" 
              className="inline-flex items-center gap-2 bg-primary-red text-white font-bold px-10 py-4 rounded hover:bg-dark-red transition-colors shadow-md text-[13px] tracking-wide"
            >
              + Load More Products
            </a>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* ============================================================================ */}
      {/* SHOP BY PRODUCT TYPE SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--product-types py-20 px-8 bg-white">
        <div className="max-w-[1280px] mx-auto">
          {/* Section Header */}
          <h2 className="product-types__heading text-[36px] font-heading font-bold text-black text-center mb-16">
            Shop by Product Type
          </h2>

          {/* Product Type Grid - Centered */}
          <div className="product-types__grid flex flex-wrap items-start justify-center gap-10 max-w-[1100px] mx-auto">
            {productTypes.map((type) => (
              <div key={type.title} className="product-type text-center w-44">
                {/* Circle Image */}
                <a 
                  href={type.link} 
                  className="product-type__image-link block w-44 h-44 mx-auto mb-5 rounded-full overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={type.icon} 
                    alt={type.title} 
                    className="product-type__image w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  />
                </a>

                {/* Title */}
                <h3 className="product-type__title font-bold text-black text-[17px] mb-3">
                  {type.title}
                </h3>

                {/* Description */}
                <p className="product-type__description text-[14px] text-gray-dark leading-relaxed mb-5 px-2 min-h-[60px]">
                  {type.description}
                </p>

                {/* CTA Button */}
                <a 
                  href={type.link} 
                  className="product-type__button inline-block bg-primary-red text-white font-bold text-[13px] px-7 py-3 rounded hover:bg-dark-red transition-colors shadow-md tracking-wide"
                >
                  Shop Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* GIVE LIGHT BANNER SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--give-light-banner relative py-24 px-8 text-center text-white overflow-hidden">
        {/* Background Media */}
        <div className="give-light-banner__media-wrapper absolute inset-0">
          <img 
            src={disasterResponseBg} 
            alt="Volunteers helping disaster relief families" 
            className="give-light-banner__image w-full h-full object-cover" 
          />
          <div className="give-light-banner__overlay absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="give-light-banner__content relative max-w-4xl mx-auto">
          <p className="give-light-banner__label text-xs font-bold tracking-widest mb-4">
            GIVE LIGHT, GET LIGHT
          </p>
          <h2 className="give-light-banner__heading text-[48px] font-heading font-bold mb-8 leading-tight">
            Support Disaster Response
          </h2>
          <p className="give-light-banner__text text-[17px] leading-relaxed mb-6">
            We work with our nonprofit partners to provide <strong>safe light and power to families impacted by natural disasters</strong>. 
            Recent responses have included the LA Wildfires, Hurricane Helene in North Carolina, and Hurricane Milton in Florida.
          </p>
          <p className="give-light-banner__text text-[17px] leading-relaxed mb-10">
            Help us provide solar lanterns and phone chargers with a Give Light sponsorship:
          </p>
          <a 
            href="/products/give-light" 
            className="give-light-banner__button inline-block bg-white text-black font-bold px-10 py-4 rounded hover:bg-gray-200 transition-colors shadow-lg text-[13px] tracking-wide"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* GIVE LIGHT PRODUCT WIDGET SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--give-light-product py-20 px-8 bg-white">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Product Gallery */}
          <div className="product-widget__gallery">
            {/* Main Image */}
            <div className="product-widget__main-image mb-5 bg-gray-100 rounded-sm overflow-hidden shadow-md">
              <img 
                src={selectedGiveLightImage} 
                alt="Give Light donation product" 
                className="w-full h-auto"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="product-widget__thumbnails grid grid-cols-6 gap-3">
              {giveLightImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedGiveLightImage(img)}
                  className={`product-widget__thumbnail border-2 rounded overflow-hidden hover:border-primary-red transition-colors ${
                    selectedGiveLightImage === img ? 'border-primary-red' : 'border-gray-300'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Give Light option ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-widget__details">
            <h3 className="product-widget__title text-[34px] font-heading font-bold text-black mb-3">
              Give Light
            </h3>
            <p className="product-widget__price text-[26px] text-black mb-8">
              ${amount.toFixed(2)} USD
            </p>

            {/* Cause Selector */}
            <div className="product-widget__form-group mb-5">
              <label className="product-widget__label block text-[15px] font-bold text-black mb-3">
                Cause:
              </label>
              <select
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                className="product-widget__select w-full border border-gray-300 rounded px-4 py-3 text-[15px] focus:border-primary-red focus:outline-none"
              >
                {CAUSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Amount Selector */}
            <div className="product-widget__form-group mb-8">
              <label className="product-widget__label block text-[15px] font-bold text-black mb-3">
                Amount:
              </label>
              <select
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="product-widget__select w-full border border-gray-300 rounded px-4 py-3 text-[15px] focus:border-primary-red focus:outline-none"
              >
                {AMOUNTS.map((a) => <option key={a} value={a}>${a}</option>)}
              </select>
            </div>

            {/* Add to Cart Button */}
            <button className="product-widget__add-button w-full bg-primary-red text-white font-bold py-4 rounded hover:bg-dark-red transition-colors mb-5 text-[14px] tracking-wide shadow-md">
              Add to Cart
            </button>

            {/* Help Link */}
            <p className="product-widget__help-link text-[14px] text-gray-medium mb-6">
              <a href="/pages/faq" className="underline hover:text-black">Need help?</a>
            </p>

            {/* Accordion */}
            <div className="product-widget__accordion divide-y divide-gray-200 border-t border-gray-200">
              {HELP_ITEMS.map((item, i) => (
                <div key={item.title} className="product-widget__accordion-item">
                  <button
                    onClick={() => setOpenHelp(openHelp === i ? null : i)}
                    className="product-widget__accordion-button w-full flex items-center justify-between py-4 text-left font-bold text-black text-[15px] hover:text-primary-red transition-colors"
                  >
                    {item.title}
                    <ChevronDown 
                      size={20} 
                      className={`transition-transform ${openHelp === i ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {openHelp === i && (
                    <p className="product-widget__accordion-content pb-5 text-[14px] text-gray-dark leading-relaxed">
                      {item.body}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Shipping Notice */}
            <p className="product-widget__shipping-notice text-[14px] font-bold text-center text-black mt-8 pt-8 border-t border-gray-200">
              FREE U.S. Shipping over $99!
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* REVIEWS SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--reviews pt-16 pb-10 px-8 bg-white">
        <div className="max-w-[1280px] mx-auto">
          
          {/* Reviews Heading */}
          <div className="reviews__header flex items-center justify-center gap-2 mb-10">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={32} fill="#E8C441" stroke="#E8C441" />)}
            </div>
            <h2 className="reviews__heading text-4xl font-heading font-bold text-black ml-2">
              10,000+ 5-Star Reviews
            </h2>
          </div>

          {/* Testimonial Spotlight */}
          {spotlightTestimonial && (
            <div className="reviews__spotlight max-w-6xl mx-auto mb-20">
              <div className="grid grid-cols-1 md:grid-cols-[330px_1fr] gap-8 items-stretch">
                {/* Image */}
                <div className="spotlight__image-wrapper">
                  <img 
                    src={spotlightTestimonial.image} 
                    alt="" 
                    className="spotlight__image w-full h-full object-cover rounded-sm" 
                  />
                </div>

                {/* Quote Content */}
                <div className="spotlight__content bg-gray-light px-12 py-10 flex flex-col justify-center rounded-sm">
                  <div className="spotlight__quote-mark text-[80px] font-serif text-gray-300 leading-none mb-4">
                    "
                  </div>
                  <p className="spotlight__text text-[19px] text-black leading-relaxed font-medium mb-6">
                    {spotlightTestimonial.text}
                  </p>
                  <p className="spotlight__author text-[14px] text-gray-600">
                    - {spotlightTestimonial.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Latest Reviews Carousel */}
          <div className="reviews__carousel border-t border-b border-gray-200 py-8">
            {/* Carousel Header */}
            <div className="reviews__carousel-header flex items-center justify-between mb-8">
              <h3 className="reviews__carousel-title text-2xl font-bold text-black">
                Latest Reviews
              </h3>
              <div className="reviews__carousel-controls flex items-center gap-4">
                <span className="reviews__count flex items-center gap-1 text-sm text-black">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#E8C441" stroke="#E8C441" />)}
                  </div>
                  <span className="font-bold ml-1">5426 Reviews</span>
                </span>
                <div className="flex gap-1">
                  <button 
                    onClick={handlePrevReviews}
                    aria-label="Previous reviews" 
                    className="reviews__nav-button p-1.5 border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={handleNextReviews}
                    aria-label="Next reviews" 
                    className="reviews__nav-button p-1.5 border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Review Cards */}
            <div className="reviews__cards-wrapper relative overflow-hidden">
              <div 
                className={`reviews__cards-grid grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out ${
                  isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                }`}
              >
                {visibleReviews.map((review) => (
                  <div key={review.id} className="review-card bg-white">
                    {/* Rating & Date */}
                    <div className="review-card__header flex items-center justify-between mb-3">
                      <div className="review-card__rating flex gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#E8C441" stroke="#E8C441" />
                        ))}
                      </div>
                      <span className="review-card__date text-xs text-gray-400">
                        {review.date}
                      </span>
                    </div>
                    
                    {/* Review Text */}
                    <p className="review-card__text text-sm text-gray-700 leading-relaxed mb-4 min-h-[80px]">
                      {review.text}
                    </p>
                    
                    {/* Product & Author */}
                    <div className="review-card__footer flex items-start gap-3 pt-3 border-t border-gray-100">
                      <img 
                        src={review.productImage} 
                        alt={review.product} 
                        className="review-card__product-image w-16 h-16 object-cover bg-gray-100 flex-shrink-0" 
                      />
                      <div className="review-card__meta">
                        <p className="review-card__author text-sm font-bold text-black mb-0.5">
                          {review.author}
                        </p>
                        <p className="review-card__product text-xs text-gray-500">
                          {review.product}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* LUMINAID STORY SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--story py-20 px-8 bg-primary-red text-center text-white">
        <p className="story__label text-xs font-bold tracking-widest mb-6">
          THE LUMINAID STORY
        </p>
        <h2 className="story__heading text-5xl font-heading font-bold mb-12 max-w-4xl mx-auto leading-tight">
          Our Mission is to Make Safe, Sustainable Light Available to All
        </h2>
        
        {/* Video Player */}
        <div className="story__video-wrapper relative max-w-3xl mx-auto rounded-sm overflow-hidden cursor-pointer group shadow-2xl">
          <img 
            src={storyVideoThumb} 
            alt="LuminAID founders Andrea Sreshta and Anna Stork" 
            className="story__video-thumbnail w-full object-cover" 
          />
          <div className="story__video-overlay absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="story__play-button w-20 h-20 rounded-full bg-primary-red/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Play size={32} className="text-white ml-1" fill="white" />
            </div>
          </div>
          
          {/* Founder Labels */}
          <div className="story__founder story__founder--left absolute bottom-6 left-6 text-left">
            <p className="story__founder-name text-xl font-bold mb-1">Andrea Sreshta</p>
            <p className="story__founder-title text-sm">Co-founder</p>
          </div>
          <div className="story__founder story__founder--right absolute bottom-6 right-6 text-right">
            <p className="story__founder-name text-xl font-bold mb-1">Anna Stork</p>
            <p className="story__founder-title text-sm">Co-founder</p>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* WHO WE WORK WITH SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--partners py-16 px-8 bg-white text-center">
        <p className="partners__label text-xs font-bold tracking-widest text-black mb-10">
          WHO WE WORK WITH
        </p>
        
        {/* Partner Logos */}
        <div className="partners__logo-strip flex flex-wrap items-center justify-center gap-16 max-w-[1000px] mx-auto mb-16">
          {partners.map((partner) => (
            <img 
              key={partner.name} 
              src={partner.logo} 
              alt={`${partner.name} logo`} 
              className="partners__logo h-8 object-contain opacity-60 grayscale" 
            />
          ))}
        </div>
        
        {/* Heading */}
        <h2 className="partners__heading text-4xl font-heading font-bold text-black max-w-3xl mx-auto mb-10 leading-tight">
          We're proud to be trusted by nonprofits operating in over 100 countries.
        </h2>
        
        {/* CTA Button */}
        <a 
          href="/pages/give-light" 
          className="partners__button inline-block bg-primary-red text-white font-bold text-sm px-10 py-3.5 rounded hover:bg-dark-red transition-colors mb-16 tracking-wide"
        >
          GET INVOLVED
        </a>
        
        {/* World Map */}
        <div className="partners__map-wrapper max-w-3xl mx-auto">
          <img 
            src={worldMap} 
            alt="Map of countries where LuminAID partners operate" 
            className="partners__map w-full" 
          />
        </div>
      </section>

      <TrustBadges />

    </div>
  )
}

export default Home
