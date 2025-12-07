const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const CollaborativeFilterService = require('../services/collaborativeFilterService');

// Helper function to get root category (Level 1)
async function getRootCategory(categoryId) {
  if (!categoryId) return null;

  let category = await Category.findById(categoryId).lean();
  if (!category) return null;

  // Traverse up to find root (parent = null means Level 1)
  while (category.parent) {
    category = await Category.findById(category.parent).lean();
    if (!category) return null;
  }

  return category;
}

// Helper function to get all category IDs in the same hierarchy
async function getCategoryHierarchyIds(categoryId) {
  if (!categoryId) return [];

  const rootCategory = await getRootCategory(categoryId);
  if (!rootCategory) return [];

  // Get all categories under this root
  const allCategories = await Category.find({}).lean();
  const hierarchyIds = [rootCategory._id.toString()];

  // Build category tree
  const findChildren = (parentId) => {
    const children = allCategories.filter(cat =>
      cat.parent && cat.parent.toString() === parentId.toString()
    );

    children.forEach(child => {
      hierarchyIds.push(child._id.toString());
      findChildren(child._id);
    });
  };

  findChildren(rootCategory._id);
  return hierarchyIds;
}

// @desc    Get similar products using collaborative filtering + category fallback
// @route   GET /api/recommendations/similar/:productId
// @access  Public
exports.getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 6;

    // Get the current product (support both ObjectId and slug)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
    const query = isObjectId ? { _id: productId } : { slug: productId };

    const product = await Product.findOne(query)
      .populate('category')
      .populate('subcategory');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Try collaborative filtering first
    const cfRecommendations = await CollaborativeFilterService.getRecommendations(
      product._id.toString(),
      limit
    );

    let similarProducts = [];

    // Get products from CF recommendations
    if (cfRecommendations.length > 0) {
      similarProducts = await Product.find({
        _id: { $in: cfRecommendations },
        isActive: true
      })
        .populate('category', 'name')
        .select('name price images discount discountType category subcategory tags')
        .lean();
    }

    // If CF didn't return enough, use category-based fallback
    if (similarProducts.length < limit) {
      const remaining = limit - similarProducts.length;
      const excludeIds = [product._id, ...similarProducts.map(p => p._id)];

      // Get all category IDs within the same Level 1 hierarchy
      const hierarchyIds = await getCategoryHierarchyIds(product.category._id);

      // Priority 1: Same Level 3 category
      let fallbackProducts = await Product.find({
        _id: { $nin: excludeIds },
        category: product.category._id,
        isActive: true
      })
        .populate('category', 'name')
        .limit(remaining)
        .select('name price images discount discountType category subcategory tags')
        .lean();

      // Priority 2: Same Level 2 category
      if (fallbackProducts.length < remaining) {
        const stillNeeded = remaining - fallbackProducts.length;
        const allExcludeIds = [...excludeIds, ...fallbackProducts.map(p => p._id)];

        const currentCat = await Category.findById(product.category._id).lean();
        if (currentCat?.parent) {
          const siblingCategories = await Category.find({
            parent: currentCat.parent,
            _id: { $ne: product.category._id }
          }).select('_id').lean();

          const siblingCatIds = siblingCategories.map(c => c._id);

          if (siblingCatIds.length > 0) {
            const level2Products = await Product.find({
              _id: { $nin: allExcludeIds },
              category: { $in: siblingCatIds },
              isActive: true
            })
              .populate('category', 'name')
              .limit(stillNeeded)
              .select('name price images discount discountType category subcategory tags')
              .lean();

            fallbackProducts = [...fallbackProducts, ...level2Products];
          }
        }
      }

      // Priority 3: Same Level 1 hierarchy
      if (fallbackProducts.length < remaining && hierarchyIds.length > 0) {
        const stillNeeded = remaining - fallbackProducts.length;
        const allExcludeIds = [...excludeIds, ...fallbackProducts.map(p => p._id)];

        const hierarchyProducts = await Product.find({
          _id: { $nin: allExcludeIds },
          category: { $in: hierarchyIds },
          isActive: true
        })
          .populate('category', 'name')
          .limit(stillNeeded)
          .select('name price images discount discountType category subcategory tags')
          .lean();

        fallbackProducts = [...fallbackProducts, ...hierarchyProducts];
      }

      similarProducts = [...similarProducts, ...fallbackProducts];
    }

    res.json(similarProducts);
  } catch (error) {
    console.error('Error getting similar products:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get frequently bought together products using collaborative filtering
// @route   GET /api/recommendations/frequently-bought/:productId
// @access  Public
exports.getFrequentlyBoughtTogether = async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 3;

    // Get the current product (support both ObjectId and slug)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
    const query = isObjectId ? { _id: productId } : { slug: productId };

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Use collaborative filtering service
    const cfProductIds = await CollaborativeFilterService.getFrequentlyBoughtTogether(
      product._id.toString(),
      limit
    );

    let frequentlyBought = [];

    if (cfProductIds.length > 0) {
      frequentlyBought = await Product.find({
        _id: { $in: cfProductIds },
        isActive: true
      })
        .populate('category', 'name')
        .select('name price images discount discountType category subcategory')
        .lean();
    }

    // If not enough products from order history, use category fallback
    if (frequentlyBought.length < limit) {
      const hierarchyIds = await getCategoryHierarchyIds(product.category._id);
      const remaining = limit - frequentlyBought.length;
      const excludeIds = [product._id, ...frequentlyBought.map(p => p._id)];

      // Priority 1: Same Level 3 category
      let fallbackProducts = await Product.find({
        _id: { $nin: excludeIds },
        category: product.category._id,
        isActive: true
      })
        .populate('category', 'name')
        .limit(remaining)
        .select('name price images discount discountType category subcategory')
        .lean();

      // Priority 2: Same Level 2
      if (fallbackProducts.length < remaining) {
        const stillNeeded = remaining - fallbackProducts.length;
        const allExcludeIds = [...excludeIds, ...fallbackProducts.map(p => p._id)];

        const currentCat = await Category.findById(product.category._id).lean();
        if (currentCat?.parent) {
          const siblingCategories = await Category.find({
            parent: currentCat.parent,
            _id: { $ne: product.category._id }
          }).select('_id').lean();

          const siblingCatIds = siblingCategories.map(c => c._id);

          if (siblingCatIds.length > 0) {
            const level2Products = await Product.find({
              _id: { $nin: allExcludeIds },
              category: { $in: siblingCatIds },
              isActive: true
            })
              .populate('category', 'name')
              .limit(stillNeeded)
              .select('name price images discount discountType category subcategory')
              .lean();

            fallbackProducts = [...fallbackProducts, ...level2Products];
          }
        }
      }

      // Priority 3: Same Level 1 hierarchy
      if (fallbackProducts.length < remaining && hierarchyIds.length > 0) {
        const stillNeeded = remaining - fallbackProducts.length;
        const allExcludeIds = [...excludeIds, ...fallbackProducts.map(p => p._id)];

        const hierarchyProducts = await Product.find({
          _id: { $nin: allExcludeIds },
          category: { $in: hierarchyIds },
          isActive: true
        })
          .populate('category', 'name')
          .limit(stillNeeded)
          .select('name price images discount discountType category subcategory')
          .lean();

        fallbackProducts = [...fallbackProducts, ...hierarchyProducts];
      }

      frequentlyBought = [...frequentlyBought, ...fallbackProducts];
    }

    res.json(frequentlyBought);
  } catch (error) {
    console.error('Error getting frequently bought together:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get personalized recommendations based on cart items
// @route   POST /api/recommendations/cart-based
// @access  Public
exports.getCartBasedRecommendations = async (req, res) => {
  try {
    const { cartItemIds } = req.body; // Array of product IDs in cart
    const limit = parseInt(req.query.limit) || 6;

    if (!cartItemIds || cartItemIds.length === 0) {
      return res.json([]);
    }

    // Get cart products to understand customer preferences
    const cartProducts = await Product.find({
      _id: { $in: cartItemIds }
    }).select('category subcategory tags price');

    // Extract categories, subcategories, and tags
    const categories = [...new Set(cartProducts.map(p => p.category?.toString()).filter(Boolean))];
    const subcategories = [...new Set(cartProducts.map(p => p.subcategory?.toString()).filter(Boolean))];
    const allTags = [...new Set(cartProducts.flatMap(p => p.tags || []))];

    // Calculate average price
    const avgPrice = cartProducts.reduce((sum, p) => sum + p.price, 0) / cartProducts.length;
    const priceMin = avgPrice * 0.5;
    const priceMax = avgPrice * 1.5;

    // Find complementary products
    const recommendations = await Product.find({
      _id: { $nin: cartItemIds }, // Exclude items already in cart
      isActive: true,
      $or: [
        { category: { $in: categories } },
        { subcategory: { $in: subcategories } },
        { tags: { $in: allTags } },
        { price: { $gte: priceMin, $lte: priceMax } }
      ]
    })
      .populate('category', 'name')
      .limit(limit)
      .select('name price images discount discountType category tags')
      .lean();

    res.json(recommendations);
  } catch (error) {
    console.error('Error getting cart-based recommendations:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get "Complete the Look" recommendations (matching furniture sets)
// @route   GET /api/recommendations/complete-look/:productId
// @access  Public
exports.getCompleteTheLook = async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    // Get the current product (support both ObjectId and slug)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
    const query = isObjectId ? { _id: productId } : { slug: productId };

    const product = await Product.findOne(query)
      .populate('category')
      .populate('subcategory');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get all category IDs within the same Level 1 hierarchy
    const hierarchyIds = await getCategoryHierarchyIds(product.category._id);

    // Priority 1: Complementary items from same Level 2 but different Level 3
    // For example, if looking at L-Shaped Sofa, show other types of sofas
    let completeTheLook = [];

    const currentCat = await Category.findById(product.category._id).lean();
    if (currentCat?.parent) {
      // Find sibling Level 3 categories under same Level 2 parent
      const siblingCategories = await Category.find({
        parent: currentCat.parent,
        _id: { $ne: product.category._id }
      }).select('_id').lean();

      const siblingCatIds = siblingCategories.map(c => c._id);

      if (siblingCatIds.length > 0) {
        completeTheLook = await Product.find({
          _id: { $ne: product._id },
          category: { $in: siblingCatIds },
          isActive: true
        })
          .populate('category', 'name')
          .populate('subcategory', 'name')
          .limit(limit)
          .select('name price images discount discountType category subcategory tags')
          .lean();
      }
    }

    // Priority 2: Other items from same Level 1 hierarchy (stay within root category)
    if (completeTheLook.length < limit && hierarchyIds.length > 0) {
      const remaining = limit - completeTheLook.length;
      const excludeIds = [product._id, ...completeTheLook.map(p => p._id)];

      const hierarchyProducts = await Product.find({
        _id: { $nin: excludeIds },
        category: { $in: hierarchyIds, $ne: product.category._id },
        isActive: true
      })
        .populate('category', 'name')
        .populate('subcategory', 'name')
        .limit(remaining)
        .select('name price images discount discountType category subcategory tags')
        .lean();

      completeTheLook = [...completeTheLook, ...hierarchyProducts];
    }

    // Priority 3: If still not enough, show same category items
    if (completeTheLook.length < limit) {
      const remaining = limit - completeTheLook.length;
      const excludeIds = [product._id, ...completeTheLook.map(p => p._id)];

      const sameCategory = await Product.find({
        _id: { $nin: excludeIds },
        category: product.category._id,
        isActive: true
      })
        .populate('category', 'name')
        .populate('subcategory', 'name')
        .limit(remaining)
        .select('name price images discount discountType category subcategory tags')
        .lean();

      completeTheLook = [...completeTheLook, ...sameCategory];
    }

    res.json(completeTheLook);
  } catch (error) {
    console.error('Error getting complete the look:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending/popular products using collaborative filtering
// @route   GET /api/recommendations/trending
// @access  Public
exports.getTrendingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const days = parseInt(req.query.days) || 30;

    // Use collaborative filtering service
    const trendingProductIds = await CollaborativeFilterService.getTrendingProducts(limit, days);

    let products = [];

    if (trendingProductIds.length > 0) {
      const productDocs = await Product.find({
        _id: { $in: trendingProductIds },
        isActive: true
      })
        .populate('category', 'name')
        .select('name price images discount discountType category')
        .lean();

      // Sort products by trending order
      products = trendingProductIds
        .map(id => productDocs.find(p => p._id.toString() === id.toString()))
        .filter(Boolean);
    }

    res.json(products);
  } catch (error) {
    console.error('Error getting trending products:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get new arrivals
// @route   GET /api/recommendations/new-arrivals
// @access  Public
exports.getNewArrivals = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const newArrivals = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('category', 'name')
      .select('name price images discount discountType category createdAt')
      .lean();

    res.json(newArrivals);
  } catch (error) {
    console.error('Error getting new arrivals:', error);
    res.status(500).json({ message: error.message });
  }
};
