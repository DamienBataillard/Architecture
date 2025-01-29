const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const sequelize = require("./config/database");
const User = require("./models/User");
const Property = require("./models/Property");
const Wallet = require("./models/Wallet");

async function seedDatabase() {
  try {
    // Lire le fichier JSON
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json"), "utf8"));

    console.log("🔄 Synchronizing database...");
    await sequelize.sync({ force: true }); // ATTENTION : Supprime toutes les tables et les recrée !

    console.log("👤 Seeding Users...");
    await User.bulkCreate(data.users);

    console.log("🏠 Seeding Properties...");
    await Property.bulkCreate(data.properties);

    console.log("💰 Seeding Wallets...");
    await Wallet.bulkCreate(data.wallets);

    console.log("✅ Database successfully populated!");
    process.exit();
  } catch (error) {
    console.error("❌ Error populating database:", error);
    process.exit(1);
  }
}

seedDatabase();
