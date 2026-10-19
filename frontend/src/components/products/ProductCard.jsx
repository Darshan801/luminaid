import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

/**
 * ProductCard Component - "Light in Motion" Design System
 * 
 * Premium product card with:
 * - Refined hover effects (lift + warm glow)
 * - Consistent aspect ratio
 * - Clear badge hierarchy
 * - Tactile interaction feedback
 * - Mobile-optimized add-to-cart
 * 
 * Used in: Homepage, Product listings, Related products, Search results
 */

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product || !product._id) {
      console.error('Cannot add to cart: Product or product ID is missing', product);
      return;
    }
    
    setIsAdding(true);
    
    try {
      const result = await addToCart(product._id, 1);
      
      if (result.success) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Save scroll position before navigating
  const handleProductClick = () => {
    // Save current scroll position immediately (before navigation)
    const currentPath = window.location.pathname + window.location.search;
    const scrollPosition = window.scrollY;
    sessionStorage.setItem(`scroll_${currentPath}`, scrollPosition.toString());
  };

  // Get primary image
  const primaryImage = product.images?.find(img => img.isPrimary)?.url || 
                      product.images?.[0]?.url || 
                      '/images/placeholder-product.jpg';

  // Check if product has discount (must be a number and greater than 0)
  const discountValue = Number(product.discount) || 0;
  const hasDiscount = discountValue > 0;
  const discountPercentage = hasDiscount ? discountValue : 0;
  const originalPrice = product.price;
  const discountedPrice = hasDiscount 
    ? Math.round(originalPrice * (1 - discountPercentage / 100) * 100) / 100
    : originalPrice;
  
  // Check if sold out
  const isSoldOut = product.status === 'out-of-stock';
  
  // Check badges
  const isBestseller = product.bestseller === true;
  const isNew = product.newArrival === true;

  return (
    <div className="group relative h-full flex flex-col">
      <Link 
        to={`/products/${product.slug}`}
        onClick={handleProductClick}
        className="block flex-grow flex flex-col"
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-warm-paper overflow-hidden rounded-soft mb-4 
                      transition-all duration-normal group-hover:shadow-medium flex-shrink-0">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-slow 
                     group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {isBestseller && (
              <span className="badge-orange shadow-glow-sm">
                Bestseller
              </span>
            )}
            {hasDiscount && (
              <span className="badge bg-green-600 text-white shadow-sm">
                Save {discountPercentage}%
              </span>
            )}
            {isNew && (
              <span className="badge bg-blue-600 text-white shadow-sm">
                New
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-charcoal px-4 py-2 text-label-lg font-bold rounded-subtle shadow-md">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Quick Add Button - Desktop Only */}
          {product.status === 'active' && (
            <button
              onClick={handleAddToCart}
              disabled={isAdding || justAdded}
              className="absolute bottom-4 left-4 right-4 
                       bg-white text-charcoal font-bold py-3 px-4 rounded-soft
                       opacity-0 translate-y-2 
                       group-hover:opacity-100 group-hover:translate-y-0
                       transition-all duration-normal ease-out
                       hover:bg-brand-orange hover:text-white hover:shadow-glow-md
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 shadow-medium
                       focus-visible:opacity-100 focus-visible:translate-y-0 focus-ring
                       hidden sm:flex"
            >
              {justAdded ? (
                <>
                  <Check size={18} className="flex-shrink-0" />
                  <span className="text-label-lg tracking-wide">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} className="flex-shrink-0" />
                  <span className="text-label-lg tracking-wide">
                    {isAdding ? 'Adding...' : 'Quick Add'}
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Product Info - Flex container to push button to bottom */}
        <div className="flex flex-col flex-grow">
          {/* Product Title - Fixed height with line clamp */}
          <h3 className="text-body-sm md:text-body-md font-semibold text-charcoal 
                       leading-tight group-hover:text-brand-orange 
                       transition-colors duration-fast line-clamp-2 h-12 mb-2">
            {product.name}
          </h3>

          {/* Rating - Fixed minimum height */}
          <div className="h-6 mb-2">
            {product.rating > 0 && (
              <div className="flex items-center gap-2 text-label-md text-muted-neutral">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium text-charcoal">{product.rating.toFixed(1)}</span>
                </div>
                {product.reviewCount > 0 && (
                  <span>({product.reviewCount} reviews)</span>
                )}
              </div>
            )}
          </div>

          {/* Price - Fixed minimum height */}
          <div className="flex items-center gap-2 flex-wrap mb-2 min-h-8">
            {hasDiscount ? (
              <>
                <span className="text-title-sm md:text-title-md font-bold text-charcoal">
                  RS {discountedPrice.toFixed(2)}
                </span>
                <span className="text-body-sm text-muted-neutral line-through">
                  RS {originalPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-title-sm md:text-title-md font-bold text-charcoal">
                RS {originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status - Fixed minimum height */}
          <div className="h-6 mb-2">
            {product.trackInventory && product.stock < 10 && product.stock > 0 && (
              <p className="text-label-md text-orange-600 font-medium">
                Only {product.stock} left in stock!
              </p>
            )}
          </div>

          {/* Spacer to push button to bottom */}
          <div className="flex-grow"></div>

          {/* Mobile Add to Cart Button - Always at bottom */}
          {product.status === 'active' && (
            <button
              onClick={handleAddToCart}
              disabled={isAdding || justAdded}
              className="sm:hidden w-full mt-3 py-2.5 px-4 
                       bg-brand-orange text-white font-bold rounded-soft
                       hover:bg-brand-red active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-fast
                       flex items-center justify-center gap-2 shadow-sm
                       text-label-lg tracking-wide"
            >
              {justAdded ? (
                <>
                  <Check size={16} />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
