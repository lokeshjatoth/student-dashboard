const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Middleware to log every request to auth routes
router.use((req, res, next) => {
  console.log('=== AUTH ROUTE REQUEST ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Full URL:', req.originalUrl);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  next();
});

// @route   POST /api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
  const { name, email, password, department, semester } = req.body;

  // Validate input
  if (!name || !email || !password || !department || !semester) {
    return res.status(400).json({ 
      message: 'Missing required fields'
    });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      profile: { department, semester }
    });

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          return res.status(500).json({ 
            message: 'Error generating token'
          });
        }
        res.status(201).json({ 
          token, 
          message: 'User registered successfully' 
        });
      }
    );
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Missing required fields'
    });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          return res.status(500).json({ 
            message: 'Error generating token'
          });
        }
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error during profile retrieval'
    });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify token and return user info
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(401).json({ 
      message: 'Authentication failed'
    });
  }
});

// Catch-all route to log any unexpected requests
router.all('*', (req, res) => {
  console.log('=== UNEXPECTED AUTH ROUTE REQUEST ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  res.status(404).json({ message: 'Route not found' });
});

module.exports = router;
