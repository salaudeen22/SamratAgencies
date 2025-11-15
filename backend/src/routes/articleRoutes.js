const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getArticles,
  getArticleBySlug,
  getFeaturedArticles,
  getAllArticlesAdmin,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublishStatus
} = require('../controllers/articleController');

// Public routes
router.get('/', getArticles);
router.get('/featured', getFeaturedArticles);
router.get('/:slug', getArticleBySlug);

// Admin routes
router.get('/admin/all', auth, adminAuth, getAllArticlesAdmin);
router.post('/admin', auth, adminAuth, createArticle);
router.put('/admin/:id', auth, adminAuth, updateArticle);
router.delete('/admin/:id', auth, adminAuth, deleteArticle);
router.patch('/admin/:id/toggle-publish', auth, adminAuth, togglePublishStatus);

module.exports = router;
