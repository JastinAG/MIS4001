'use client'

import { useEffect, useState } from 'react'
import AdminAnalyticsCard from '@/components/admin/admin-analytics-card'
import AdminQuickStats from '@/components/admin/admin-quick-stats'

interface UniversityStats {
  university: string
  placed: number
  total: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 10,
    placed: 7,
    universities: 4,
    courses: 12,
  })
  const [universityStats, setUniversityStats] = useState<UniversityStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and then show mock data
    setTimeout(() => {
      setUniversityStats([
        { university: 'University of Nairobi', placed: 3, total: 4 },
        { university: 'Daystar University', placed: 2, total: 3 },
        { university: 'Kenyatta University', placed: 1, total: 2 },
        { university: 'Technical University of Kenya', placed: 1, total: 1 },
      ])
      setLoading(false)
    }, 500)
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
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of student placements and institutions</p>
      </div>

      <AdminQuickStats stats={stats} />
      <AdminAnalyticsCard stats={stats} />

      {/* University-wise Statistics */}
      {universityStats.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">University-wise Placements</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">University</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Placed</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Total Placements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {universityStats.map((univ, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{univ.university}</td>
                    <td className="px-4 py-3 text-sm text-green-600 font-semibold">{univ.placed}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{univ.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
