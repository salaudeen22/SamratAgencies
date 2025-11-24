
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Article = require('../models/Article');
const axios = require('axios');

// IndexNow configuration
const INDEXNOW_KEY = '5c7e7c9951fe606900186eefe1efb110';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// Generate XML sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://samratagencies.in';

    // Fetch all active products with slugs
    const products = await Product.find({ isActive: true }).select('slug updatedAt');

    // Fetch all active categories
    const categories = await Category.find({ isActive: true }).select('slug updatedAt');

    // Fetch all published articles
    const articles = await Article.find({ isPublished: true }).select('slug updatedAt publishDate');

    // Start XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add homepage
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/</loc>\n`;
    sitemap += `    <changefreq>daily</changefreq>\n`;
    sitemap += `    <priority>1.0</priority>\n`;
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemap += `  </url>\n`;

    // Add products page
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/products</loc>\n`;
    sitemap += `    <changefreq>daily</changefreq>\n`;
    sitemap += `    <priority>0.9</priority>\n`;
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemap += `  </url>\n`;

    // Add about page
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/about</loc>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.7</priority>\n`;
    sitemap += `  </url>\n`;

    // Add contact page
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/contact</loc>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.7</priority>\n`;
    sitemap += `  </url>\n`;

    // Add blog page
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/blog</loc>\n`;
    sitemap += `    <changefreq>weekly</changefreq>\n`;
    sitemap += `    <priority>0.8</priority>\n`;
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemap += `  </url>\n`;

    // Add privacy policy
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/privacy-policy</loc>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.5</priority>\n`;
    sitemap += `  </url>\n`;

    // Add terms and conditions
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/terms-and-conditions</loc>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.5</priority>\n`;
    sitemap += `  </url>\n`;

    // Add shipping and delivery
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/shipping-and-delivery</loc>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.5</priority>\n`;
    sitemap += `  </url>\n`;

    // Add cancellation and refund
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/cancellation-and-refund</loc>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.5</priority>\n`;
    sitemap += `  </url>\n`;

    // Add all category pages
    categories.forEach((category) => {
      const slug = category.slug || category._id;
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/products?category=${slug}</loc>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `    <lastmod>${category.updatedAt.toISOString()}</lastmod>\n`;
      sitemap += `  </url>\n`;
    });

    // Add all product pages
    products.forEach((product) => {
      const slug = product.slug || product._id;
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/products/${slug}</loc>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.8</priority>\n`;
      sitemap += `    <lastmod>${product.updatedAt.toISOString()}</lastmod>\n`;
      sitemap += `  </url>\n`;
    });

    // Add all blog article pages
    articles.forEach((article) => {
      const slug = article.slug || article._id;
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/blog/${slug}</loc>\n`;
      sitemap += `    <changefreq>monthly</changefreq>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `    <lastmod>${article.updatedAt.toISOString()}</lastmod>\n`;
      sitemap += `  </url>\n`;
    });

    // Close XML
    sitemap += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Get all URLs for IndexNow submission
router.get('/api/sitemap/urls', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://samratagencies.in';
    const urls = [];

    // Static pages
    urls.push(`${baseUrl}/`);
    urls.push(`${baseUrl}/products`);
    urls.push(`${baseUrl}/about`);
    urls.push(`${baseUrl}/contact`);
    urls.push(`${baseUrl}/blog`);
    urls.push(`${baseUrl}/privacy-policy`);
    urls.push(`${baseUrl}/terms-and-conditions`);
    urls.push(`${baseUrl}/shipping-and-delivery`);
    urls.push(`${baseUrl}/cancellation-and-refund`);
    urls.push(`${baseUrl}/support`);

    // Fetch all active products
    const products = await Product.find({ isActive: true }).select('slug');
    products.forEach((product) => {
      const slug = product.slug || product._id;
      urls.push(`${baseUrl}/products/${slug}`);
    });

    // Fetch all active categories
    const categories = await Category.find({ isActive: true }).select('slug');
    categories.forEach((category) => {
      const slug = category.slug || category._id;
      urls.push(`${baseUrl}/products?category=${slug}`);
    });

    // Fetch all published articles
    const articles = await Article.find({ isPublished: true }).select('slug');
    articles.forEach((article) => {
      const slug = article.slug || article._id;
      urls.push(`${baseUrl}/blog/${slug}`);
    });

    res.json({
      success: true,
      count: urls.length,
      urls
    });
  } catch (error) {
    console.error('URL list generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating URL list'
    });
  }
});

// Submit all URLs to IndexNow
router.post('/api/sitemap/submit-indexnow', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://samratagencies.in';
    const host = baseUrl.replace(/^https?:\/\//, '');
    const urls = [];

    // Static pages
    urls.push(`${baseUrl}/`);
    urls.push(`${baseUrl}/products`);
    urls.push(`${baseUrl}/about`);
    urls.push(`${baseUrl}/contact`);
    urls.push(`${baseUrl}/blog`);
    urls.push(`${baseUrl}/privacy-policy`);
    urls.push(`${baseUrl}/terms-and-conditions`);
    urls.push(`${baseUrl}/shipping-and-delivery`);
    urls.push(`${baseUrl}/cancellation-and-refund`);
    urls.push(`${baseUrl}/support`);

    // Fetch all active products
    const products = await Product.find({ isActive: true }).select('slug');
    products.forEach((product) => {
      const slug = product.slug || product._id;
      urls.push(`${baseUrl}/products/${slug}`);
    });

    // Fetch all active categories
    const categories = await Category.find({ isActive: true }).select('slug');
    categories.forEach((category) => {
      const slug = category.slug || category._id;
      urls.push(`${baseUrl}/products?category=${slug}`);
    });

    // Fetch all published articles
    const articles = await Article.find({ isPublished: true }).select('slug');
    articles.forEach((article) => {
      const slug = article.slug || article._id;
      urls.push(`${baseUrl}/blog/${slug}`);
    });

    // Submit to IndexNow API
    const response = await axios.post(INDEXNOW_ENDPOINT, {
      host: host,
      key: INDEXNOW_KEY,
      keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
      urlList: urls
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

    res.json({
      success: true,
      message: 'URLs submitted to IndexNow successfully',
      count: urls.length,
      status: response.status
    });
  } catch (error) {
    console.error('IndexNow submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting URLs to IndexNow',
      error: error.message
    });
  }
});

module.exports = router;
