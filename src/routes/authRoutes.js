
const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerificationCode,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);

// Protected route: logged-in user can view their own profile
router.get('/me', protect, getMe);

module.exports = router;
