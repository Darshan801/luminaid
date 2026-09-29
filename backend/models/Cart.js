const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  variant: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Snapshot of product data at time of adding to cart
  productSnapshot: {
    name: String,
    image: String,
    sku: String
  }
}, { _id: true });

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      sparse: true // Allows null for guest carts
    },
    sessionId: {
      type: String,
      index: true,
      sparse: true // For guest carts
    },
    items: [cartItemSchema],
    
    // Pricing
    subtotal: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Discount code
    discountCode: {
      code: String,
      discountAmount: Number,
      discountType: {
        type: String,
        enum: ['percentage', 'fixed']
      }
    },
    
    // Status
    status: {
      type: String,
      enum: ['active', 'abandoned', 'converted', 'expired'],
      default: 'active',
      index: true
    },
    
    // Expiry for guest carts
    expiresAt: {
      type: Date,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
cartSchema.index({ user: 1, status: 1 });
cartSchema.index({ sessionId: 1, status: 1 });
// Note: expiresAt TTL index is defined in schema

// Virtual for item count
cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for unique item count
cartSchema.virtual('uniqueItemCount').get(function() {
  return this.items.length;
});

// Pre-save middleware to calculate totals
cartSchema.pre('save', async function(next) {
  if (this.isModified('items') || this.isModified('discountCode')) {
    // Calculate subtotal
    this.subtotal = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Apply discount
    if (this.discountCode && this.discountCode.code) {
      if (this.discountCode.discountType === 'percentage') {
        this.discount = (this.subtotal * this.discountCode.discountAmount) / 100;
      } else {
        this.discount = this.discountCode.discountAmount;
      }
    } else {
      this.discount = 0;
    }
    
    // Calculate shipping (free over $99)
    const subtotalAfterDiscount = this.subtotal - this.discount;
    this.shipping = subtotalAfterDiscount >= 99 ? 0 : 7.99;
    
    // Calculate tax (example: 8% - should be based on location in production)
    this.tax = (subtotalAfterDiscount * 0.08);
    
    // Calculate total
    this.total = subtotalAfterDiscount + this.shipping + this.tax;
    
    // Ensure non-negative
    if (this.total < 0) this.total = 0;
  }
  
  next();
});

// Set expiry for guest carts (7 days)
cartSchema.pre('save', function(next) {
  if (this.isNew && this.sessionId && !this.user) {
    this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Instance method to add item
cartSchema.methods.addItem = async function(productId, quantity = 1, variant = null, price) {
  // Check if item already exists
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() && 
    item.variant === variant
  );
  
  if (existingItemIndex > -1) {
    // Update quantity
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Get product info for snapshot
    const Product = mongoose.model('Product');
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    if (product.trackInventory && product.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      variant,
      price: price || product.price,
      productSnapshot: {
        name: product.name,
        image: product.images[0]?.url || '',
        sku: product.sku
      }
    });
  }
  
  return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = async function(itemId, quantity) {
  const item = this.items.id(itemId);
  
  if (!item) {
    throw new Error('Item not found in cart');
  }
  
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }
  
  // Check stock
  const Product = mongoose.model('Product');
  const product = await Product.findById(item.product);
  
  if (product.trackInventory && product.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  
  item.quantity = quantity;
  return this.save();
};

// Instance method to remove item
cartSchema.methods.removeItem = function(itemId) {
  const item = this.items.id(itemId);
  
  if (!item) {
    throw new Error('Item not found in cart');
  }
  
  item.remove();
  return this.save();
};

// Instance method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.discountCode = {};
  return this.save();
};

// Instance method to apply discount code
cartSchema.methods.applyDiscountCode = function(code, discountAmount, discountType) {
  this.discountCode = {
    code,
    discountAmount,
    discountType
  };
  return this.save();
};

// Instance method to remove discount code
cartSchema.methods.removeDiscountCode = function() {
  this.discountCode = {};
  return this.save();
};

// Static method to find user's active cart
cartSchema.statics.findUserCart = async function(userId) {
  let cart = await this.findOne({ user: userId, status: 'active' })
    .populate('items.product');
  
  if (!cart) {
    cart = await this.create({ user: userId });
  }
  
  return cart;
};

// Static method to find guest cart
cartSchema.statics.findGuestCart = async function(sessionId) {
  let cart = await this.findOne({ sessionId, status: 'active' })
    .populate('items.product');
  
  if (!cart) {
    cart = await this.create({ sessionId });
  }
  
  return cart;
};

// Static method to merge guest cart to user cart
cartSchema.statics.mergeGuestCart = async function(sessionId, userId) {
  const guestCart = await this.findOne({ sessionId, status: 'active' });
  const userCart = await this.findUserCart(userId);
  
  if (guestCart && guestCart.items.length > 0) {
    // Merge items
    for (const guestItem of guestCart.items) {
      const existingItem = userCart.items.find(item =>
        item.product.toString() === guestItem.product.toString() &&
        item.variant === guestItem.variant
      );
      
      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }
    
    await userCart.save();
    
    // Mark guest cart as converted
    guestCart.status = 'converted';
    await guestCart.save();
  }
  
  return userCart;
};

// Static method to mark abandoned carts
cartSchema.statics.markAbandonedCarts = function(daysSinceUpdate = 3) {
  const cutoffDate = new Date(Date.now() - daysSinceUpdate * 24 * 60 * 60 * 1000);
  return this.updateMany(
    { 
      status: 'active', 
      updatedAt: { $lt: cutoffDate },
      items: { $ne: [] }
    },
    { status: 'abandoned' }
  );
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
