const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

console.log('AUTH ROUTES LOADED');

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
  console.log('=== REGISTER ROUTE HANDLER ===');
  console.log('Received registration request');
  console.log('Full request details:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  
  const { name, email, password, department, semester } = req.body;

  // Validate input
  if (!name || !email || !password || !department || !semester) {
    console.log('VALIDATION ERROR: Missing required fields');
    return res.status(400).json({ 
      message: 'Missing required fields',
      receivedFields: Object.keys(req.body)
    });
  }

  try {
    console.log('Attempting to find existing user');
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Creating new user');
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
          console.error('TOKEN GENERATION ERROR:', err);
          return res.status(500).json({ 
            message: 'Error generating token',
            error: err.message 
          });
        }
        console.log('User registered successfully');
        res.status(201).json({ 
          token, 
          message: 'User registered successfully' 
        });
      }
    );
  } catch (err) {
    console.error('REGISTRATION SERVER ERROR:', err);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: err.message 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  console.log('=== LOGIN ROUTE HANDLER ===');
  console.log('Received login request');
  console.log('Full request details:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    console.log('VALIDATION ERROR: Missing required fields');
    return res.status(400).json({ 
      message: 'Missing required fields',
      receivedFields: Object.keys(req.body)
    });
  }

  try {
    console.log('Finding user');
    let user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing passwords');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
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
          console.error('TOKEN GENERATION ERROR:', err);
          return res.status(500).json({ 
            message: 'Error generating token',
            error: err.message 
          });
        }
        console.log('User logged in successfully');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('LOGIN SERVER ERROR:', err);
    res.status(500).json({ 
      message: 'Server error during login',
      error: err.message 
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  console.log('=== PROFILE ROUTE HANDLER ===');
  console.log('Received profile request');
  console.log('Full request details:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    query: req.query
  });
  
  try {
    console.log('Getting user profile');
    const user = await User.findById(req.user.id).select('-password');
    console.log('User profile retrieved successfully');
    res.json(user);
  } catch (err) {
    console.error('PROFILE SERVER ERROR:', err);
    res.status(500).json({ 
      message: 'Server error during profile retrieval',
      error: err.message 
    });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify token and return user info
router.get('/verify', authMiddleware, async (req, res) => {
  console.log('=== VERIFY ROUTE HANDLER ===');
  console.log('Received verify request');
  console.log('Full request details:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    query: req.query
  });
  
  try {
    console.log('Verifying token');
    const user = await User.findById(req.user.id).select('-password');
    console.log('Token verified successfully');
    res.json({ user });
  } catch (err) {
    console.error('VERIFY SERVER ERROR:', err);
    res.status(500).json({ 
      message: 'Server error during verification',
      error: err.message 
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
