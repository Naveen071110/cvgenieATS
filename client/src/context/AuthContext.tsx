// Compatibility layer for Clerk authentication
// This provides a useAuth hook that wraps Clerk functionality
import { useUser, useClerk, useAuth as useClerkAuthHook } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { clearSubscriptionCache } from '@/lib/subscriptionUtils'

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
  };
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isSignedIn: boolean;
  getToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

function useActiveClerkAuth(): AuthContextType {
  const { user, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const { getToken, isSignedIn } = useClerkAuthHook();

  // Clear subscription cache when user changes
  useEffect(() => {
    if (isLoaded) {
      clearSubscriptionCache();
    }
  }, [user?.id, isLoaded]);

  const authUser: AuthUser | null = user ? {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    user_metadata: {
      full_name: user.fullName || undefined,
      avatar_url: user.imageUrl || undefined,
      name: user.firstName || undefined,
    }
  } : null;

  const signOut = async () => {
    await clerkSignOut();
  };

  return {
    user: authUser,
    isLoading: !isLoaded,
    isSignedIn: Boolean(isSignedIn),
    getToken: async () => (getToken ? await getToken() : null),
    signOut
  };
}

function useFallbackAuth(): AuthContextType {
  return {
    user: null,
    isLoading: false,
    isSignedIn: false,
    getToken: async () => null,
    signOut: async () => {},
  };
}

export function useAuth(): AuthContextType {
  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    return useFallbackAuth();
  }
  return useActiveClerkAuth();
}
