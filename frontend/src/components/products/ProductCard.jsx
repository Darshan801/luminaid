import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
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

  // Get primary image
  const primaryImage = product.images?.find(img => img.isPrimary)?.url || 
                      product.images?.[0]?.url || 
                      '/images/placeholder-product.jpg';

  // Check if product is on sale
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = onSale 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group relative">
      <Link to={`/products/${product.slug}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-lg mb-4">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.bestseller && (
              <span className="bg-primary-orange text-white px-3 py-1 text-xs font-bold uppercase shadow-md">
                Bestseller
              </span>
            )}
            {product.featured && !product.bestseller && (
              <span className="bg-primary-red text-white px-3 py-1 text-xs font-bold uppercase shadow-md">
                Featured
              </span>
            )}
            {onSale && (
              <span className="bg-green-600 text-white px-3 py-1 text-xs font-bold uppercase shadow-md">
                Save {discount}%
              </span>
            )}
            {(product.newArrival || product.tags?.includes('new')) && (
              <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase shadow-md">
                New
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {product.status === 'out-of-stock' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-black px-4 py-2 text-sm font-bold">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Quick Add Button - Desktop */}
          {product.status === 'active' && (
            <button
              onClick={handleAddToCart}
              disabled={isAdding || justAdded}
              className="absolute bottom-3 left-3 right-3 bg-white text-black font-bold py-3 px-4 
                       opacity-0 group-hover:opacity-100 transition-all duration-300
                       hover:bg-primary-red hover:text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 shadow-lg"
            >
              {justAdded ? (
                <>
                  <Check size={18} />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>{isAdding ? 'Adding...' : 'Quick Add'}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight 
                       group-hover:text-primary-red transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{product.rating.toFixed(1)}</span>
              </div>
              {product.reviewCount > 0 && (
                <span>({product.reviewCount} reviews)</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg font-bold text-gray-900">
              RS {product.price.toFixed(2)}
            </span>
            {onSale && (
              <span className="text-sm text-gray-500 line-through">
                RS {product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.trackInventory && product.stock < 10 && product.stock > 0 && (
            <p className="text-xs text-orange-600 font-medium">
              Only {product.stock} left in stock!
            </p>
          )}
        </div>
      </Link>

      {/* Mobile Add to Cart Button */}
      {product.status === 'active' && (
        <button
          onClick={handleAddToCart}
          disabled={isAdding || justAdded}
          className="mt-3 w-full bg-primary-red text-white font-bold py-3 px-4 
                   hover:bg-red-700 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2 lg:hidden"
        >
          {justAdded ? (
            <>
              <Check size={18} />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ProductCard;