import { useState } from 'react'
import { Star, Truck, ThumbsUp, Shield } from 'lucide-react'

// ============================================================================
// CONSTANTS
// ============================================================================

const PRODUCT_IMAGES = [
  '/src/assets/images/products/0196-150_Max_QI_product_image.jpg',
  '/src/assets/images/products/0196-150_Max_QI_product_image.jpg',
  '/src/assets/images/products/0196-150_Max_QI_product_image.jpg',
  '/src/assets/images/products/0196-150_Max_QI_product_image.jpg',
]

const BUNDLE_INCLUDES = [
  '4 x SolarPal Titan 2-in-1 Power Lanterns'
]

const BESTSELLING_BUNDLES = [
  {
    id: 1,
    name: 'Titan 4-Pack',
    price: 290.99,
    originalPrice: 388.00,
    badge: 'BEST SELLER',
    quantity: 'x 4',
    image: '/src/assets/images/products/0196-150_Max_QI_product_image.jpg'
  },
  {
    id: 2,
    name: 'Solar String Light 4-Pack',
    price: 250.00,
    originalPrice: 300.00,
    badge: 'BEST SELLER',
    quantity: 'x 4',
    image: '/src/assets/images/products/StringLightatSunset.jpg'
  },
  {
    id: 3,
    name: 'SolarPal 5-Pack',
    price: 99.99,
    originalPrice: 150.00,
    badge: 'BEST SELLER',
    quantity: 'x 5',
    image: '/src/assets/images/products/0196-150_Max_QI_product_image.jpg'
  },
  {
    id: 4,
    name: 'Max 3-Pack',
    price: 165.99,
    originalPrice: 200.00,
    badge: 'BEST SELLER',
    quantity: 'x 3',
    image: '/src/assets/images/products/0196-150_Max_QI_product_image.jpg'
  }
]

const TESTIMONIAL = {
  rating: 5,
  text: "I love everything about this light. I bought these as gifts for all the members of my family last Christmas, and bought three more this year to make sure we had plenty around for hiking and emergency backpack use. Highly, highly recommend!",
  author: "Laura W."
}

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

const TitanBundle = () => {
  // State Management
  const [selectedImage, setSelectedImage] = useState(PRODUCT_IMAGES[0])

  return (
    <div className="titan-bundle w-full">
      
      {/* ============================================================================ */}
      {/* BREADCRUMB */}
      {/* ============================================================================ */}
      
      <section className="breadcrumb py-4 px-8 bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <nav className="breadcrumb__nav text-sm text-gray-600">
            <a href="/" className="hover:text-black">Home</a>
            <span className="mx-2">/</span>
            <span className="text-black">Titan 4-Pack</span>
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
                <div className="product-gallery__quantity absolute top-4 left-4 bg-white px-4 py-2 rounded shadow-md">
                  <span className="text-2xl font-bold text-black">x 4</span>
                </div>
                <img 
                  src={selectedImage} 
                  alt="Titan 4-Pack Bundle" 
                  className="w-full h-auto"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="product-gallery__thumbnails grid grid-cols-4 gap-3">
                {PRODUCT_IMAGES.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`product-gallery__thumbnail border-2 rounded overflow-hidden hover:border-primary-red transition-colors ${
                      selectedImage === img ? 'border-primary-red' : 'border-gray-300'
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
              <h1 className="product-info__title text-[36px] font-heading font-bold text-black mb-3">
                Titan 4-Pack
              </h1>

              {/* Price */}
              <div className="product-info__pricing flex items-center gap-3 mb-6">
                <span className="product-info__price text-[28px] font-bold text-primary-red">
                  $290.99 USD
                </span>
                <span className="product-info__original-price text-[20px] text-gray-500 line-through">
                  $388.00 USD
                </span>
                <span className="product-info__badge bg-primary-red text-white text-[11px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                  BEST SELLER
                </span>
              </div>

              {/* Add to Cart Button */}
              <button className="product-info__add-button w-full bg-primary-red text-white font-bold py-4 rounded hover:bg-dark-red transition-colors mb-6 text-[15px] tracking-wide shadow-md">
                Add to Cart
              </button>

              {/* Description */}
              <div className="product-info__description mb-6">
                <p className="text-[15px] text-gray-dark leading-relaxed mb-4">
                  For all adventurers: try night to try day. The Titan is our most popular 
                  product: 300 lumens of ultra-bright, inflatable like a roll light mode, 
                  and high efficiency solar power. Plus, a USB port for keeping your 
                  on-while modern art, and you can try roving with life on or off.
                </p>
              </div>

              {/* Bundle Includes */}
              <div className="product-info__includes mb-6">
                <h3 className="text-[15px] font-bold text-black mb-3">This Bundle Includes:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {BUNDLE_INCLUDES.map((item, index) => (
                    <li key={index} className="text-[14px] text-gray-dark">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Notice */}
              <div className="product-info__shipping bg-gray-light px-6 py-4 rounded text-center">
                <p className="text-[14px] font-bold text-black">
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
      
      <section className="section--testimonial py-16 px-8 bg-[#1a5742] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <p className="testimonial__label text-[12px] font-bold tracking-widest mb-6 uppercase">
            ACTUAL BUYER VERIFIED
          </p>

          {/* Stars */}
          <div className="testimonial__stars flex items-center justify-center gap-1 mb-6">
            {[...Array(TESTIMONIAL.rating)].map((_, i) => (
              <Star key={i} size={32} fill="#E8C441" stroke="#E8C441" />
            ))}
          </div>

          {/* Quote Mark */}
          <div className="testimonial__quote-mark text-[80px] font-serif text-white/30 leading-none mb-4">
            "
          </div>

          {/* Testimonial Text */}
          <p className="testimonial__text text-[20px] leading-relaxed mb-8">
            {TESTIMONIAL.text}
          </p>

          {/* Author */}
          <p className="testimonial__author text-[15px] font-medium">
            - {TESTIMONIAL.author}
          </p>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* BESTSELLING BUNDLES SECTION */}
      {/* ============================================================================ */}
      
      <section className="section--bestselling py-20 px-8 bg-white">
        <div className="max-w-[1280px] mx-auto">
          {/* Section Header */}
          <h2 className="bestselling__heading text-[32px] font-heading font-bold text-black text-center mb-14">
            Shop Bestselling Bundles
          </h2>

          {/* Bundle Grid */}
          <div className="bestselling__grid grid grid-cols-2 lg:grid-cols-4 gap-8">
            {BESTSELLING_BUNDLES.map((bundle) => (
              <div key={bundle.id} className="bundle-card group">
                {/* Image */}
                <div className="bundle-card__image-wrapper relative bg-gray-100 rounded-t overflow-hidden mb-4">
                  {bundle.badge && (
                    <span className="bundle-card__badge absolute top-3 left-3 bg-primary-red text-white text-[10px] font-bold px-2.5 py-1.5 rounded uppercase tracking-wide">
                      {bundle.badge}
                    </span>
                  )}
                  <div className="bundle-card__quantity absolute top-3 right-3 bg-white px-3 py-1 rounded shadow-sm">
                    <span className="text-sm font-bold text-black">{bundle.quantity}</span>
                  </div>
                  <img 
                    src={bundle.image} 
                    alt={bundle.name} 
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="bundle-card__content">
                  <h3 className="bundle-card__title text-[15px] font-bold text-black mb-2 group-hover:text-primary-red transition-colors">
                    {bundle.name}
                  </h3>
                  <div className="bundle-card__pricing flex items-center gap-2 mb-3">
                    <span className="bundle-card__price text-[15px] font-bold text-black">
                      ${bundle.price} USD
                    </span>
                    <span className="bundle-card__original-price text-[13px] text-gray-500 line-through">
                      ${bundle.originalPrice.toFixed(2)}
                    </span>
                  </div>
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

export default TitanBundle
