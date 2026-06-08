import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import orderRoutes from "./routes/orders";
import paymentRoutes from "./routes/payments";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
  credentials: true,
}));

// Raw body parser for webhooks (Razorpay needs raw body for signature verification)
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// JSON body parser for everything else
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
