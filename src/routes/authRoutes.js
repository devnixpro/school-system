
const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getActiveSchoolsList,
  getMe,
  verifyEmail,
  resendVerificationCode,
  logout,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/public/schools', getActiveSchoolsList);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);

// Protected route: logged-in user can view their own profile
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
