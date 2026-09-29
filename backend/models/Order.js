const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sku: String,
  image: String,
  variant: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: true });

const orderSchema = new mongoose.Schema(
  {
    // Order Identification
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    
    // Customer
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: false // Allows guest checkout
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    
    // Items
    items: [orderItemSchema],
    
    // Pricing
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    discountCode: {
      code: String,
      amount: Number
    },
    tax: {
      type: Number,
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    
    // Shipping Address
    shippingAddress: {
      fullName: {
        type: String,
        required: true
      },
      addressLine1: {
        type: String,
        required: true
      },
      addressLine2: String,
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true,
        default: 'United States'
      },
      phone: String
    },
    
    // Billing Address
    billingAddress: {
      fullName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    sameAsShipping: {
      type: Boolean,
      default: true
    },
    
    // Payment
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
      index: true
    },
    paymentIntentId: String, // Stripe payment intent ID
    transactionId: String,
    
    // Order Status
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
      ],
      default: 'pending',
      index: true
    },
    
    // Fulfillment
    shippingMethod: {
      type: String,
      enum: ['standard', 'express', 'overnight', 'international'],
      default: 'standard'
    },
    trackingNumber: String,
    trackingUrl: String,
    carrier: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date,
    
    // Give Light Program
    isGiveLight: {
      type: Boolean,
      default: false
    },
    giveLightCause: {
      type: String,
      enum: ['disaster-relief', 'refugee-relief', 'allocate-as-needed']
    },
    
    // Notes
    customerNotes: String,
    internalNotes: String,
    
    // Cancellation/Refund
    cancelledAt: Date,
    cancellationReason: String,
    refundedAt: Date,
    refundAmount: Number,
    refundReason: String,
    
    // Analytics
    source: {
      type: String,
      enum: ['web', 'mobile', 'admin'],
      default: 'web'
    },
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    
    // Email Notifications
    emailsSent: {
      confirmation: { type: Boolean, default: false },
      shipping: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ customerEmail: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    // Generate order number: LUM-YYYYMMDD-XXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Find last order of the day
    const lastOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^LUM-${dateStr}`)
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `LUM-${dateStr}-${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to calculate item subtotals
orderSchema.pre('save', function(next) {
  this.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });
  next();
});

// Instance method to mark as paid
orderSchema.methods.markAsPaid = function(transactionId) {
  this.paymentStatus = 'paid';
  this.transactionId = transactionId;
  this.status = 'confirmed';
  return this.save();
};

// Instance method to mark as shipped
orderSchema.methods.markAsShipped = function(trackingNumber, carrier) {
  this.status = 'shipped';
  this.trackingNumber = trackingNumber;
  this.carrier = carrier;
  this.shippedAt = new Date();
  
  // Generate tracking URL based on carrier
  if (carrier === 'USPS') {
    this.trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  } else if (carrier === 'UPS') {
    this.trackingUrl = `https://www.ups.com/track?tracknum=${trackingNumber}`;
  } else if (carrier === 'FedEx') {
    this.trackingUrl = `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`;
  }
  
  return this.save();
};

// Instance method to mark as delivered
orderSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};

// Instance method to cancel order
orderSchema.methods.cancelOrder = function(reason) {
  if (['delivered', 'shipped', 'cancelled'].includes(this.status)) {
    throw new Error('Cannot cancel order in current status');
  }
  
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  return this.save();
};

// Instance method to refund order
orderSchema.methods.refundOrder = async function(amount, reason) {
  if (this.paymentStatus !== 'paid') {
    throw new Error('Can only refund paid orders');
  }
  
  const refundAmount = amount || this.total;
  
  if (refundAmount > this.total) {
    throw new Error('Refund amount cannot exceed order total');
  }
  
  this.refundAmount = refundAmount;
  this.refundReason = reason;
  this.refundedAt = new Date();
  
  if (refundAmount === this.total) {
    this.paymentStatus = 'refunded';
    this.status = 'refunded';
  } else {
    this.paymentStatus = 'partially_refunded';
  }
  
  return this.save();
};

// Instance method to update user's order stats
orderSchema.methods.updateUserStats = async function() {
  if (!this.user) return;
  
  const User = mongoose.model('User');
  const user = await User.findById(this.user);
  
  if (user) {
    user.totalSpent += this.total;
    user.orderCount += 1;
    
    // Award loyalty points (1 point per dollar)
    const points = Math.floor(this.total);
    user.loyaltyPoints += points;
    
    await user.save();
  }
};

// Static method to get user orders
orderSchema.statics.getUserOrders = function(userId, page = 1, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('items.product', 'name images');
};

// Static method to get order by number and email
orderSchema.statics.getOrderByNumberAndEmail = function(orderNumber, email) {
  return this.findOne({ 
    orderNumber: orderNumber.toUpperCase(), 
    customerEmail: email.toLowerCase() 
  });
};

// Static method to get dashboard stats
orderSchema.statics.getDashboardStats = async function(startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $nin: ['cancelled', 'refunded'] }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' }
      }
    }
  ]);
  
  return stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
};

// Post-save hook to update product purchase count
orderSchema.post('save', async function(doc) {
  if (doc.status === 'confirmed' && doc.paymentStatus === 'paid') {
    const Product = mongoose.model('Product');
    
    for (const item of doc.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { purchaseCount: item.quantity }
      });
    }
    
    // Update user stats
    await doc.updateUserStats();
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
