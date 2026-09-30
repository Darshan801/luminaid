import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Check,
  Minus,
  Plus,
  ChevronDown,
  ShoppingCart,
  Play,
  Truck,
  Shield,
  Package,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getProduct, getFeaturedProducts } from '../../services/productService';
import { CartContext } from '../../context/CartContext';
import ProductCard from '../../components/products/ProductCard';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProduct(slug);
      setProduct(data);
      setSelectedImage(0);
      setQuantity(1);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const products = await getFeaturedProducts(4);
      setRelatedProducts(products);
    } catch (err) {
      console.error('Failed to fetch related products:', err);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const result = await addToCart(product._id, quantity);
      if (result?.success) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 3000);
      }
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  const incrementQuantity = () => {
    if (product.trackInventory && quantity >= product.stock) return;
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Link
            to="/products"
            className="inline-block bg-primary-red text-white px-6 py-3 font-bold hover:bg-red-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = product.images?.[selectedImage]?.url || product.images?.[0]?.url || '/images/placeholder-product.jpg';
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = onSale ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;
  const inStock = product.status === 'active' && (!product.trackInventory || product.stock > 0);

  return (
    <div className="w-full bg-white">
      
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-red transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-red transition-colors">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.bestseller && (
                  <span className="bg-primary-orange text-white px-3 py-1.5 text-xs font-bold uppercase shadow-md">
                    Bestseller
                  </span>
                )}
                {onSale && (
                  <span className="bg-green-600 text-white px-3 py-1.5 text-xs font-bold uppercase shadow-md">
                    Save {discount}%
                  </span>
                )}
                {product.tags?.includes('new') && (
                  <span className="bg-blue-600 text-white px-3 py-1.5 text-xs font-bold uppercase shadow-md">
                    New
                  </span>
                )}
              </div>

              {!inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white text-black px-6 py-3 text-lg font-bold">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary-red' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="text-lg text-gray-600">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Rating & Reviews */}
            {product.rating > 0 && (
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
                </div>
                {product.reviewCount > 0 && (
                  <span className="text-sm text-gray-600">
                    ({product.reviewCount} reviews)
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-6 border-b">
              <span className="text-4xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {onSale && (
                <>
                  <span className="text-2xl text-gray-500 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check size={20} />
                  <span className="font-semibold">In Stock</span>
                  {product.trackInventory && product.stock < 10 && (
                    <span className="text-orange-600 ml-2">
                      (Only {product.stock} left!)
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-red-600 font-semibold">Out of Stock</div>
              )}
            </div>

            {/* Quantity Selector */}
            {inStock && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900">
                  Quantity:
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="px-6 py-3 min-w-[4rem] text-center font-bold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={product.trackInventory && quantity >= product.stock}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {product.trackInventory && (
                    <span className="text-sm text-gray-600">
                      {product.stock} available
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Add to Cart Buttons */}
            {inStock && (
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || justAdded}
                  className="w-full bg-primary-red text-white py-4 px-6 font-bold text-lg rounded
                           hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-3"
                >
                  {justAdded ? (
                    <>
                      <Check size={24} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={24} />
                      <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isAdding}
                  className="w-full bg-gray-900 text-white py-4 px-6 font-bold text-lg rounded
                           hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy It Now
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck size={32} className="mx-auto mb-2 text-gray-700" />
                <p className="text-xs font-semibold text-gray-700">Free Shipping</p>
                <p className="text-xs text-gray-500">Orders $99+</p>
              </div>
              <div className="text-center">
                <Shield size={32} className="mx-auto mb-2 text-gray-700" />
                <p className="text-xs font-semibold text-gray-700">Warranty</p>
                <p className="text-xs text-gray-500">1 Year</p>
              </div>
              <div className="text-center">
                <Package size={32} className="mx-auto mb-2 text-gray-700" />
                <p className="text-xs font-semibold text-gray-700">Easy Returns</p>
                <p className="text-xs text-gray-500">30 Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Blocks Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Feature Block 1 - Red Background */}
          <div className="bg-primary-red rounded-lg overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-12 flex flex-col justify-center text-white">
                <h2 className="text-3xl font-bold mb-4">3-in-1 Solar Power</h2>
                <p className="text-lg mb-6">
                  Solar powered LED lantern charges phones and small devices. Perfect for camping, 
                  emergency preparedness, and outdoor adventures.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="flex-shrink-0 mt-0.5" />
                    <span>Integrated solar panel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="flex-shrink-0 mt-0.5" />
                    <span>USB charging capability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="flex-shrink-0 mt-0.5" />
                    <span>Ultra-bright LED lights</span>
                  </li>
                </ul>
              </div>
              <div className="aspect-square md:aspect-auto">
                <img
                  src={product.images?.[1]?.url || product.images?.[0]?.url || '/images/placeholder-product.jpg'}
                  alt="Product feature"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Feature Block 2 - Gray Background */}
          <div className="bg-gray-200 rounded-lg overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="aspect-square md:aspect-auto order-2 md:order-1">
                <img
                  src={product.images?.[0]?.url || '/images/placeholder-product.jpg'}
                  alt="Product in use"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-12 flex flex-col justify-center order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Waterproof & Durable</h2>
                <p className="text-lg mb-6 text-gray-700">
                  Built to withstand the elements. IP67 waterproof rating means it can handle rain, 
                  snow, and even being submerged in water.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="flex-shrink-0 mt-0.5 text-green-600" />
                    <span>IP67 waterproof rated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Dustproof construction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Shatterproof design</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature Block 3 - Yellow Background */}
          <div className="bg-yellow-100 rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Ultra Portable</h2>
                <p className="text-lg mb-6 text-gray-700">
                  Lightweight and collapsible design packs down flat for easy storage and transport. 
                  Perfect for backpacking and travel.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Collapses to 1.5 inches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Weighs only 9.5 oz</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Built-in handle</span>
                  </li>
                </ul>
              </div>
              <div className="aspect-square md:aspect-auto">
                <img
                  src={product.images?.[0]?.url || '/images/placeholder-product.jpg'}
                  alt="Portable design"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group cursor-pointer">
            <img
              src={product.images?.[0]?.url || '/images/placeholder-product.jpg'}
              alt="Video thumbnail"
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                <Play size={32} className="text-black ml-1" fill="black" />
              </div>
              <h3 className="text-white text-2xl font-bold">See It In Action</h3>
              <p className="text-white/80 mt-2">Watch how {product.name} works</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Compare Power Lanterns</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-4 font-bold text-gray-900">Feature</th>
                  <th className="text-center p-4 bg-primary-red/10">
                    <div className="font-bold text-gray-900">Titan</div>
                    <div className="text-sm text-gray-600">Most Popular</div>
                  </th>
                  <th className="text-center p-4">
                    <div className="font-bold text-gray-900">Survivor</div>
                    <div className="text-sm text-gray-600">Premium</div>
                  </th>
                  <th className="text-center p-4">
                    <div className="font-bold text-gray-900">Max</div>
                    <div className="text-sm text-gray-600">Budget</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-4 font-semibold">Brightness</td>
                  <td className="p-4 text-center bg-primary-red/5">300 lumens</td>
                  <td className="p-4 text-center">350 lumens</td>
                  <td className="p-4 text-center">150 lumens</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Runtime</td>
                  <td className="p-4 text-center bg-primary-red/5">50 hours</td>
                  <td className="p-4 text-center">100 hours</td>
                  <td className="p-4 text-center">40 hours</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Phone Charging</td>
                  <td className="p-4 text-center bg-primary-red/5"><Check className="inline text-green-600" size={20} /></td>
                  <td className="p-4 text-center"><Check className="inline text-green-600" size={20} /></td>
                  <td className="p-4 text-center"><Check className="inline text-green-600" size={20} /></td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Red Night Vision</td>
                  <td className="p-4 text-center bg-primary-red/5">—</td>
                  <td className="p-4 text-center"><Check className="inline text-green-600" size={20} /></td>
                  <td className="p-4 text-center">—</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Weight</td>
                  <td className="p-4 text-center bg-primary-red/5">9.5 oz</td>
                  <td className="p-4 text-center">11 oz</td>
                  <td className="p-4 text-center">7 oz</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Price</td>
                  <td className="p-4 text-center bg-primary-red/5 font-bold">$88</td>
                  <td className="p-4 text-center font-bold">$115</td>
                  <td className="p-4 text-center font-bold">$60</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Details Accordion */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-b divide-y bg-white rounded-lg overflow-hidden shadow-sm">
            
            {/* Description */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === 'description' ? null : 'description')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900">Description</span>
                <ChevronDown
                  size={24}
                  className={`transition-transform ${openSection === 'description' ? 'rotate-180' : ''}`}
                />
              </button>
              {openSection === 'description' && (
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* Features */}
            {product.features?.length > 0 && (
              <div>
                <button
                  onClick={() => setOpenSection(openSection === 'features' ? null : 'features')}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-bold text-gray-900">Features</span>
                  <ChevronDown
                    size={24}
                    className={`transition-transform ${openSection === 'features' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openSection === 'features' && (
                  <div className="px-6 pb-6">
                    <ul className="space-y-3">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700">
                          <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Specifications */}
            {product.specifications?.length > 0 && (
              <div>
                <button
                  onClick={() => setOpenSection(openSection === 'specifications' ? null : 'specifications')}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-bold text-gray-900">Specifications</span>
                  <ChevronDown
                    size={24}
                    className={`transition-transform ${openSection === 'specifications' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openSection === 'specifications' && (
                  <div className="px-6 pb-6">
                    <table className="w-full">
                      <tbody className="divide-y">
                        {product.specifications.map((spec, index) => (
                          <tr key={index}>
                            <td className="py-3 pr-6 font-semibold text-gray-900 w-1/3">
                              {spec.name}
                            </td>
                            <td className="py-3 text-gray-700">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Shipping & Returns */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900">Shipping & Returns</span>
                <ChevronDown
                  size={24}
                  className={`transition-transform ${openSection === 'shipping' ? 'rotate-180' : ''}`}
                />
              </button>
              {openSection === 'shipping' && (
                <div className="px-6 pb-6 space-y-4 text-gray-700">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping</h4>
                    <p>Free standard shipping on orders over $99. Orders typically ship within 1-2 business days.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Returns</h4>
                    <p>30-day return policy. Items must be unused and in original packaging.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Warranty</h4>
                    <p>All LuminAID products come with a 1-year warranty against manufacturing defects.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
