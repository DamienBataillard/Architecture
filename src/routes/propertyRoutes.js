const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Routes protégées pour les agents
router.post('/', verifyToken, checkRole(['agent']), propertyController.createProperty);
router.put('/:id', verifyToken, checkRole(['agent']), propertyController.updateProperty);
router.delete('/:id', verifyToken, checkRole(['agent']), propertyController.deleteProperty);

// Routes accessibles à tous
router.get('/', verifyToken, propertyController.getOpenProperties);

module.exports = router;
