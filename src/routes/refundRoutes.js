const express = require("express");
const router = express.Router();
const refundController = require("../controllers/refundController");

// ✅ Route to trigger refunds manually
router.post("/trigger", refundController.processRefunds);

module.exports = router;
