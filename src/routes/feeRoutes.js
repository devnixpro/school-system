const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const feeController = require('../controllers/feeController');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/analytics/summary', feeController.getAnalyticsSummary);
router.get('/analytics/monthly', feeController.getMonthlyAnalytics);
router.get('/analytics/by-type', feeController.getAnalyticsByType);

router.get('/', feeController.listFees);
router.post('/', feeController.createFee);
router.post('/bulk', feeController.bulkCreateFees);

router.get('/:id/receipt', feeController.getFeeReceipt);
router.get('/:id', feeController.getFeeById);
router.put('/:id/pay', feeController.markFeePaid);
router.put('/:id', feeController.updateFee);
router.delete('/:id', feeController.deleteFee);

module.exports = router;
