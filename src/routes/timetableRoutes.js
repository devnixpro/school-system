const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

// protected routes

// const { protect , authorize } = require('../middleware/auth')  
// router.get('/', protect, timetableController.getAllTimetables);
// router.get('/:id', protect, timetableController.getTimetableById);
// router.post(
//   '/', 
//   protect, 
//   authorize('admin', 'teacher'), 
//   timetableController.createTimetable
// );

// router.put(
//   '/:id', 
//   protect, 
//   authorize('admin', 'teacher'), 
//   timetableController.updateTimetable
// );

// router.delete(
//   '/:id', 
//   protect, 
//   authorize('admin', 'teacher'), 
//   timetableController.deleteTimetable
// );

// Normal / Unprotected Routes checking for frontend
router.get('/', timetableController.getAllTimetables);
router.get('/:id', timetableController.getTimetableById);
router.post('/', timetableController.createTimetable);
router.put('/:id', timetableController.updateTimetable);
router.delete('/:id', timetableController.deleteTimetable);

module.exports = router;