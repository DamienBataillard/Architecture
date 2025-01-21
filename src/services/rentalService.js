const RentalIncome = require('../models/RentalIncome');
const Investment = require('../models/Investment');
const Wallet = require('../models/Wallet');

const distributeRentalIncome = async (property_id, total_income) => {
    try {
        // Récupérer tous les investissements pour cette propriété
        const investments = await Investment.findAll({ where: { property_id } });

        // Calculer et distribuer les revenus locatifs
        for (const investment of investments) {
            const income = (investment.share_percentage / 100) * total_income;

            // Ajouter le revenu au portefeuille de l'investisseur
            const wallet = await Wallet.findOne({ where: { user_id: investment.user_id } });
            if (wallet) {
                wallet.balance += income;
                await wallet.save();

                // Enregistrer le revenu locatif dans la table RentalIncome
                await RentalIncome.create({
                    property_id,
                    user_id: investment.user_id,
                    amount: income,
                });
            }
        }

        console.log(`Rental income distributed for property ID: ${property_id}`);
    } catch (error) {
        console.error('Error distributing rental income:', error);
    }
};

module.exports = { distributeRentalIncome };
