const express = require('express');
const router = express.Router();

const {
  getDashboard,
  getStudents,
  getTeachers,
  getClasses,
} = require('../controllers/admin.controller');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role.middleware');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/students', getStudents);
router.get('/teachers', getTeachers);
router.get('/classes', getClasses);

module.exports = router;