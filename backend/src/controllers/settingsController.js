const Settings = require('../models/Settings');

// Get settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ _isSingleton: true });

    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({ _isSingleton: true });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ _isSingleton: true });

    if (!settings) {
      settings = await Settings.create({ _isSingleton: true, ...req.body });
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
