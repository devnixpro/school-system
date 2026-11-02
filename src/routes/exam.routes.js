const express = require('express');
const router = express.Router();

const {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  publishResult,
} = require('../controllers/examController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role.middleware');

// Saare routes protected hain (Login zaroori hai)
router.use(protect);

// Exams CRUD
router.get('/', authorize('admin', 'teacher', 'student', 'superadmin'), getExams);
router.post('/', authorize('admin', 'superadmin'), createExam);
router.get('/:id', authorize('admin', 'teacher', 'student', 'superadmin'), getExamById);
router.put('/:id', authorize('admin', 'superadmin'), updateExam);
router.delete('/:id', authorize('admin', 'superadmin'), deleteExam);

// Result Publish
router.put('/:id/result', authorize('admin', 'teacher'), publishResult);

module.exports = router;