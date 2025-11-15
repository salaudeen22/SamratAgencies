const Article = require('../models/Article');

// Get all articles (public - only published)
const getArticles = async (req, res) => {
  try {
    const { category, tag, search, page = 1, limit = 10 } = req.query;

    const query = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const articles = await Article.find(query)
      .select('-content') // Don't send full content in list view
      .sort({ publishDate: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
};

// Get single article by slug
const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      isPublished: true
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Failed to fetch article' });
  }
};

// Get featured articles
const getFeaturedArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;

    const articles = await Article.find({ isPublished: true })
      .select('-content')
      .sort({ views: -1, publishDate: -1 })
      .limit(limit);

    res.json(articles);
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    res.status(500).json({ message: 'Failed to fetch featured articles' });
  }
};

// Admin: Get all articles (including unpublished)
const getAllArticlesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const articles = await Article.find()
      .select('-content')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Article.countDocuments();

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
};

// Admin: Create article
const createArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Failed to create article', error: error.message });
  }
};

// Admin: Update article
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Failed to update article', error: error.message });
  }
};

// Admin: Delete article
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Failed to delete article' });
  }
};

// Admin: Toggle publish status
const togglePublishStatus = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    article.isPublished = !article.isPublished;
    if (article.isPublished && !article.publishDate) {
      article.publishDate = new Date();
    }

    await article.save();
    res.json(article);
  } catch (error) {
    console.error('Error toggling publish status:', error);
    res.status(500).json({ message: 'Failed to toggle publish status' });
  }
};

module.exports = {
  getArticles,
  getArticleBySlug,
  getFeaturedArticles,
  getAllArticlesAdmin,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublishStatus
};
