'use client'

import { useAuth } from '@/contexts/auth-context'
import { useStudent } from '@/contexts/student-context'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GradesInput from '@/components/dashboard/grades-input'
import CourseSelection from '@/components/dashboard/course-selection'
import AdmissionLetterView from '@/components/dashboard/admission-letter-view'
import { Button } from '@/components/ui/button'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function DashboardContent() {
  const { user } = useAuth()
  const { grades, clusterPoints, selectedCourse, updateGrades, selectCourse } = useStudent()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const activeTab = searchParams.get('view') || 'overview'
  
  // Mock data for the chart
  const performanceData = grades.length > 0 
    ? grades.map(g => ({ subject: g.subject.substring(0, 4), score: getPoints(g.score) * 8.33 })) 
    : []

  function getPoints(grade: string) {
    const points: Record<string, number> = { 'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1 }
    return points[grade] || 0
  }

  const handleGradesComplete = (score: number, submittedGrades: Array<{ subject: string; score: string }>) => {
    updateGrades(score, submittedGrades)
    router.push('/dashboard?view=courses')
  }

  const handleCourseSelected = (course: any) => {
    selectCourse(course)
    router.push('/dashboard?view=admission')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'grades':
        return <GradesInput onComplete={handleGradesComplete} />
      
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
            studentName={user?.email?.split('@')[0] || 'Wanjiku Kamau'} 
            course={selectedCourse.course}
            university={selectedCourse.university}
            date={new Date().toLocaleDateString()}
            kcseIndex="12345678001" // Mock index
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Please select a course first to generate your admission letter.</p>
          </div>
        )

      case 'overview':
      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="glass-panel p-6 rounded-xl">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-500">Placement Status</span>
                  <span className={`text-2xl font-bold ${selectedCourse ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedCourse ? 'Placed' : (clusterPoints ? 'In Progress' : 'Pending Grades')}
                  </span>
                </div>
                <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${selectedCourse ? 'bg-green-500 w-full' : (clusterPoints ? 'bg-yellow-500 w-[60%]' : 'bg-slate-300 w-[10%]')} rounded-full`} />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-xl">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-500">Cluster Points</span>
                  <span className="text-2xl font-bold text-slate-900">{clusterPoints ? clusterPoints.toFixed(1) : '-'}</span>
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  {clusterPoints ? 'Calculated from your subjects' : 'Input grades to calculate'}
                </p>
              </div>

              <div className="glass-panel p-6 rounded-xl">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-500">Next Step</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {selectedCourse ? 'Download Letter' : (clusterPoints ? 'Select Courses' : 'Enter Grades')}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            {grades.length > 0 && (
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-6 text-slate-900">Academic Performance</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="subject" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                        itemStyle={{ color: '#0f172a' }}
                        cursor={{ fill: '#f1f5f9' }}
                      />
                      <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Student Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-500">
          Manage your placement journey, view grades, and select courses.
        </p>
      </div>

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
