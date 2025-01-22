const cron = require('node-cron');
const { processRefunds } = require('./services/refundService');

// Tâche planifiée pour exécuter le remboursement toutes les 24 heures
cron.schedule('0 0 * * *', async () => {
    console.log('Starting refund process...');
    await processRefunds();
    console.log('Refund process completed.');
});

module.exports = cron;
