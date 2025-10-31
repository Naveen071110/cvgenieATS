// Compatibility layer for Clerk authentication
// This provides a useAuth hook that wraps Clerk functionality
import { useUser, useClerk } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { clearSubscriptionCache } from '@/lib/subscriptionUtils'

export function useAuth() {
  const { user, isLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerk()

  // Clear subscription cache when user changes
  useEffect(() => {
    if (isLoaded) {
      clearSubscriptionCache()
    }
  }, [user?.id, isLoaded])

  const authUser = user ? {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    user_metadata: {
      full_name: user.fullName || undefined,
      avatar_url: user.imageUrl || undefined,
      name: user.firstName || undefined,
    }
  } : null

  const signOut = async () => {
    await clerkSignOut()
  }

  return {
    user: authUser,
    isLoading: !isLoaded,
    signOut
  }
}
