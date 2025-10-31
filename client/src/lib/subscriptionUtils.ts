
/**
 * Subscription utilities to ensure users are correctly assigned Pro/Free tiers
 */

export interface SubscriptionData {
  isPro: boolean;
  subscriptionStatus: string;
  dodoCustomerId?: string;
  dodoSubscriptionId?: string;
}

/**
 * Validates if a user should have Pro access
 * STRICT: Both isPro flag AND active status must be true
 */
export function validateProAccess(subscription: SubscriptionData | null | undefined): boolean {
  if (!subscription) return false;
  
  return Boolean(
    subscription.isPro === true && 
    subscription.subscriptionStatus === 'active'
  );
}

/**
 * Clear any cached subscription data to force fresh fetch
 */
export function clearSubscriptionCache() {
  // Clear localStorage if any subscription data is cached
  const keysToRemove = ['subscription', 'isPro', 'userTier'];
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Failed to clear ${key} from localStorage`);
    }
  });
}

/**
 * Get user tier display name
 */
export function getUserTierDisplay(subscription: SubscriptionData | null | undefined): string {
  return validateProAccess(subscription) ? 'Pro' : 'Free';
}
