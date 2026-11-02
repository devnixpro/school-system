const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const homeworkController = require('../controllers/homeworkController');

const router = express.Router();

router.use(protect, authorize('admin', 'teacher'));
router.get('/', homeworkController.listHomework);
router.post('/', homeworkController.createHomework);
router.put('/:id', homeworkController.updateHomework);
router.delete('/:id', homeworkController.deleteHomework);

module.exports = router;
