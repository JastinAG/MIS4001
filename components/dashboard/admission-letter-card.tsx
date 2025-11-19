'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

interface AdmissionLetter {
  id: string
  course_name: string
  university_name: string
  admission_date: string
  letter_date: string
  pdf_path: string | null
}

export default function AdmissionLetterCard({ userId }: { userId: string }) {
  const supabase = getSupabaseClient()
  const [letter, setLetter] = useState<AdmissionLetter | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const { data, error } = await supabase
          .from('admission_letters')
          .select(`
            id,
            letter_date,
            admission_date,
            pdf_path,
            courses(name),
            universities(name)
          `)
          .eq('student_id', userId)
          .single()

        if (error && error.code !== 'PGRST116') throw error

        if (data) {
          setLetter({
            id: data.id,
            course_name: data.courses?.name || 'N/A',
            university_name: data.universities?.name || 'N/A',
            admission_date: data.admission_date,
            letter_date: data.letter_date,
            pdf_path: data.pdf_path,
          })
        }
      } catch (error) {
        console.error('Error fetching letter:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchLetter()
    }
  }, [userId, supabase])

  const handleGeneratePDF = async () => {
    if (!letter) return

    try {
      setGenerating(true)
      const response = await fetch('/api/admission-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterId: letter.id }),
      })

      if (!response.ok) throw new Error('Failed to generate PDF')

      const data = await response.json()
      setLetter({ ...letter, pdf_path: data.pdfPath })
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!letter?.pdf_path) return

    try {
      const response = await fetch(letter.pdf_path)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `admission-letter-${letter.course_name.replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF')
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">Loading admission letter...</p>
      </div>
    )
  }

  if (!letter) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">No admission letter available yet</p>
        <p className="text-sm text-gray-500 mt-2">
          You will receive an admission letter once you are placed.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-2xl font-bold text-gray-900">Admission Letter</h2>
        <p className="text-gray-600 text-sm mt-1">Your official admission document</p>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">University</p>
            <p className="text-2xl font-bold text-blue-600">{letter.university_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Course</p>
            <p className="text-2xl font-bold text-gray-900">{letter.course_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">Letter Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(letter.letter_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Admission Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(letter.admission_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            PDF Status:{' '}
            <span className={letter.pdf_path ? 'text-green-600 font-semibold' : 'text-yellow-600'}>
              {letter.pdf_path ? 'Ready to Download' : 'Not Generated'}
            </span>
          </p>

          <div className="flex gap-3">
            {!letter.pdf_path ? (
              <button
                onClick={handleGeneratePDF}
                disabled={generating}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {generating ? 'Generating PDF...' : 'Generate PDF'}
              </button>
            ) : (
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
              >
                Download PDF
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
            >
              Print Letter
            </button>
          </div>
        </div>
      </div>

      {/* Letter Preview Section */}
      <div className="border-t border-gray-200 p-8 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Letter Preview</h3>
        <div
          className="bg-white p-12 border border-gray-300 rounded-lg shadow-sm"
          style={{
            fontFamily: 'Georgia, serif',
            lineHeight: 1.8,
            color: '#333',
          }}
        >
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600">Official Admission Letter</p>
            <p className="text-2xl font-bold mt-2">Student Placement System</p>
          </div>

          <div className="border-t border-b border-gray-300 py-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Letter Date</p>
            <p className="font-semibold">
              {new Date(letter.letter_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <p>Dear Student,</p>
            <p>
              Congratulations! We are pleased to inform you that you have been successfully admitted to:
            </p>

            <div className="bg-blue-50 p-6 rounded border-l-4 border-blue-600 my-6">
              <p className="font-semibold text-lg text-blue-900 mb-2">{letter.university_name}</p>
              <p className="text-blue-900">Programme: {letter.course_name}</p>
            </div>

            <p>
              Your admission date is{' '}
              <span className="font-semibold">
                {new Date(letter.admission_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              . Please ensure you report on or before this date with all required documentation.
            </p>

            <p>
              Should you have any questions regarding your admission, please contact the admissions office
              of the respective university.
            </p>

            <p>We wish you all the best in your academic journey.</p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Authorized By</p>
                <p className="font-semibold mt-2">_________________________</p>
                <p className="text-sm text-gray-600">Director of Admissions</p>
              </div>
              <div className="mt-8">
                <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
