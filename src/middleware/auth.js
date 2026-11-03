const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token (Supports both Cookies and Bearer Headers)
const protect = async (req, res, next) => {
  let token;

  // 1. Check token in cookies (primary, since controller uses res.cookie)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  // 2. Fallback: Check Authorization header if cookie is missing
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. User not found or inactive.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token invalid or expired.',
    });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };