const DeliveryZone = require('../models/DeliveryZone');

// @desc    Calculate delivery charge for a pincode
// @route   POST /api/delivery/calculate
// @access  Public
exports.calculateDeliveryCharge = async (req, res) => {
  try {
    const { pincode, cartTotal } = req.body;

    if (!pincode) {
      return res.status(400).json({ message: 'Pincode is required' });
    }

    // Find matching zones (sorted by priority)
    const zones = await DeliveryZone.find({ isActive: true }).sort({ priority: 1 });

    // Find the first matching zone
    let matchedZone = null;
    for (const zone of zones) {
      if (zone.isPincodeInZone(pincode)) {
        matchedZone = zone;
        break;
      }
    }

    if (!matchedZone) {
      return res.status(404).json({
        message: 'Delivery not available for this pincode',
        available: false
      });
    }

    // Calculate delivery charge
    let deliveryCharge = matchedZone.deliveryCharge;
    let isFree = false;

    // Check if cart total qualifies for free delivery
    if (
      matchedZone.freeDeliveryThreshold &&
      cartTotal >= matchedZone.freeDeliveryThreshold
    ) {
      deliveryCharge = 0;
      isFree = true;
    }

    res.json({
      available: true,
      deliveryCharge,
      isFree,
      freeDeliveryThreshold: matchedZone.freeDeliveryThreshold,
      estimatedDays: matchedZone.estimatedDays,
      codAvailable: matchedZone.codAvailable,
      zoneName: matchedZone.name
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all delivery zones
// @route   GET /api/delivery/zones
// @access  Admin
exports.getAllZones = async (req, res) => {
  try {
    const zones = await DeliveryZone.find().sort({ priority: 1 });
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single delivery zone
// @route   GET /api/delivery/zones/:id
// @access  Admin
exports.getZoneById = async (req, res) => {
  try {
    const zone = await DeliveryZone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({ message: 'Delivery zone not found' });
    }

    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create delivery zone
// @route   POST /api/delivery/zones
// @access  Admin
exports.createZone = async (req, res) => {
  try {
    const zone = new DeliveryZone(req.body);
    const createdZone = await zone.save();
    res.status(201).json(createdZone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery zone
// @route   PUT /api/delivery/zones/:id
// @access  Admin
exports.updateZone = async (req, res) => {
  try {
    const zone = await DeliveryZone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({ message: 'Delivery zone not found' });
    }

    Object.assign(zone, req.body);
    const updatedZone = await zone.save();

    res.json(updatedZone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete delivery zone
// @route   DELETE /api/delivery/zones/:id
// @access  Admin
exports.deleteZone = async (req, res) => {
  try {
    const zone = await DeliveryZone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({ message: 'Delivery zone not found' });
    }

    await DeliveryZone.deleteOne({ _id: req.params.id });
    res.json({ message: 'Delivery zone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check pincode serviceability
// @route   GET /api/delivery/check/:pincode
// @access  Public
exports.checkPincode = async (req, res) => {
  try {
    const { pincode } = req.params;

    const zones = await DeliveryZone.find({ isActive: true }).sort({ priority: 1 });

    for (const zone of zones) {
      if (zone.isPincodeInZone(pincode)) {
        return res.json({
          serviceable: true,
          zone: {
            name: zone.name,
            deliveryCharge: zone.deliveryCharge,
            freeDeliveryThreshold: zone.freeDeliveryThreshold,
            estimatedDays: zone.estimatedDays,
            codAvailable: zone.codAvailable
          }
        });
      }
    }

    res.json({ serviceable: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
