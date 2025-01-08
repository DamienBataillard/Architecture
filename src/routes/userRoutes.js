const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route pour récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll(); // Assurez-vous que le modèle User existe
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Ajouter un nouvel utilisateur
router.post('/', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const user = await User.create({ name, email, password, role });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});

module.exports = router;
