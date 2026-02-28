require("dotenv").config();
const app = require("./app");
const pool = require("./db");
const seedTestMerchant = require("./seed/merchant.seed");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Test DB connection
    await pool.query("SELECT 1");

    // Seed merchant
    await seedTestMerchant();

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
