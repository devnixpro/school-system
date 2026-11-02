const express = require("express");
const router = express.Router();

const {
  getGateways,
  updateGateways,
} = require("../controllers/paymentGateway.controller");

const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));

router.get("/", getGateways);
router.put("/", updateGateways);

module.exports = router;
