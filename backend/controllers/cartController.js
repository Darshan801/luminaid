const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private/Public (with session)
exports.getCart = async (req, res) => {
  try {
    let cart;

    if (req.user) {
      // Authenticated user
      cart = await Cart.findUserCart(req.user.id);
    } else {
      // Guest user - check for existing cart session
      const sessionId = req.cookies?.cartSessionId;
      
      if (sessionId) {
        // Try to find existing cart
        cart = await Cart.findOne({ sessionId, status: 'active' }).populate('items.product');
        
        if (!cart) {
          // Session expired or cart not found, create new one
          const newSessionId = require('crypto').randomBytes(16).toString('hex');
          cart = await Cart.create({ sessionId: newSessionId });
          
          res.cookie('cartSessionId', newSessionId, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        }
      } else {
        // New guest user - create session and cart
        const newSessionId = require('crypto').randomBytes(16).toString('hex');
        cart = await Cart.create({ sessionId: newSessionId });
        
        res.cookie('cartSessionId', newSessionId, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get Cart Error:', error);
    console.error('Error Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private/Public (with session)
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variant = null } = req.body;
    
    console.log('[addToCart] ===== START ADD TO CART =====');
    console.log('[addToCart] Request timestamp:', new Date().toISOString());
    console.log('[addToCart] User:', req.user ? `ID=${req.user.id}, Email=${req.user.email}` : 'Guest');
    console.log('[addToCart] Product ID:', productId);
    console.log('[addToCart] Quantity:', quantity);
    console.log('[addToCart] Variant:', variant);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Get product to verify it exists and get price
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    // Check stock
    if (product.trackInventory && product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
        availableStock: product.stock
      });
    }

    // Get or create cart
    let cart;
    if (req.user) {
      console.log('[addToCart] Adding to authenticated user cart:', req.user.id);
      cart = await Cart.findUserCart(req.user.id);
      console.log('[addToCart] Cart ID:', cart._id);
      console.log('[addToCart] Cart status:', cart.status);
      console.log('[addToCart] Cart user:', cart.user);
      console.log('[addToCart] Cart found, items before add:', cart.items.length);
    } else {
      const sessionId = req.cookies?.cartSessionId;
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'No cart session found. Please enable cookies.'
        });
      }
      cart = await Cart.findOne({ sessionId, status: 'active' }).populate('items.product');
      
      if (!cart) {
        cart = await Cart.create({ sessionId });
      }
    }

    // Add item to cart
    const savedCart = await cart.addItem(productId, quantity, variant, product.price);
    console.log('[addToCart] Item added, cart ID after save:', savedCart._id);
    console.log('[addToCart] Cart status after save:', savedCart.status);
    console.log('[addToCart] Cart user after save:', savedCart.user);
    console.log('[addToCart] Items after add:', savedCart.items.length);

    // Repopulate cart - use the returned cart from addItem
    await savedCart.populate('items.product');
    
    // Assign back to cart variable for response
    cart = savedCart;

    console.log('[addToCart] ===== END ADD TO CART (SUCCESS) =====');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add item to cart',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private/Public (with session)
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Get cart
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id, status: 'active' });
    } else {
      const sessionId = req.session?.cartId || req.cookies?.cartSessionId;
      cart = await Cart.findOne({ sessionId, status: 'active' });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Update item quantity
    await cart.updateItemQuantity(itemId, quantity);

    // Repopulate cart
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cart
    });
  } catch (error) {
    console.error('Update Cart Item Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update cart item',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private/Public (with session)
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Get cart
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id, status: 'active' });
    } else {
      const sessionId = req.session?.cartId || req.cookies?.cartSessionId;
      cart = await Cart.findOne({ sessionId, status: 'active' });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item
    await cart.removeItem(itemId);

    // Repopulate cart
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    console.error('Remove from Cart Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove item from cart',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private/Public (with session)
exports.clearCart = async (req, res) => {
  try {
    // Get cart
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id, status: 'active' });
    } else {
      const sessionId = req.session?.cartId || req.cookies?.cartSessionId;
      cart = await Cart.findOne({ sessionId, status: 'active' });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.clearCart();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    console.error('Clear Cart Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

// @desc    Apply discount code to cart
// @route   POST /api/cart/discount
// @access  Private/Public (with session)
exports.applyDiscount = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Discount code is required'
      });
    }

    // Get cart
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id, status: 'active' });
    } else {
      const sessionId = req.session?.cartId || req.cookies?.cartSessionId;
      cart = await Cart.findOne({ sessionId, status: 'active' });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // TODO: Validate discount code against DiscountCode model
    // For now, using mock validation
    const validDiscounts = {
      'WELCOME10': { amount: 10, type: 'percentage' },
      'SAVE20': { amount: 20, type: 'fixed' },
      'HOLIDAY15': { amount: 15, type: 'percentage' }
    };

    const discount = validDiscounts[code.toUpperCase()];

    if (!discount) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discount code'
      });
    }

    await cart.applyDiscountCode(code.toUpperCase(), discount.amount, discount.type);

    // Repopulate cart
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Discount code applied',
      data: cart
    });
  } catch (error) {
    console.error('Apply Discount Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply discount code',
      error: error.message
    });
  }
};

// @desc    Remove discount code from cart
// @route   DELETE /api/cart/discount
// @access  Private/Public (with session)
exports.removeDiscount = async (req, res) => {
  try {
    // Get cart
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id, status: 'active' });
    } else {
      const sessionId = req.session?.cartId || req.cookies?.cartSessionId;
      cart = await Cart.findOne({ sessionId, status: 'active' });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.removeDiscountCode();

    // Repopulate cart
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Discount code removed',
      data: cart
    });
  } catch (error) {
    console.error('Remove Discount Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove discount code',
      error: error.message
    });
  }
};

// @desc    Merge guest cart to user cart (after login)
// @route   POST /api/cart/merge
// @access  Private
exports.mergeCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const sessionId = req.cookies?.cartSessionId;

    if (!sessionId) {
      // No guest cart to merge
      const cart = await Cart.findUserCart(req.user.id);
      return res.status(200).json({
        success: true,
        message: 'No guest cart to merge',
        data: cart
      });
    }

    const cart = await Cart.mergeGuestCart(sessionId, req.user.id);

    // Clear cookie
    res.clearCookie('cartSessionId');

    res.status(200).json({
      success: true,
      message: 'Carts merged successfully',
      data: cart
    });
  } catch (error) {
    console.error('Merge Cart Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to merge carts',
      error: error.message
    });
  }
};

// @desc    Get cart item count
// @route   GET /api/cart/count
// @access  Private/Public (with session)
exports.getCartCount = async (req, res) => {
  try {
    let cart;

    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id, status: 'active' });
    } else {
      const sessionId = req.cookies?.cartSessionId;
      if (sessionId) {
        cart = await Cart.findOne({ sessionId, status: 'active' });
      }
    }

    const count = cart ? cart.itemCount : 0;

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get Cart Count Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart count',
      error: error.message
    });
  }
};
