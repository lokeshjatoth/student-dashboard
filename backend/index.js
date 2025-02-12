const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = require('./src/app');
const config = require('./src/config/environment');

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Local frontend
    process.env.FRONTEND_URL  // Deployed frontend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./src/routes/auth'));

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running in ${config.environment} mode on port ${PORT}`);
});
