const CF = require('collaborative-filter');
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * Build recommendation model from order history
 * Returns recommendations based on collaborative filtering
 */
class CollaborativeFilterService {
  /**
   * Get personalized recommendations for a product based on order history
   * @param {String} productId - Product ID to get recommendations for
   * @param {Number} limit - Number of recommendations to return
   * @returns {Array} Array of recommended product IDs
   */
  static async getRecommendations(productId, limit = 6) {
    try {
      // Get all completed orders with items
      const orders = await Order.find({
        status: { $nin: ['cancelled', 'failed'] }
      })
        .select('items user')
        .lean();

      if (orders.length < 2) {
        // Not enough data for collaborative filtering
        return [];
      }

      // Build user-product matrix
      // Structure: { userId: { productId: rating } }
      const userProductMatrix = {};
      const allProducts = new Set();

      orders.forEach(order => {
        const userId = order.user?.toString() || order._id.toString();

        if (!userProductMatrix[userId]) {
          userProductMatrix[userId] = {};
        }

        order.items.forEach(item => {
          const itemProductId = item.product.toString();
          allProducts.add(itemProductId);

          // Rating based on quantity (more quantity = higher rating)
          // Scale: 1-5 stars based on quantity
          const rating = Math.min(5, item.quantity);
          userProductMatrix[userId][itemProductId] = rating;
        });
      });

      // Convert to array format for collaborative-filter library
      // Format: [userId, productId, rating]
      const ratingsArray = [];
      Object.keys(userProductMatrix).forEach(userId => {
        Object.keys(userProductMatrix[userId]).forEach(prodId => {
          ratingsArray.push([
            userId,
            prodId,
            userProductMatrix[userId][prodId]
          ]);
        });
      });

      if (ratingsArray.length < 5) {
        // Not enough ratings data
        return [];
      }

      // Train collaborative filtering model
      const model = new CF.Model();
      model.train(ratingsArray);

      // Get all product IDs
      const productIds = Array.from(allProducts);

      // Find users who bought this product
      const usersWhoBought = [];
      Object.keys(userProductMatrix).forEach(userId => {
        if (userProductMatrix[userId][productId]) {
          usersWhoBought.push(userId);
        }
      });

      if (usersWhoBought.length === 0) {
        // Product has no purchase history
        return [];
      }

      // Get recommendations for users who bought this product
      const recommendationScores = {};

      usersWhoBought.forEach(userId => {
        productIds.forEach(prodId => {
          // Skip the current product
          if (prodId === productId) return;

          try {
            // Predict rating for this user-product combination
            const prediction = model.predict(userId, prodId);

            if (prediction > 0) {
              if (!recommendationScores[prodId]) {
                recommendationScores[prodId] = [];
              }
              recommendationScores[prodId].push(prediction);
            }
          } catch (err) {
            // Prediction failed, skip this combination
          }
        });
      });

      // Calculate average score for each product
      const avgScores = Object.keys(recommendationScores).map(prodId => {
        const scores = recommendationScores[prodId];
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        return { productId: prodId, score: avgScore };
      });

      // Sort by score and return top N
      const topRecommendations = avgScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.productId);

      return topRecommendations;
    } catch (error) {
      console.error('Collaborative filtering error:', error);
      return [];
    }
  }

  /**
   * Get frequently bought together using collaborative filtering
   * @param {String} productId - Product ID
   * @param {Number} limit - Number of products to return
   * @returns {Array} Array of product IDs
   */
  static async getFrequentlyBoughtTogether(productId, limit = 3) {
    try {
      // Get orders containing this product
      const orders = await Order.find({
        'items.product': productId,
        status: { $nin: ['cancelled', 'failed'] }
      })
        .select('items')
        .lean();

      if (orders.length === 0) {
        return [];
      }

      // Count co-occurrences
      const coOccurrences = {};

      orders.forEach(order => {
        const productIds = order.items.map(item => item.product.toString());

        productIds.forEach(prodId => {
          if (prodId !== productId) {
            coOccurrences[prodId] = (coOccurrences[prodId] || 0) + 1;
          }
        });
      });

      // Sort by frequency and return top N
      const sortedProducts = Object.entries(coOccurrences)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(entry => entry[0]);

      return sortedProducts;
    } catch (error) {
      console.error('Frequently bought together error:', error);
      return [];
    }
  }

  /**
   * Get trending products based on recent purchase patterns
   * With smart fallback to popular products if no recent orders
   * @param {Number} limit - Number of products to return
   * @param {Number} days - Number of days to look back (default 30)
   * @returns {Array} Array of product IDs
   */
  static async getTrendingProducts(limit = 8, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const orders = await Order.find({
        createdAt: { $gte: startDate },
        status: { $nin: ['cancelled', 'failed'] }
      })
        .select('items')
        .lean();

      // Count product occurrences
      const productCounts = {};

      orders.forEach(order => {
        order.items.forEach(item => {
          const prodId = item.product.toString();
          productCounts[prodId] = (productCounts[prodId] || 0) + item.quantity;
        });
      });

      // Sort by count and return top N
      let trending = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(entry => entry[0]);

      // Fallback: If not enough trending products, get from all-time orders
      if (trending.length < limit) {
        const allOrders = await Order.find({
          status: { $nin: ['cancelled', 'failed'] }
        })
          .select('items')
          .lean();

        const allProductCounts = {};
        allOrders.forEach(order => {
          order.items.forEach(item => {
            const prodId = item.product.toString();
            if (!trending.includes(prodId)) {
              allProductCounts[prodId] = (allProductCounts[prodId] || 0) + item.quantity;
            }
          });
        });

        const additionalTrending = Object.entries(allProductCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit - trending.length)
          .map(entry => entry[0]);

        trending = [...trending, ...additionalTrending];
      }

      return trending;
    } catch (error) {
      console.error('Trending products error:', error);
      return [];
    }
  }
}

module.exports = CollaborativeFilterService;
