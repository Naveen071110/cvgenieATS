import { sql } from "./neon";
import { usageSessions } from "@shared/schema";

export interface UserSubscription {
  userId: string;
  isPro: boolean;
  subscriptionStatus: string | null;
  dodoCustomerId: string | null;
  dodoSubscriptionId: string | null;
}

/**
 * Get user subscription status from Neon database by Clerk user ID
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  try {
    const result = await sql`
      SELECT session_id, is_pro, subscription_status, dodo_customer_id, dodo_subscription_id
      FROM usage_sessions
      WHERE session_id = ${userId}
      LIMIT 1
    `;

    if (result.length === 0 || !result[0]) {
      // No record found - user is FREE by default
      return {
        userId,
        isPro: false,
        subscriptionStatus: 'free',
        dodoCustomerId: null,
        dodoSubscriptionId: null,
      };
    }

    const subscription = result[0];
    
    // STRICT: Only set isPro if BOTH conditions are true:
    // 1. Database has is_pro = 1
    // 2. subscription_status is explicitly "active"
    const isActive = subscription.subscription_status === 'active';
    const isPro = subscription.is_pro === 1 && isActive;
    
    return {
      userId,
      isPro,
      subscriptionStatus: subscription.subscription_status || 'free',
      dodoCustomerId: subscription.dodo_customer_id,
      dodoSubscriptionId: subscription.dodo_subscription_id,
    };
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    // On error, default to FREE tier
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
    // STRICT: Only set isPro to 1 if status is explicitly "active"
    // Any other status (free, cancelled, expired, etc.) = isPro: 0
    const isPro = subscriptionStatus === 'active' ? 1 : 0;
    
    const existing = await sql`
      SELECT id FROM usage_sessions WHERE session_id = ${userId} LIMIT 1
    `;

    if (existing.length > 0) {
      await sql`
        UPDATE usage_sessions
        SET is_pro = ${isPro},
            dodo_customer_id = ${dodoCustomerId},
            dodo_subscription_id = ${dodoSubscriptionId},
            subscription_status = ${subscriptionStatus}
        WHERE session_id = ${userId}
      `;
    } else {
      // New user - insert with specified status
      await sql`
        INSERT INTO usage_sessions (session_id, generations_used, is_pro, dodo_customer_id, dodo_subscription_id, subscription_status)
        VALUES (${userId}, 0, ${isPro}, ${dodoCustomerId}, ${dodoSubscriptionId}, ${subscriptionStatus})
      `;
    }
    
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
