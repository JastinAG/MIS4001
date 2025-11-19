'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

interface ClusterData {
  subject: string
  score: number
}

export default function StudentGradesCard({ userId }: { userId: string }) {
  const supabase = getSupabaseClient()
  const [clusters, setClusters] = useState<ClusterData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const { data, error } = await supabase
          .from('student_clusters')
          .select('subject, score')
          .eq('student_id', userId)
          .order('subject')

        if (error) throw error
        setClusters(data || [])
      } catch (error) {
        console.error('Error fetching cluster data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchClusters()
    }
  }, [userId, supabase])

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">Loading grades...</p>
      </div>
    )
  }

  if (clusters.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">No grade information available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">KCSE Subject Grades</h2>
        <p className="text-gray-600 text-sm mt-1">Your cluster subjects and scores</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusters.map((cluster, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
            >
              <p className="text-sm text-gray-600 mb-1">Subject</p>
              <p className="text-lg font-semibold text-gray-900 mb-3">{cluster.subject}</p>
              <p className="text-sm text-gray-600 mb-1">Score</p>
              <p className="text-3xl font-bold text-blue-600">{cluster.score}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Total subjects: <span className="font-semibold text-gray-900">{clusters.length}</span>
        </p>
      </div>
    </div>
  )
}
