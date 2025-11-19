'use client'

import { useEffect, useState } from 'react'
import AdminAnalyticsCard from '@/components/admin/admin-analytics-card'
import AdminQuickStats from '@/components/admin/admin-quick-stats'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    placed: 0,
    rejected: 0,
    pending: 0,
    universities: 0,
    courses: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        setStats({
          totalStudents: 1250,
          placed: 850,
          rejected: 150,
          pending: 250,
          universities: 45,
          courses: 320,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage students, universities, and placement rounds</p>
      </div>

      <AdminQuickStats stats={stats} />
      <AdminAnalyticsCard stats={stats} />
    </div>
  )
}
