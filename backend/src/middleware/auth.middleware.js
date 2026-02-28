const pool = require("../db");

const authMiddleware = async (req, res, next) => {
  try {
    // ✅ FIX: lowercase header names
    const apiKey = req.header("x-api-key");
    const apiSecret = req.header("x-api-secret");

    if (!apiKey || !apiSecret) {
      return res.status(401).json({
        error: {
          code: "AUTHENTICATION_ERROR",
          description: "Missing API credentials",
        },
      });
    }

    const query = `
      SELECT id, name, email, api_key, api_secret
      FROM merchants
      WHERE api_key = $1
        AND api_secret = $2
        AND is_active = true
    `;

    const result = await pool.query(query, [apiKey, apiSecret]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: {
          code: "AUTHENTICATION_ERROR",
          description: "Invalid API credentials",
        },
      });
    }

    req.merchant = result.rows[0];
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({
      error: {
        code: "AUTHENTICATION_ERROR",
        description: "Authentication failed",
      },
    });
  }
};

module.exports = authMiddleware;
