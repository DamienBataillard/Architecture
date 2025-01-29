const RentalIncome = require("../models/RentalIncome");
const Investment = require("../models/Investment");
const Wallet = require("../models/Wallet");
const Property = require("../models/Property");
const Transaction = require("../models/Transaction");

/**
 * Distributes rental income to all investors of a funded property.
 * @param {number} property_id - The ID of the property.
 * @param {number} total_income - The total rental income to be distributed.
 */

const distributeRentalIncome = async (property_id, total_income) => {
    try {
        console.log(`📢 Processing rental income for property ID: ${property_id}`);

        // ✅ Validate property exists and is funded
        const property = await Property.findOne({ where: { id: property_id, status: "funded" } });
        if (!property) {
            console.warn(`⚠️ Property ID: ${property_id} not found or not funded.`);
            return;
        }

        // ✅ Retrieve all investments in this property
        const investments = await Investment.findAll({ where: { property_id } });

        if (investments.length === 0) {
            console.warn(`⚠️ No investments found for property ID: ${property_id}.`);
            return;
        }

        for (const investment of investments) {
            // ✅ Calculate investor's rental income share
            const income = (investment.share_percentage / 100) * total_income;

            // ✅ Find investor's wallet
            let wallet = await Wallet.findOne({ where: { user_id: investment.user_id } });

            // ✅ If no wallet, create one
            if (!wallet) {
                wallet = await Wallet.create({ user_id: investment.user_id, balance: 0 });
            }

            // ✅ Update wallet balance
            wallet.balance += income;
            await wallet.save();

            // ✅ Record rental income transaction
            await RentalIncome.create({
                property_id,
                user_id: investment.user_id,
                amount: income,
            });

            // ✅ Log transaction in database
            await Transaction.create({
                user_id: investment.user_id,
                type: "rental_income",
                amount: income,
            });

            console.log(`✅ Rental income of ${income.toFixed(2)} EUR added to user ${investment.user_id}`);
        }

        console.log(`🎉 Successfully distributed rental income for property ID: ${property_id}`);
    } catch (error) {
        console.error("❌ Error distributing rental income:", error);
    }
};

module.exports = { distributeRentalIncome };
