const mongoose = require('mongoose');

// Variant schema - only created when specific attributes affect price/stock
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
  stock: {
    type: Number,
    default: 0,
    min: 0
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
  // If no variants, use these
  price: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
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

// Virtual field to get total stock
productSchema.virtual('totalStock').get(function() {
  if (this.hasVariants) {
    return this.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
  }
  return this.stock || 0;
});

// Virtual field to check stock availability
productSchema.virtual('inStock').get(function() {
  if (this.hasVariants) {
    return this.variants.some(variant => variant.stock > 0 && variant.isActive);
  }
  return this.stock > 0;
});

// Virtual field to get price range (for products with variants)
productSchema.virtual('priceRange').get(function() {
  if (this.hasVariants) {
    const prices = this.variants.map(v => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? { min, max, isSame: true } : { min, max, isSame: false };
  }
  return { min: this.price, max: this.price, isSame: true };
});

module.exports = mongoose.model('Product', productSchema);
