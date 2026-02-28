const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { createOrder } = require("../services/order.service");

// Create Order
router.post("/", authMiddleware, async (req, res) => {
  const result = await createOrder(req.merchant.id, req.body);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({
    id: result.id,
    merchant_id: result.merchant_id,
    amount: result.amount,
    currency: result.currency,
    receipt: result.receipt,
    notes: result.notes,
    status: result.status,
    created_at: result.created_at,
  });
});
// Public Order Fetch (for checkout)
router.get("/:order_id/public", async (req, res) => {
  const { order_id } = req.params;

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

  return res.status(200).json({
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
  });
});



// Get Order by ID
router.get("/:order_id", authMiddleware, async (req, res) => {
  const { order_id } = req.params;

  const result = await require("../services/order.service")
    .getOrderById(order_id, req.merchant.id);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json({
    id: result.id,
    merchant_id: result.merchant_id,
    amount: result.amount,
    currency: result.currency,
    receipt: result.receipt,
    notes: result.notes,
    status: result.status,
    created_at: result.created_at,
    updated_at: result.updated_at,
  });
});
module.exports = router;
