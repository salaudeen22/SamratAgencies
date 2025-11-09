const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  inputType: {
    type: String,
    enum: ['text', 'number', 'select', 'multiselect', 'color', 'boolean', 'textarea', 'dimension'],
    required: true
  },
  // For select/multiselect types
  options: [{
    label: String,
    value: String
  }],
  unit: {
    type: String, // e.g., 'cm', 'kg', 'inches'
    trim: true
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  // If true, this attribute can create variants (affects price/stock)
  isVariant: {
    type: Boolean,
    default: false
  },
  // Display order
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Helper text for admin
  helpText: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Attribute', attributeSchema);
