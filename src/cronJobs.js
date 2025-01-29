const cron = require("node-cron");
const { processRefunds } = require("./services/refundService");
const { processMonthlyRentalIncome } = require("./services/rentalService");

let isProcessingRefunds = false;
let isProcessingRentals = false;

// Refund Process - Runs every 24 hours at midnight
cron.schedule("0 0 * * *", async () => {
    if (isProcessingRefunds) {
        console.log("⏳ Refund process is already running. Skipping this execution...");
        return;
    }

    isProcessingRefunds = true;

    try {
        console.log("🚀 Starting refund process...");
        await processRefunds();
        console.log("✅ Refund process completed.");
    } catch (error) {
        console.error("❌ Error in scheduled refund process:", error);
    } finally {
        isProcessingRefunds = false;
    }
});

// Rental Income Distribution - Runs every 1st of the month at midnight
cron.schedule("0 0 1 * *", async () => {
    if (isProcessingRentals) {
        console.log("⏳ Rental income process is already running. Skipping this execution...");
        return;
    }

    isProcessingRentals = true;

    try {
        console.log("📅 Running monthly rental income job...");
        await processMonthlyRentalIncome();
        console.log("✅ Rental income job completed.");
    } catch (error) {
        console.error("❌ Error in scheduled rental income process:", error);
    } finally {
        isProcessingRentals = false;
    }
});

console.log("🔄 Scheduled refund process every 24 hours at midnight.");
console.log("🔄 Scheduled rental income distribution every 1st of the month at midnight.");

module.exports = cron;
