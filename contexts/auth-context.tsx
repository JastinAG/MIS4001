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

  const fetchUserRole = useCallback(async (userId: string) => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from('users').select('role').eq('id', userId).single()

      if (error) {
        console.error('Error fetching user role:', error)
        setUserRole('student')
        return 'student'
      } else if (data) {
        const role = data.role as 'student' | 'admin'
        setUserRole(role)
        return role
      } else {
        setUserRole('student')
        return 'student'
      }
    } catch (error) {
      console.error('Error fetching user role:', error)
      setUserRole('student')
      return 'student'
    } finally {
      setLoading(false)
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
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!mounted) return

          if (session?.user) {
            setUser(session.user)
            await fetchUserRole(session.user.id)
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

    if (data.user) {
      const resolvedRole = await fetchUserRole(data.user.id)
      if (resolvedRole && resolvedRole !== role) {
        await supabase.auth.signOut()
        setUser(null)
        setUserRole(null)
        throw new Error(
          `Access denied. This account is registered as ${resolvedRole}, not ${role}.`,
        )
      }
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


