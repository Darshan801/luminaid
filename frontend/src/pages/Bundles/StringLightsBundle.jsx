import { useState } from 'react'
import { Star, Truck, ThumbsUp, Shield, ChevronDown, Plus, Minus } from 'lucide-react'
import glowTimeImage from '../../assets/images/glow time.jpg?url'

// ============================================================================
// CONSTANTS
// ============================================================================

const PRODUCT_IMAGES = [
  '/src/assets/images/products/StringLightatSunset.jpg',
  '/src/assets/images/products/StringLightatSunset.jpg',
  '/src/assets/images/products/StringLightatSunset.jpg',
  '/src/assets/images/products/StringLightatSunset.jpg',
  '/src/assets/images/products/StringLightatSunset.jpg',
  '/src/assets/images/products/StringLightatSunset.jpg',
]

const BUNDLE_INCLUDES = [
  '4 x Solar String Lights (12 LEDs each)',
  'Warm white LED color',
  'Weather-resistant design',
  'No batteries or outlets needed'
]

const PRODUCT_FEATURES = [
  {
    title: '5+ Give Time',
    description: 'Compact design for easy storage',
    icon: '⏱️'
  },
  {
    title: '100% Solar Powered',
    description: 'Charges in direct sunlight',
    icon: '☀️'
  },
  {
    title: 'Waterproof',
    description: 'IP67 rated for outdoor use',
    icon: '💧'
  },
  {
    title: 'Easy to Hang',
    description: 'Built-in hanging loops',
    icon: '🔗'
  }
]

const TESTIMONIAL = {
  rating: 5,
  text: "These string lights are absolutely perfect! They create such a warm, cozy atmosphere on our patio. Love that they're solar powered so no hassle with cords or batteries.",
  author: "Jessica M."
}

const REVIEWS_DATA = [
  {
    id: 1,
    author: "Sue",
    avatar: "S",
    avatarColor: "bg-primary-red",
    verified: true,
    country: "Canada",
    countryFlag: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Canada_%28Pantone%29.svg",
    date: "04/08/2026",
    rating: 5,
    product: "NEW! Solar String Light",
    text: "Great solar product"
  },
  {
    id: 2,
    author: "Jessica",
    avatar: "J",
    avatarColor: "bg-blue-600",
    verified: true,
    country: "United States",
    countryFlag: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
    date: "03/15/2026",
    rating: 5,
    product: "NEW! Solar String Light",
    text: "Perfect for camping trips! The lights are bright, easy to set up, and last all night. Love that they're solar powered - no need to worry about batteries."
  },
  {
    id: 3,
    author: "Michael",
    avatar: "M",
    avatarColor: "bg-green-600",
    verified: true,
    country: "United States",
    countryFlag: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
    date: "02/28/2026",
    rating: 5,
    product: "NEW! Solar String Light",
    text: "Amazing ambiance for our backyard! These string lights transformed our outdoor space. Very well made and the solar charging works perfectly."
  }
]

const QUESTIONS_DATA = [
  {
    id: 1,
    author: "David",
    avatar: "D",
    avatarColor: "bg-purple-600",
    country: "United States",
    countryFlag: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
    date: "05/10/2026",
    question: "How long does it take to fully charge the string lights?",
    answer: "It typically takes 6-8 hours of direct sunlight to fully charge the solar panel. Once charged, the lights can run for 8-10 hours.",
    answeredBy: "LuminAID Team",
    answeredDate: "05/11/2026"
  },
  {
    id: 2,
    author: "Sarah",
    avatar: "S",
    avatarColor: "bg-pink-600",
    country: "Canada",
    countryFlag: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Canada_%28Pantone%29.svg",
    date: "04/22/2026",
    question: "Can these lights withstand rain and snow?",
    answer: "Yes! These string lights are IP67 rated, which means they are completely waterproof and can withstand rain, snow, and other weather conditions.",
    answeredBy: "LuminAID Team",
    answeredDate: "04/23/2026"
  },
  {
    id: 3,
    author: "Tom",
    avatar: "T",
    avatarColor: "bg-orange-600",
    country: "United States",
    countryFlag: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
    date: "03/30/2026",
    question: "What's the total length when all 4 strings are connected?",
    answer: "Each string is 12 feet long, so if you hang all 4 strings end-to-end, you would have approximately 48 feet of coverage. However, each string operates independently.",
    answeredBy: "LuminAID Team",
    answeredDate: "03/31/2026"
  }
]

const BESTSELLING_BUNDLES = [
  {
    id: 1,
    name: 'String Light 4-Pack',
    price: 250.00,
    originalPrice: 300.00,
    badge: 'BEST SELLER',
    image: '/src/assets/images/products/StringLightatSunset.jpg'
  },
  {
    id: 2,
    name: 'Titan 4-Pack',
    price: 290.99,
    originalPrice: 388.00,
    badge: 'BEST SELLER',
    image: '/src/assets/images/products/0196-150_Max_QI_product_image.jpg'
  },
  {
    id: 3,
    name: 'SolarPal 5-Pack',
    price: 99.99,
    originalPrice: 150.00,
    badge: 'BEST SELLER',
    image: '/src/assets/images/products/0196-150_Max_QI_product_image.jpg'
  }
]

const FAQ_ITEMS = [
  {
    question: 'How long do the lights last on a full charge?',
    answer: 'The solar string lights can last up to 8-10 hours on a full charge, depending on the amount of sunlight received during the day.'
  },
  {
    question: 'Are these lights weatherproof?',
    answer: 'Yes, these lights are IP67 rated, making them completely waterproof and weather-resistant for outdoor use in any condition.'
  },
  {
    question: 'How long is each string?',
    answer: 'Each string light is approximately 12 feet long with 12 LED bulbs evenly spaced along the string.'
  },
  {
    question: 'Can I connect multiple strings together?',
    answer: 'Each string operates independently. However, you can hang them end-to-end to create longer coverage areas.'
  },
  {
    question: 'What is the warranty?',
    answer: 'All LuminAID products come with a 1-year manufacturer warranty covering defects in materials and workmanship.'
  }
]

// ============================================================================
// TRUST BADGES COMPONENT
// ============================================================================

const TrustBadges = () => (
  <section className="trust-badges py-12 px-8 bg-gray-light">
    <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
      <div className="trust-badge flex flex-col items-center gap-3">
        <Truck size={36} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-[15px]">FREE U.S. SHIPPING $99+</p>
      </div>
      <div className="trust-badge flex flex-col items-center gap-3">
        <ThumbsUp size={36} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-[15px]">10,000+ REVIEWS</p>
      </div>
      <div className="trust-badge flex flex-col items-center gap-3">
        <Shield size={36} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-[15px]">OFF-GRID GUARANTEE</p>
      </div>
    </div>
  </section>
)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StringLightsBundle = () => {
  // State Management
  const [selectedImage, setSelectedImage] = useState(PRODUCT_IMAGES[0])
  const [quantity, setQuantity] = useState(1)
  const [openFaq, setOpenFaq] = useState(null)
  const [activeReviewTab, setActiveReviewTab] = useState('reviews') // 'reviews' or 'questions'
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  const basePrice = 250.00
  const totalPrice = (basePrice * quantity).toFixed(2)

  const handleIncrement = () => setQuantity(prev => prev + 1)
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  return (
    <div className="string-lights-bundle w-full">
      
      {/* ============================================================================ */}
      {/* BREADCRUMB */}
      {/* ============================================================================ */}
      
      <section className="breadcrumb py-4 px-8 bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <nav className="breadcrumb__nav text-sm text-gray-600">
            <a href="/" className="hover:text-black">Home</a>
            <span className="mx-2">/</span>
            <span className="text-black">Solar String Light 4-Pack</span>
          </nav>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* PRODUCT DETAILS SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--product-details py-12 px-8 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Product Gallery */}
            <div className="product-gallery">
              {/* Main Image */}
              <div className="product-gallery__main relative bg-gray-100 rounded-sm overflow-hidden mb-4">
                <img 
                  src={selectedImage} 
                  alt="Solar String Light 4-Pack Bundle" 
                  className="w-full h-auto"
                />
                {/* Zoom Button */}
                <button className="product-gallery__zoom absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              </div>

              {/* Thumbnail Gallery */}
              <div className="product-gallery__thumbnails grid grid-cols-6 gap-3">
                {PRODUCT_IMAGES.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`product-gallery__thumbnail border-2 rounded overflow-hidden hover:border-primary-red transition-colors ${
                      selectedImage === img ? 'border-black' : 'border-gray-300'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`View ${index + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              {/* Title */}
              <h1 className="product-info__title text-[40px] font-heading font-bold text-black mb-4 leading-tight">
                Solar String Light 4-Pack
              </h1>

              {/* Price */}
              <div className="product-info__pricing flex items-center gap-3 mb-4">
                <span className="product-info__price text-[32px] font-bold text-primary-red">
                  ${totalPrice} USD
                </span>
                <span className="product-info__original-price text-[20px] text-gray-500 line-through">
                  $300.00 USD
                </span>
                <span className="product-info__badge bg-primary-red text-white text-[11px] font-bold px-3 py-1 rounded uppercase tracking-wide">
                  SAVE $45.00
                </span>
              </div>

              {/* Reviews */}
              <div className="product-info__reviews flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#E8C441" stroke="#E8C441" />
                  ))}
                </div>
                <a href="#reviews" className="text-[14px] text-black underline hover:text-primary-red">
                  32 reviews
                </a>
              </div>

              {/* Color Selector */}
              <div className="product-info__color-selector mb-6">
                <label className="block text-[14px] font-bold text-black mb-3">
                  NEW! Solar String Light (Color): <span className="font-normal">Warm White</span>
                </label>
                <div className="flex gap-3">
                  <button className="color-option px-6 py-3 border-2 border-gray-300 rounded text-[14px] font-medium hover:border-black transition-colors">
                    NEW! Multi-Color
                  </button>
                  <button className="color-option px-6 py-3 border-2 border-black rounded text-[14px] font-bold bg-white transition-colors">
                    Warm White
                  </button>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="product-info__quantity mb-6">
                <label className="block text-[14px] font-bold text-black mb-3">Quantity:</label>
                <div className="flex items-center gap-0 border-2 border-gray-300 rounded w-fit">
                  <button
                    onClick={handleDecrement}
                    className="quantity-button w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-r border-gray-300"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="quantity-display text-lg font-bold text-black min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="quantity-button w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-l border-gray-300"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="product-info__add-button w-full bg-primary-red text-white font-bold py-4 rounded hover:bg-dark-red transition-colors mb-6 text-[16px] tracking-wide shadow-md">
                Add to Cart
              </button>

              {/* Description */}
              <div className="product-info__description mb-6 pb-6 border-b border-gray-200">
                <p className="text-[15px] text-gray-dark leading-relaxed">
                  Meet the newest addition to the LuminAID lineup: our solar string light 
                  that also does triple duty as a 300-lumen lantern and 2000mAh phone 
                  charger! With 32 feet of warm white LED bulbs, you can add a magical 
                  glow to your tent, RV, backyard, or bedroom.
                </p>
              </div>

              {/* Bundle Includes */}
              <div className="product-info__includes">
                <h3 className="text-[15px] font-bold text-black mb-3">This Bundle Includes:</h3>
                <ul className="space-y-2">
                  {BUNDLE_INCLUDES.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-[15px] text-gray-dark">
                      <span className="text-black mt-1">•</span>
                      <span>
                        {index === 0 ? (
                          <>
                            4 x <span className="font-bold text-black">Solar String Light</span>
                          </>
                        ) : (
                          item
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* IT'S GLOW TIME SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--glow-time relative py-20 px-8 text-white text-center overflow-hidden">
        {/* Background Image */}
        <div className="glow-time__background absolute inset-0">
          <img 
            src={glowTimeImage} 
            alt="String lights glowing at night" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="glow-time__content relative max-w-2xl mx-auto">
          <h2 className="glow-time__heading text-[48px] font-heading font-bold mb-12 leading-tight">
            It's Glow Time
          </h2>

          <ul className="glow-time__features space-y-4 text-[18px]">
            <li className="glow-time__feature">Extra-Long LED String Lights</li>
            <li className="glow-time__feature">Doubles as a Solar Lantern</li>
            <li className="glow-time__feature">Charges Your Phone</li>
            <li className="glow-time__feature">Easy to Charge via Solar Power or USB</li>
            <li className="glow-time__feature">Adjustable Brightness & Lighting Modes</li>
          </ul>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* FROM THE BACKYARD TO THE BACKCOUNTRY SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--lifestyle py-24 px-8 bg-white">
        <div className="max-w-[1280px] mx-auto">
          {/* Section Heading */}
          <h2 className="lifestyle__heading text-[52px] font-heading font-bold text-black text-center mb-16 leading-tight">
            From the Backyard to the Backcountry
          </h2>

          {/* Lifestyle Grid */}
          <div className="lifestyle__grid grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Image 1 - Extra Long */}
            <div className="lifestyle-card group">
              <div className="lifestyle-card__image-wrapper relative overflow-hidden rounded-sm mb-5 aspect-square bg-gray-900">
                <img 
                  src={PRODUCT_IMAGES[0]} 
                  alt="Extra Long string lights" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="lifestyle-card__title text-[18px] font-bold text-black text-center leading-snug">
                Extra Long
              </h3>
            </div>

            {/* Image 2 - Charges Your Phone */}
            <div className="lifestyle-card group">
              <div className="lifestyle-card__image-wrapper relative overflow-hidden rounded-sm mb-5 aspect-square bg-gray-900">
                <img 
                  src={PRODUCT_IMAGES[1]} 
                  alt="Charges Your Phone" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="lifestyle-card__title text-[18px] font-bold text-black text-center leading-snug">
                Charges Your Phone
              </h3>
            </div>

            {/* Image 3 - Ready for Camping */}
            <div className="lifestyle-card group">
              <div className="lifestyle-card__image-wrapper relative overflow-hidden rounded-sm mb-5 aspect-square bg-gray-900">
                <img 
                  src={PRODUCT_IMAGES[2]} 
                  alt="Ready for Camping" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="lifestyle-card__title text-[18px] font-bold text-black text-center leading-snug">
                Ready for Camping
              </h3>
            </div>

            {/* Image 4 - Bright Enough to Read By */}
            <div className="lifestyle-card group">
              <div className="lifestyle-card__image-wrapper relative overflow-hidden rounded-sm mb-5 aspect-square bg-gray-900">
                <img 
                  src={PRODUCT_IMAGES[3]} 
                  alt="Bright Enough to Read By" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="lifestyle-card__title text-[18px] font-bold text-black text-center leading-snug">
                Bright Enough to Read By
              </h3>
            </div>

            {/* Image 5 - Perfect for Cozy Nights In */}
            <div className="lifestyle-card group">
              <div className="lifestyle-card__image-wrapper relative overflow-hidden rounded-sm mb-5 aspect-square bg-gray-900">
                <img 
                  src={PRODUCT_IMAGES[4]} 
                  alt="Perfect for Cozy Nights In" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Arrow Navigation Button */}
                <button className="lifestyle-card__nav absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              <h3 className="lifestyle-card__title text-[18px] font-bold text-black text-center leading-snug">
                Perfect for Cozy Nights In
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* BUNDLE AND SAVE SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--bestselling py-20 px-8 bg-gray-light">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="bestselling__heading text-[32px] font-heading font-bold text-black text-center mb-14">
            Bundle and Save
          </h2>

          <div className="bestselling__grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {BESTSELLING_BUNDLES.map((bundle) => (
              <div key={bundle.id} className="bundle-card group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="bundle-card__image-wrapper relative bg-gray-100">
                  {bundle.badge && (
                    <span className="bundle-card__badge absolute top-3 left-3 bg-primary-red text-white text-[10px] font-bold px-2.5 py-1.5 rounded uppercase tracking-wide z-10">
                      {bundle.badge}
                    </span>
                  )}
                  <img 
                    src={bundle.image} 
                    alt={bundle.name} 
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="bundle-card__content p-5">
                  <h3 className="bundle-card__title text-[16px] font-bold text-black mb-3">
                    {bundle.name}
                  </h3>
                  <div className="bundle-card__pricing flex items-center gap-2 mb-4">
                    <span className="bundle-card__price text-[18px] font-bold text-primary-red">
                      ${bundle.price} USD
                    </span>
                    <span className="bundle-card__original-price text-[14px] text-gray-500 line-through">
                      ${bundle.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <button className="bundle-card__button w-full bg-primary-red text-white font-bold py-3 rounded hover:bg-dark-red transition-colors text-[13px]">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* CUSTOMER REVIEWS SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--reviews py-20 px-8 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="reviews__heading text-[32px] font-heading font-bold text-black mb-10">
            Customer Reviews
          </h2>

          {/* Reviews Summary */}
          <div className="reviews__summary grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 pb-12 border-b border-gray-200">
            
            {/* Left Side - Rating Statistics */}
            <div className="reviews__stats">
              {/* Overall Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="reviews__overall-rating bg-gray-600 text-white text-[28px] font-bold px-5 py-2 rounded">
                  4.9
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={24} fill="#E8C441" stroke="#E8C441" />
                  ))}
                </div>
              </div>

              <p className="reviews__total text-[15px] text-gray-dark mb-6">
                Based on 32 Reviews
              </p>

              {/* Rating Breakdown Bars */}
              <div className="reviews__breakdown space-y-2">
                {[
                  { stars: 5, count: 31, percentage: 97 },
                  { stars: 4, count: 0, percentage: 0 },
                  { stars: 3, count: 1, percentage: 3 },
                  { stars: 2, count: 0, percentage: 0 },
                  { stars: 1, count: 0, percentage: 0 },
                ].map((item) => (
                  <div key={item.stars} className="flex items-center gap-3 text-[14px]">
                    <span className="w-8 text-gray-dark">{item.stars} ★</span>
                    <div className="flex-1 h-5 bg-gray-200 rounded-sm overflow-hidden">
                      <div 
                        className="h-full bg-primary-red"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-gray-dark">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Customer Photos */}
            <div className="reviews__photos">
              <div className="grid grid-cols-4 gap-3">
                {PRODUCT_IMAGES.slice(0, 4).map((img, index) => (
                  <div key={index} className="reviews__photo aspect-square rounded overflow-hidden bg-gray-100">
                    <img 
                      src={img} 
                      alt={`Customer photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Tabs and Actions */}
          <div className="reviews__tabs-header flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <div className="reviews__tabs flex gap-8">
              <button 
                onClick={() => setActiveReviewTab('reviews')}
                className={`reviews__tab text-[16px] font-bold pb-2 transition-colors ${
                  activeReviewTab === 'reviews' 
                    ? 'text-black border-b-3 border-primary-red' 
                    : 'text-gray-dark hover:text-black'
                }`}
              >
                Reviews <span className={activeReviewTab === 'reviews' ? 'text-gray-500' : ''}>32</span>
              </button>
              <button 
                onClick={() => setActiveReviewTab('questions')}
                className={`reviews__tab text-[16px] font-bold pb-2 transition-colors ${
                  activeReviewTab === 'questions' 
                    ? 'text-black border-b-3 border-primary-red' 
                    : 'text-gray-dark hover:text-black'
                }`}
              >
                Questions <span className={activeReviewTab === 'questions' ? 'text-gray-500' : ''}>24</span>
              </button>
            </div>

            <div className="reviews__actions flex gap-3">
              <button 
                onClick={() => setShowQuestionModal(true)}
                className="reviews__action-button flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded text-[14px] font-medium hover:border-black transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4M12 8h.01"/>
                </svg>
                Ask a Question
              </button>
              <button 
                onClick={() => setShowReviewModal(true)}
                className="reviews__action-button flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded text-[14px] font-medium hover:border-black transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Write a Review
              </button>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="reviews__filter flex items-center gap-3 mb-8">
            <span className="text-[15px] font-medium text-gray-dark">
              {activeReviewTab === 'reviews' ? 'Filter Reviews:' : 'Filter Questions:'}
            </span>
            <select className="reviews__filter-select px-4 py-2 border-2 border-gray-300 rounded text-[14px] font-medium bg-white hover:border-black transition-colors cursor-pointer">
              <option>Most Recent</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
              <option>Most Helpful</option>
            </select>
          </div>

          {/* Reviews Content */}
          {activeReviewTab === 'reviews' && (
            <div className="reviews__list space-y-6">
              {REVIEWS_DATA.map((review) => (
                <div key={review.id} className="review-card border-b border-gray-200 pb-8">
                  <div className="review-card__header flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`review-card__avatar w-12 h-12 rounded-full ${review.avatarColor} text-white flex items-center justify-center font-bold text-[18px]`}>
                        {review.avatar}
                      </div>
                      
                      {/* User Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="review-card__author text-[15px] font-bold text-black">{review.author}</span>
                          {review.verified && (
                            <span className="review-card__verified text-[13px] text-gray-500">Verified by shop</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <img 
                            src={review.countryFlag} 
                            alt={review.country} 
                            className="w-5 h-3"
                          />
                          <span className="text-[13px] text-gray-500">{review.country}</span>
                        </div>
                      </div>
                    </div>

                    <span className="review-card__date text-[13px] text-gray-500">{review.date}</span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={20} fill="#E8C441" stroke="#E8C441" />
                    ))}
                  </div>

                  {/* Review Content */}
                  <div className="review-card__content">
                    <p className="review-card__title text-[15px] font-bold text-black mb-2">
                      Reviewing:
                    </p>
                    <p className="review-card__product text-[14px] text-gray-dark mb-3">
                      {review.product}
                    </p>
                    <p className="review-card__text text-[15px] text-gray-dark leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Questions Content */}
          {activeReviewTab === 'questions' && (
            <div className="questions__list space-y-6">
              {QUESTIONS_DATA.map((question) => (
                <div key={question.id} className="question-card border-b border-gray-200 pb-8">
                  <div className="question-card__header flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`question-card__avatar w-12 h-12 rounded-full ${question.avatarColor} text-white flex items-center justify-center font-bold text-[18px]`}>
                        {question.avatar}
                      </div>
                      
                      {/* User Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="question-card__author text-[15px] font-bold text-black">{question.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img 
                            src={question.countryFlag} 
                            alt={question.country} 
                            className="w-5 h-3"
                          />
                          <span className="text-[13px] text-gray-500">{question.country}</span>
                        </div>
                      </div>
                    </div>

                    <span className="question-card__date text-[13px] text-gray-500">{question.date}</span>
                  </div>

                  {/* Question */}
                  <div className="question-card__content mb-4">
                    <p className="question-card__question text-[15px] font-bold text-black mb-4">
                      Q: {question.question}
                    </p>
                    
                    {/* Answer */}
                    {question.answer && (
                      <div className="question-card__answer bg-gray-50 border-l-4 border-primary-red p-4 rounded-r">
                        <p className="text-[15px] text-gray-dark leading-relaxed mb-3">
                          A: {question.answer}
                        </p>
                        <p className="text-[13px] text-gray-500">
                          Answered by <span className="font-bold text-black">{question.answeredBy}</span> on {question.answeredDate}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          <div className="reviews__load-more text-center mt-10">
            <button className="px-8 py-3 border-2 border-gray-300 rounded text-[14px] font-bold hover:border-black transition-colors">
              {activeReviewTab === 'reviews' ? 'Load More Reviews' : 'Load More Questions'}
            </button>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* ============================================================================ */}
      {/* ASK A QUESTION MODAL */}
      {/* ============================================================================ */}
      
      {showQuestionModal && (
        <div className="modal-overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="modal-content bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="modal-header flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-[24px] font-heading font-bold text-black">Ask a Question</h3>
              <button 
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form className="modal-body p-6 space-y-5">
              <div>
                <label className="block text-[14px] font-bold text-black mb-2">
                  Name <span className="text-primary-red">*</span>
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded text-[15px] focus:border-black focus:outline-none transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-black mb-2">
                  Email <span className="text-primary-red">*</span>
                </label>
                <input 
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded text-[15px] focus:border-black focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-black mb-2">
                  Question <span className="text-primary-red">*</span>
                </label>
                <textarea 
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded text-[15px] focus:border-black focus:outline-none transition-colors resize-none"
                  placeholder="What would you like to know about this product?"
                  required
                />
              </div>

              <div className="flex items-start gap-2">
                <input 
                  type="checkbox"
                  id="question-notify"
                  className="mt-1 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="question-notify" className="text-[14px] text-gray-dark cursor-pointer">
                  Notify me when someone answers my question
                </label>
              </div>

              <div className="modal-footer flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded text-[15px] font-bold hover:border-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-red text-white rounded text-[15px] font-bold hover:bg-dark-red transition-colors"
                >
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================================ */}
      {/* WRITE A REVIEW MODAL */}
      {/* ============================================================================ */}
      
      {showReviewModal && (
        <div className="modal-overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="modal-content bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="modal-header flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-[24px] font-heading font-bold text-black">Write a Review</h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form className="modal-body p-6 space-y-5">
              <div>
                <label className="block text-[14px] font-bold text-black mb-2">
                  Name <span className="text-primary-red">*</span>
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded text-[15px] focus:border-black focus:outline-none transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-black mb-2">
                  Email <span className="text-primary-red">*</span>
                </label>
                <input 
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded text-[15px] focus:border-black focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-black mb-3">
                  Rating <span className="text-primary-red">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className="hover:scale-110 transition-transform"
                    >
                      <Star size={32} className="text-gray-300 hover:fill-yellow-400 hover:text-yellow-400 cursor-pointer" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-black mb-2">
                  Review Title <span className="text-primary-red">*</span>
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded text-[15px] focus:border-black focus:outline-none transition-colors"
                  placeholder="Give your review a title"
                  required
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-black mb-2">
                  Review <span className="text-primary-red">*</span>
                </label>
                <textarea 
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded text-[15px] focus:border-black focus:outline-none transition-colors resize-none"
                  placeholder="Share your experience with this product"
                  required
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-black mb-2">
                  Upload Photos (Optional)
                </label>
                <input 
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded text-[15px] focus:border-black focus:outline-none transition-colors cursor-pointer"
                />
                <p className="text-[13px] text-gray-500 mt-2">You can upload up to 5 photos</p>
              </div>

              <div className="flex items-start gap-2">
                <input 
                  type="checkbox"
                  id="review-recommend"
                  className="mt-1 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="review-recommend" className="text-[14px] text-gray-dark cursor-pointer">
                  I would recommend this product to a friend
                </label>
              </div>

              <div className="modal-footer flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded text-[15px] font-bold hover:border-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-red text-white rounded text-[15px] font-bold hover:bg-dark-red transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default StringLightsBundle
