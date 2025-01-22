const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes pour les utilisateurs
router.get('/', userController.getAllUsers); // Récupérer tous les utilisateurs
router.post('/', userController.registerUser); // Créer un nouvel utilisateur
router.post('/login', userController.loginUser); // Connexion d'un utilisateur

module.exports = router;
