const cron = require("node-cron");
const { processRefunds } = require("./services/refundService");

let isProcessing = false; // Lock mechanism to prevent overlapping executions

// Schedule the refund process every 24 hours at midnight
cron.schedule("0 0 * * *", async () => {
    if (isProcessing) {
        console.log("⏳ Refund process is already running. Skipping this execution...");
        return;
    }

    isProcessing = true; // Lock the execution

    try {
        console.log("🚀 Starting refund process...");
        await processRefunds();
        console.log("✅ Refund process completed successfully.");
    } catch (error) {
        console.error("❌ Error in scheduled refund process:", error);
    } finally {
        isProcessing = false; // Unlock for next execution
    }
});

console.log("🔄 Scheduled refund process every 24 hours at midnight.");
module.exports = cron;
