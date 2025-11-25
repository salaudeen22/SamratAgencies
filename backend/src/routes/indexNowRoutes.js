const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  submitAllSiteUrls,
  submitBatchToIndexNow,
  INDEXNOW_KEY,
  BASE_URL
} = require('../utils/indexNow');

// Public route: Verify IndexNow key
router.get(`/${INDEXNOW_KEY}.txt`, (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(INDEXNOW_KEY);
});

// Admin routes
router.use(auth);
router.use(adminAuth);

/**
 * POST /api/indexnow/submit-all
 * Submit all site URLs to IndexNow
 * This is useful for initial setup or bulk re-indexing
 */
router.post('/submit-all', async (req, res) => {
  try {
    const result = await submitAllSiteUrls();

    if (result.success) {
      res.json({
        success: true,
        message: `Successfully submitted ${result.totalUrls} URLs to IndexNow`,
        ...result
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to submit URLs to IndexNow',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error submitting all URLs to IndexNow:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting to IndexNow',
      error: error.message
    });
  }
});

/**
 * POST /api/indexnow/submit-batch
 * Submit a custom batch of URLs to IndexNow
 * Body: { urls: ['url1', 'url2', ...] }
 */
router.post('/submit-batch', async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of URLs to submit'
      });
    }

    const result = await submitBatchToIndexNow(urls);

    if (result.success) {
      res.json({
        success: true,
        message: `Successfully submitted ${result.totalUrls} URLs to IndexNow`,
        ...result
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to submit URLs to IndexNow',
        ...result
      });
    }
  } catch (error) {
    console.error('Error submitting batch to IndexNow:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting to IndexNow',
      error: error.message
    });
  }
});

/**
 * GET /api/indexnow/info
 * Get IndexNow configuration info
 */
router.get('/info', (req, res) => {
  res.json({
    indexNowKey: INDEXNOW_KEY,
    baseUrl: BASE_URL,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    endpoints: [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow',
      'https://yandex.com/indexnow'
    ],
    searchEngines: [
      'Bing',
      'Yandex',
      'Seznam.cz',
      'Naver'
    ],
    documentation: 'https://www.indexnow.org/documentation'
  });
});

module.exports = router;
