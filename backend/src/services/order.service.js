const pool = require("../db");
const generateId = require("../utils/idGenerator");

const createOrder = async (merchantId, data) => {
  const { amount, currency = "INR", receipt = null, notes = null } = data;

  if (!amount || amount < 100) {
    return {
      error: {
        code: "BAD_REQUEST_ERROR",
        description: "amount must be at least 100",
      },
    };
  }

  let orderId;
  let exists = true;

  while (exists) {
    orderId = generateId("order");
    const check = await pool.query("SELECT id FROM orders WHERE id = $1", [orderId]);
    exists = check.rows.length > 0;
  }

  const insertQuery = `
    INSERT INTO orders (
      id, merchant_id, amount, currency, receipt, notes, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, 'created'
    )
    RETURNING *
  `;

  const result = await pool.query(insertQuery, [
    orderId,
    merchantId,
    amount,
    currency,
    receipt,
    notes,
  ]);

  return result.rows[0];
};

const getOrderById = async (orderId, merchantId) => {
  const query = `
    SELECT *
    FROM orders
    WHERE id = $1 AND merchant_id = $2
  `;

  const result = await pool.query(query, [orderId, merchantId]);

  if (result.rows.length === 0) {
    return {
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found",
      },
    };
  }

  return result.rows[0];
};
const getOrderByIdPublic = async (orderId) => {
  const query = `
    SELECT id, amount, currency, status
    FROM orders
    WHERE id = $1
  `;

  const result = await pool.query(query, [orderId]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

module.exports = {
  createOrder,
  getOrderById,
  getOrderByIdPublic,
};
