const RentalIncome = require("../models/RentalIncome");
const Investment = require("../models/Investment");
const Wallet = require("../models/Wallet");
const Property = require("../models/Property");

exports.distributeRentalIncome = async (req, res) => {
    const { property_id, total_income } = req.body;

    try {
        // ✅ Verify the property exists and is fully funded
        const property = await Property.findOne({
            where: { id: property_id, status: "funded", ownership_certified: true },
        });

        if (!property) {
            return res.status(400).json({ message: "Property not eligible for rental income distribution." });
        }

        // ✅ Fetch all investors who own shares in this property
        const investments = await Investment.findAll({ where: { property_id } });

        if (investments.length === 0) {
            return res.status(400).json({ message: "No investors found for this property." });
        }

        // ✅ Distribute rental income proportionally to investors
        for (const investment of investments) {
            const income = (investment.share_percentage / 100) * total_income;

            // ✅ Update investor's wallet balance
            const wallet = await Wallet.findOne({ where: { user_id: investment.user_id } });
            if (wallet) {
                wallet.balance += income;
                await wallet.save();

                // ✅ Log rental income transaction
                await RentalIncome.create({
                    property_id,
                    user_id: investment.user_id,
                    amount: income,
                });

                console.log(`✅ ${income} EUR added to user ${investment.user_id}'s wallet from property ${property_id}`);
            }
        }

        res.status(200).json({ message: "Rental income distributed successfully." });
    } catch (error) {
        console.error("❌ Error distributing rental income:", error);
        res.status(500).json({ message: "Error distributing rental income", error });
    }
};


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
