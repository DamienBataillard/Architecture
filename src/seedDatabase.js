const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
const sequelize = require("./config/database");
const User = require("./models/User");
const Property = require("./models/Property");
const Wallet = require("./models/Wallet");

// Load environment variables
require("dotenv").config();

async function createDatabase() {
  try {
    console.log("🔄 Checking if database exists...");

    // Create a connection without specifying the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    });

    // Create the database if it does not exist
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
    // Load initial data
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json"), "utf8"));

    console.log("🔄 Creating database if not exists...");
    await createDatabase();

    console.log("🔄 Synchronizing database...");
    await sequelize.sync({ force: true }); // ⚠️ This will reset all tables!

    console.log("👤 Seeding Users...");
    await User.bulkCreate(data.user);

    console.log("🏠 Seeding Properties...");
    await Property.bulkCreate(data.properties);

    console.log("💰 Seeding Wallets...");
    await Wallet.bulkCreate(data.wallets);

    console.log("✅ Database successfully created and populated!");
    process.exit();
  } catch (error) {
    console.error("❌ Error populating database:", error);
    process.exit(1);
  }
}

// Run the script
seedDatabase();
