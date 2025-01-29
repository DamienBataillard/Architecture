const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const User = require("../models/User"); 
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const sendEmail = require("../services/emailService"); // Assuming you have an email utility

// ✅ Get Wallet Balance
exports.getWallet = async (req, res) => {
    const user_id = req.user.userId; // Get from JWT token

    try {
        let wallet = await Wallet.findOne({ where: { user_id } });

        // ✅ If wallet doesn't exist, create a new one
        if (!wallet) {
            wallet = await Wallet.create({ user_id, balance: 0 });
        }

        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ message: "Error fetching wallet", error });
    }
};

// ✅ Add Funds to Wallet (Using Stripe)
exports.addFunds = async (req, res) => {
    const { user_id, amount, paymentMethodId } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount specified" });
    }

    try {
        // ✅ Fetch user from the database
        const user = await User.findOne({ where: { id: user_id } });

        console.log(user)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const email = user.email; // Extract email from the user object

        // ✅ Verify if user wallet exists
        let wallet = await Wallet.findOne({ where: { user_id } });
        if (!wallet) {
            wallet = await Wallet.create({ user_id, balance: 0 });
        }

        // ✅ Process payment with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: "eur",
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never" // 🔥 Prevents errors caused by missing `return_url`
            },
        });

        // ✅ Add funds after successful payment
        wallet.balance += parseFloat(amount);
        await wallet.save();

        // ✅ Log the transaction
        await Transaction.create({
            user_id,
            type: "deposit",
            amount,
        });

        // ✅ Send payment receipt email
        const emailContent = `
            <h1>Payment Receipt</h1>
            <p>Hello ${user.name},</p>
            <p>We have received your payment of <strong>${amount} EUR</strong>.</p>
            <p>Your wallet balance has been updated successfully.</p>
            <p>Thank you for your trust!</p>
            <hr />
            <p><strong>Transaction ID:</strong> ${paymentIntent.id}</p>
        `;

        await sendEmail(email, "Payment Receipt", emailContent);

        res.status(200).json({
            message: "Funds added successfully",
            wallet,
            paymentIntent,
        });
    } catch (error) {
        console.error("❌ Error processing payment:", error);

        if (error.type === "StripeCardError") {
            return res.status(400).json({ message: "Card was declined", error });
        }

        res.status(500).json({ message: "Error adding funds", error });
    }
};
