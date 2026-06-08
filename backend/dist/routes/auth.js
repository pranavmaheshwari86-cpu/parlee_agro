"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);
        const exists = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (exists) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        return res.status(201).json({ success: true, userId: user.id });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: "Invalid data", details: error.flatten() });
        }
        return res.status(500).json({ error: "Failed to register" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ success: true, user: userWithoutPassword });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: "Invalid data", details: error.flatten() });
        }
        return res.status(500).json({ error: "Failed to login" });
    }
});
exports.default = router;
