import { calculateClusterScore } from './grade-calculator'

interface Course {
  id: string
  university: string
  course: string
  min_points: number
  capacity: number
  location: string
}

interface StudentGrade {
  subject: string
  score: string
}

/**
 * Recommends courses based on cluster points
 * Sorts by best match (highest cluster points above minimum requirement)
 */
export function recommendCourses(
  clusterPoints: number,
  availableCourses: Course[]
): Course[] {
  // Filter eligible courses
  const eligibleCourses = availableCourses.filter(
    (course) => clusterPoints >= course.min_points
  )

  // Sort by:
  // 1. Best match (smallest gap between cluster points and min_points)
  // 2. Higher capacity (more available slots)
  // 3. Alphabetical by university
  return eligibleCourses.sort((a, b) => {
    const gapA = clusterPoints - a.min_points
    const gapB = clusterPoints - b.min_points

    // Prefer courses where student's points are closer to minimum (better match)
    if (Math.abs(gapA - gapB) > 2) {
      return gapA - gapB
    }

    // If gaps are similar, prefer higher capacity
    if (b.capacity !== a.capacity) {
      return b.capacity - a.capacity
    }

    // Finally, sort alphabetically
    return a.university.localeCompare(b.university)
  })
}

/**
 * Gets top N recommended courses
 */
export function getTopRecommendations(
  clusterPoints: number,
  availableCourses: Course[],
  topN: number = 5
): Course[] {
  const recommended = recommendCourses(clusterPoints, availableCourses)
  return recommended.slice(0, topN)
}



