const express = require('express');
const cors = require('cors');

const app = express();

// Dynamic CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',  // Vite dev server
      'https://student-dashboard-1-vema.onrender.com', // Render production URL
      'http://localhost:3000',  // Backend dev server
      undefined  // For server-to-server or non-browser requests
    ];

    // Allow if origin is in the list or not specified (for server-side requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Basic middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  console.log('Origin:', req.get('origin'));
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

module.exports = app;
