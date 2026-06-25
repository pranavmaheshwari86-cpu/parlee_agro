"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const orders_1 = __importDefault(require("./routes/orders"));
const payments_1 = __importDefault(require("./routes/payments"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.set("trust proxy", 1);
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NEXTAUTH_URL || ["http://localhost:4000", "http://localhost:3001"],
    credentials: true,
}));
// Raw body parser for webhooks (Razorpay needs raw body for signature verification)
app.use("/api/payments/webhook", express_1.default.raw({ type: "application/json" }));
// JSON body parser for everything else
app.use(express_1.default.json());
// API key verification middleware
app.use((req, res, next) => {
    if (req.path === "/health" || req.path === "/api/payments/webhook") {
        return next();
    }
    const apiKey = req.header("x-api-key");
    if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(403).json({ error: "Forbidden: Invalid API Key" });
    }
    next();
});
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/orders", orders_1.default);
app.use("/api/payments", payments_1.default);
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
