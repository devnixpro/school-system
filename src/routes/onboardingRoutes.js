const express = require('express');
const router = express.Router();
const { saveOnboarding } = require('../controllers/onboardingController');

// POST /api/onboarding/save
router.post('/save', saveOnboarding);

module.exports = router;