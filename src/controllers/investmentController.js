const Investment = require('../models/Investment');
const Property = require('../models/Property');
const Wallet = require('../models/Wallet');

// Créer un investissement
exports.createInvestment = async (req, res) => {
    const { user_id, property_id, amount } = req.body;

    try {
        // Vérifier si la propriété existe et est ouverte au financement
        const property = await Property.findOne({ where: { id: property_id, status: 'open' } });
        if (!property) {
            return res.status(400).json({ message: 'Property not available for investment' });
        }

        // Vérifier si l'utilisateur a un portefeuille et un solde suffisant
        const wallet = await Wallet.findOne({ where: { user_id } });
        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance in wallet' });
        }

        // Calculer le pourcentage de parts achetées
        const share_percentage = (amount / property.price) * 100;

        // Créer l'investissement
        const investment = await Investment.create({
            user_id,
            property_id,
            amount,
            share_percentage,
        });

        // Mettre à jour le solde du portefeuille
        wallet.balance -= amount;
        await wallet.save();

        await Transaction.create({
            user_id,
            type: 'withdrawal',
            amount,
        });

        res.status(201).json({ message: 'Investment created successfully', investment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating investment', error });
    }
};

// Lister les investissements d'un utilisateur
exports.getInvestmentsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const investments = await Investment.findAll({ where: { user_id: userId } });
        res.status(200).json(investments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching investments', error });
    }
};
