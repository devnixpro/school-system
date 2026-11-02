const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');

// protected route

// const { protect, authorize } = require('../middleware/auth');

// router.get('/', protect, noticeController.getAllNotices);
// router.get('/:id', protect, noticeController.getNoticeById);

// router.post(
//   '/', 
//   protect, 
//   authorize('admin', 'teacher'), 
//   noticeController.createNotice
// );

// router.put(
//   '/:id', 
//   protect, 
//   authorize('admin', 'teacher'), 
//   noticeController.updateNotice
// );

// router.delete(
//   '/:id', 
//   protect, 
//   authorize('admin', 'teacher'), 
//   noticeController.deleteNotice
// );

// normal route to check endpoints

router.get('/', noticeController.getAllNotices);
router.get('/:id', noticeController.getNoticeById);
router.post('/', noticeController.createNotice);
router.put('/:id', noticeController.updateNotice);
router.delete('/:id', noticeController.deleteNotice);

module.exports = router;