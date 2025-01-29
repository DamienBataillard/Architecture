const express = require("express");
const router = express.Router();
const rentalIncomeController = require("../controllers/rentalIncomeController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// ✅ Secure route to fetch rental income of a logged-in user
router.get("/", verifyToken, checkRole(["investor"]), rentalIncomeController.getRentalIncomeByUser);

module.exports = router;
