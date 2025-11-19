'use client'

import React, { createContext, useContext, useState } from 'react'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  userRole: 'student' | 'admin' | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null)
  const [loading, setLoading] = useState(false) // Set loading to false initially

  const createMockUser = (email: string): User => ({
    id: `user-${Date.now()}`,
    aud: 'authenticated',
    role: 'authenticated',
    email: email,
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmation_sent_at: null,
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: {
      provider: 'email',
      providers: ['email'],
    },
    user_metadata: {},
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_anonymous: false,
  })

  const signUp = async (email: string, password: string) => {
    const mockUser = createMockUser(email)
    setUser(mockUser)
    setUserRole('student')
  }

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const mockUser = createMockUser(email)
    setUser(mockUser)
    setUserRole('student')
  }

  const signOut = async () => {
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
