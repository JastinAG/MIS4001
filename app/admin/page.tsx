'use client'

import { useEffect, useState } from 'react'
import AdminAnalyticsCard from '@/components/admin/admin-analytics-card'
import AdminQuickStats from '@/components/admin/admin-quick-stats'
import { getSupabaseClient } from '@/lib/supabase/client'

interface UniversityStats {
  university: string
  placed: number
  total: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    placed: 0,
    universities: 0,
    courses: 0,
  })
  const [universityStats, setUniversityStats] = useState<UniversityStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const supabase = getSupabaseClient()

      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('placement_status')

      if (studentsError) throw studentsError

      const totalStudents = students?.length || 0
      const placed = students?.filter((s) => s.placement_status === 'placed').length || 0

      const { count: universityCount, error: univError } = await supabase
        .from('universities')
        .select('id', { count: 'exact', head: true })

      if (univError) throw univError

      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('id', { count: 'exact', head: true })

      if (coursesError) throw coursesError

      const { data: placements, error: placementsError } = await supabase
        .from('placements')
        .select(
          `
          status,
          universities (
            name
          )
        `,
        )

      if (placementsError) throw placementsError

      const univStatsMap = new Map<string, { placed: number; total: number }>()

      placements?.forEach((placement: any) => {
        const universityName = placement.universities?.name || 'Unknown'
        if (!univStatsMap.has(universityName)) {
          univStatsMap.set(universityName, { placed: 0, total: 0 })
        }
        const stats = univStatsMap.get(universityName)!
        stats.total += 1
        if (placement.status === 'accepted' || placement.status === 'placed') {
          stats.placed += 1
        }
      })

      const formattedStats: UniversityStats[] = Array.from(univStatsMap.entries()).map(
        ([university, values]) => ({
          university,
          placed: values.placed,
          total: values.total,
        }),
      )

      setStats({
        totalStudents,
        placed,
        universities: universityCount || 0,
        courses: coursesCount || 0,
      })
      setUniversityStats(formattedStats)
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

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
