const express = require('express');
const router = express.Router();

const {
  getDashboard,
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
} = require('../controllers/superadmin.controller');

const {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} = require('../controllers/subscription.controller');

const { getPlatformAnalytics } = require('../controllers/platformAnalytics.controller');

const {
  getPlatformSettings,
  updatePlatformSettings,
} = require('../controllers/platformSettings.controller');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role.middleware');

router.use(protect, authorize('superadmin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Schools
router.get('/schools', getSchools);
router.post('/schools', createSchool);
router.put('/schools/:id', updateSchool);
router.delete('/schools/:id', deleteSchool);

// Subscriptions
router.get('/subscriptions', getSubscriptions);
router.post('/subscriptions', createSubscription);
router.put('/subscriptions/:id', updateSubscription);
router.delete('/subscriptions/:id', deleteSubscription);

// Platform Analytics
router.get('/analytics', getPlatformAnalytics);

// Platform Settings
router.get('/settings', getPlatformSettings);
router.put('/settings', updatePlatformSettings);

module.exports = router;