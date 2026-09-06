const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authLimiter } = require('../middleware/rateLimit');
const auth = require('../middleware/auth');
const User = require('../models/User');
const UserProgress = require('../models/schemas').UserProgress;

// Register new user
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      email,
      username,
      password: await bcrypt.hash(password, 10)
    });

    await user.save();

    // Initialize user progress
    const userProgress = new UserProgress({
      userId: user._id,
      reads: {
        politics: 0,
        tech: 0,
        climate: 0
      },
      badges: []
    });

    await userProgress.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    const progress = await UserProgress.findOne({ userId: req.user.userId });

    res.json({
      user,
      progress
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.patch('/preferences', auth, async (req, res) => {
  try {
    const { categories, notifications } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        preferences: {
          categories,
          notifications
        }
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/track-read
 * Track article view and compute virality badge based on view counts.
 */
router.post('/track-read', auth, async (req, res) => {
  try {
    const { articleUrl } = req.body;
    if (!articleUrl) return res.status(400).json({ message: 'articleUrl is required' });

    // Increment view count in Redis
    const redisClient = req.app.locals.redis;
    const count = await redisClient.incr(`views:${articleUrl}`);

    // Compute virality percentage (cap at 1000 views = 100%)
    const virality = Math.min(100, Math.round((count / 1000) * 100));

    res.json({ virality: `${virality}%`, views: count });
  } catch (error) {
    console.error('Error tracking read:', error);
    res.status(500).json({ message: 'Error tracking read' });
  }
});

module.exports = router; 