const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const merchantRoutes = require("./routes/merchant.routes");
const statsRoutes = require("./routes/stats.routes");
const testRoutes = require("./routes/test.routes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/merchants", merchantRoutes);
app.use("/api/v1/stats", statsRoutes);

// 🔑 REQUIRED TEST ENDPOINT
app.use(testRoutes);

module.exports = app;
