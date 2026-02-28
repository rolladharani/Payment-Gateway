const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const pool = require("../db");

// Dashboard stats
router.get("/dashboard", authMiddleware, async (req, res) => {
  const merchantId = req.merchant.id;

  const totalResult = await pool.query(
    "SELECT COUNT(*) FROM payments WHERE merchant_id = $1",
    [merchantId]
  );

  const successResult = await pool.query(
    `
    SELECT 
      COUNT(*) AS success_count,
      COALESCE(SUM(amount), 0) AS total_amount
    FROM payments
    WHERE merchant_id = $1 AND status = 'success'
    `,
    [merchantId]
  );

  const total = parseInt(totalResult.rows[0].count);
  const success = parseInt(successResult.rows[0].success_count);
  const totalAmount = parseInt(successResult.rows[0].total_amount);

  const successRate = total === 0 ? 0 : Math.round((success / total) * 100);

  res.json({
    total_transactions: total,
    total_amount: totalAmount,
    success_rate: successRate,
  });
});

module.exports = router;
