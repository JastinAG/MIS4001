'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Grade {
  subject: string
  score: string
}

interface Course {
  id: string
  code: string
  name: string
  university: string
  cluster_points: number
}

interface StudentContextType {
  grades: Grade[]
  clusterPoints: number | null
  selectedCourse: { course: string; university: string } | null
  updateGrades: (score: number, grades: Grade[]) => void
  selectCourse: (course: { course: string; university: string }) => void
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

export function StudentProvider({ children }: { children: ReactNode }) {
  const [grades, setGrades] = useState<Grade[]>([])
  const [clusterPoints, setClusterPoints] = useState<number | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<{ course: string; university: string } | null>(null)

  const updateGrades = (score: number, newGrades: Grade[]) => {
    setClusterPoints(score)
    setGrades(newGrades)
  }

  const selectCourse = (course: { course: string; university: string }) => {
    setSelectedCourse(course)
  }

  return (
    <StudentContext.Provider value={{ grades, clusterPoints, selectedCourse, updateGrades, selectCourse }}>
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const context = useContext(StudentContext)
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider')
  }
  return context
}
