
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";

interface SubscriptionStatus {
  isPro: boolean;
  subscriptionStatus: string;
  dodoCustomerId?: string;
  dodoSubscriptionId?: string;
}

export function useSubscription() {
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<SubscriptionStatus>({
    queryKey: ['/api/subscription/status'],
    enabled: isSignedIn,
    staleTime: 300000, // 5 minutes — subscription changes only on payment
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const refreshSubscription = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
  };

  // STRICT: User is Pro ONLY if both conditions are true
  const isPro = Boolean(
    data?.isPro && 
    data?.subscriptionStatus === 'active'
  );

  return {
    isPro,
    subscriptionStatus: data?.subscriptionStatus || 'free',
    isLoading,
    error,
    refreshSubscription,
  };
}
