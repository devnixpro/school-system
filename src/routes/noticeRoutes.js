const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, noticeController.getAllNotices);
router.get('/:id', protect, noticeController.getNoticeById);

router.post(
  '/', 
  protect, 
  authorize('admin', 'teacher'), 
  noticeController.createNotice
);

router.put(
  '/:id', 
  protect, 
  authorize('admin', 'teacher'), 
  noticeController.updateNotice
);

router.delete(
  '/:id', 
  protect, 
  authorize('admin', 'teacher'), 
  noticeController.deleteNotice
);

module.exports = router;