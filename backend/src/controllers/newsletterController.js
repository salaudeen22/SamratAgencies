const Newsletter = require('../models/Newsletter');

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });

    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ message: 'Email already subscribed' });
      } else {
        // Reactivate subscription
        existing.isActive = true;
        await existing.save();
        return res.json({ message: 'Subscription reactivated successfully!' });
      }
    }

    // Create new subscription
    const newsletter = new Newsletter({ email });
    await newsletter.save();

    res.status(201).json({ message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ message: 'Failed to subscribe to newsletter' });
  }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const newsletter = await Newsletter.findOne({ email });

    if (!newsletter) {
      return res.status(404).json({ message: 'Email not found' });
    }

    newsletter.isActive = false;
    await newsletter.save();

    res.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({ message: 'Failed to unsubscribe from newsletter' });
  }
};

// Admin: Get all subscribers
const getAllSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 50, isActive } = req.query;

    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (page - 1) * limit;

    const subscribers = await Newsletter.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Newsletter.countDocuments(query);

    res.json({
      subscribers,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getAllSubscribers
};
