'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

interface StudentRecord {
  id: string
  full_name: string
  kcse_index_number: string
  kcse_mean_grade: number
  cluster_score: number
  placement_status: string
  county: string
}

export default function AdminStudentsPage() {
  const supabase = getSupabaseClient()
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .order('full_name')

        if (error) throw error
        setStudents(data || [])
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [supabase])

  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.kcse_index_number.includes(searchTerm) ||
      student.county.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="text-center py-8">Loading students...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Students</h1>
        <p className="text-gray-600">View and manage all registered students</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search by name, KCSE index, or county..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">KCSE Index</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mean Grade</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cluster Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">County</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {student.full_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.kcse_index_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {student.kcse_mean_grade.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {student.cluster_score?.toFixed(0) || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.county}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        student.placement_status === 'placed'
                          ? 'bg-green-100 text-green-800'
                          : student.placement_status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {student.placement_status.charAt(0).toUpperCase() +
                        student.placement_status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-blue-900">
          Total Students: <span className="font-bold">{students.length}</span>
        </p>
      </div>
    </div>
  )
}
