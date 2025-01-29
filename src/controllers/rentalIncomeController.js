const RentalIncome = require("../models/RentalIncome");

exports.getRentalIncomeByUser = async (req, res) => {
    const user_id = req.user.userId; // Get user ID from token

    try {
        const rentalIncomes = await RentalIncome.findAll({ where: { user_id } });

        if (rentalIncomes.length === 0) {
            return res.status(404).json({ message: "No rental income records found for this user." });
        }

        res.status(200).json(rentalIncomes);
    } catch (error) {
        console.error("❌ Error fetching rental income:", error);
        res.status(500).json({ message: "Error fetching rental income", error });
    }
};
