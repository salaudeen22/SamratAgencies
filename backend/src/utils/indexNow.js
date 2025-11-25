const axios = require('axios');
const logger = require('../config/logger');

// IndexNow configuration
const INDEXNOW_KEY = '81f3e5e8955448008d96b009fe55e242';
const BASE_URL = process.env.FRONTEND_URL || 'https://samratagencies.in';
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

// IndexNow endpoints for different search engines
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',  // Primary endpoint (Bing, Yandex)
  'https://www.bing.com/indexnow',      // Bing specific
  'https://yandex.com/indexnow',        // Yandex specific
];

/**
 * Submit a single URL to IndexNow
 * @param {string} url - The full URL to submit
 */
const submitToIndexNow = async (url) => {
  try {
    const host = new URL(BASE_URL).hostname;

    const payload = {
      host: host,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: [url]
    };

    // Submit to primary endpoint
    const response = await axios.post(INDEXNOW_ENDPOINTS[0], payload, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      timeout: 10000
    });

    logger.info(`IndexNow submitted successfully: ${url}`, {
      status: response.status,
      url: url
    });

    return { success: true, url };
  } catch (error) {
    logger.error(`IndexNow submission failed for ${url}:`, {
      error: error.message,
      response: error.response?.data
    });
    return { success: false, url, error: error.message };
  }
};

/**
 * Submit multiple URLs to IndexNow (batch submission)
 * @param {string[]} urls - Array of full URLs to submit
 */
const submitBatchToIndexNow = async (urls) => {
  if (!urls || urls.length === 0) {
    logger.warn('IndexNow: No URLs provided for batch submission');
    return { success: false, message: 'No URLs provided' };
  }

  // IndexNow allows up to 10,000 URLs per request, but we'll limit to 1000 for safety
  const batchSize = 1000;
  const batches = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    batches.push(urls.slice(i, i + batchSize));
  }

  const results = [];

  for (const batch of batches) {
    try {
      const host = new URL(BASE_URL).hostname;

      const payload = {
        host: host,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: batch
      };

      const response = await axios.post(INDEXNOW_ENDPOINTS[0], payload, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        timeout: 30000
      });

      logger.info(`IndexNow batch submitted successfully: ${batch.length} URLs`, {
        status: response.status,
        count: batch.length
      });

      results.push({ success: true, count: batch.length });
    } catch (error) {
      logger.error(`IndexNow batch submission failed:`, {
        error: error.message,
        count: batch.length,
        response: error.response?.data
      });
      results.push({ success: false, count: batch.length, error: error.message });
    }
  }

  return {
    success: results.some(r => r.success),
    totalUrls: urls.length,
    batches: results.length,
    results
  };
};

/**
 * Submit product URL when created or updated
 * @param {Object} product - Product object with slug or _id
 */
const submitProductToIndexNow = async (product) => {
  try {
    const slug = product.slug || product._id;
    const url = `${BASE_URL}/products/${slug}`;
    return await submitToIndexNow(url);
  } catch (error) {
    logger.error('Error submitting product to IndexNow:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Submit category URL when created or updated
 * @param {Object} category - Category object with slug or _id
 */
const submitCategoryToIndexNow = async (category) => {
  try {
    const slug = category.slug || category._id;
    const url = `${BASE_URL}/products?category=${slug}`;
    return await submitToIndexNow(url);
  } catch (error) {
    logger.error('Error submitting category to IndexNow:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Submit article/blog URL when created or updated
 * @param {Object} article - Article object with slug or _id
 */
const submitArticleToIndexNow = async (article) => {
  try {
    const slug = article.slug || article._id;
    const url = `${BASE_URL}/blog/${slug}`;
    return await submitToIndexNow(url);
  } catch (error) {
    logger.error('Error submitting article to IndexNow:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Submit all site URLs (useful for initial setup or bulk updates)
 */
const submitAllSiteUrls = async () => {
  try {
    const Product = require('../models/Product');
    const Category = require('../models/Category');
    const Article = require('../models/Article');

    const urls = [];

    // Static pages
    urls.push(`${BASE_URL}/`);
    urls.push(`${BASE_URL}/products`);
    urls.push(`${BASE_URL}/about`);
    urls.push(`${BASE_URL}/contact`);
    urls.push(`${BASE_URL}/blog`);
    urls.push(`${BASE_URL}/privacy-policy`);
    urls.push(`${BASE_URL}/terms-and-conditions`);
    urls.push(`${BASE_URL}/shipping-and-delivery`);
    urls.push(`${BASE_URL}/cancellation-and-refund`);
    urls.push(`${BASE_URL}/support`);

    // All active products
    const products = await Product.find({ isActive: true }).select('slug _id');
    products.forEach((product) => {
      const slug = product.slug || product._id;
      urls.push(`${BASE_URL}/products/${slug}`);
    });

    // All active categories
    const categories = await Category.find({ isActive: true }).select('slug _id');
    categories.forEach((category) => {
      const slug = category.slug || category._id;
      urls.push(`${BASE_URL}/products?category=${slug}`);
    });

    // All published articles
    const articles = await Article.find({ isPublished: true }).select('slug _id');
    articles.forEach((article) => {
      const slug = article.slug || article._id;
      urls.push(`${BASE_URL}/blog/${slug}`);
    });

    logger.info(`Submitting ${urls.length} URLs to IndexNow`);
    return await submitBatchToIndexNow(urls);
  } catch (error) {
    logger.error('Error submitting all URLs to IndexNow:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  submitToIndexNow,
  submitBatchToIndexNow,
  submitProductToIndexNow,
  submitCategoryToIndexNow,
  submitArticleToIndexNow,
  submitAllSiteUrls,
  INDEXNOW_KEY,
  BASE_URL
};
