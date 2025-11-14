const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema({
  // Zone name
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Description
  description: {
    type: String
  },

  // Zone type
  zoneType: {
    type: String,
    enum: ['pincode', 'city', 'state', 'country'],
    default: 'pincode'
  },

  // Pincode ranges or specific pincodes
  pincodes: [{
    type: String,
    trim: true
  }],

  // Cities
  cities: [{
    type: String,
    trim: true
  }],

  // States
  states: [{
    type: String,
    trim: true
  }],

  // Delivery charges
  deliveryCharge: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },

  // Free delivery threshold (₹)
  freeDeliveryThreshold: {
    type: Number,
    min: 0,
    default: null // null means no free delivery
  },

  // Estimated delivery days
  estimatedDays: {
    min: {
      type: Number,
      required: true,
      default: 3
    },
    max: {
      type: Number,
      required: true,
      default: 7
    }
  },

  // COD availability
  codAvailable: {
    type: Boolean,
    default: true
  },

  // Zone priority (lower number = higher priority)
  priority: {
    type: Number,
    default: 999
  },

  // Active status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to check if pincode is in this zone
deliveryZoneSchema.methods.isPincodeInZone = function(pincode) {
  if (!pincode) return false;

  // Exact match
  if (this.pincodes.includes(pincode)) {
    return true;
  }

  // Range match (e.g., "400001-400100")
  for (const pin of this.pincodes) {
    if (pin.includes('-')) {
      const [start, end] = pin.split('-');
      const pincodeNum = parseInt(pincode);
      const startNum = parseInt(start);
      const endNum = parseInt(end);

      if (pincodeNum >= startNum && pincodeNum <= endNum) {
        return true;
      }
    }

    // Prefix match (e.g., "4000*" matches all 4000xx)
    if (pin.includes('*')) {
      const prefix = pin.replace('*', '');
      if (pincode.startsWith(prefix)) {
        return true;
      }
    }
  }

  return false;
};

// Index for faster lookups
deliveryZoneSchema.index({ pincodes: 1 });
deliveryZoneSchema.index({ cities: 1 });
deliveryZoneSchema.index({ states: 1 });
deliveryZoneSchema.index({ priority: 1 });

module.exports = mongoose.model('DeliveryZone', deliveryZoneSchema);
