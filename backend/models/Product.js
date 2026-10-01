const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters']
    },

    // Pricing
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare at price cannot be negative'],
      default: null
    },
    costPrice: {
      type: Number,
      min: [0, 'Cost price cannot be negative'],
      default: 0
    },

    // Inventory
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    trackInventory: {
      type: Boolean,
      default: true
    },

    // Categorization
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Power Lanterns', 'String Lights', 'Accessories', 'Bundles', 'Gifts'],
      index: true
    },
    subCategory: {
      type: String,
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }],

    // Images
    images: [{
      url: {
        type: String,
        required: true
      },
      altText: {
        type: String,
        default: ''
      },
      isPrimary: {
        type: Boolean,
        default: false
      },
      publicId: String // Cloudinary public ID for deletion
    }],

    // Specifications
    specifications: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      value: {
        type: String,
        required: true,
        trim: true
      }
    }],

    // Features
    features: [{
      type: String,
      trim: true
    }],

    // Variants (for sizes, colors, etc.)
    hasVariants: {
      type: Boolean,
      default: false
    },
    variants: [{
      name: String,
      sku: String,
      price: Number,
      stock: Number,
      attributes: {
        type: Map,
        of: String
      }
    }],

    // Shipping
    weight: {
      type: Number,
      min: 0,
      default: 0 // in pounds
    },
    dimensions: {
      length: { type: Number, min: 0, default: 0 }, // inches
      width: { type: Number, min: 0, default: 0 },
      height: { type: Number, min: 0, default: 0 }
    },
    freeShipping: {
      type: Boolean,
      default: false
    },

    // Reviews & Ratings
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // Status & Visibility
    status: {
      type: String,
      enum: ['draft', 'active', 'archived', 'out-of-stock'],
      default: 'active',
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    bestseller: {
      type: Boolean,
      default: false,
      index: true
    },
    newArrival: {
      type: Boolean,
      default: false,
      index: true
    },

    // Badges
    badges: [{
      text: String,
      type: {
        type: String,
        enum: ['bestseller', 'new', 'sale', 'limited']
      },
      color: String
    }],

    // SEO
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    metaKeywords: [{
      type: String
    }],

    // Related Products
    relatedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],

    // Analytics
    viewCount: {
      type: Number,
      default: 0
    },
    purchaseCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' }); // Text search
productSchema.index({ price: 1 }); // Price sorting
productSchema.index({ rating: -1 }); // Rating sorting
productSchema.index({ createdAt: -1 }); // Newest first
// Note: slug and sku indexes are defined in schema with unique: true

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Virtual for low stock status
productSchema.virtual('isLowStock').get(function() {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

// Pre-save middleware to generate slug from name
productSchema.pre('save', function() {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

// Pre-save middleware to set primary image
productSchema.pre('save', function() {
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
});

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 4) {
  return this.find({ status: 'active', featured: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get bestsellers
productSchema.statics.getBestsellers = function(limit = 4) {
  return this.find({ status: 'active', bestseller: true })
    .sort({ purchaseCount: -1 })
    .limit(limit);
};

// Static method to search products
productSchema.statics.searchProducts = function(query, filters = {}) {
  const searchQuery = { status: 'active' };

  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }

  // Category filter
  if (filters.category) {
    searchQuery.category = filters.category;
  }

  // Price range filter
  if (filters.minPrice || filters.maxPrice) {
    searchQuery.price = {};
    if (filters.minPrice) searchQuery.price.$gte = filters.minPrice;
    if (filters.maxPrice) searchQuery.price.$lte = filters.maxPrice;
  }

  // Rating filter
  if (filters.minRating) {
    searchQuery.rating = { $gte: filters.minRating };
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    searchQuery.tags = { $in: filters.tags };
  }

  return this.find(searchQuery);
};

// Instance method to increment view count
productSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Instance method to update rating
productSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { product: this._id, status: 'approved' } },
    { $group: {
      _id: '$product',
      avgRating: { $avg: '$rating' },
      count: { $sum: 1 }
    }}
  ]);

  if (stats.length > 0) {
    this.rating = Math.round(stats[0].avgRating * 10) / 10;
    this.reviewCount = stats[0].count;
  } else {
    this.rating = 0;
    this.reviewCount = 0;
  }

  return this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
