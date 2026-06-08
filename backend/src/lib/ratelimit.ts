type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
};

const limits = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, config: RateLimitConfig) {
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
