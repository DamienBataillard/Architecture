const Transaction = require('../models/Transaction');

// Lister toutes les transactions d'un utilisateur
exports.getTransactionsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const transactions = await Transaction.findAll({ where: { user_id: userId } });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};
