const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // Product
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    
    // User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Allow anonymous reviews
      index: true
    },
    
    // Author Info (for display)
    authorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    authorEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
      index: true
    },
    
    // Rating
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      index: true
    },
    
    // Content
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters']
    },
    
    // Media
    images: [{
      url: String,
      publicId: String // Cloudinary public ID
    }],
    
    // Moderation
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'pending',
      index: true
    },
    rejectionReason: String,
    
    // Helpfulness
    helpful: {
      type: Number,
      default: 0,
      min: 0
    },
    notHelpful: {
      type: Number,
      default: 0,
      min: 0
    },
    helpfulVotes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      vote: {
        type: String,
        enum: ['helpful', 'not-helpful']
      }
    }],
    
    // Admin Response
    response: {
      text: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      respondedAt: Date
    },
    
    // Reporting
    reported: {
      type: Boolean,
      default: false
    },
    reportCount: {
      type: Number,
      default: 0
    },
    reports: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: String,
      reportedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true, sparse: true }); // One review per user per product
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ isVerifiedPurchase: 1 });

// Virtual for helpfulness ratio
reviewSchema.virtual('helpfulnessRatio').get(function() {
  const total = this.helpful + this.notHelpful;
  if (total === 0) return 0;
  return (this.helpful / total) * 100;
});

// Virtual for net helpfulness
reviewSchema.virtual('netHelpfulness').get(function() {
  return this.helpful - this.notHelpful;
});

// Pre-save middleware to check if user purchased product
reviewSchema.pre('save', async function(next) {
  if (this.isNew && this.user) {
    const Order = mongoose.model('Order');
    
    // Check if user has purchased this product
    const hasPurchased = await Order.exists({
      user: this.user,
      'items.product': this.product,
      paymentStatus: 'paid',
      status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
    });
    
    this.isVerifiedPurchase = !!hasPurchased;
  }
  next();
});

// Post-save hook to update product rating
reviewSchema.post('save', async function(doc) {
  if (doc.status === 'approved') {
    const Product = mongoose.model('Product');
    const product = await Product.findById(doc.product);
    
    if (product) {
      await product.updateRating();
    }
  }
});

// Post-remove hook to update product rating
reviewSchema.post('remove', async function(doc) {
  const Product = mongoose.model('Product');
  const product = await Product.findById(doc.product);
  
  if (product) {
    await product.updateRating();
  }
});

// Instance method to approve review
reviewSchema.methods.approve = function() {
  this.status = 'approved';
  return this.save();
};

// Instance method to reject review
reviewSchema.methods.reject = function(reason) {
  this.status = 'rejected';
  this.rejectionReason = reason;
  return this.save();
};

// Instance method to flag review
reviewSchema.methods.flag = function() {
  this.status = 'flagged';
  return this.save();
};

// Instance method to add vote
reviewSchema.methods.addVote = function(userId, voteType) {
  // Check if user already voted
  const existingVoteIndex = this.helpfulVotes.findIndex(
    v => v.user && v.user.toString() === userId.toString()
  );
  
  if (existingVoteIndex > -1) {
    const oldVote = this.helpfulVotes[existingVoteIndex].vote;
    
    // Remove old vote counts
    if (oldVote === 'helpful') {
      this.helpful = Math.max(0, this.helpful - 1);
    } else {
      this.notHelpful = Math.max(0, this.notHelpful - 1);
    }
    
    // Update vote
    if (oldVote === voteType) {
      // User is removing their vote
      this.helpfulVotes.splice(existingVoteIndex, 1);
    } else {
      // User is changing their vote
      this.helpfulVotes[existingVoteIndex].vote = voteType;
      if (voteType === 'helpful') {
        this.helpful += 1;
      } else {
        this.notHelpful += 1;
      }
    }
  } else {
    // New vote
    this.helpfulVotes.push({
      user: userId,
      vote: voteType
    });
    
    if (voteType === 'helpful') {
      this.helpful += 1;
    } else {
      this.notHelpful += 1;
    }
  }
  
  return this.save();
};

// Instance method to add admin response
reviewSchema.methods.addResponse = function(responseText, adminId) {
  this.response = {
    text: responseText,
    respondedBy: adminId,
    respondedAt: new Date()
  };
  return this.save();
};

// Instance method to report review
reviewSchema.methods.reportReview = function(userId, reason) {
  // Check if user already reported
  const alreadyReported = this.reports.some(
    r => r.user && r.user.toString() === userId.toString()
  );
  
  if (!alreadyReported) {
    this.reports.push({
      user: userId,
      reason,
      reportedAt: new Date()
    });
    this.reportCount += 1;
    this.reported = true;
    
    // Auto-flag if multiple reports
    if (this.reportCount >= 3) {
      this.status = 'flagged';
    }
  }
  
  return this.save();
};

// Static method to get product reviews
reviewSchema.statics.getProductReviews = function(
  productId, 
  { page = 1, limit = 10, sort = '-createdAt', rating = null, verified = null }
) {
  const query = { 
    product: productId, 
    status: 'approved' 
  };
  
  if (rating) {
    query.rating = rating;
  }
  
  if (verified !== null) {
    query.isVerifiedPurchase = verified;
  }
  
  return this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'firstName lastName')
    .populate('response.respondedBy', 'firstName lastName');
};

// Static method to get review stats
reviewSchema.statics.getProductReviewStats = async function(productId) {
  const stats = await this.aggregate([
    { 
      $match: { 
        product: mongoose.Types.ObjectId(productId), 
        status: 'approved' 
      } 
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);
  
  const totalReviews = stats.reduce((sum, stat) => sum + stat.count, 0);
  const averageRating = stats.reduce((sum, stat) => sum + (stat._id * stat.count), 0) / totalReviews || 0;
  
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };
  
  stats.forEach(stat => {
    distribution[stat._id] = stat.count;
  });
  
  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    distribution,
    percentages: {
      5: totalReviews > 0 ? Math.round((distribution[5] / totalReviews) * 100) : 0,
      4: totalReviews > 0 ? Math.round((distribution[4] / totalReviews) * 100) : 0,
      3: totalReviews > 0 ? Math.round((distribution[3] / totalReviews) * 100) : 0,
      2: totalReviews > 0 ? Math.round((distribution[2] / totalReviews) * 100) : 0,
      1: totalReviews > 0 ? Math.round((distribution[1] / totalReviews) * 100) : 0
    }
  };
};

// Static method to get user's reviews
reviewSchema.statics.getUserReviews = function(userId, page = 1, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('product', 'name images slug');
};

// Static method to check if user can review product
reviewSchema.statics.canUserReview = async function(userId, productId) {
  // Check if user already reviewed
  const existingReview = await this.findOne({ user: userId, product: productId });
  if (existingReview) {
    return { canReview: false, reason: 'Already reviewed' };
  }
  
  // Check if user purchased product
  const Order = mongoose.model('Order');
  const hasPurchased = await Order.exists({
    user: userId,
    'items.product': productId,
    paymentStatus: 'paid',
    status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
  });
  
  return { 
    canReview: true, 
    isVerifiedPurchase: !!hasPurchased 
  };
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
