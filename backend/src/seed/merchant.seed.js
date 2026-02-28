const pool = require("../db");

const seedTestMerchant = async () => {
  try {
    const checkQuery = `
      SELECT id FROM merchants WHERE email = $1
    `;
    const result = await pool.query(checkQuery, ["test@example.com"]);

    if (result.rows.length > 0) {
      console.log("Test merchant already exists, skipping seed");
      return;
    }

    const insertQuery = `
      INSERT INTO merchants (
        id,
        name,
        email,
        api_key,
        api_secret,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, NOW(), NOW()
      )
    `;

    await pool.query(insertQuery, [
      "550e8400-e29b-41d4-a716-446655440000",
      "Test Merchant",
      "test@example.com",
      "key_test_abc123",
      "secret_test_xyz789",
    ]);

    console.log("Test merchant seeded successfully");
  } catch (error) {
    console.error("Error seeding test merchant:", error);
  }
};

module.exports = seedTestMerchant;
