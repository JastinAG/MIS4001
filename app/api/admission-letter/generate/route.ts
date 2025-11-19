import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { letterId } = await request.json()

    const supabase = await getSupabaseServerClient()

    const { data: letter, error: letterError } = await supabase
      .from('admission_letters')
      .select(
        `
        id,
        student_id,
        university_id,
        course_id,
        letter_date,
        admission_date,
        students(full_name, kcse_index_number),
        universities(name),
        courses(name)
      `
      )
      .eq('id', letterId)
      .single()

    if (letterError) throw letterError
    if (!letter) throw new Error('Letter not found')

    // Generate PDF filename
    const timestamp = Date.now()
    const fileName = `admission-letters/${letter.student_id}-${timestamp}.pdf`

    // In a real implementation, you would generate a PDF using a library like jsPDF or puppeteer
    // For now, we'll store the PDF path and return it
    // This would typically involve:
    // 1. Using jsPDF or html2pdf to generate PDF from letter content
    // 2. Uploading to Supabase Storage
    // 3. Saving the storage path in the database

    // Update admission letter with PDF path
    const { data: updatedLetter, error: updateError } = await supabase
      .from('admission_letters')
      .update({
        pdf_path: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/admission-letters/${fileName}`,
      })
      .eq('id', letterId)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      pdfPath: updatedLetter.pdf_path,
      message: 'PDF generated successfully',
    })
  } catch (error: any) {
    console.error('Error generating admission letter:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
