const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

// Get logged-in merchant details
router.get("/me", authMiddleware, async (req, res) => {
  const merchant = req.merchant;

  return res.status(200).json({
    id: merchant.id,
    api_key: merchant.api_key,
    api_secret: merchant.api_secret,
  });
});

module.exports = router;
