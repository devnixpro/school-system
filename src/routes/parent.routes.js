const express = require('express');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const parentController = require('../controllers/parent.controller');

// All parent routes require authentication and the parent role.
router.use(protect);
router.use(authorize('parent'));

// GET /api/parent/children
router.get('/children', parentController.getMyChildren);
router.get('/children/:childId/summary', parentController.getChildSummary);
router.get('/children/:childId/attendance', parentController.getChildAttendance);
router.get('/children/:childId/results', parentController.getChildResults);
router.get('/children/:childId/fees', parentController.getChildFees);
router.get('/children/:childId/fees/:feeId/receipt', parentController.getChildFeeReceipt);
router.get('/children/:childId/homework', parentController.getChildHomework);

module.exports = router;
