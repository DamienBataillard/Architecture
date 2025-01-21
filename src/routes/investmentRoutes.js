const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');

// Routes pour les investissements
router.post('/', investmentController.createInvestment); // Créer un investissement
router.get('/:userId', investmentController.getInvestmentsByUser); // Lister les investissements d'un utilisateur

module.exports = router;
