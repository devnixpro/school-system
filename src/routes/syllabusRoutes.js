const express = require('express');
const router = express.Router();
const { 
  getAllSyllabus, 
  getSyllabusById, 
  createSyllabus, 
  updateProgress,
  deleteSyllabus, 
} = require('../controllers/syllabusController');

// Routes definitions
router.get('/', getAllSyllabus);          // GET /api/syllabus
router.get('/:id', getSyllabusById);      // GET /api/syllabus/cs101
router.post('/', createSyllabus);         // POST /api/syllabus
router.patch('/:id', updateProgress);     // PATCH /api/syllabus/cs101
router.delete('/:id', deleteSyllabus)

module.exports = router;