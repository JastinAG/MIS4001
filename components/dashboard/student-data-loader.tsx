'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useStudent } from '@/contexts/student-context'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle } from 'lucide-react'

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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      loadStudentData()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadStudentData = async () => {
    try {
      setLoading(true)
      setError(null)
      const supabase = getSupabaseClient()

      // Fetch student data and grades in parallel for faster loading
      const [studentResult, gradesResult] = await Promise.all([
        supabase
          .from('students')
          .select('full_name, kcse_index_number, cluster_score')
          .eq('id', user!.id)
          .single(),
        supabase
          .from('student_clusters')
          .select('subject, grade')
          .eq('student_id', user!.id)
          .order('subject', { ascending: true }),
      ])

      const { data: student, error: studentError } = studentResult
      const { data: grades, error: gradesError } = gradesResult

      if (studentError || !student) {
        throw new Error(
          'We could not find your academic record. Please contact support or try again later.',
        )
      }

      if (gradesError || !grades || grades.length === 0) {
        throw new Error('No subject grades found for this account.')
      }

      const formattedGrades = grades.map((g) => ({
        subject: g.subject,
        score: g.grade,
      }))

      setStudentData({
        full_name: student.full_name,
        kcse_index_number: student.kcse_index_number,
        cluster_score: student.cluster_score,
        grades: formattedGrades,
      })

      if (student.cluster_score) {
        updateGrades(student.cluster_score, formattedGrades)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load student data. Please try again.')
      setStudentData(null)
    } finally {
      setLoading(false)
    }
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

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Student data unavailable</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <Button variant="outline" onClick={loadStudentData}>
            Retry
          </Button>
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
            <p className="text-base font-semibold text-slate-900">
              {studentData.full_name || user?.email?.split('@')[0] || 'Student'}
            </p>
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

