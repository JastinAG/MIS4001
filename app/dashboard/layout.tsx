'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { StudentProvider } from '@/contexts/student-context'

function DashboardNav() {
  const searchParams = useSearchParams()
  const currentView = searchParams.get('view') || 'overview'

  const isActive = (view: string) => currentView === view ? 'text-foreground font-semibold' : 'hover:text-foreground transition-colors'

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
      <Link href="/dashboard?view=overview" className={isActive('overview')}>
        Overview
      </Link>
      <Link href="/dashboard?view=grades" className={isActive('grades')}>
        Grades
      </Link>
      <Link href="/dashboard?view=courses" className={isActive('courses')}>
        Course Selection
      </Link>
      <Link href="/dashboard?view=admission" className={isActive('admission')}>
        Admission Letter
      </Link>
    </nav>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <StudentProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="font-semibold text-lg tracking-tight">
                Placement<span className="text-muted-foreground">System</span>
              </Link>
              <Suspense fallback={null}>
                <DashboardNav />
              </Suspense>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground hidden sm:block">
                {user.email}
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                {user.email?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </StudentProvider>
  )
}
