const Property = require('../models/Property');
const Investment = require('../models/Investment');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

exports.processRefunds = async () => {
    try {
        // Récupérer les propriétés dont le délai de financement est dépassé (plus de 2 mois)
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        const expiredProperties = await Property.findAll({
            where: {
                status: 'open',
                createdAt: { $lt: twoMonthsAgo }, // Propriétés créées il y a plus de 2 mois
            },
        });

        for (const property of expiredProperties) {
            // Récupérer tous les investissements pour cette propriété
            const investments = await Investment.findAll({ where: { property_id: property.id } });

            for (const investment of investments) {
                // Trouver le portefeuille de l'utilisateur
                const wallet = await Wallet.findOne({ where: { user_id: investment.user_id } });

                if (wallet) {
                    // Ajouter le montant investi dans le portefeuille
                    wallet.balance += investment.amount;
                    await wallet.save();

                    // Créer une transaction de remboursement
                    await Transaction.create({
                        user_id: investment.user_id,
                        type: 'refund',
                        amount: investment.amount,
                    });

                    console.log(`Refunded ${investment.amount} to user ${investment.user_id} for property ${property.id}`);
                }

                // Supprimer l'investissement
                await investment.destroy();
            }

            // Mettre à jour le statut de la propriété en "failed"
            property.status = 'failed';
            await property.save();

            console.log(`Property ${property.id} marked as failed and refunds processed.`);
        }
    } catch (error) {
        console.error('Error processing refunds:', error);
    }
};
