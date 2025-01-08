const Property = require('../models/Property');

// Ajouter une propriété
exports.createProperty = async (req, res) => {
    const { name, description, price, status, type, agent_id } = req.body;

    try {
        const property = await Property.create({ name, description, price, status, type, agent_id });
        res.status(201).json({ message: 'Property created successfully', property });
    } catch (error) {
        res.status(500).json({ message: 'Error creating property', error });
    }
};

// Lister les propriétés ouvertes au financement
exports.getOpenProperties = async (req, res) => {
    try {
        const properties = await Property.findAll({ where: { status: 'open' } });
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties', error });
    }
};

// Mettre à jour une propriété
exports.updateProperty = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        await property.update(updates);
        res.status(200).json({ message: 'Property updated successfully', property });
    } catch (error) {
        res.status(500).json({ message: 'Error updating property', error });
    }
};

// Supprimer une propriété
exports.deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        await property.destroy();
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property', error });
    }
};
