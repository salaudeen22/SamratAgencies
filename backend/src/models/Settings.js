const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Site Information
  siteName: {
    type: String,
    default: 'Samrat Agencies'
  },
  siteDescription: {
    type: String,
    default: 'Premium Furniture & Samsung Dealer in Bangalore'
  },
  siteEmail: {
    type: String,
    default: 'info@samratagencies.com'
  },
  sitePhone: {
    type: String,
    default: '+91 1234567890'
  },
  siteAddress: {
    type: String,
    default: 'Bangalore, Karnataka, India'
  },

  // Business Hours
  businessHours: {
    monday: { type: String, default: '9:00 AM - 6:00 PM' },
    tuesday: { type: String, default: '9:00 AM - 6:00 PM' },
    wednesday: { type: String, default: '9:00 AM - 6:00 PM' },
    thursday: { type: String, default: '9:00 AM - 6:00 PM' },
    friday: { type: String, default: '9:00 AM - 6:00 PM' },
    saturday: { type: String, default: '9:00 AM - 6:00 PM' },
    sunday: { type: String, default: 'Closed' }
  },

  // Tax & Shipping
  taxRate: {
    type: Number,
    default: 18, // GST %
    min: 0,
    max: 100
  },
  defaultShippingCharge: {
    type: Number,
    default: 0
  },
  freeShippingThreshold: {
    type: Number,
    default: 10000
  },

  // Social Media
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },

  // Payment Settings
  razorpayEnabled: {
    type: Boolean,
    default: true
  },
  codEnabled: {
    type: Boolean,
    default: true
  },

  // Email Settings
  emailSettings: {
    smtpHost: { type: String, default: '' },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: '' },
    smtpPassword: { type: String, default: '' },
    fromEmail: { type: String, default: '' },
    fromName: { type: String, default: 'Samrat Agencies' }
  },

  // SEO Settings
  seo: {
    metaTitle: { type: String, default: 'Samrat Agencies - Furniture Expert | Samsung Dealer | Bangalore' },
    metaDescription: { type: String, default: 'Samrat Agencies - Premium Furniture & Samsung Dealer in Bangalore. Established 1991. Rated 5.0★ with 108+ reviews.' },
    metaKeywords: { type: String, default: 'furniture, samsung, bangalore, home furniture, office furniture' },
    ogImage: { type: String, default: '' }
  },

  // Other Settings
  currency: {
    type: String,
    default: '₹'
  },
  currencyCode: {
    type: String,
    default: 'INR'
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },

  // Singleton pattern - only one settings document
  _isSingleton: {
    type: Boolean,
    default: true,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
