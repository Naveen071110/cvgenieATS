import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService, type AuthUser } from '@/lib/supabase'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial user with error handling
    authService.getCurrentUser().then((user) => {
      setUser(user as AuthUser | null)
      setIsLoading(false)
    }).catch((error) => {
      console.warn('Auth service not configured:', error.message)
      setUser(null)
      setIsLoading(false)
    })

    // Listen for auth changes with error handling
    try {
      const { data: { subscription } } = authService.onAuthStateChange((user) => {
        setUser(user)
        setIsLoading(false)
      })
      return () => subscription.unsubscribe()
    } catch (error) {
      console.warn('Auth service not configured:', error)
      setUser(null)
      setIsLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await authService.signInWithEmail(email, password)
      setIsLoading(false)
      return { error }
    } catch (err) {
      setIsLoading(false)
      return { error: new Error('Authentication service not configured. Please contact support.') }
    }
  }

  const signUp = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await authService.signUpWithEmail(email, password)
      setIsLoading(false)
      return { error }
    } catch (err) {
      setIsLoading(false)
      return { error: new Error('Authentication service not configured. Please contact support.') }
    }
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    try {
      const { error } = await authService.signInWithGoogle()
      setIsLoading(false)
      return { error }
    } catch (err) {
      setIsLoading(false)
      return { error: new Error('Authentication service not configured. Please contact support.') }
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await authService.signOut()
      setUser(null)
      setIsLoading(false)
    } catch (err) {
      console.warn('Sign out error:', err)
      setUser(null)
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut
    }}>
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