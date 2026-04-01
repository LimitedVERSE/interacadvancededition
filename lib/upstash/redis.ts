import { Redis } from '@upstash/redis'

/**
 * Upstash Redis client for caching and rate limiting.
 * Uses environment variables from the Upstash integration.
 */
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Cache helper types
export type CacheOptions = {
  /** Time to live in seconds */
  ttl?: number
  /** Cache key prefix */
  prefix?: string
}

/**
 * Get a cached value or fetch and cache it
 */
export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 300, prefix = 'cache' } = options
  const cacheKey = `${prefix}:${key}`

  const cached = await redis.get<T>(cacheKey)
  if (cached !== null) {
    return cached
  }

  const value = await fetcher()
  await redis.set(cacheKey, value, { ex: ttl })
  return value
}

/**
 * Invalidate a cache key
 */
export async function invalidate(key: string, prefix = 'cache'): Promise<void> {
  await redis.del(`${prefix}:${key}`)
}

/**
 * Invalidate all keys matching a pattern
 */
export async function invalidatePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}
