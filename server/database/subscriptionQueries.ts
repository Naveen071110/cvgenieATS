import { sql } from "./neon";
import { usageSessions } from "@shared/schema";
import { dbCache, CACHE_KEYS, CACHE_TTL } from "./cache";

export interface UserSubscription {
  userId: string;
  isPro: boolean;
  subscriptionStatus: string | null;
  dodoCustomerId: string | null;
  dodoSubscriptionId: string | null;
}

/**
 * Get user subscription status from Neon database by Clerk user ID
 * Uses in-memory cache with 60s TTL to reduce DB hits
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  const cacheKey = CACHE_KEYS.subscription(userId);
  const cached = dbCache.get<UserSubscription>(cacheKey);
  if (cached) return cached;

  try {
    const result = await sql`
      SELECT is_pro, subscription_status, dodo_customer_id, dodo_subscription_id
      FROM usage_sessions
      WHERE session_id = ${userId}
      LIMIT 1
    `;

    if (result.length === 0 || !result[0]) {
      const free: UserSubscription = {
        userId,
        isPro: false,
        subscriptionStatus: 'free',
        dodoCustomerId: null,
        dodoSubscriptionId: null,
      };
      dbCache.set(cacheKey, free, CACHE_TTL.subscription);
      return free;
    }

    const subscription = result[0];
    const isActive = subscription.subscription_status === 'active';
    const isPro = subscription.is_pro === 1 && isActive;
    
    const sub: UserSubscription = {
      userId,
      isPro,
      subscriptionStatus: subscription.subscription_status || 'free',
      dodoCustomerId: subscription.dodo_customer_id,
      dodoSubscriptionId: subscription.dodo_subscription_id,
    };
    dbCache.set(cacheKey, sub, CACHE_TTL.subscription);
    return sub;
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return {
      userId,
      isPro: false,
      subscriptionStatus: 'free',
      dodoCustomerId: null,
      dodoSubscriptionId: null,
    };
  }
}

/**
 * Update user subscription status in Neon database
 * ONLY sets isPro = 1 if subscriptionStatus is explicitly "active"
 */
export async function updateUserSubscription(
  userId: string,
  dodoCustomerId: string,
  dodoSubscriptionId: string,
  subscriptionStatus: string
): Promise<void> {
  try {
    const isPro = subscriptionStatus === 'active' ? 1 : 0;

    // Single UPSERT — eliminates the extra SELECT before INSERT/UPDATE
    await sql`
      INSERT INTO usage_sessions (session_id, generations_used, is_pro, dodo_customer_id, dodo_subscription_id, subscription_status)
      VALUES (${userId}, 0, ${isPro}, ${dodoCustomerId}, ${dodoSubscriptionId}, ${subscriptionStatus})
      ON CONFLICT (session_id) DO UPDATE SET
        is_pro = ${isPro},
        dodo_customer_id = ${dodoCustomerId},
        dodo_subscription_id = ${dodoSubscriptionId},
        subscription_status = ${subscriptionStatus}
    `;

    dbCache.invalidate(CACHE_KEYS.subscription(userId));
    console.log(`Updated subscription for user ${userId}: isPro=${isPro}, status=${subscriptionStatus}`);
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }
}

/**
 * Get user subscription by Dodo customer ID
 */
export async function getUserByDodoCustomerId(dodoCustomerId: string): Promise<string | null> {
  try {
    const result = await sql`
      SELECT session_id FROM usage_sessions WHERE dodo_customer_id = ${dodoCustomerId} LIMIT 1
    `;

    return result.length > 0 && result[0] ? result[0].session_id : null;
  } catch (error) {
    console.error("Error fetching user by Dodo customer ID:", error);
    return null;
  }
}

/**
 * Initialize usage_sessions table if it doesn't exist
 */
export async function initializeUsageSessionsTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS usage_sessions (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) NOT NULL UNIQUE,
      generations_used INTEGER DEFAULT 0,
      is_pro INTEGER DEFAULT 0,
      dodo_customer_id VARCHAR(255),
      dodo_subscription_id VARCHAR(255),
      subscription_status VARCHAR(50) DEFAULT 'free'
    )
  `;
  
  // Create indexes if they don't exist
  await sql`
    CREATE INDEX IF NOT EXISTS idx_usage_sessions_session_id ON usage_sessions(session_id)
  `;
  
  await sql`
    CREATE INDEX IF NOT EXISTS idx_usage_sessions_dodo_customer_id ON usage_sessions(dodo_customer_id)
  `;
}

/**
 * Get total generations used by a user
 */
export async function getUserUsageCount(userId: string): Promise<number> {
  try {
    const result = await sql`
      SELECT generations_used FROM usage_sessions WHERE session_id = ${userId} LIMIT 1
    `;
    if (result.length === 0 || !result[0]) return 0;
    return Number(result[0].generations_used) || 0;
  } catch (error) {
    console.error("Error getting user usage count:", error);
    return 0;
  }
}

/**
 * Increment generations used count for a user
 */
export async function incrementUserUsageCount(userId: string): Promise<number> {
  try {
    const result = await sql`
      INSERT INTO usage_sessions (session_id, generations_used, is_pro, subscription_status)
      VALUES (${userId}, 1, 0, 'free')
      ON CONFLICT (session_id) DO UPDATE SET
        generations_used = usage_sessions.generations_used + 1
      RETURNING generations_used
    `;
    return Number(result[0]?.generations_used) || 1;
  } catch (error) {
    console.error("Error incrementing user usage count:", error);
    return 1;
  }
}

