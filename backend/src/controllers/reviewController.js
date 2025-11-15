const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    const query = {
      product: productId,
      isApproved: true
    };

    if (rating) {
      query.rating = parseInt(rating);
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Create a review
const createReview = async (req, res) => {
  try {
    const { product, productId, rating, title, comment, images } = req.body;
    const userId = req.user._id;

    // Support both 'product' and 'productId' field names
    const targetProductId = product || productId;

    if (!targetProductId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: targetProductId,
      user: userId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Check if user purchased this product
    const hasPurchased = await Order.exists({
      user: userId,
      'items.product': targetProductId,
      status: 'delivered'
    });

    const review = new Review({
      product: targetProductId,
      user: userId,
      rating,
      title,
      comment,
      images: images || [],
      isVerifiedPurchase: !!hasPurchased,
      isApproved: true // Auto-approve for now
    });

    await review.save();

    // Update product rating
    await updateProductRating(targetProductId);

    await review.populate('user', 'name');

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

// Update product's average rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({
      product: productId,
      isApproved: true
    });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        numReviews: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      numReviews: reviews.length
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user._id;

    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();
    await updateProductRating(review.product);
    await review.populate('user', 'name');

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await updateProductRating(review.product);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
};
