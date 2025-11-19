'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

interface PreferenceData {
  id: string
  preference_order: number
  course_name: string
  university_name: string
  min_cluster_score: number
}

export default function StudentPreferencesCard({ userId }: { userId: string }) {
  const supabase = getSupabaseClient()
  const [preferences, setPreferences] = useState<PreferenceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('student_preferences')
          .select(`
            id,
            preference_order,
            courses(name, min_cluster_score, universities(name))
          `)
          .eq('student_id', userId)
          .order('preference_order')

        if (error) throw error

        const formattedData = (data || []).map((item: any) => ({
          id: item.id,
          preference_order: item.preference_order,
          course_name: item.courses?.name || 'N/A',
          university_name: item.courses?.universities?.name || 'N/A',
          min_cluster_score: item.courses?.min_cluster_score || 0,
        }))

        setPreferences(formattedData)
      } catch (error) {
        console.error('Error fetching preferences:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchPreferences()
    }
  }, [userId, supabase])

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">Loading preferences...</p>
      </div>
    )
  }

  if (preferences.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">No course preferences set</p>
        <p className="text-sm text-gray-500 mt-2">
          Contact support to add your course preferences.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Course Preferences</h2>
        <p className="text-gray-600 text-sm mt-1">Your preferred courses in order</p>
      </div>

      <div className="divide-y divide-gray-200">
        {preferences.map((pref) => (
          <div key={pref.id} className="p-6 hover:bg-gray-50 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full">
                    {pref.preference_order}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {pref.course_name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{pref.university_name}</p>
                <p className="text-sm text-gray-600">
                  Minimum Cluster Score: <span className="font-semibold">{pref.min_cluster_score}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Total preferences: <span className="font-semibold text-gray-900">{preferences.length}</span>
        </p>
      </div>
    </div>
  )
}
