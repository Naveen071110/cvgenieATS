import { neonClient } from "./neon";
import { usageSessions } from "@shared/schema";
import { eq } from "drizzle-orm";

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
    const db = neonClient();
    
    const result = await db
      .select({
        sessionId: usageSessions.sessionId,
        isPro: usageSessions.isPro,
        subscriptionStatus: usageSessions.subscriptionStatus,
        dodoCustomerId: usageSessions.dodoCustomerId,
        dodoSubscriptionId: usageSessions.dodoSubscriptionId,
      })
      .from(usageSessions)
      .where(eq(usageSessions.sessionId, userId))
      .limit(1);

    if (result.length === 0) {
      return {
        userId,
        isPro: false,
        subscriptionStatus: 'free',
        dodoCustomerId: null,
        dodoSubscriptionId: null,
      };
    }

    const subscription = result[0];
    return {
      userId,
      isPro: subscription.isPro === 1,
      subscriptionStatus: subscription.subscriptionStatus || 'free',
      dodoCustomerId: subscription.dodoCustomerId,
      dodoSubscriptionId: subscription.dodoSubscriptionId,
    };
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
 */
export async function updateUserSubscription(
  userId: string,
  dodoCustomerId: string,
  dodoSubscriptionId: string,
  subscriptionStatus: string
): Promise<void> {
  try {
    const db = neonClient();
    
    const isPro = subscriptionStatus === 'active' ? 1 : 0;
    
    const existingUser = await db
      .select()
      .from(usageSessions)
      .where(eq(usageSessions.sessionId, userId))
      .limit(1);

    if (existingUser.length > 0) {
      await db
        .update(usageSessions)
        .set({
          isPro,
          dodoCustomerId,
          dodoSubscriptionId,
          subscriptionStatus,
        })
        .where(eq(usageSessions.sessionId, userId));
    } else {
      await db.insert(usageSessions).values({
        sessionId: userId,
        generationsUsed: 0,
        isPro,
        dodoCustomerId,
        dodoSubscriptionId,
        subscriptionStatus,
      });
    }
    
    console.log(`Updated subscription for user ${userId}: ${subscriptionStatus}`);
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
    const db = neonClient();
    
    const result = await db
      .select({ sessionId: usageSessions.sessionId })
      .from(usageSessions)
      .where(eq(usageSessions.dodoCustomerId, dodoCustomerId))
      .limit(1);

    return result.length > 0 ? result[0].sessionId : null;
  } catch (error) {
    console.error("Error fetching user by Dodo customer ID:", error);
    return null;
  }
}
