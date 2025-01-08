require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
const Property = require('./models/Property');
const Wallet = require('./models/Wallet');
const userRoutes = require('./routes/userRoutes'); // Import des routes utilisateurs
const propertyRoutes = require('./routes/propertyRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Test de la base de données
sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection failed:', err));

sequelize.sync({ force: false }) // `force: true` recrée les tables à chaque démarrage
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Sync error:', err));

// Routes
app.use('/api/users', userRoutes); // Intégration des routes
app.use('/api/properties', propertyRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
