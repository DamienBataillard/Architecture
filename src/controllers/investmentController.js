const sequelize = require("../config/database");  // ✅ Import Sequelize instance
const Investment = require("../models/Investment");
const Property = require("../models/Property");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");


// Créer un investissement
exports.createInvestment = async (req, res) => {
    const { user_id, property_id, amount } = req.body;

    // Commencer une transaction Sequelize
    const transaction = await sequelize.transaction();

    try {
        // Vérifier si la propriété existe et est ouverte au financement
        const property = await Property.findOne({
            where: { id: property_id, status: 'open' },
            lock: transaction.LOCK.UPDATE, // Verrouiller la ligne pour éviter les modifications concurrentes
            transaction, // Inclure dans la transaction
        });

        if (!property) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Property not available for investment' });
        }

        // Vérifier si l'utilisateur a un portefeuille
        const wallet = await Wallet.findOne({ where: { user_id }, transaction });
        if (!wallet) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Wallet not found for this user' });
        }

        // Vérifier si le solde est supérieur ou égal à 500 EUR
        if (wallet.balance < 500) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Insufficient wallet balance. Minimum balance of 500 EUR is required to invest.' });
        }

        // Vérifier si le solde est suffisant pour l'investissement
        if (wallet.balance < amount) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Insufficient balance in wallet' });
        }

        // Vérifier si le montant total après cet investissement ne dépasse pas le prix de la propriété
        const totalInvested = await Investment.sum('amount', {
            where: { property_id },
            transaction, // Inclure dans la transaction
        });

        if (totalInvested + amount > property.price) {
            await transaction.rollback();
            return res.status(400).json({
                message: 'Investment amount exceeds the remaining funding required for this property',
            });
        }

        // Calculer le pourcentage de parts achetées
        const share_percentage = (amount / property.price) * 100;

        // Créer l'investissement
        const investment = await Investment.create(
            {
                user_id,
                property_id,
                amount,
                share_percentage,
            },
            { transaction }
        );

        // Mettre à jour le solde du portefeuille
        wallet.balance -= amount;
        await wallet.save({ transaction });

        // Enregistrer une transaction utilisateur
        await Transaction.create(
            {
                user_id,
                type: 'withdrawal',
                amount,
            },
            { transaction }
        );

        // Vérifier si le financement est terminé après cet investissement
        if (totalInvested + amount === property.price) {
            property.status = 'funded'; // Mettre à jour le statut de la propriété
            property.ownership_certified = true;
            await property.save({ transaction });
        }

        // Valider la transaction
        await transaction.commit();

        res.status(201).json({ message: 'Investment created successfully', investment });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(500).json({ message: 'Error creating investment', error });
    }
};

// ✅ Get Investments (Portfolio) by User
exports.getInvestmentsByUser = async (req, res) => {
    const user_id = req.user.userId; // Get user ID from JWT

    try {
        const investments = await Investment.findAll({
            where: { user_id },
            include: [
                {
                    model: Property,
                    as: "property",
                    attributes: ["id", "name", "description", "price", "status", "type"]
                }
            ]
        });

        if (!investments.length) {
            return res.status(404).json({ message: "No investments found in your portfolio" });
        }

        const portfolio = investments.map(investment => ({
            property: investment.property,
            amount_invested: investment.amount,
            share_percentage: investment.share_percentage
        }));

        res.status(200).json({ message: "Portfolio retrieved successfully", portfolio });
    } catch (error) {
        console.error("❌ Error fetching portfolio:", error);
        res.status(500).json({ message: "Error fetching portfolio", error });
    }
};

// ✅ Refund Investors if Property is Not Fully Funded
exports.refundInvestors = async (property_id) => {
    const transaction = await sequelize.transaction(); // Start transaction

    try {
        const investments = await Investment.findAll({ where: { property_id }, transaction });

        for (const investment of investments) {
            const wallet = await Wallet.findOne({ where: { user_id: investment.user_id }, transaction });

            if (wallet) {
                wallet.balance += investment.amount;
                await wallet.save({ transaction });

                await Transaction.create(
                    { user_id: investment.user_id, type: 'refund', amount: investment.amount },
                    { transaction }
                );
            }

            await investment.destroy({ transaction }); // Remove investment entry
        }

        await transaction.commit(); // Commit transaction
        console.log(`✅ Refunds completed for property ID: ${property_id}`);
    } catch (error) {
        await transaction.rollback(); // Rollback on error
        console.error("❌ Error processing refunds:", error);
    }
};
