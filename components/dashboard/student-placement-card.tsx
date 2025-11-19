'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

interface PlacementResult {
  id: string
  university_name: string
  course_name: string
  status: string
  placement_date: string
}

export default function StudentPlacementCard({ userId, expanded = false }: { userId: string; expanded?: boolean }) {
  const supabase = getSupabaseClient()
  const [placements, setPlacements] = useState<PlacementResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const { data, error } = await supabase
          .from('placements')
          .select(`
            id,
            status,
            placement_date,
            universities(name),
            courses(name)
          `)
          .eq('student_id', userId)
          .order('placement_date', { ascending: false })

        if (error) throw error

        const formattedData = (data || []).map((item: any) => ({
          id: item.id,
          university_name: item.universities?.name || 'N/A',
          course_name: item.courses?.name || 'N/A',
          status: item.status,
          placement_date: item.placement_date,
        }))

        setPlacements(formattedData)
      } catch (error) {
        console.error('Error fetching placements:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchPlacements()
    }
  }, [userId, supabase])

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">Loading placement results...</p>
      </div>
    )
  }

  if (placements.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No placement results yet</p>
          <p className="text-sm text-gray-500">
            Placement results will appear here once the admin triggers a placement round.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          {expanded ? 'Placement Results' : 'Latest Placement'}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {expanded
            ? 'All your placement results'
            : 'Your most recent placement result'}
        </p>
      </div>

      <div className={expanded ? 'space-y-4 p-6' : ''}>
        {(expanded ? placements : placements.slice(0, 1)).map((placement) => (
          <div
            key={placement.id}
            className={`p-6 border rounded-lg ${
              placement.status === 'accepted'
                ? 'border-green-200 bg-green-50'
                : placement.status === 'rejected'
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">University</p>
                <p className="text-lg font-semibold text-gray-900">
                  {placement.university_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Course</p>
                <p className="text-lg font-semibold text-gray-900">
                  {placement.course_name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    placement.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : placement.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {placement.status.charAt(0).toUpperCase() + placement.status.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Placement Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(placement.placement_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
