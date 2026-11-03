
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT and authenticate user.
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !/^Bearer\s+\S+$/i.test(authHeader)) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please provide a valid Bearer token.'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing from environment variables.');

      return res.status(500).json({
        success: false,
        message: 'Server authentication configuration error.'
      });
    }

    const token = authHeader.split(/\s+/)[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.'
      });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user || user.isActive !== true) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account is inactive.'
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError' ||
      error.name === 'NotBeforeError'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.'
      });
    }

    next(error);
  }
};

// Role-based authorization.
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.'
      });
    }

    next();
  };
};

module.exports = { protect, authorize };
