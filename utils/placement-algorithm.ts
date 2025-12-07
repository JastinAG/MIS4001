// Placement matching algorithm
export async function runPlacementAlgorithm(
  supabase: any
): Promise<{ placedCount: number; rejectedCount: number }> {
  try {
    const [{ data: students }, { data: placements }, { data: preferences }] = await Promise.all([
      supabase.from('students').select('*').eq('placement_status', 'pending'),
      supabase.from('placements').select('*'),
      supabase
        .from('student_preferences')
        .select('*, courses(min_cluster_score, intake_capacity)')
        .order('preference_order'),
    ])

    let placedCount = 0
    let rejectedCount = 0

    // For each student, find best matching course
    for (const student of students || []) {
      const studentPrefs = preferences?.filter((p: any) => p.student_id === student.id) || []

      let placed = false

      for (const pref of studentPrefs) {
        const course = pref.courses
        if (!course) continue

        // Check if student qualifies
        if (student.cluster_score >= course.min_cluster_score) {
          // Check available slots
          const courseplacements = (placements || []).filter(
            (p: any) => p.course_id === pref.course_id
          )

          if (courseplacements.length < course.intake_capacity) {
            // Place student - create placement record
            const { data: newPlacement, error: placementError } = await supabase
              .from('placements')
              .insert({
                student_id: student.id,
                course_id: pref.course_id,
                university_id: course.university_id,
                placement_date: new Date(),
                status: 'pending',
              })
              .select()
              .single()

            if (placementError) {
              console.error('Error creating placement:', placementError)
              continue
            }

            // Update student placement status
            await supabase
              .from('students')
              .update({ placement_status: 'placed' })
              .eq('id', student.id)

            // Create admission letter automatically when student is placed
            if (newPlacement) {
              const admissionDate = new Date()
              admissionDate.setMonth(admissionDate.getMonth() + 1) // Set admission date to 1 month from now

              await supabase.from('admission_letters').insert({
                placement_id: newPlacement.id,
                student_id: student.id,
                university_id: course.university_id,
                course_id: pref.course_id,
                letter_date: new Date(),
                admission_date: admissionDate.toISOString().split('T')[0],
              })
            }

            placedCount++
            placed = true
            break
          }
        }
      }

      if (!placed) {
        await supabase
          .from('students')
          .update({ placement_status: 'rejected' })
          .eq('id', student.id)
        rejectedCount++
      }
    }

    return { placedCount, rejectedCount }
  } catch (error) {
    console.error('Placement algorithm error:', error)
    throw error
  }
}
