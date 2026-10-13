import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, Truck, ThumbsUp, Shield, Check, ShoppingCart, Plus, Minus } from 'lucide-react'
import { getProductsByCategory } from '../../services/productService'
import { useCart } from '../../hooks/useCart'
import { formatCurrency } from '../../utils/format'

// Image from public folder
const glowTimeImage = '/images/glow-time.jpg';

// Testimonial data
const TESTIMONIAL = {
  rating: 5,
  text: "These string lights are absolutely perfect! They create such a warm, cozy atmosphere on our patio. Love that they're solar powered so no hassle with cords or batteries.",
  author: "Jessica M."
}

// Trust badges component
const TrustBadges = () => (
  <section className="w-full py-12 md:py-16 bg-gray-50">
    <div className="max-w-[1440px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
            <Truck size={32} />
          </div>
          <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">FREE SHIPPING RS 99+</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
            <ThumbsUp size={32} />
          </div>
          <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">10,000+ REVIEWS</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
            <Shield size={32} />
          </div>
          <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">OFF-GRID GUARANTEE</p>
        </div>
      </div>
    </div>
  </section>
)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StringLightsBundle = () => {
  const navigate = useNavigate()
  const { addToCart, loading: cartLoading } = useCart()

  // State Management
  const [bundleProduct, setBundleProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)

  // Fetch String Lights bundle
  useEffect(() => {
    const fetchStringLightsBundle = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch String Lights category
        const response = await getProductsByCategory('String Lights', { 
          limit: 20 
        })
        
        const products = response.data || []

        // Find String Light bundle product
        const stringLightProduct = products.find(p => 
          p.name.toLowerCase().includes('string light')
        ) || products[0]

        if (stringLightProduct) {
          setBundleProduct(stringLightProduct)
          setSelectedImage(stringLightProduct.images?.[0]?.url || '/images/products/StringLightatSunset.jpg')
          
          // Set related bundles
          const related = products.filter(p => p._id !== stringLightProduct._id).slice(0, 3)
          setRelatedProducts(related)
        } else {
          setError('No String Lights products found in database')
        }
      } catch (err) {
        console.error('Error fetching String Lights bundle:', err)
        setError(err.message || 'Failed to load bundle')
      } finally {
        setLoading(false)
      }
    }

    fetchStringLightsBundle()
  }, [])

  const handleIncrement = () => setQuantity(prev => prev + 1)
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  // Handle add to cart
  const handleAddToCart = async (productId, qty, productName) => {
    if (!productId) {
      alert('Product ID not found. Please refresh the page.')
      return
    }

    try {
      setAddingToCart(true)
      const result = await addToCart(productId, qty || 1)
      
      if (result.success) {
        alert(`Added ${qty || 1} x ${productName || 'product'} to cart!`)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading bundle...</p>
        </div>
      </div>
    )
  }

  // If no bundle product found, show error
  if (!bundleProduct && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">Bundle Not Found</h1>
          <p className="text-gray-600 mb-8 text-lg">
            {error || 'No String Lights products found in the database.'}
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-brand-orange text-white px-8 py-3.5 font-bold rounded-soft
                     hover:bg-brand-orange-dark active:scale-95
                     transition-all duration-fast shadow-glow-sm hover:shadow-glow-md"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    )
  }

  const displayProduct = bundleProduct
  const currentImage = selectedImage || displayProduct?.images?.[0]?.url || '/images/products/StringLightatSunset.jpg'
  const basePrice = displayProduct?.price || 0
  const totalPrice = (basePrice * quantity).toFixed(2)

  return (
    <div className="w-full bg-white">
      
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Solar String Light 4-Pack</span>
          </nav>
        </div>
      </div>

      {/* Product Details Section */}
      <section className="w-full py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Product Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-soft overflow-hidden shadow-medium">
                <img 
                  src={currentImage} 
                  alt={displayProduct.name} 
                  className="w-full h-full object-cover"
                />
                {!displayProduct.inStock && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-white text-black px-6 py-3 text-lg font-bold rounded-soft shadow-medium">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {displayProduct.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {displayProduct.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img.url)}
                      className={`aspect-square bg-gray-100 rounded-soft overflow-hidden border
                                transition-all duration-fast ${
                                currentImage === img.url 
                                  ? 'border-brand-orange shadow-glow-sm' 
                                  : 'border-transparent hover:border-gray-300'
                              }`}
                    >
                      <img 
                        src={img.url} 
                        alt={img.altText || `View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              
              {/* Title */}
              <div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-3 leading-tight">
                  {displayProduct.name}
                </h1>
              </div>

              {/* Rating & Reviews */}
              {displayProduct.rating > 0 && (
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < Math.floor(displayProduct.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-900">{displayProduct.rating.toFixed(1)}</span>
                  </div>
                  {displayProduct.reviewCount > 0 && (
                    <span className="text-sm text-gray-600">
                      ({displayProduct.reviewCount} reviews)
                    </span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 pb-6 border-b border-gray-200">
                <span className="text-4xl font-bold text-gray-900">
                  {formatCurrency(parseFloat(totalPrice))}
                </span>
                {displayProduct.compareAtPrice > displayProduct.price && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      {formatCurrency(displayProduct.compareAtPrice * quantity)}
                    </span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-soft">
                      Save {formatCurrency((displayProduct.compareAtPrice - displayProduct.price) * quantity)}
                    </span>
                  </>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {displayProduct.bestseller && (
                  <span className="bg-brand-orange text-white px-3 py-1.5 text-xs font-bold uppercase 
                               rounded-soft shadow-glow-sm">
                    Bestseller
                  </span>
                )}
                {displayProduct.inStock && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check size={20} />
                    <span className="font-semibold">In Stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {displayProduct.description && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-base text-gray-700 leading-relaxed">
                    {displayProduct.description || displayProduct.shortDescription}
                  </p>
                </div>
              )}

              {/* Color Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Color: <span className="font-normal">Warm White</span>
                </label>
                <div className="flex gap-3">
                  <button className="px-6 py-3 border border-gray-300 rounded-soft text-sm font-medium 
                                   hover:border-brand-orange transition-colors duration-fast">
                    Multi-Color
                  </button>
                  <button className="px-6 py-3 border-2 border-brand-orange rounded-soft text-sm font-bold 
                                   bg-white transition-colors duration-fast">
                    Warm White
                  </button>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Quantity:</label>
                <div className="flex items-center gap-0 border border-gray-300 rounded-soft w-fit">
                  <button
                    onClick={handleDecrement}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 
                             transition-colors duration-fast"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-bold text-gray-900 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 
                             transition-colors duration-fast"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Features */}
              {displayProduct.features?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">What's Included:</h3>
                  <ul className="space-y-2">
                    {displayProduct.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                        <Check size={16} className="flex-shrink-0 mt-0.5 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add to Cart Button */}
              <button 
                onClick={() => handleAddToCart(displayProduct._id, quantity, displayProduct.name)}
                disabled={addingToCart || cartLoading || !displayProduct.inStock}
                className="w-full bg-brand-orange text-white py-4 px-6 font-bold text-lg rounded-soft
                         hover:bg-brand-orange-dark 
                         active:scale-95
                         transition-all duration-fast 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-3
                         shadow-glow-sm hover:shadow-glow-md"
              >
                {addingToCart ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Adding...</span>
                  </>
                ) : !displayProduct.inStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart size={24} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Shipping Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-soft px-6 py-4 text-center">
                <p className="text-sm font-bold text-blue-900">
                  {displayProduct.freeShipping ? '✓ FREE SHIPPING!' : '✓ FREE U.S. Shipping over RS 99!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* It's Glow Time Section */}
      <section className="relative py-20 px-8 text-white text-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={glowTimeImage} 
            alt="String lights glowing at night" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-12 leading-tight">
            It's Glow Time
          </h2>

          <ul className="space-y-4 text-lg">
            <li>Extra-Long LED String Lights</li>
            <li>Doubles as a Solar Lantern</li>
            <li>Charges Your Phone</li>
            <li>Easy to Charge via Solar Power or USB</li>
            <li>Adjustable Brightness & Lighting Modes</li>
          </ul>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full py-16 md:py-20 bg-gradient-to-br from-orange-50 via-warm-paper to-red-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-soft border border-gray-200">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="#F47721" stroke="#F47721" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                10,000+ 5-Star Reviews
              </span>
            </div>
          </div>

          {/* Quote Mark */}
          <div className="text-center mb-6">
            <svg className="w-16 h-16 mx-auto text-brand-orange/30" fill="currentColor" viewBox="0 0 32 32">
              <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z"/>
            </svg>
          </div>

          {/* Testimonial Text */}
          <blockquote className="text-center mb-8">
            <p className="text-xl md:text-2xl leading-relaxed text-gray-900 font-light italic mb-6">
              {TESTIMONIAL.text}
            </p>
            
            {/* Author */}
            <footer className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white font-bold text-lg shadow-glow-sm">
                {TESTIMONIAL.author.charAt(0)}
              </div>
              <cite className="not-italic">
                <span className="block text-base font-bold text-gray-900">{TESTIMONIAL.author}</span>
                <span className="block text-sm text-gray-600">Verified Buyer</span>
              </cite>
            </footer>
          </blockquote>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Verified Purchase</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="font-medium">Rated 4.9/5.0</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Customer Favorite</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle and Save Section */}
      {relatedProducts.length > 0 && (
        <section className="w-full py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 text-center mb-12">
              Bundle and Save
            </h2>

            {/* Bundle Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <div 
                  key={product._id} 
                  onClick={() => handleProductClick(product)}
                  className="group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100 rounded-soft overflow-hidden mb-4 
                                shadow-soft hover:shadow-medium transition-all duration-normal">
                    {product.bestseller && (
                      <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold 
                                   px-2.5 py-1.5 rounded-soft uppercase tracking-wide z-10 shadow-glow-sm">
                        Best Seller
                      </span>
                    )}
                    <img 
                      src={product.images?.[0]?.url || '/images/products/StringLightatSunset.jpg'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-normal"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-orange 
                                 transition-colors duration-fast line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.compareAtPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(product._id, 1, product.name)
                      }}
                      className="w-full bg-brand-orange text-white font-bold py-2.5 rounded-soft
                               hover:bg-brand-orange-dark active:scale-95
                               transition-all duration-fast text-sm shadow-sm"
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

export default StringLightsBundle
