'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

interface University {
  id: string
  name: string
  code: string
}

interface Course {
  id: string
  university_id: string
  name: string
  min_cluster_score: number
  intake_capacity: number
}

export default function AdminUniversitiesPage() {
  const supabase = getSupabaseClient()
  const [universities, setUniversities] = useState<University[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showUnivForm, setShowUnivForm] = useState(false)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [selectedUni, setSelectedUni] = useState<string>('')

  const [univForm, setUnivForm] = useState({ name: '', code: '' })
  const [courseForm, setCourseForm] = useState({
    name: '',
    min_cluster_score: '',
    intake_capacity: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: unis }, { data: coursesList }] = await Promise.all([
          supabase.from('universities').select('*'),
          supabase.from('courses').select('*'),
        ])

        setUniversities(unis || [])
        setCourses(coursesList || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('universities')
        .insert([{ name: univForm.name, code: univForm.code }])
        .select()

      if (error) throw error

      setUniversities([...universities, data[0]])
      setUnivForm({ name: '', code: '' })
      setShowUnivForm(false)
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          {
            university_id: selectedUni,
            name: courseForm.name,
            min_cluster_score: parseFloat(courseForm.min_cluster_score),
            intake_capacity: parseInt(courseForm.intake_capacity),
          },
        ])
        .select()

      if (error) throw error

      setCourses([...courses, data[0]])
      setCourseForm({ name: '', min_cluster_score: '', intake_capacity: '' })
      setShowCourseForm(false)
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading universities...</div>
  }

  const uniCourses = selectedUni ? courses.filter((c) => c.university_id === selectedUni) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Universities & Courses</h1>
        <p className="text-gray-600">Manage institutions and their course offerings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Universities Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Universities</h2>
            <button
              onClick={() => setShowUnivForm(!showUnivForm)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          {showUnivForm && (
            <form onSubmit={handleAddUniversity} className="mb-4 p-4 bg-gray-50 rounded">
              <input
                type="text"
                placeholder="University Name"
                value={univForm.name}
                onChange={(e) => setUnivForm({ ...univForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                required
              />
              <input
                type="text"
                placeholder="Code"
                value={univForm.code}
                onChange={(e) => setUnivForm({ ...univForm, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                required
              />
              <button
                type="submit"
                className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          )}

          <div className="space-y-2">
            {universities.map((uni) => (
              <button
                key={uni.id}
                onClick={() => setSelectedUni(uni.id)}
                className={`w-full text-left p-3 rounded transition ${
                  selectedUni === uni.id
                    ? 'bg-blue-100 border border-blue-300'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold text-gray-900">{uni.name}</p>
                <p className="text-sm text-gray-600">{uni.code}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Courses Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedUni ? 'Courses' : 'Select a University'}
            </h2>
            {selectedUni && (
              <button
                onClick={() => setShowCourseForm(!showCourseForm)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Add Course
              </button>
            )}
          </div>

          {selectedUni && showCourseForm && (
            <form onSubmit={handleAddCourse} className="mb-4 p-4 bg-gray-50 rounded">
              <input
                type="text"
                placeholder="Course Name"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                required
              />
              <input
                type="number"
                placeholder="Min Cluster Score"
                value={courseForm.min_cluster_score}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, min_cluster_score: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                step="0.1"
                required
              />
              <input
                type="number"
                placeholder="Intake Capacity"
                value={courseForm.intake_capacity}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, intake_capacity: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                required
              />
              <button
                type="submit"
                className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Add Course
              </button>
            </form>
          )}

          {selectedUni && uniCourses.length > 0 ? (
            <div className="space-y-2">
              {uniCourses.map((course) => (
                <div key={course.id} className="p-3 border border-gray-200 rounded">
                  <p className="font-semibold text-gray-900">{course.name}</p>
                  <p className="text-sm text-gray-600">
                    Min Score: {course.min_cluster_score} | Capacity: {course.intake_capacity}
                  </p>
                </div>
              ))}
            </div>
          ) : selectedUni ? (
            <p className="text-gray-500">No courses added for this university</p>
          ) : (
            <p className="text-gray-500">Select a university to view its courses</p>
          )}
        </div>
      </div>
    </div>
  )
}
