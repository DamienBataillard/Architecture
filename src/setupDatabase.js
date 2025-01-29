const mysql = require("mysql2/promise");
const { exec } = require("child_process");
require("dotenv").config();

async function checkAndSetupDatabase() {
  try {
    console.log("🔍 Checking if the database exists...");

    // Connect to MySQL server without selecting a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    });

    // Check if the database exists
    const [rows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}';`);
    
    if (rows.length > 0) {
      console.log(`✅ Database '${process.env.DB_NAME}' already exists. Skipping setup.`);
      await connection.end();
      return;
    }

    console.log(`🚀 Database '${process.env.DB_NAME}' not found. Creating and seeding...`);
    
    // Create the database
    await connection.query(`CREATE DATABASE ${process.env.DB_NAME};`);
    console.log(`✅ Database '${process.env.DB_NAME}' created successfully.`);

    // Close the connection
    await connection.end();

    // Run the seed script
    exec("node seedDatabase.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error running seedDatabase.js:`, error);
        return;
      }
      console.log(stdout);
      console.error(stderr);
    });

  } catch (error) {
    console.error("❌ Error setting up database:", error);
  }
}

// Run the setup check
checkAndSetupDatabase();
