'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useStudent } from '@/contexts/student-context'
import { calculateClusterScore } from '@/utils/grade-calculator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

interface StudentData {
  full_name: string
  kcse_index_number: string
  cluster_score: number | null
  grades: Array<{ subject: string; score: string }>
}

export default function StudentDataLoader() {
  const { user } = useAuth()
  const { updateGrades } = useStudent()
  const [loading, setLoading] = useState(true)
  const [studentData, setStudentData] = useState<StudentData | null>(null)

  useEffect(() => {
    if (user) {
      loadStudentData()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadStudentData = () => {
    setLoading(true)

    const emailPrefix = user?.email?.split('@')[0] || 'student'

    // Derive a readable full name from the email prefix
    const derivedName = emailPrefix
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ')

    const fullName = derivedName || 'Student'

    const grades: Array<{ subject: string; score: string }> = [
      { subject: 'Mathematics', score: 'A' },
      { subject: 'English', score: 'B+' },
      { subject: 'Kiswahili', score: 'B' },
      { subject: 'Chemistry', score: 'A-' },
      { subject: 'Biology', score: 'B+' },
      { subject: 'Physics', score: 'B' },
      { subject: 'History', score: 'C+' },
    ]

    const clusterScore = calculateClusterScore(grades)

    const data: StudentData = {
      full_name: fullName,
      kcse_index_number: '12345678001',
      cluster_score: clusterScore,
      grades,
    }

    setStudentData(data)
    updateGrades(clusterScore, grades)
    setLoading(false)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-600">Loading your data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!studentData) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Student Information
        </CardTitle>
        <CardDescription>Your academic records and placement status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Full Name</p>
            <p className="text-base font-semibold text-slate-900">{studentData.full_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">KCSE Index Number</p>
            <p className="text-base font-semibold text-slate-900">{studentData.kcse_index_number}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Cluster Points</p>
            <p className="text-2xl font-bold text-blue-600">
              {studentData.cluster_score?.toFixed(1) || 'Calculating...'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Subjects Entered</p>
            <p className="text-base font-semibold text-slate-900">{studentData.grades.length} subjects</p>
          </div>
        </div>

        {studentData.grades.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-500 mb-3">Your Grades</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {studentData.grades.map((grade, index) => (
                <div key={index} className="bg-slate-50 p-2 rounded text-center">
                  <p className="text-xs text-slate-600 mb-1">{grade.subject}</p>
                  <p className="text-sm font-bold text-slate-900">{grade.score}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

