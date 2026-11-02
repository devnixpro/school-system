const express = require('express');
const router = express.Router();

const {
  getDashboard,
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
} = require('../controllers/superadmin.controller');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role.middleware');

router.use(protect, authorize('superadmin'));

router.get('/dashboard', getDashboard);
router.get('/schools', getSchools);
router.post('/schools', createSchool);
router.put('/schools/:id', updateSchool);
router.delete('/schools/:id', deleteSchool);

module.exports = router;