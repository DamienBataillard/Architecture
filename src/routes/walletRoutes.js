const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// ✅ Secure wallet routes
router.get("/", verifyToken, checkRole(["investor"]), walletController.getWallet);
router.post("/add-funds", verifyToken, checkRole(["investor"]), walletController.addFunds);

module.exports = router;
