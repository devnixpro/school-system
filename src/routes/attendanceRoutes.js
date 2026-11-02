const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  getAttendanceSummary,
  updateAttendance,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');
// All attendance routes require authentication
router.use(protect);

// @route  POST  /api/attendance                        - Mark attendance (admin, teacher)
// @route  GET   /api/attendance                        - Get all attendance records
router
  .route('/')
  .post(authorize('admin', 'teacher'), markAttendance)
  .get(authorize('superadmin', 'admin', 'teacher', 'student'), getAttendance);

// @route  GET   /api/attendance/summary/:studentId     - Get attendance summary
router.get(
  '/summary/:studentId',
  authorize('superadmin', 'admin', 'teacher', 'student'),
  getAttendanceSummary
);

// @route  PUT   /api/attendance/:id                    - Update attendance record
router.put('/:id', authorize('admin', 'teacher'), updateAttendance);

module.exports = router;
