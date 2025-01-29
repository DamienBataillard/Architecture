const express = require("express");
const router = express.Router();
const investmentController = require("../controllers/investmentController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// ✅ Secure investment routes
router.post("/", verifyToken, checkRole(["investor"]), investmentController.createInvestment);
router.get("/portfolio", verifyToken, checkRole(["investor"]), investmentController.getInvestmentsByUser);

module.exports = router;
