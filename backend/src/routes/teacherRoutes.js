const express = require('express');
const router = express.Router();
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

// All teacher routes require authentication
router.use(protect);

// @route  POST  /api/teachers      - Add new teacher (admin only)
// @route  GET   /api/teachers      - Get all teachers
router
  .route('/')
  .post(authorize('admin'), createTeacher)
  .get(getAllTeachers);

// @route  GET    /api/teachers/:id  - Get single teacher
// @route  PUT    /api/teachers/:id  - Update teacher (admin only)
// @route  DELETE /api/teachers/:id  - Delete teacher (admin only)
router
  .route('/:id')
  .get(getTeacherById)
  .put(authorize('admin'), updateTeacher)
  .delete(authorize('admin'), deleteTeacher);

module.exports = router;
