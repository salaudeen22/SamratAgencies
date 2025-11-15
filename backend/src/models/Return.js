const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: Number,
    image: String,
    reason: {
      type: String,
      required: true
    }
  }],
  returnReason: {
    type: String,
    required: true,
    enum: [
      'defective',
      'wrong_item',
      'not_as_described',
      'damaged',
      'changed_mind',
      'size_issue',
      'quality_issue',
      'other'
    ]
  },
  returnDescription: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Picked Up', 'Refunded', 'Cancelled'],
    default: 'Pending'
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundMethod: {
    type: String,
    enum: ['original_payment', 'bank_transfer', 'store_credit'],
    default: 'original_payment'
  },
  isRefunded: {
    type: Boolean,
    default: false
  },
  refundedAt: {
    type: Date
  },
  adminNotes: {
    type: String
  },
  pickupAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  trackingInfo: {
    courier: String,
    trackingNumber: String,
    pickedUpAt: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Return', returnSchema);
