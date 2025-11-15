const mongoose = require('mongoose');

// Variant schema - only created when specific attributes affect price/availability
const variantSchema = new mongoose.Schema({
  // Attribute values that define this variant (e.g., {color: 'Red', size: 'Large'})
  attributeValues: {
    type: Map,
    of: String
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Discount fields for variant
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  availabilityType: {
    type: String,
    enum: ['immediate', 'made-to-order'],
    default: 'immediate'
  },
  deliveryDays: {
    type: Number,
    min: 1,
    default: 7
  },
  images: [{
    url: String,
    public_id: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  // Reference to category (for navigation/filtering)
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  // Reference to attribute set (determines which fields to show)
  attributeSet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AttributeSet',
    required: true
  },
  // Dynamic specifications based on attribute set
  // Stored as key-value pairs: {seating_capacity: '5', material: 'Leather'}
  specifications: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  // Main product images
  images: [{
    url: String,
    public_id: String
  }],
  // Product variants (only if some attributes affect price/stock)
  variants: [variantSchema],

  // Variant Configuration - Price modifiers per attribute option (new flexible system)
  variantPricing: [{
    attributeCode: String,
    attributeName: String,
    options: [{
      value: String,
      label: String,
      priceModifier: {
        type: Number,
        default: 0
      },
      image: {
        url: String,
        public_id: String
      }
    }]
  }],

  // If no variants, use these
  price: {
    type: Number,
    min: 0
  },
  // Discount fields for main product
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  availabilityType: {
    type: String,
    enum: ['immediate', 'made-to-order'],
    default: 'immediate'
  },
  deliveryDays: {
    type: Number,
    min: 1,
    default: 7
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  brand: {
    type: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  onSale: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Virtual field to check if product has variants
productSchema.virtual('hasVariants').get(function() {
  return this.variants && this.variants.length > 0;
});

// Virtual field to check if product is available (has any immediate or made-to-order option)
productSchema.virtual('isAvailable').get(function() {
  if (this.hasVariants) {
    return this.variants.some(variant => variant.isActive);
  }
  return this.isActive;
});

// Virtual field to check if product has immediate availability
productSchema.virtual('hasImmediateAvailability').get(function() {
  if (this.hasVariants) {
    return this.variants.some(variant => variant.availabilityType === 'immediate' && variant.isActive);
  }
  return this.availabilityType === 'immediate' && this.isActive;
});

// Helper function to calculate discounted price
const calculateDiscountedPrice = (price, discount, discountType) => {
  // Check if discount is active
  if (discount <= 0) {
    return price;
  }

  if (discountType === 'percentage') {
    return price - (price * discount / 100);
  } else if (discountType === 'fixed') {
    return Math.max(0, price - discount);
  }

  return price;
};

// Virtual field for variant discounted price
variantSchema.virtual('discountedPrice').get(function() {
  return calculateDiscountedPrice(
    this.price,
    this.discount,
    this.discountType
  );
});

// Virtual field to check if variant has active discount
variantSchema.virtual('hasActiveDiscount').get(function() {
  return this.discount > 0;
});

// Virtual field for product discounted price
productSchema.virtual('discountedPrice').get(function() {
  return calculateDiscountedPrice(
    this.price,
    this.discount,
    this.discountType
  );
});

// Virtual field to check if product has active discount
productSchema.virtual('hasActiveDiscount').get(function() {
  return this.discount > 0;
});

// Virtual field to get price range (for products with variants)
productSchema.virtual('priceRange').get(function() {
  if (this.hasVariants) {
    const prices = this.variants.map(v => v.discountedPrice || v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? { min, max, isSame: true } : { min, max, isSame: false };
  }
  return { min: this.discountedPrice || this.price, max: this.discountedPrice || this.price, isSame: true };
});

module.exports = mongoose.model('Product', productSchema);
