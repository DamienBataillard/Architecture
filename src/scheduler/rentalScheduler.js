const cron = require('node-cron');
const { distributeRentalIncome } = require('../services/rentalService');

// Exemple : Récupérer les propriétés avec un revenu locatif à distribuer
const properties = [
    { id: 1, total_income: 5000 },
    { id: 2, total_income: 8000 },
];

// Planifier la distribution mensuelle
cron.schedule('0 0 1 * *', async () => { // Exécuter le 1er jour de chaque mois
    console.log('Starting rental income distribution...');

    for (const property of properties) {
        await distributeRentalIncome(property.id, property.total_income);
    }

    console.log('Rental income distribution completed.');
});
