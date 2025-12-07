import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { placementId } = await request.json()

    if (!placementId) {
      return NextResponse.json({ error: 'Placement ID is required' }, { status: 400 })
    }

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the placement belongs to the current user
    const { data: placement, error: placementError } = await supabase
      .from('placements')
      .select('student_id, status')
      .eq('id', placementId)
      .single()

    if (placementError || !placement) {
      return NextResponse.json({ error: 'Placement not found' }, { status: 404 })
    }

    if (placement.student_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update placement status to 'accepted'
    const { error: updateError } = await supabase
      .from('placements')
      .update({ status: 'accepted' })
      .eq('id', placementId)

    if (updateError) {
      console.error('Error updating placement:', updateError)
      return NextResponse.json(
        { error: 'Failed to accept admission' },
        { status: 500 },
      )
    }

    // Also ensure student placement_status is 'placed'
    await supabase
      .from('students')
      .update({ placement_status: 'placed' })
      .eq('id', user.id)

    return NextResponse.json({ success: true, message: 'Admission accepted successfully' })
  } catch (error: any) {
    console.error('Error accepting admission:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

