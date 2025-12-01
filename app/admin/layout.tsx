'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, userRole, loading } = useAuth()

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      router.push('/login')
    }
  }, [user, userRole, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user || userRole !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Student Placement System</p>
          </div>

          <nav className="mt-6 space-y-2 px-4">
            <Link
              href="/admin"
              className="block px-4 py-3 rounded hover:bg-gray-800 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/students"
              className="block px-4 py-3 rounded hover:bg-gray-800 transition"
            >
              Students
            </Link>
            <Link
              href="/admin/universities"
              className="block px-4 py-3 rounded hover:bg-gray-800 transition"
            >
              Universities & Courses
            </Link>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 w-64">
            <Link
              href="/"
              className="text-gray-400 hover:text-white text-sm transition"
            >
              Back to Home
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
