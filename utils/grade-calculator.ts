// KCSE Grade to Points Mapping (Kenya Education System)
const GRADE_POINTS: Record<string, number> = {
  'A': 12,
  'A-': 11,
  'B+': 10,
  'B': 9,
  'B-': 8,
  'C+': 7,
  'C': 6,
  'C-': 5,
  'D+': 4,
  'D': 3,
  'D-': 2,
  'E': 1,
}

export function calculateClusterScore(subjects: Array<{ subject: string; score: string }>): number {
  const validSubjects = subjects.slice(0, 8) // Only first 8 subjects count
  const totalPoints = validSubjects.reduce((sum, { score }) => {
    return sum + (GRADE_POINTS[score] || 0)
  }, 0)
  return totalPoints
}

export function getMeanGradePoints(meanGrade: number): number {
  // KCSE Mean Grade: 12 = A, 11 = A-, 10 = B+, etc.
  if (meanGrade >= 12) return 12
  if (meanGrade >= 11) return 11
  if (meanGrade >= 10) return 10
  if (meanGrade >= 9) return 9
  if (meanGrade >= 8) return 8
  if (meanGrade >= 7) return 7
  if (meanGrade >= 6) return 6
  if (meanGrade >= 5) return 5
  if (meanGrade >= 4) return 4
  if (meanGrade >= 3) return 3
  if (meanGrade >= 2) return 2
  return 1
}
