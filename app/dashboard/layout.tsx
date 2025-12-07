'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { StudentProvider } from '@/contexts/student-context'

function DashboardNav() {
  const searchParams = useSearchParams()
  const currentView = searchParams.get('view') || 'overview'

  const navItems = [
    { view: 'overview', label: 'Overview' },
    { view: 'grades', label: 'Grades' },
    { view: 'courses', label: 'Course Selection' },
    { view: 'admission', label: 'Admission Letters' },
  ]

  return (
    <nav className="w-full flex justify-center items-center">
      <div className="flex items-center gap-1 sm:gap-2 bg-slate-100 p-1.5 rounded-lg w-full sm:w-auto overflow-x-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.view
          return (
            <Link
              key={item.view}
              href={`/dashboard?view=${item.view}`}
              className={`
                px-3 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }
              `}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
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
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
          <div className="container mx-auto px-4">
            {/* User info row */}
            <div className="h-14 flex items-center justify-end">
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-600 hidden sm:block">
                  {user.email}
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
            </div>
            {/* Navigation menu - centered */}
            <div className="pb-4">
              <Suspense fallback={null}>
                <DashboardNav />
              </Suspense>
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
