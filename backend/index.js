require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');

// Connect to Database
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((error) => {
  console.error('MongoDB connection error:', error.message);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
