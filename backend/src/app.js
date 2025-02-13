const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;
