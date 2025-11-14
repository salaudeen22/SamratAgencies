const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  // Coupon code (promo code)
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  // Description of the coupon
  description: {
    type: String,
    required: true
  },

  // Discount type and amount
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },

  // Coupon application level
  applicationType: {
    type: String,
    enum: ['cart', 'product', 'category'],
    default: 'cart'
  },

  // For product-level or category-level coupons
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],

  // Minimum purchase requirements
  minPurchaseAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  minPurchaseQuantity: {
    type: Number,
    default: 0,
    min: 0
  },

  // Maximum discount cap (for percentage discounts)
  maxDiscountAmount: {
    type: Number,
    min: 0
  },

  // Free shipping
  freeShipping: {
    type: Boolean,
    default: false
  },

  // Usage limits
  usageLimit: {
    type: Number,
    min: 0,
    default: null // null means unlimited
  },
  usageLimitPerUser: {
    type: Number,
    min: 0,
    default: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },

  // User restrictions
  userRestriction: {
    type: String,
    enum: ['all', 'first-time', 'specific-users', 'new-users'],
    default: 'all'
  },
  specificUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Bulk purchase discount
  bulkPurchaseRules: [{
    minQuantity: {
      type: Number,
      required: true,
      min: 1
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    }
  }],

  // Date restrictions
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  // Usage tracking
  usageHistory: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    discountApplied: {
      type: Number
    },
    usedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to check if coupon is currently valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive &&
         now >= this.startDate &&
         now <= this.endDate &&
         (this.usageLimit === null || this.usedCount < this.usageLimit);
});

// Method to check if user can use this coupon
couponSchema.methods.canUserUseCoupon = function(userId, isFirstTimeBuyer = false) {
  // Check if coupon is valid
  if (!this.isValid) {
    return { valid: false, message: 'Coupon is not valid or has expired' };
  }

  // Check user restrictions
  if (this.userRestriction === 'first-time' && !isFirstTimeBuyer) {
    return { valid: false, message: 'This coupon is only for first-time buyers' };
  }

  if (this.userRestriction === 'specific-users') {
    if (!this.specificUsers.some(user => user.toString() === userId.toString())) {
      return { valid: false, message: 'This coupon is not available for your account' };
    }
  }

  // Check per-user usage limit
  const userUsageCount = this.usageHistory.filter(
    usage => usage.user && usage.user.toString() === userId.toString()
  ).length;

  if (userUsageCount >= this.usageLimitPerUser) {
    return { valid: false, message: 'You have already used this coupon the maximum number of times' };
  }

  return { valid: true, message: 'Coupon is valid' };
};

// Method to calculate discount for a cart
couponSchema.methods.calculateDiscount = function(cartTotal, cartItems = []) {
  let discount = 0;

  // Check minimum purchase requirements
  if (cartTotal < this.minPurchaseAmount) {
    return { discount: 0, message: `Minimum purchase amount of ₹${this.minPurchaseAmount} required` };
  }

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity < this.minPurchaseQuantity) {
    return { discount: 0, message: `Minimum purchase quantity of ${this.minPurchaseQuantity} items required` };
  }

  // Calculate discount based on application type
  if (this.applicationType === 'cart') {
    // Cart-level discount
    if (this.discountType === 'percentage') {
      discount = (cartTotal * this.discountValue) / 100;
      if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
        discount = this.maxDiscountAmount;
      }
    } else if (this.discountType === 'fixed') {
      discount = Math.min(this.discountValue, cartTotal);
    }
  } else if (this.applicationType === 'product' && this.applicableProducts.length > 0) {
    // Product-level discount
    const applicableItems = cartItems.filter(item =>
      this.applicableProducts.some(prodId => prodId.toString() === item.product.toString())
    );

    const applicableTotal = applicableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (this.discountType === 'percentage') {
      discount = (applicableTotal * this.discountValue) / 100;
      if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
        discount = this.maxDiscountAmount;
      }
    } else if (this.discountType === 'fixed') {
      discount = Math.min(this.discountValue, applicableTotal);
    }
  } else if (this.applicationType === 'category' && this.applicableCategories.length > 0) {
    // Category-level discount (would need category info in cartItems)
    const applicableItems = cartItems.filter(item =>
      this.applicableCategories.some(catId => catId.toString() === item.category?.toString())
    );

    const applicableTotal = applicableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (this.discountType === 'percentage') {
      discount = (applicableTotal * this.discountValue) / 100;
      if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
        discount = this.maxDiscountAmount;
      }
    } else if (this.discountType === 'fixed') {
      discount = Math.min(this.discountValue, applicableTotal);
    }
  }

  // Check bulk purchase rules
  if (this.bulkPurchaseRules.length > 0) {
    const sortedRules = [...this.bulkPurchaseRules].sort((a, b) => b.minQuantity - a.minQuantity);

    for (const rule of sortedRules) {
      if (totalQuantity >= rule.minQuantity) {
        let bulkDiscount = 0;
        if (rule.discountType === 'percentage') {
          bulkDiscount = (cartTotal * rule.discountValue) / 100;
        } else {
          bulkDiscount = rule.discountValue;
        }

        // Use the better discount (bulk vs regular)
        discount = Math.max(discount, bulkDiscount);
        break;
      }
    }
  }

  return {
    discount: Math.round(discount * 100) / 100,
    freeShipping: this.freeShipping,
    message: 'Coupon applied successfully'
  };
};

// Method to mark coupon as used
couponSchema.methods.markAsUsed = function(userId, orderId, discountApplied) {
  this.usedCount += 1;
  this.usageHistory.push({
    user: userId,
    order: orderId,
    discountApplied,
    usedAt: new Date()
  });
  return this.save();
};

// Index for faster lookups
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
couponSchema.index({ 'usageHistory.user': 1 });

module.exports = mongoose.model('Coupon', couponSchema);
