const express = require('express');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const { getMyChildren } = require('../controllers/parent.controller');

// All parent routes require authentication and the parent role.
router.use(protect);
router.use(authorize('parent'));

// GET /api/parent/children
router.get('/children', getMyChildren);

module.exports = router;
