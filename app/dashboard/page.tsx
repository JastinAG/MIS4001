'use client'

import { useAuth } from '@/contexts/auth-context'
import { useStudent } from '@/contexts/student-context'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StudentDataLoader from '@/components/dashboard/student-data-loader'
import CourseSelection from '@/components/dashboard/course-selection'
import AdmissionLetterView from '@/components/dashboard/admission-letter-view'
import { Button } from '@/components/ui/button'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

function DashboardContent() {
  const { user } = useAuth()
  const { grades, clusterPoints, selectedCourse, updateGrades, selectCourse } = useStudent()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [studentName, setStudentName] = useState<string>('')
  const [kcseIndex, setKcseIndex] = useState<string>('')
  
  const activeTab = searchParams.get('view') || 'overview'

  useEffect(() => {
    if (user?.id) {
      loadStudentInfo()
    }
  }, [user])

  const loadStudentInfo = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase
        .from('students')
        .select('full_name, kcse_index_number')
        .eq('id', user!.id)
        .single()

      if (data) {
        setStudentName(data.full_name)
        setKcseIndex(data.kcse_index_number)
      }
    } catch (error) {
      console.error('Error loading student info:', error)
    }
  }
  
  // Mock data for the chart
  const performanceData = grades.length > 0 
    ? grades.map(g => ({ subject: g.subject.substring(0, 4), score: getPoints(g.score) * 8.33 })) 
    : []

  function getPoints(grade: string) {
    const points: Record<string, number> = { 'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1 }
    return points[grade] || 0
  }

  const handleCourseSelected = (course: any) => {
    selectCourse(course)
    router.push('/dashboard?view=admission')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return clusterPoints ? (
          <CourseSelection 
            clusterPoints={clusterPoints} 
            onSelectCourse={handleCourseSelected} 
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Please enter your grades first to view eligible courses.</p>
            <Button variant="link" onClick={() => router.push('/dashboard?view=grades')}>Go to Grades</Button>
          </div>
        )

      case 'admission':
        return selectedCourse ? (
          <AdmissionLetterView 
            studentName={studentName || user?.email?.split('@')[0] || 'Student'} 
            course={selectedCourse.course}
            university={selectedCourse.university}
            date={new Date().toLocaleDateString()}
            kcseIndex={kcseIndex || 'N/A'}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Please select a course first to generate your admission letter.</p>
            <Button variant="link" onClick={() => router.push('/dashboard?view=courses')}>View Courses</Button>
          </div>
        )

      case 'grades':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Grades</h2>
              <p className="text-slate-600">View your KCSE subject grades and cluster points</p>
            </div>
            <StudentDataLoader />
            {grades.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Subject Grades</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                  {grades.map((grade, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-slate-50 p-4 rounded-lg text-center border border-slate-200 hover:shadow-md transition-shadow">
                      <p className="text-sm font-medium text-slate-600 mb-2">{grade.subject}</p>
                      <p className="text-2xl font-bold text-blue-600">{grade.score}</p>
                    </div>
                  ))}
                </div>
                {clusterPoints && (
                  <div className="mt-6 pt-6 border-t border-slate-200 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-slate-700">Total Cluster Points:</span>
                      <span className="text-3xl font-bold text-blue-600">{clusterPoints.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">Based on your top 8 subjects</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                <p className="text-slate-500 mb-4">No grades available yet.</p>
                <p className="text-sm text-slate-400">Your grades will appear here once they are loaded from your student record.</p>
              </div>
            )}
          </div>
        )

      case 'overview':
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Overview</h2>
              <p className="text-slate-600">Track your placement journey progress</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-500">Placement Status</span>
                  <span className={`text-2xl font-bold ${selectedCourse ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedCourse ? 'Placed' : (clusterPoints ? 'In Progress' : 'Pending Grades')}
                  </span>
                </div>
                <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${selectedCourse ? 'bg-green-500 w-full' : (clusterPoints ? 'bg-yellow-500 w-[60%]' : 'bg-slate-300 w-[10%]')} rounded-full transition-all`} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-500">Cluster Points</span>
                  <span className="text-2xl font-bold text-slate-900">{clusterPoints ? clusterPoints.toFixed(1) : '-'}</span>
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  {clusterPoints ? 'Calculated from your subjects' : 'View grades to calculate'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-500">Next Step</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {selectedCourse ? 'Download Letter' : (clusterPoints ? 'Select Courses' : 'View Grades')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Only show StudentDataLoader on overview */}
      {activeTab === 'overview' && <StudentDataLoader />}

      {renderContent()}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
