const express = require('express');
const router = express.Router();

const {
  getTheme,
  createOrUpdateTheme,
} = require('../controllers/theme.controller');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role.middleware');

router.use(protect, authorize('admin'));

router.get('/:schoolId', getTheme);
router.put('/:schoolId', createOrUpdateTheme);

module.exports = router;