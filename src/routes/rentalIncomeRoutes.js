const express = require('express');
const router = express.Router();
const rentalIncomeController = require('../controllers/rentalIncomeController');

// Route pour récupérer les revenus locatifs d'un utilisateur
router.get('/:userId', rentalIncomeController.getRentalIncomeByUser);

module.exports = router;
