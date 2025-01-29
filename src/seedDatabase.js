const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
const sequelize = require("./config/database");
const User = require("./models/User");
const Property = require("./models/Property");
const Wallet = require("./models/Wallet");
const RentalIncome = require("./models/RentalIncome");
const Transaction = require("./models/Transaction");

require("dotenv").config();

async function createDatabase() {
  try {
    console.log("🔄 Checking if database exists...");

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`✅ Database '${process.env.DB_NAME}' is ready.`);
    await connection.end();
  } catch (error) {
    console.error("❌ Error creating database:", error);
    process.exit(1);
  }
}

async function seedDatabase() {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json"), "utf8"));

    console.log("🔄 Creating database if not exists...");
    await createDatabase();

    console.log("🔄 Synchronizing database...");
    await sequelize.sync({ force: true });

    // 🔹 Ensure users exist before seeding properties & wallets
    if (data.users && data.users.length > 0) {
      console.log("👤 Seeding Users...");

      for (const userData of data.users) {
        if (!userData.password.startsWith("$2a$")) {
          // Only hash if password is not already hashed
          userData.password = await bcrypt.hash(userData.password, 10);
        }
        await User.create(userData);
      }
    } else {
      console.warn("⚠️ No users found in data.json");
    }

    // 🔹 Ensure properties exist
    if (data.properties && data.properties.length > 0) {
      console.log("🏠 Seeding Properties...");
      await Property.bulkCreate(data.properties);
    } else {
      console.warn("⚠️ No properties found in data.json");
    }

    // 🔹 Ensure wallets exist
    if (data.wallets && data.wallets.length > 0) {
      console.log("💰 Seeding Wallets...");
      await Wallet.bulkCreate(data.wallets);
    } else {
      console.warn("⚠️ No wallets found in data.json");
    }

    console.log("✅ Database successfully created and populated!");
    process.exit();
  } catch (error) {
    console.error("❌ Error populating database:", error);
    process.exit(1);
  }
}

// Run the script
seedDatabase();
