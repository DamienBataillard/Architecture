const Property = require("../models/Property");
const Investment = require("../models/Investment");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const { Op } = require("sequelize");

exports.processRefunds = async () => {
    try {
        console.log("🔍 Checking properties for refund processing...");

        // Calculate the current date
        const today = new Date();

        // Find properties where funding deadline has expired
        const expiredProperties = await Property.findAll({
            where: {
                status: "open",
                funding_deadline: { [Op.lt]: today }, // Compare funding deadline, NOT createdAt
            },
        });

        if (expiredProperties.length === 0) {
            console.log("✅ No expired properties found for refund processing.");
            return;
        }

        for (const property of expiredProperties) {
            console.log(`🚨 Processing refunds for expired property: ${property.id}`);

            // Fetch all investments for this property
            const investments = await Investment.findAll({ where: { property_id: property.id } });

            for (const investment of investments) {
                const wallet = await Wallet.findOne({ where: { user_id: investment.user_id } });

                if (wallet) {
                    // Refund money to the investor's wallet
                    wallet.balance += investment.amount;
                    await wallet.save();

                    // Log refund transaction
                    await Transaction.create({
                        user_id: investment.user_id,
                        type: "refund",
                        amount: investment.amount,
                    });

                    console.log(`✅ Refunded ${investment.amount} EUR to user ${investment.user_id}`);
                }

                // Delete the investment record
                await investment.destroy();
            }

            // Update property status to "failed"
            property.status = "failed";
            await property.save();

            console.log(`✅ Property ${property.id} marked as 'failed' and all refunds completed.`);
        }
    } catch (error) {
        console.error("❌ Error processing refunds:", error);
    }
};
