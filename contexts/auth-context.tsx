'use client'

import React, { createContext, useContext, useState } from 'react'
import type { User } from '@supabase/supabase-js'

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
  const [loading] = useState(false)

  const createMockUser = (email: string): User => ({
    id: `mock-${Date.now()}`,
    aud: 'authenticated',
    role: 'authenticated',
    email,
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

  const signUp = async (email: string, _password: string) => {
    // Allow instant signup with any credentials (mock mode)
    const mockUser = createMockUser(email)
    setUser(mockUser)
    setUserRole('student')
  }

  const signIn = async (
    email: string,
    _password: string,
    role: 'student' | 'admin' = 'student',
  ) => {
    // Allow instant login with any credentials and chosen role
    const mockUser = createMockUser(email)
    setUser(mockUser)
    setUserRole(role)
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

