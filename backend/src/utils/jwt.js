const jwt = require('jsonwebtoken');
const config = require('../config/environment');

const generateToken = (user) => {
  return jwt.sign(
    { 
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    }, 
    config.jwtSecret, 
    { expiresIn: '30d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
