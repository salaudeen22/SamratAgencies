const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Category = require('../models/Category');

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    // Get only parent categories (those without a parent field)
    const categories = await Category.find({ isActive: true, parent: { $exists: false } })
      .populate('subcategories')
      .sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single category by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes - all require auth and admin
router.use(auth);
router.use(adminAuth);

// Get all categories (admin)
router.get('/admin/all', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create category
router.post('/admin', async (req, res) => {
  try {
    const { name, description, image, isActive, order } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const category = new Category({
      name,
      slug,
      description,
      image,
      isActive,
      order: order || 0,
      subcategories: []
    });

    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create category', error: error.message });
  }
});

// Update category
router.put('/admin/:id', async (req, res) => {
  try {
    const { name, description, image, isActive, order } = req.body;
    const updateData = { description, image, isActive, order };

    // Update slug if name changed
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update category', error: error.message });
  }
});

// Delete category
router.delete('/admin/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
});

// Add subcategory
router.post('/admin/:id/subcategories', async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.subcategories.push({
      name,
      slug,
      description,
      image,
      isActive: isActive !== undefined ? isActive : true
    });

    await category.save();
    res.json({ message: 'Subcategory added successfully', category });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add subcategory', error: error.message });
  }
});

// Update subcategory
router.put('/admin/:id/subcategories/:subId', async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = category.subcategories.id(req.params.subId);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    if (name) {
      subcategory.name = name;
      subcategory.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    if (description !== undefined) subcategory.description = description;
    if (image !== undefined) subcategory.image = image;
    if (isActive !== undefined) subcategory.isActive = isActive;

    await category.save();
    res.json({ message: 'Subcategory updated successfully', category });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update subcategory', error: error.message });
  }
});

// Delete subcategory
router.delete('/admin/:id/subcategories/:subId', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.subcategories.pull(req.params.subId);
    await category.save();

    res.json({ message: 'Subcategory deleted successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete subcategory', error: error.message });
  }
});

module.exports = router;
