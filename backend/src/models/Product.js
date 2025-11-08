const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Sofa', 'Chair', 'Table', 'Bed', 'Cabinet', 'Desk', 'Shelf', 'Other']
  },
  subCategory: {
    type: String
  },
  images: [{
    url: String,
    public_id: String
  }],
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  material: {
    type: String
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  },
  color: [{
    type: String
  }],
  weight: {
    type: Number
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
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
