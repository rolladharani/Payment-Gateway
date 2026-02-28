const pool = require("../db");
const generateId = require("../utils/idGenerator");
const validateVPA = require("../utils/vpa");
const validateLuhn = require("../utils/luhn");
const detectCardNetwork = require("../utils/cardNetwork");
const { isExpiryValid } = require("./validation.service");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processPayment = async (merchantId, data) => {
  const { order_id, method } = data;

  // 1️⃣ Verify order exists (merchant OR public)
  let orderResult;

  if (merchantId) {
    // 🔒 Merchant flow
    orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND merchant_id = $2",
      [order_id, merchantId]
    );
  } else {
    // 🌐 Public checkout flow
    orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [order_id]
    );
  }

  if (orderResult.rows.length === 0) {
    return {
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found",
      },
    };
  }

  const order = orderResult.rows[0];

  // 2️⃣ Validate payment method
  if (!["upi", "card"].includes(method)) {
    return {
      error: {
        code: "BAD_REQUEST_ERROR",
        description: "Invalid payment method",
      },
    };
  }

  // 3️⃣ Generate unique payment ID
  let paymentId;
  let exists = true;

  while (exists) {
    paymentId = generateId("pay");
    const check = await pool.query(
      "SELECT id FROM payments WHERE id = $1",
      [paymentId]
    );
    exists = check.rows.length > 0;
  }

  let paymentData = {
    id: paymentId,
    order_id: order.id,
    merchant_id: order.merchant_id,
    amount: order.amount,
    currency: order.currency,
    method,
    status: "processing",
    vpa: null,
    card_network: null,
    card_last4: null,
    error_code: null,
    error_description: null,
  };

  // 4️⃣ Method-specific validation
  if (method === "upi") {
    if (!data.vpa || !validateVPA(data.vpa)) {
      return {
        error: {
          code: "INVALID_VPA",
          description: "VPA format invalid",
        },
      };
    }
    paymentData.vpa = data.vpa;
  }

  if (method === "card") {
    const card = data.card;
    if (!card) {
      return {
        error: {
          code: "INVALID_CARD",
          description: "Card validation failed",
        },
      };
    }

    const { number, expiry_month, expiry_year } = card;

    if (!validateLuhn(number)) {
      return {
        error: {
          code: "INVALID_CARD",
          description: "Card validation failed",
        },
      };
    }

    if (!isExpiryValid(expiry_month, expiry_year)) {
      return {
        error: {
          code: "EXPIRED_CARD",
          description: "Card expiry date invalid",
        },
      };
    }

    paymentData.card_network = detectCardNetwork(number);
    paymentData.card_last4 = number.slice(-4);
  }

  // 5️⃣ Insert payment (status = processing)
  await pool.query(
    `
    INSERT INTO payments (
      id, order_id, merchant_id, amount, currency,
      method, status, vpa, card_network, card_last4
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
    )
  `,
    [
      paymentData.id,
      paymentData.order_id,
      paymentData.merchant_id,
      paymentData.amount,
      paymentData.currency,
      paymentData.method,
      paymentData.status,
      paymentData.vpa,
      paymentData.card_network,
      paymentData.card_last4,
    ]
  );

  // 6️⃣ Simulate processing delay
  const testMode = process.env.TEST_MODE === "true";
  let delay = 1000;

  if (!testMode) {
    const min = parseInt(process.env.PROCESSING_DELAY_MIN || 5000);
    const max = parseInt(process.env.PROCESSING_DELAY_MAX || 10000);
    delay = Math.floor(Math.random() * (max - min + 1)) + min;
  } else if (process.env.TEST_PROCESSING_DELAY) {
    delay = parseInt(process.env.TEST_PROCESSING_DELAY);
  }

  await sleep(delay);

  // 7️⃣ Decide success / failure
  let success = true;

  if (testMode) {
    success = process.env.TEST_PAYMENT_SUCCESS !== "false";
  } else {
    const rate =
      method === "upi"
        ? parseFloat(process.env.UPI_SUCCESS_RATE || 0.9)
        : parseFloat(process.env.CARD_SUCCESS_RATE || 0.95);
    success = Math.random() < rate;
  }

  if (success) {
    await pool.query(
      "UPDATE payments SET status = 'success', updated_at = NOW() WHERE id = $1",
      [paymentId]
    );
  } else {
    await pool.query(
      `
      UPDATE payments
      SET status = 'failed',
          error_code = 'PAYMENT_FAILED',
          error_description = 'Payment processing failed',
          updated_at = NOW()
      WHERE id = $1
    `,
      [paymentId]
    );
  }

  const finalResult = await pool.query(
    "SELECT * FROM payments WHERE id = $1",
    [paymentId]
  );

  return finalResult.rows[0];
};

const getPaymentById = async (paymentId, merchantId) => {
  const result = await pool.query(
    "SELECT * FROM payments WHERE id = $1 AND merchant_id = $2",
    [paymentId, merchantId]
  );

  if (result.rows.length === 0) {
    return {
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Payment not found",
      },
    };
  }

  return result.rows[0];
};

module.exports = {
  processPayment,
  getPaymentById,
};
