const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route pour lister toutes les transactions d'un utilisateur
router.get('/:userId', transactionController.getTransactionsByUser);

module.exports = router;
