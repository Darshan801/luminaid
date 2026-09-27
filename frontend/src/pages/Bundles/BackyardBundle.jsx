import { useState } from 'react'
import { Star, Truck, ThumbsUp, Shield } from 'lucide-react'

// ============================================================================
// CONSTANTS
// ============================================================================

const PRODUCT_IMAGES = [
  '/src/assets/images/products/StringLightatSunset.jpg',
  '/src/assets/images/products/0196-150_Max_QI_product_image.jpg',
  '/src/assets/images/products/StringLightatSunset.jpg',
  '/src/assets/images/products/0196-150_Max_QI_product_image.jpg',
  '/src/assets/images/products/StringLightatSunset.jpg',
  '/src/assets/images/products/0196-150_Max_QI_product_image.jpg',
]

const BUNDLE_INCLUDES = [
  '1 x Solar String Light - Warm White',
  '4 x Solar String Light - Multi Color',
  '1x Trio Magnetic Light System'
]

const TESTIMONIAL = {
  rating: 5,
  text: "I love everything about the light. I bought these as gifts for all the members of my family last Christmas, and bought three more this year to make sure we had plenty around for fishing and for emergency back ups use. Highly, highly recommend!",
  author: "Laura W."
}

const BESTSELLING_BUNDLES = [
  {
    id: 1,
    name: 'Titan 4-Pack',
    price: 299.99,
    originalPrice: 350.00,
    badge: 'BEST SELLER',
    image: '/src/assets/images/products/0196-150_Max_QI_product_image.jpg'
  },
  {
    id: 2,
    name: 'Solar String Light 4-Pack',
    price: 283.00,
    originalPrice: 340.00,
    badge: 'BEST SELLER',
    image: '/src/assets/images/products/StringLightatSunset.jpg'
  },
  {
    id: 3,
    name: 'Survivor 2-Pack',
    price: 204.99,
    originalPrice: 240.00,
    badge: 'BEST SELLER',
    image: '/src/assets/images/products/SurvivorThumbnai.jpg'
  },
  {
    id: 4,
    name: 'Max 3-Pack',
    price: 185.50,
    originalPrice: 210.00,
    badge: 'BEST SELLER',
    image: '/src/assets/images/products/0196-150_Max_QI_product_image.jpg'
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

const BackyardBundle = () => {
  // State Management
  const [selectedImage, setSelectedImage] = useState(PRODUCT_IMAGES[0])

  return (
    <div className="backyard-bundle w-full">
      
      {/* ============================================================================ */}
      {/* BREADCRUMB */}
      {/* ============================================================================ */}
      
      <section className="breadcrumb py-4 px-8 bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <nav className="breadcrumb__nav text-sm text-gray-600">
            <a href="/" className="hover:text-black">Home</a>
            <span className="mx-2">/</span>
            <span className="text-black">Backyard Bundle</span>
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
                  alt="Backyard Bundle" 
                  className="w-full h-auto"
                />
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
                Backyard Bundle
              </h1>

              {/* Price */}
              <div className="product-info__pricing flex items-center gap-3 mb-4">
                <span className="product-info__price text-[32px] font-bold text-primary-red">
                  $199.99 USD
                </span>
                <span className="product-info__original-price text-[20px] text-gray-500 line-through">
                  $287.00 USD
                </span>
                <span className="product-info__badge bg-primary-red text-white text-[11px] font-bold px-3 py-1 rounded uppercase tracking-wide">
                  SAVE $87.01
                </span>
              </div>

              {/* Add to Cart Button */}
              <button className="product-info__add-button w-full bg-primary-red text-white font-bold py-4 rounded hover:bg-dark-red transition-colors mb-6 text-[16px] tracking-wide shadow-md">
                Add to Cart
              </button>

              {/* Description */}
              <div className="product-info__description mb-6 pb-6 border-b border-gray-200">
                <p className="text-[15px] text-gray-dark leading-relaxed mb-4">
                  Light up your backyard with this set of our newest products! Covering 107 string lights will brighten any space, 
                  and you can stick the magnets: the mini lanterns wherever you need some extra light. Packing power and flexibility, 
                  the Trio lanterns do three-fold use (inside for some extra ambiance.
                </p>
              </div>

              {/* Bundle Includes */}
              <div className="product-info__includes mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-[15px] font-bold text-black mb-3">This Bundle Includes:</h3>
                <ul className="space-y-2">
                  {BUNDLE_INCLUDES.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-[15px] text-gray-dark">
                      <span className="text-black mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="product-info__shipping">
                <p className="text-[15px] font-bold text-black">
                  FREE U.S. Shipping over $99!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* TESTIMONIAL SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--testimonial py-16 px-8 bg-[#0b5c3d] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <p className="testimonial__label text-[12px] font-bold tracking-widest mb-6 uppercase">
            10,000+ 5-STAR REVIEWS
          </p>

          {/* Stars */}
          <div className="testimonial__stars flex items-center justify-center gap-1 mb-6">
            {[...Array(TESTIMONIAL.rating)].map((_, i) => (
              <Star key={i} size={32} fill="#E8C441" stroke="#E8C441" />
            ))}
          </div>

          {/* Testimonial Text */}
          <p className="testimonial__text text-[20px] leading-relaxed mb-8">
            "{TESTIMONIAL.text}"
          </p>

          {/* Author */}
          <p className="testimonial__author text-[15px] font-medium">
            - {TESTIMONIAL.author}
          </p>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* SHOP BESTSELLING BUNDLES SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--bestselling py-20 px-8 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="bestselling__heading text-[32px] font-heading font-bold text-black text-center mb-14">
            Shop Bestselling Bundles
          </h2>

          <div className="bestselling__grid grid grid-cols-1 md:grid-cols-4 gap-8">
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

      <TrustBadges />

    </div>
  )
}

export default BackyardBundle
