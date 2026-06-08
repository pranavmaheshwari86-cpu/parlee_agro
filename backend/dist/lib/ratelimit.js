"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = rateLimit;
const limits = new Map();
function rateLimit(ip, config) {
    const now = Date.now();
    const record = limits.get(ip);
    if (!record || now > record.resetTime) {
        limits.set(ip, { count: 1, resetTime: now + config.windowMs });
        return { success: true };
    }
    if (record.count >= config.maxRequests) {
        return { success: false };
    }
    record.count += 1;
    return { success: true };
}
