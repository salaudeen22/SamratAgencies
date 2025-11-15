const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Banner = require('../models/Banner');

// Get all active banners (public)
router.get('/', async (req, res) => {
  try {
    const { position } = req.query;
    const now = new Date();

    const query = {
      isActive: true,
      $or: [
        { startDate: { $lte: now } },
        { startDate: { $exists: false } }
      ],
      $or: [
        { endDate: { $gte: now } },
        { endDate: { $exists: false } },
        { endDate: null }
      ]
    };

    if (position) {
      query.position = position;
    }

    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes - all require auth and admin
router.use(auth);
router.use(adminAuth);

// Get all banners (admin)
router.get('/admin/all', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create banner
router.post('/admin', async (req, res) => {
  try {
    const { title, description, image, link, buttonText, position, isActive, order, startDate, endDate } = req.body;

    const banner = new Banner({
      title,
      description,
      image,
      link,
      buttonText: buttonText || 'Shop Now',
      position: position || 'hero',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      startDate: startDate || Date.now(),
      endDate
    });

    await banner.save();
    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create banner', error: error.message });
  }
});

// Update banner
router.put('/admin/:id', async (req, res) => {
  try {
    const { title, description, image, link, buttonText, position, isActive, order, startDate, endDate } = req.body;

    const updateData = {
      title,
      description,
      image,
      link,
      buttonText,
      position,
      isActive,
      order,
      startDate,
      endDate
    };

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.json({ message: 'Banner updated successfully', banner });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update banner', error: error.message });
  }
});

// Delete banner
router.delete('/admin/:id', async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete banner', error: error.message });
  }
});

module.exports = router;
