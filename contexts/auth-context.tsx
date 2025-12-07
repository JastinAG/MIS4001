'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  userRole: 'student' | 'admin' | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string, role?: 'student' | 'admin') => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserRole = useCallback(async (userId: string, setLoadingState: boolean = true) => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from('users').select('role').eq('id', userId).single()

      if (error) {
        // PGRST116 means no rows returned (user not in users table yet)
        // This is normal for newly created users - default to student
        if (error.code === 'PGRST116') {
          setUserRole('student')
          if (setLoadingState) setLoading(false)
          return 'student'
        }
        // Log other errors but don't show empty error objects
        if (error.message) {
          console.error('Error fetching user role:', error.message)
        }
        setUserRole('student')
        if (setLoadingState) setLoading(false)
        return 'student'
      } else if (data) {
        const role = data.role as 'student' | 'admin'
        setUserRole(role)
        if (setLoadingState) setLoading(false)
        return role
      } else {
        // No data returned, default to student
        setUserRole('student')
        if (setLoadingState) setLoading(false)
        return 'student'
      }
    } catch (error: any) {
      // Handle unexpected errors gracefully
      if (error?.message) {
        console.error('Error fetching user role:', error.message)
      }
      setUserRole('student')
      if (setLoadingState) setLoading(false)
      return 'student'
    }
  }, [])

  useEffect(() => {
    let mounted = true
    let subscription: { unsubscribe: () => void } | null = null

    const initializeAuth = async () => {
      try {
        const supabase = getSupabaseClient()

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Error getting session:', sessionError)
          if (mounted) setLoading(false)
          return
        }

        if (session?.user && mounted) {
          setUser(session.user)
          await fetchUserRole(session.user.id)
        } else if (mounted) {
          setLoading(false)
        }

        const {
          data: { subscription: authSubscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return

          if (session?.user) {
            setUser(session.user)
            // Don't block on role fetch - do it in background
            // This allows immediate navigation while role loads
            fetchUserRole(session.user.id, false).catch(() => {
              // Silently fail
            })
            // Always set loading to false immediately to allow navigation
            setLoading(false)
          } else {
            setUser(null)
            setUserRole(null)
            setLoading(false)
          }
        })

        subscription = authSubscription
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()
    
    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [fetchUserRole])

  const signUp = async (email: string, password: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign up.')
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }
  }

  const signIn = async (
    email: string,
    password: string,
    role: 'student' | 'admin' = 'student',
  ) => {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    // Set user immediately and stop loading for instant navigation
    if (data.user) {
      setUser(data.user)
      setLoading(false) // Stop loading immediately to allow navigation
      
      // Fetch role asynchronously without blocking navigation
      // Validate role in background - if mismatch, sign out after navigation
      fetchUserRole(data.user.id, false).then((resolvedRole) => {
        if (resolvedRole && resolvedRole !== role) {
          // Role mismatch - sign out
          supabase.auth.signOut()
          setUser(null)
          setUserRole(null)
          setLoading(true)
          // Redirect to login with error message
          window.location.href = '/login?error=role_mismatch'
        }
      }).catch(() => {
        // Silently fail - role will be checked by auth state handler
      })
    }
  }

  const signOut = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    setUser(null)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, userRole, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}


