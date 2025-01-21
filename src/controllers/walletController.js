const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// Afficher le solde d'un utilisateur
exports.getWallet = async (req, res) => {
    const { userId } = req.params;

    try {
        const wallet = await Wallet.findOne({ where: { user_id: userId } });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wallet', error });
    }
};

// Ajouter de l'argent au portefeuille
exports.depositMoney = async (req, res) => {
    const { user_id, amount } = req.body;

    try {
        // Vérifier que le portefeuille existe
        let wallet = await Wallet.findOne({ where: { user_id } });
        if (!wallet) {
            // Créer un portefeuille si aucun n'existe
            wallet = await Wallet.create({ user_id, balance: 0 });
        }

        // Ajouter de l'argent
        wallet.balance += parseFloat(amount);
        await wallet.save();

        res.status(200).json({ message: 'Money deposited successfully', wallet });
    } catch (error) {
        res.status(500).json({ message: 'Error depositing money', error });
    }
};

exports.addFunds = async (req, res) => {
    const { user_id, amount } = req.body;

    try {
        let wallet = await Wallet.findOne({ where: { user_id } });
        if (!wallet) {
            wallet = await Wallet.create({ user_id, balance: 0 });
        }

        wallet.balance += parseFloat(amount);
        await wallet.save();

        // Enregistrer la transaction
        await Transaction.create({
            user_id,
            type: 'deposit',
            amount,
        });

        res.status(200).json({ message: 'Funds added successfully', wallet });
    } catch (error) {
        res.status(500).json({ message: 'Error adding funds', error });
    }
};
