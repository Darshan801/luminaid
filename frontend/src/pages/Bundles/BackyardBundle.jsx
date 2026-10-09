import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, Truck, ThumbsUp, Shield, Loader } from 'lucide-react'
import { getProductsByCategory } from '../../services/productService'
import { useCart } from '../../hooks/useCart'
import { formatCurrency } from '../../utils/format'

// ============================================================================
// CONSTANTS
// ============================================================================

const TESTIMONIAL = {
  rating: 5,
  text: "I love everything about the light. I bought these as gifts for all the members of my family last Christmas, and bought three more this year to make sure we had plenty around for fishing and for emergency back ups use. Highly, highly recommend!",
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
        <p className="trust-badge__text font-bold text-black text-[15px]">FREE U.S. SHIPPING RS 99+</p>
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
  const navigate = useNavigate()
  const { addToCart, loading: cartLoading } = useCart()

  // State Management
  const [bundleProduct, setBundleProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)

  // Fetch Backyard bundle
  useEffect(() => {
    const fetchBackyardBundle = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch Bundles category
        const response = await getProductsByCategory('Bundles', { 
          limit: 20 
        })
        
        const products = response.data || []

        // Find Backyard bundle product
        const backyardProduct = products.find(p => 
          p.name.toLowerCase().includes('backyard')
        ) || products[0]

        if (backyardProduct) {
          setBundleProduct(backyardProduct)
          setSelectedImage(backyardProduct.images?.[0]?.url || '/images/products/StringLightatSunset.jpg')
          
          // Set related bundles
          const related = products.filter(p => p._id !== backyardProduct._id).slice(0, 4)
          setRelatedProducts(related)
        } else {
          setError('No Backyard products found in database')
        }
      } catch (err) {
        console.error('Error fetching Backyard bundle:', err)
        setError(err.message || 'Failed to load bundle')
      } finally {
        setLoading(false)
      }
    }

    fetchBackyardBundle()
  }, [])

  // Handle add to cart
  const handleAddToCart = async (productId, productName) => {
    if (!productId) {
      alert('Product ID not found. Please refresh the page.')
      return
    }

    try {
      setAddingToCart(true)
      const result = await addToCart(productId, 1)
      
      if (result.success) {
        alert(`Added ${productName || 'product'} to cart!`)
      } else {
        alert(result.error || 'Failed to add to cart')
      }
    } catch (err) {
      console.error('Add to cart error:', err)
      alert('Failed to add to cart. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  // Handle product click
  const handleProductClick = (product) => {
    navigate(`/products/${product.slug}`)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-12 w-12 text-primary-red" />
      </div>
    )
  }

  // If no bundle product found, show error
  if (!bundleProduct && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-black mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            No Backyard products found in the database. Please add products to continue.
          </p>
          <Link to="/products" className="text-primary-red underline">
            Browse All Products
          </Link>
        </div>
      </div>
    )
  }

  const displayProduct = bundleProduct

  // Set selected image if not already set
  const currentImage = selectedImage || displayProduct?.images?.[0]?.url || '/images/products/StringLightatSunset.jpg'

  return (
    <div className="backyard-bundle w-full">
      
      {/* ============================================================================ */}
      {/* BREADCRUMB */}
      {/* ============================================================================ */}
      
      <section className="breadcrumb py-4 px-8 bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <nav className="breadcrumb__nav text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
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
                  src={currentImage} 
                  alt={displayProduct.name} 
                  className="w-full h-auto"
                />
              </div>

              {/* Thumbnail Gallery */}
              {displayProduct.images?.length > 1 && (
                <div className="product-gallery__thumbnails grid grid-cols-6 gap-3">
                  {displayProduct.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img.url)}
                      className={`product-gallery__thumbnail border-2 rounded overflow-hidden hover:border-primary-red transition-colors ${
                        currentImage === img.url ? 'border-black' : 'border-gray-300'
                      }`}
                    >
                      <img 
                        src={img.url} 
                        alt={img.altText || `View ${index + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              {/* Title */}
              <h1 className="product-info__title text-[40px] font-heading font-bold text-black mb-4 leading-tight">
                {displayProduct.name}
              </h1>

              {/* Rating */}
              {displayProduct.rating > 0 && (
                <div className="product-info__reviews flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < Math.floor(displayProduct.rating) ? "#E8C441" : "none"} 
                        stroke="#E8C441" 
                      />
                    ))}
                  </div>
                  <span className="text-[14px] text-gray-600">
                    {displayProduct.rating} ({displayProduct.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="product-info__pricing flex items-center gap-3 mb-4">
                <span className="product-info__price text-[32px] font-bold text-primary-red">
                  {formatCurrency(displayProduct.price)}
                </span>
                {displayProduct.compareAtPrice > displayProduct.price && (
                  <>
                    <span className="product-info__original-price text-[20px] text-gray-500 line-through">
                      {formatCurrency(displayProduct.compareAtPrice)}
                    </span>
                    <span className="product-info__badge bg-primary-red text-white text-[11px] font-bold px-3 py-1 rounded uppercase tracking-wide">
                      SAVE {formatCurrency(displayProduct.compareAtPrice - displayProduct.price)}
                    </span>
                  </>
                )}
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={() => handleAddToCart(displayProduct._id, displayProduct.name)}
                disabled={addingToCart || cartLoading || !displayProduct.inStock}
                className="product-info__add-button w-full bg-primary-red text-white font-bold py-4 rounded hover:bg-dark-red transition-colors mb-6 text-[16px] tracking-wide shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <>
                    <Loader className="animate-spin h-5 w-5" />
                    Adding...
                  </>
                ) : !displayProduct.inStock ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </button>

              {/* Description */}
              <div className="product-info__description mb-6 pb-6 border-b border-gray-200">
                <p className="text-[15px] text-gray-dark leading-relaxed mb-4">
                  {displayProduct.description || displayProduct.shortDescription}
                </p>
              </div>

              {/* Bundle Includes */}
              {displayProduct.features?.length > 0 && (
                <div className="product-info__includes mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-[15px] font-bold text-black mb-3">This Bundle Includes:</h3>
                  <ul className="space-y-2">
                    {displayProduct.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-[15px] text-gray-dark">
                        <span className="text-black mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Shipping Info */}
              <div className="product-info__shipping">
                <p className="text-[15px] font-bold text-black">
                  {displayProduct.freeShipping ? 'FREE SHIPPING!' : 'FREE U.S. Shipping over RS 99!'}
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
      
      {relatedProducts.length > 0 && (
        <section className="section--bestselling py-20 px-8 bg-white">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="bestselling__heading text-[32px] font-heading font-bold text-black text-center mb-14">
              Shop Bestselling Bundles
            </h2>

            <div className="bestselling__grid grid grid-cols-1 md:grid-cols-4 gap-8">
              {relatedProducts.map((product) => (
                <div 
                  key={product._id} 
                  onClick={() => handleProductClick(product)}
                  className="bundle-card group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="bundle-card__image-wrapper relative bg-gray-100">
                    {product.bestseller && (
                      <span className="bundle-card__badge absolute top-3 left-3 bg-primary-red text-white text-[10px] font-bold px-2.5 py-1.5 rounded uppercase tracking-wide z-10">
                        BEST SELLER
                      </span>
                    )}
                    <img 
                      src={product.images?.[0]?.url || '/images/products/0196-150_Max_QI_product_image.jpg'} 
                      alt={product.name} 
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="bundle-card__content p-5">
                    <h3 className="bundle-card__title text-[16px] font-bold text-black mb-3 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="bundle-card__pricing flex items-center gap-2 mb-4">
                      <span className="bundle-card__price text-[18px] font-bold text-primary-red">
                        {formatCurrency(product.price)}
                      </span>
                      {product.compareAtPrice > product.price && (
                        <span className="bundle-card__original-price text-[14px] text-gray-500 line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(product._id, product.name)
                      }}
                      className="bundle-card__button w-full bg-primary-red text-white font-bold py-3 rounded hover:bg-dark-red transition-colors text-[13px]"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <TrustBadges />

    </div>
  )
}

export default BackyardBundle
