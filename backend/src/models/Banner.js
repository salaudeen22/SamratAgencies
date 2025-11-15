const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    url: {
      type: String,
      required: true
    },
    public_id: String
  },
  link: {
    type: String,
    trim: true
  },
  buttonText: {
    type: String,
    default: 'Shop Now'
  },
  position: {
    type: String,
    enum: ['hero', 'promotional', 'sidebar'],
    default: 'hero'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
bannerSchema.index({ isActive: 1, position: 1 });
bannerSchema.index({ order: 1 });

module.exports = mongoose.model('Banner', bannerSchema);
