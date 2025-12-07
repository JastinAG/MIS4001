 'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, School, BookOpen, ArrowRight, Sparkles } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getTopRecommendations } from '@/utils/course-recommendations'

interface Course {
  id: string
  university: string
  course: string
  min_points: number
  capacity: number
  location: string
}

interface CourseSelectionProps {
  clusterPoints: number
  onSelectCourse: (course: any) => void
}

export default function CourseSelection({ clusterPoints, onSelectCourse }: CourseSelectionProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [isShortlisting, setIsShortlisting] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    if (courses.length > 0 && clusterPoints) {
      const recommended = getTopRecommendations(clusterPoints, courses, 10)
      setRecommendedCourses(recommended)
    }
  }, [courses, clusterPoints])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const supabase = getSupabaseClient()

      const { data, error } = await supabase
        .from('courses')
        .select(
          `
          id,
          name,
          min_cluster_score,
          intake_capacity,
          universities (
            name,
            code
          )
        `,
        )
        .order('name')

      if (error) throw error

      const formattedCourses: Course[] = (data || []).map((course) => ({
        id: course.id,
        university: course.universities?.name || 'Unknown University',
        course: course.name,
        min_points: Number(course.min_cluster_score),
        capacity: course.intake_capacity,
        location: 'Nairobi',
      }))

      setCourses(formattedCourses)
    } catch (error) {
      console.error('Error loading courses:', error)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  // Filter courses based on cluster points
  const eligibleCourses = recommendedCourses.length > 0 
    ? recommendedCourses 
    : courses.filter(c => clusterPoints >= c.min_points)

  const handleApply = (course: any) => {
    setSelectedCourseId(course.id)
    setIsShortlisting(true)

    setTimeout(() => {
      setIsShortlisting(false)
      onSelectCourse(course)
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <h3 className="text-xl font-semibold text-slate-900">Loading Courses...</h3>
      </div>
    )
  }

  if (isShortlisting) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <h3 className="text-xl font-semibold text-slate-900">Processing Application...</h3>
        <p className="text-slate-500">Checking eligibility and available capacity.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="bg-blue-50 border border-blue-100 p-3 sm:p-4 rounded-lg flex items-start gap-2 sm:gap-3">
        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <h4 className="font-semibold text-sm sm:text-base text-blue-900">You have {clusterPoints.toFixed(1)} Cluster Points</h4>
          <p className="text-xs sm:text-sm text-blue-700 mt-1">
            Based on your performance, we've found {eligibleCourses.length} recommended courses.
            {recommendedCourses.length > 0 && (
              <span className="block mt-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Top recommendations are shown first.
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {eligibleCourses.map((course, index) => (
          <Card key={course.id} className={`transition-all hover:shadow-md ${selectedCourseId === course.id ? 'ring-2 ring-blue-500' : ''} ${index < 3 ? 'border-2 border-blue-200' : ''}`}>
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <Badge variant="outline" className="bg-slate-50 text-slate-600 text-xs">
                  {course.location}
                </Badge>
                <div className="flex gap-1">
                  {index < 3 && (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" /> Recommended
                    </Badge>
                  )}
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-xs">
                    Eligible
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 break-words">
                {course.course}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1 text-xs sm:text-sm">
                <School className="h-3 w-3 flex-shrink-0" /> <span className="break-words">{course.university}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 sm:pb-3">
              <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs sm:text-sm text-slate-500">
                <span>Min Points: <span className="font-medium text-slate-900">{course.min_points}</span></span>
                <span>Capacity: <span className="font-medium text-slate-900">{course.capacity}</span></span>
              </div>
            </CardContent>
            <CardFooter className="pt-2 sm:pt-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base" 
                onClick={() => handleApply(course)}
                disabled={selectedCourseId !== null}
              >
                {selectedCourseId === course.id ? 'Applied' : 'Apply Now'} <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {eligibleCourses.length === 0 && (
          <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-dashed">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No Eligible Courses Found</h3>
            <p className="text-slate-500 max-w-md mx-auto mt-1">
              Unfortunately, your cluster points do not meet the minimum requirements for the available courses in this intake.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
