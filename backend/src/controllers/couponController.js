const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Admin
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      applicationType,
      applicableProducts,
      applicableCategories,
      minPurchaseAmount,
      minPurchaseQuantity,
      maxDiscountAmount,
      freeShipping,
      usageLimit,
      usageLimitPerUser,
      userRestriction,
      specificUsers,
      bulkPurchaseRules,
      startDate,
      endDate,
      isActive
    } = req.body;

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      applicationType,
      applicableProducts,
      applicableCategories,
      minPurchaseAmount,
      minPurchaseQuantity,
      maxDiscountAmount,
      freeShipping,
      usageLimit,
      usageLimitPerUser,
      userRestriction,
      specificUsers,
      bulkPurchaseRules,
      startDate,
      endDate,
      isActive
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons (with pagination and filters)
// @route   GET /api/coupons
// @access  Admin
exports.getAllCoupons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    if (req.query.applicationType) {
      filter.applicationType = req.query.applicationType;
    }
    if (req.query.search) {
      filter.$or = [
        { code: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await Coupon.countDocuments(filter);
    const coupons = await Coupon.find(filter)
      .populate('applicableProducts', 'name slug price')
      .populate('applicableCategories', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.json({
      coupons,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active coupons for customers
// @route   GET /api/coupons/active
// @access  Public
exports.getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
      ]
    })
      .select('-usageHistory -specificUsers')
      .populate('applicableProducts', 'name slug')
      .populate('applicableCategories', 'name slug')
      .sort({ createdAt: -1 });

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Admin
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('applicableProducts', 'name slug price')
      .populate('applicableCategories', 'name slug')
      .populate('usageHistory.user', 'name email')
      .populate('usageHistory.order', 'orderNumber totalPrice');

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate and get coupon by code
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = async (req, res) => {
  try {
    const { code, userId, cartTotal, cartItems } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() })
      .populate('applicableProducts', '_id')
      .populate('applicableCategories', '_id');

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    // Check if user is first-time buyer
    let isFirstTimeBuyer = false;
    if (userId) {
      const orderCount = await Order.countDocuments({
        user: userId,
        status: { $in: ['delivered', 'completed'] }
      });
      isFirstTimeBuyer = orderCount === 0;
    }

    // Check if user can use coupon
    const userValidation = coupon.canUserUseCoupon(userId || null, isFirstTimeBuyer);
    if (!userValidation.valid) {
      return res.status(400).json({ message: userValidation.message });
    }

    // Calculate discount
    const discountResult = coupon.calculateDiscount(cartTotal, cartItems);

    if (discountResult.discount === 0 && discountResult.message) {
      return res.status(400).json({ message: discountResult.message });
    }

    res.json({
      valid: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        applicationType: coupon.applicationType,
        freeShipping: coupon.freeShipping
      },
      discount: discountResult.discount,
      freeShipping: discountResult.freeShipping,
      message: discountResult.message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Admin
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Validate dates if provided
    const startDate = req.body.startDate || coupon.startDate;
    const endDate = req.body.endDate || coupon.endDate;

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check if code is being changed and if new code exists
    if (req.body.code && req.body.code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: req.body.code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      coupon.code = req.body.code.toUpperCase();
    }

    // Update fields
    const fieldsToUpdate = [
      'description', 'discountType', 'discountValue', 'applicationType',
      'applicableProducts', 'applicableCategories', 'minPurchaseAmount',
      'minPurchaseQuantity', 'maxDiscountAmount', 'freeShipping',
      'usageLimit', 'usageLimitPerUser', 'userRestriction', 'specificUsers',
      'bulkPurchaseRules', 'startDate', 'endDate', 'isActive'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        coupon[field] = req.body[field];
      }
    });

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Check if coupon has been used
    if (coupon.usedCount > 0) {
      // Instead of deleting, just deactivate it
      coupon.isActive = false;
      await coupon.save();
      return res.json({ message: 'Coupon has been deactivated (it has usage history)' });
    }

    await Coupon.deleteOne({ _id: req.params.id });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get coupon statistics
// @route   GET /api/coupons/:id/stats
// @access  Admin
exports.getCouponStats = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('usageHistory.user', 'name email')
      .populate('usageHistory.order', 'orderNumber totalPrice createdAt');

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    const totalDiscount = coupon.usageHistory.reduce(
      (sum, usage) => sum + (usage.discountApplied || 0),
      0
    );

    const uniqueUsers = new Set(
      coupon.usageHistory.map(usage => usage.user?._id?.toString()).filter(Boolean)
    ).size;

    res.json({
      code: coupon.code,
      description: coupon.description,
      usedCount: coupon.usedCount,
      usageLimit: coupon.usageLimit,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
      uniqueUsers,
      averageDiscount: coupon.usedCount > 0 ? Math.round((totalDiscount / coupon.usedCount) * 100) / 100 : 0,
      usageHistory: coupon.usageHistory,
      isValid: coupon.isValid
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark coupon as used (called when order is placed)
// @route   POST /api/coupons/:id/use
// @access  Private
exports.useCoupon = async (req, res) => {
  try {
    const { userId, orderId, discountApplied } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await coupon.markAsUsed(userId, orderId, discountApplied);

    res.json({ message: 'Coupon usage recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
