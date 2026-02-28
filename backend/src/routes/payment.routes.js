const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { processPayment } = require("../services/payment.service");
const pool = require("../db");


// Create Payment
router.post("/", authMiddleware, async (req, res) => {
  const result = await processPayment(req.merchant.id, req.body);

  if (result.error) {
    const status =
      result.error.code === "NOT_FOUND_ERROR" ? 404 : 400;
    return res.status(status).json({ error: result.error });
  }

  const response = {
    id: result.id,
    order_id: result.order_id,
    amount: result.amount,
    currency: result.currency,
    method: result.method,
    status: result.status,
    created_at: result.created_at,
  };

  if (result.method === "upi") {
    response.vpa = result.vpa;
  }

  if (result.method === "card") {
    response.card_network = result.card_network;
    response.card_last4 = result.card_last4;
  }

  return res.status(201).json(response);
});
// Get Payment by ID
router.get("/:payment_id", authMiddleware, async (req, res) => {
  const { payment_id } = req.params;

  const result = await require("../services/payment.service")
    .getPaymentById(payment_id, req.merchant.id);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  const response = {
    id: result.id,
    order_id: result.order_id,
    amount: result.amount,
    currency: result.currency,
    method: result.method,
    status: result.status,
    created_at: result.created_at,
    updated_at: result.updated_at,
  };

  if (result.method === "upi") {
    response.vpa = result.vpa;
  }

  if (result.method === "card") {
    response.card_network = result.card_network;
    response.card_last4 = result.card_last4;
  }

  return res.status(200).json(response);
});

// Public Payment (Checkout)
router.post("/public", async (req, res) => {
  const { order_id, method, vpa, card } = req.body;

  // 1️⃣ Fetch order
  const order = await require("../services/order.service")
    .getOrderByIdPublic(order_id);

  if (!order) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found",
      },
    });
  }

  // 2️⃣ Create payment using existing logic
  const result = await require("../services/payment.service")
    .processPayment(null, { order_id, method, vpa, card });

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  // 3️⃣ Respond
  const response = {
    id: result.id,
    order_id: result.order_id,
    amount: result.amount,
    currency: result.currency,
    method: result.method,
    status: result.status,
    created_at: result.created_at,
  };

  if (result.method === "upi") response.vpa = result.vpa;
  if (result.method === "card") {
    response.card_network = result.card_network;
    response.card_last4 = result.card_last4;
  }

  return res.status(201).json(response);
});

// List all payments for dashboard
router.get("/", authMiddleware, async (req, res) => {
  const merchantId = req.merchant.id;

  const result = await pool.query(
    `
    SELECT 
      id,
      order_id,
      amount,
      currency,
      method,
      status,
      created_at
    FROM payments
    WHERE merchant_id = $1
    ORDER BY created_at DESC
    `,
    [merchantId]
  );

  res.json({
    count: result.rows.length,
    items: result.rows,
  });
});

module.exports = router;
