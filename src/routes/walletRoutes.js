const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Routes pour les portefeuilles
router.get('/:userId', walletController.getWallet); // Afficher le solde d'un utilisateur
router.post('/deposit', walletController.depositMoney); // Ajouter de l'argent au portefeuille

module.exports = router;
