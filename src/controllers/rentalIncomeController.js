const RentalIncome = require('../models/RentalIncome');

// Lister les revenus locatifs d'un utilisateur
exports.getRentalIncomeByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const rentalIncomes = await RentalIncome.findAll({ where: { user_id: userId } });
        res.status(200).json(rentalIncomes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rental income', error });
    }
};
