import { redis } from './redis'

/**
 * Advanced caching utilities for Upstash Redis
 */

// Cache key prefixes for different data types
export const CACHE_KEYS = {
  USER_PROFILE: (userId: string) => `user:${userId}:profile`,
  USER_ACCOUNTS: (userId: string) => `user:${userId}:accounts`,
  ACCOUNT_BALANCE: (accountId: string) => `account:${accountId}:balance`,
  ACCOUNT_TRANSACTIONS: (accountId: string, page: number) => `account:${accountId}:txns:page:${page}`,
  RECIPIENTS: (userId: string) => `user:${userId}:recipients`,
  FEATURE_FLAGS: (flagName: string) => `flags:${flagName}`,
} as const

// Default TTL values (in seconds)
export const CACHE_TTL = {
  USER_PROFILE: 3600,      // 1 hour
  ACCOUNT_BALANCE: 300,    // 5 minutes
  TRANSACTIONS: 120,       // 2 minutes
  RECIPIENTS: 600,         // 10 minutes
  FEATURE_FLAGS: 600,      // 10 minutes
} as const

/**
 * Cache a user's profile
 */
export async function cacheUserProfile<T>(userId: string, profile: T): Promise<void> {
  await redis.set(CACHE_KEYS.USER_PROFILE(userId), profile, { 
    ex: CACHE_TTL.USER_PROFILE 
  })
}

/**
 * Get cached user profile
 */
export async function getCachedUserProfile<T>(userId: string): Promise<T | null> {
  return redis.get<T>(CACHE_KEYS.USER_PROFILE(userId))
}

/**
 * Cache account balance
 */
export async function cacheAccountBalance(
  accountId: string, 
  balance: number
): Promise<void> {
  await redis.set(CACHE_KEYS.ACCOUNT_BALANCE(accountId), balance, { 
    ex: CACHE_TTL.ACCOUNT_BALANCE 
  })
}

/**
 * Get cached account balance
 */
export async function getCachedAccountBalance(accountId: string): Promise<number | null> {
  return redis.get<number>(CACHE_KEYS.ACCOUNT_BALANCE(accountId))
}

/**
 * Invalidate all cache for a user
 */
export async function invalidateUserCache(userId: string): Promise<void> {
  const keys = await redis.keys(`user:${userId}:*`)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

/**
 * Invalidate account-related cache
 */
export async function invalidateAccountCache(accountId: string): Promise<void> {
  const keys = await redis.keys(`account:${accountId}:*`)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

/**
 * Session caching for auth
 */
export async function cacheSession(
  sessionId: string, 
  sessionData: Record<string, unknown>
): Promise<void> {
  await redis.set(`session:${sessionId}`, sessionData, { ex: 3600 }) // 1 hour
}

export async function getCachedSession<T>(sessionId: string): Promise<T | null> {
  return redis.get<T>(`session:${sessionId}`)
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await redis.del(`session:${sessionId}`)
}

/**
 * Feature flags
 */
export async function getFeatureFlag(flagName: string): Promise<boolean> {
  const value = await redis.get<boolean>(CACHE_KEYS.FEATURE_FLAGS(flagName))
  return value ?? false
}

export async function setFeatureFlag(flagName: string, enabled: boolean): Promise<void> {
  await redis.set(CACHE_KEYS.FEATURE_FLAGS(flagName), enabled, { 
    ex: CACHE_TTL.FEATURE_FLAGS 
  })
}

/**
 * Increment a counter (useful for analytics)
 */
export async function incrementCounter(key: string, amount = 1): Promise<number> {
  return redis.incrby(key, amount)
}

/**
 * Get counter value
 */
export async function getCounter(key: string): Promise<number> {
  const value = await redis.get<number>(key)
  return value ?? 0
}
