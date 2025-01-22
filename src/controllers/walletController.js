const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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

exports.addFunds = async (req, res) => {
    const { user_id, amount, paymentMethodId } = req.body;

    // Validation des données
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount specified' });
    }

    try {
        // Vérifier si le portefeuille existe
        let wallet = await Wallet.findOne({ where: { user_id } });
        if (!wallet) {
            wallet = await Wallet.create({ user_id, balance: 0 });
        }

        // Traitement du paiement avec Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe attend un montant en centimes
            currency: 'eur',
            payment_method: paymentMethodId,
            confirm: true, // Confirme immédiatement le paiement
        });

        // Ajouter les fonds au portefeuille
        wallet.balance += parseFloat(amount);
        await wallet.save();

        // Enregistrer la transaction
        await Transaction.create({
            user_id,
            type: 'deposit',
            amount,
        });

        // Contenu de l'e-mail
        const emailContent = `
            <h1>Reçu de paiement</h1>
            <p>Bonjour,</p>
            <p>Nous avons bien reçu votre paiement de <strong>${amount} EUR</strong>.</p>
            <p>Votre portefeuille a été mis à jour avec succès.</p>
            <p>Merci de votre confiance !</p>
            <hr />
            <p><strong>Transaction ID :</strong> ${paymentIntent.id}</p>
        `;

        // Envoyer un reçu par e-mail
        await sendEmail(email, 'Reçu de paiement', emailContent);

        res.status(200).json({
            message: 'Funds added successfully',
            wallet,
            paymentIntent,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding funds', error });
    }
};

