const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Category = require('../models/Category');

// Get all categories with hierarchy (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent')
      .sort({ order: 1, name: 1 });

    // Build hierarchy
    const categoryMap = {};
    const rootCategories = [];

    // First pass: create map
    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = {
        ...cat.toObject(),
        children: []
      };
    });

    // Second pass: build hierarchy
    categories.forEach(cat => {
      if (cat.parent) {
        const parentId = cat.parent._id ? cat.parent._id.toString() : cat.parent.toString();
        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(categoryMap[cat._id.toString()]);
        }
      } else {
        rootCategories.push(categoryMap[cat._id.toString()]);
      }
    });

    res.json(rootCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single category by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
      .populate('parent');
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

// Get all categories (admin) - returns hierarchical structure
router.get('/admin/all', async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parent')
      .sort({ order: 1, name: 1 });

    // Build hierarchy
    const categoryMap = {};
    const rootCategories = [];

    // First pass: create map
    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = {
        ...cat.toObject(),
        children: []
      };
    });

    // Second pass: build hierarchy
    categories.forEach(cat => {
      if (cat.parent) {
        const parentId = cat.parent._id ? cat.parent._id.toString() : cat.parent.toString();
        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(categoryMap[cat._id.toString()]);
        }
      } else {
        rootCategories.push(categoryMap[cat._id.toString()]);
      }
    });

    res.json(rootCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create category
router.post('/admin', async (req, res) => {
  try {
    const { name, description, image, isActive, order, parent } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const category = new Category({
      name,
      slug,
      description,
      image,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      parent: parent || null
    });

    await category.save();
    const populatedCategory = await Category.findById(category._id).populate('parent');
    res.status(201).json({ message: 'Category created successfully', category: populatedCategory });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create category', error: error.message });
  }
});

// Update category
router.put('/admin/:id', async (req, res) => {
  try {
    const { name, description, image, isActive, order, parent } = req.body;
    const updateData = { description, image, isActive, order };

    // Update slug if name changed
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    // Update parent if provided
    if (parent !== undefined) {
      updateData.parent = parent || null;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parent');

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
    // Check if category has children
    const childrenCount = await Category.countDocuments({ parent: req.params.id });
    if (childrenCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete category with children. Delete child categories first.'
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
});

module.exports = router;
