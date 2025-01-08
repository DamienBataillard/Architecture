const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

// Routes pour les propriétés
router.post('/', propertyController.createProperty); // Ajouter une propriété
router.get('/', propertyController.getOpenProperties); // Lister les propriétés ouvertes
router.put('/:id', propertyController.updateProperty); // Mettre à jour une propriété
router.delete('/:id', propertyController.deleteProperty); // Supprimer une propriété

module.exports = router;
