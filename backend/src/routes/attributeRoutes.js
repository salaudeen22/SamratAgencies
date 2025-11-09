const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Attribute = require('../models/Attribute');
const AttributeSet = require('../models/AttributeSet');

// All routes require auth and admin
router.use(auth);
router.use(adminAuth);

// ============ ATTRIBUTES ============

// Get all attributes
router.get('/attributes', async (req, res) => {
  try {
    const attributes = await Attribute.find().sort({ order: 1, name: 1 });
    res.json(attributes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create attribute
router.post('/attributes', async (req, res) => {
  try {
    const { name, inputType, options, unit, isRequired, isVariant, order, helpText } = req.body;

    // Generate code from name
    const code = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    const attribute = new Attribute({
      name,
      code,
      inputType,
      options,
      unit,
      isRequired,
      isVariant,
      order,
      helpText
    });

    await attribute.save();
    res.status(201).json({ message: 'Attribute created successfully', attribute });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create attribute', error: error.message });
  }
});

// Update attribute
router.put('/attributes/:id', async (req, res) => {
  try {
    const { name, inputType, options, unit, isRequired, isVariant, order, helpText, isActive } = req.body;

    const updateData = {
      inputType,
      options,
      unit,
      isRequired,
      isVariant,
      order,
      helpText,
      isActive
    };

    // Update code if name changed
    if (name) {
      updateData.name = name;
      updateData.code = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    }

    const attribute = await Attribute.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!attribute) {
      return res.status(404).json({ message: 'Attribute not found' });
    }

    res.json({ message: 'Attribute updated successfully', attribute });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update attribute', error: error.message });
  }
});

// Delete attribute
router.delete('/attributes/:id', async (req, res) => {
  try {
    // Check if attribute is used in any attribute set
    const usedInSets = await AttributeSet.find({ 'attributes.attribute': req.params.id });

    if (usedInSets.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete attribute that is used in attribute sets',
        usedIn: usedInSets.map(set => set.name)
      });
    }

    const attribute = await Attribute.findByIdAndDelete(req.params.id);

    if (!attribute) {
      return res.status(404).json({ message: 'Attribute not found' });
    }

    res.json({ message: 'Attribute deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete attribute', error: error.message });
  }
});

// ============ ATTRIBUTE SETS ============

// Get all attribute sets
router.get('/attribute-sets', async (req, res) => {
  try {
    const attributeSets = await AttributeSet.find()
      .populate('attributes.attribute')
      .sort({ name: 1 });
    res.json(attributeSets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single attribute set
router.get('/attribute-sets/:id', async (req, res) => {
  try {
    const attributeSet = await AttributeSet.findById(req.params.id)
      .populate('attributes.attribute');

    if (!attributeSet) {
      return res.status(404).json({ message: 'Attribute set not found' });
    }

    res.json(attributeSet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create attribute set
router.post('/attribute-sets', async (req, res) => {
  try {
    const { name, description, attributes } = req.body;

    // Generate code from name
    const code = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    const attributeSet = new AttributeSet({
      name,
      code,
      description,
      attributes
    });

    await attributeSet.save();
    await attributeSet.populate('attributes.attribute');

    res.status(201).json({ message: 'Attribute set created successfully', attributeSet });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create attribute set', error: error.message });
  }
});

// Update attribute set
router.put('/attribute-sets/:id', async (req, res) => {
  try {
    const { name, description, attributes, isActive } = req.body;

    const updateData = {
      description,
      attributes,
      isActive
    };

    // Update code if name changed
    if (name) {
      updateData.name = name;
      updateData.code = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    }

    const attributeSet = await AttributeSet.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('attributes.attribute');

    if (!attributeSet) {
      return res.status(404).json({ message: 'Attribute set not found' });
    }

    res.json({ message: 'Attribute set updated successfully', attributeSet });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update attribute set', error: error.message });
  }
});

// Delete attribute set
router.delete('/attribute-sets/:id', async (req, res) => {
  try {
    const attributeSet = await AttributeSet.findByIdAndDelete(req.params.id);

    if (!attributeSet) {
      return res.status(404).json({ message: 'Attribute set not found' });
    }

    res.json({ message: 'Attribute set deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete attribute set', error: error.message });
  }
});

module.exports = router;
