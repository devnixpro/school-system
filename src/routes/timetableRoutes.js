const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { protect , authorize } = require('../middleware/auth')  
router.get('/', protect, timetableController.getAllTimetables);
router.get('/:id', protect, timetableController.getTimetableById);
router.post(
  '/', 
  protect, 
  authorize('admin', 'teacher'), 
  timetableController.createTimetable
);

router.put(
  '/:id', 
  protect, 
  authorize('admin', 'teacher'), 
  timetableController.updateTimetable
);

router.delete(
  '/:id', 
  protect, 
  authorize('admin', 'teacher'), 
  timetableController.deleteTimetable
);

module.exports = router;