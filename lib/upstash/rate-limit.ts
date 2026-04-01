import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

/**
 * Rate limiters for different endpoints
 * Using sliding window algorithm for smooth rate limiting
 */

// Auth endpoints - stricter limits to prevent brute force
export const authRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: 'ratelimit:auth',
})

// Transaction endpoints - moderate limits
export const transactionRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'ratelimit:transaction',
})

// General API endpoints
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:api',
})

// Admin endpoints
export const adminRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 m'),
  analytics: true,
  prefix: 'ratelimit:admin',
})

/**
 * Check rate limit and return result
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const { success, remaining, reset } = await limiter.limit(identifier)
  return { success, remaining, reset }
}

/**
 * Get identifier from request (IP or user ID)
 */
export function getIdentifier(
  request: Request,
  userId?: string
): string {
  if (userId) {
    return `user:${userId}`
  }
  
  // Fallback to IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `ip:${ip}`
}
