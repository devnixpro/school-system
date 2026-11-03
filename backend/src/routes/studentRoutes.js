const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// All student routes require authentication
router.use(protect);

// @route  POST   /api/students      - Register new student (admin only)
// @route  GET    /api/students      - Get all students
router
  .route('/')
  .post(authorize('admin'), createStudent)
  .get(getAllStudents);

// @route  GET    /api/students/:id  - Get single student
// @route  PUT    /api/students/:id  - Update student (admin only)
// @route  DELETE /api/students/:id  - Delete student (admin only)
router
  .route('/:id')
  .get(getStudentById)
  .put(authorize('admin'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

module.exports = router;
