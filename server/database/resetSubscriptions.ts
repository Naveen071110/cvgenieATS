
import { sql } from "./neon";

/**
 * One-time migration script to reset all users to FREE tier
 * Run this to fix existing users who incorrectly have Pro status
 */
export async function resetAllUsersToFree() {
  try {
    console.log('Starting subscription reset...');
    
    // Get all users
    const allUsers = await sql`
      SELECT session_id, is_pro, subscription_status, dodo_customer_id, dodo_subscription_id
      FROM usage_sessions
    `;
    
    console.log(`Found ${allUsers.length} users to check`);
    
    let resetCount = 0;
    let keptProCount = 0;
    
    for (const user of allUsers) {
      const hasActiveSubscription = user.subscription_status === 'active' && 
                                    user.dodo_subscription_id && 
                                    user.dodo_customer_id;
      
      if (user.is_pro === 1 && !hasActiveSubscription) {
        // User is marked as Pro but has no active subscription - reset to free
        await sql`
          UPDATE usage_sessions
          SET is_pro = 0,
              subscription_status = 'free'
          WHERE session_id = ${user.session_id}
        `;
        console.log(`Reset user ${user.session_id} to free (was incorrectly Pro)`);
        resetCount++;
      } else if (hasActiveSubscription) {
        console.log(`Keeping user ${user.session_id} as Pro (has active subscription)`);
        keptProCount++;
      }
    }
    
    console.log(`\nReset complete:`);
    console.log(`- Reset to free: ${resetCount} users`);
    console.log(`- Kept as Pro: ${keptProCount} users`);
    console.log(`- Total processed: ${allUsers.length} users`);
    
    return { resetCount, keptProCount, totalUsers: allUsers.length };
  } catch (error) {
    console.error('Error resetting subscriptions:', error);
    throw error;
  }
}

/**
 * Reset a specific user to free tier
 */
export async function resetUserToFree(userId: string) {
  try {
    await sql`
      UPDATE usage_sessions
      SET is_pro = 0,
          subscription_status = 'free',
          dodo_customer_id = NULL,
          dodo_subscription_id = NULL
      WHERE session_id = ${userId}
    `;
    console.log(`Reset user ${userId} to free tier`);
  } catch (error) {
    console.error(`Error resetting user ${userId}:`, error);
    throw error;
  }
}
