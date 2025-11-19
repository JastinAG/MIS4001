'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, School, BookOpen, ArrowRight } from 'lucide-react'

// Mock Data for Universities and Courses
const MOCK_COURSES = [
  {
    id: 1,
    university: 'University of Nairobi',
    course: 'Bachelor of Science in Computer Science',
    min_points: 42,
    capacity: 50,
    location: 'Nairobi'
  },
  {
    id: 2,
    university: 'Jomo Kenyatta University of Agriculture and Technology',
    course: 'Bachelor of Science in Information Technology',
    min_points: 38,
    capacity: 80,
    location: 'Juja'
  },
  {
    id: 3,
    university: 'Kenyatta University',
    course: 'Bachelor of Education (Science)',
    min_points: 35,
    capacity: 120,
    location: 'Nairobi'
  },
  {
    id: 4,
    university: 'Strathmore University',
    course: 'Bachelor of Business Information Technology',
    min_points: 40,
    capacity: 60,
    location: 'Nairobi'
  },
  {
    id: 5,
    university: 'Moi University',
    course: 'Bachelor of Medicine and Surgery',
    min_points: 44,
    capacity: 40,
    location: 'Eldoret'
  },
  {
    id: 6,
    university: 'Egerton University',
    course: 'Bachelor of Science in Agriculture',
    min_points: 30,
    capacity: 100,
    location: 'Njoro'
  },
  {
    id: 7,
    university: 'Technical University of Kenya',
    course: 'Bachelor of Engineering (Electrical)',
    min_points: 41,
    capacity: 45,
    location: 'Nairobi'
  },
  {
    id: 8,
    university: 'Daystar University',
    course: 'Bachelor of Arts in Communication',
    min_points: 36,
    capacity: 70,
    location: 'Nairobi'
  },
  {
    id: 9,
    university: 'Daystar University',
    course: 'Bachelor of Business Administration',
    min_points: 38,
    capacity: 85,
    location: 'Nairobi'
  },
  {
    id: 10,
    university: 'Daystar University',
    course: 'Bachelor of Science in Information Technology',
    min_points: 37,
    capacity: 60,
    location: 'Nairobi'
  }
]

interface CourseSelectionProps {
  clusterPoints: number
  onSelectCourse: (course: any) => void
}

export default function CourseSelection({ clusterPoints, onSelectCourse }: CourseSelectionProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [isShortlisting, setIsShortlisting] = useState(false)

  // Filter courses based on cluster points
  const eligibleCourses = MOCK_COURSES.filter(c => clusterPoints >= c.min_points)

  const handleApply = (course: any) => {
    setSelectedCourseId(course.id)
    setIsShortlisting(true)
    
    // Simulate shortlisting process
    setTimeout(() => {
      setIsShortlisting(false)
      onSelectCourse(course)
    }, 2000)
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
            Based on your performance, you are eligible for {eligibleCourses.length} courses.
            Select a course below to apply for placement.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {eligibleCourses.map((course) => (
          <Card key={course.id} className={`transition-all hover:shadow-md ${selectedCourseId === course.id ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <Badge variant="outline" className="bg-slate-50 text-slate-600 text-xs">
                  {course.location}
                </Badge>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-xs">
                  Eligible
                </Badge>
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
