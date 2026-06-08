"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const orders_1 = __importDefault(require("./routes/orders"));
const payments_1 = __importDefault(require("./routes/payments"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
    credentials: true,
}));
// Raw body parser for webhooks (Razorpay needs raw body for signature verification)
app.use("/api/payments/webhook", express_1.default.raw({ type: "application/json" }));
// JSON body parser for everything else
app.use(express_1.default.json());
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
