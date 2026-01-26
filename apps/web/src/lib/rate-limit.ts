import Redis from 'ioredis';

// Initialize Redis client
const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

interface RateLimitConfig {
  windowMs: number;    // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyPrefix?: string;  // Key prefix for different rate limiters
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

// In-memory fallback for when Redis is not available
const memoryStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limiter using Redis with in-memory fallback
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { windowMs, maxRequests, keyPrefix = 'rl' } = config;
  const key = `${keyPrefix}:${identifier}`;
  const now = Date.now();

  // Use Redis if available
  if (redis) {
    try {
      const multi = redis.multi();
      multi.incr(key);
      multi.pttl(key);
      
      const results = await multi.exec();
      if (!results) {
        throw new Error('Redis multi failed');
      }

      const [incrResult, pttlResult] = results;
      const count = (incrResult?.[1] as number) || 1;
      const ttl = (pttlResult?.[1] as number) || -1;

      // Set expiry on first request
      if (ttl === -1) {
        await redis.pexpire(key, windowMs);
      }

      const resetAt = now + (ttl > 0 ? ttl : windowMs);
      const remaining = Math.max(0, maxRequests - count);
      const allowed = count <= maxRequests;

      return {
        allowed,
        remaining,
        resetAt,
        retryAfter: allowed ? undefined : Math.ceil((resetAt - now) / 1000),
      };
    } catch (error) {
      console.error('Redis rate limit error:', error);
      // Fall through to memory store
    }
  }

  // In-memory fallback
  const record = memoryStore.get(key);
  
  if (!record || record.resetAt < now) {
    // Start new window
    const resetAt = now + windowMs;
    memoryStore.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt,
    };
  }

  record.count++;
  const remaining = Math.max(0, maxRequests - record.count);
  const allowed = record.count <= maxRequests;

  return {
    allowed,
    remaining,
    resetAt: record.resetAt,
    retryAfter: allowed ? undefined : Math.ceil((record.resetAt - now) / 1000),
  };
}

// Cleanup memory store periodically
if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.resetAt < now) {
        memoryStore.delete(key);
      }
    }
  }, 60000); // Cleanup every minute
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Authentication endpoints - strict limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
    keyPrefix: 'rl:auth',
  },
  
  // API read endpoints - generous limits
  apiRead: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    keyPrefix: 'rl:api:read',
  },
  
  // API write endpoints - moderate limits
  apiWrite: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    keyPrefix: 'rl:api:write',
  },
  
  // File uploads - strict limits
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    keyPrefix: 'rl:upload',
  },
  
  // Expensive operations (publish, bulk) - very strict
  expensive: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    keyPrefix: 'rl:expensive',
  },
} as const;

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.resetAt),
    ...(result.retryAfter && { 'Retry-After': String(result.retryAfter) }),
  };
}
