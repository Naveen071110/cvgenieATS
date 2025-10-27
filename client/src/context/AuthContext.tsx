import { createContext, useContext } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'

interface AuthContextValue {
  user: {
    id: string
    email: string | undefined
    user_metadata: {
      full_name?: string
      avatar_url?: string
      name?: string
    }
  } | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerk()

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

  const value: AuthContextValue = {
    user: authUser,
    isLoading: !isLoaded,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
