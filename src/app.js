require('dotenv').config();
require('./scheduler/rentalScheduler');
const express = require('express');
const cors = require('cors');
const cronJobs = require('./cronJobs');
const sequelize = require('./config/database');
const investmentRoutes = require('./routes/investmentRoutes');
const userRoutes = require('./routes/userRoutes'); // Import des routes utilisateurs
const propertyRoutes = require('./routes/propertyRoutes');
const walletRoutes = require('./routes/walletRoutes');
const refundRoutes = require("./routes/refundRoutes");
const transactionRoutes = require('./routes/transactionRoutes');
const rentalIncomeRoutes = require('./routes/rentalIncomeRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

cronJobs;

// Test de la base de données
sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection failed:', err));

sequelize.sync({ alter: true  }) // `force: true` recrée les tables à chaque démarrage
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Sync error:', err));

// Routes
app.use('/api/users', userRoutes); // Intégration des routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/investments', investmentRoutes);
app.use("/api/refunds", refundRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/rental-income', rentalIncomeRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
