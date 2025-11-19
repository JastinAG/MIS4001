'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Printer } from 'lucide-react'
import { useRef, useState } from 'react'
import { generateAdmissionLetterPDF } from '@/utils/letter-generator'

interface AdmissionLetterViewProps {
  studentName: string
  course: string
  university: string
  date: string
  kcseIndex: string
}

export default function AdmissionLetterView({ studentName, course, university, date, kcseIndex }: AdmissionLetterViewProps) {
  const letterRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePrint = () => {
    const printContent = letterRef.current
    if (printContent) {
      const originalContents = document.body.innerHTML
      document.body.innerHTML = printContent.innerHTML
      window.print()
      document.body.innerHTML = originalContents
      window.location.reload()
    }
  }

  const handleDownload = async () => {
    try {
      setIsGenerating(true)
      const blob = await generateAdmissionLetterPDF({
        studentName,
        universityName: university,
        courseName: course,
        letterDate: date,
        admissionDate: '2025-09-15', // Default admission date
        kcseIndex
      })
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Admission_Letter_${studentName.replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try printing instead.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-end gap-4 print:hidden">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
        <Button 
          onClick={handleDownload} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isGenerating}
        >
          <Download className="mr-2 h-4 w-4" /> 
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-12 print:p-0" ref={letterRef}>
          {/* Letter Header */}
          <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wide mb-2">
              {university}
            </h1>
            <p className="text-slate-600 font-medium">OFFICE OF THE REGISTRAR (ACADEMIC AFFAIRS)</p>
            <p className="text-sm text-slate-500 mt-2">P.O. Box 12345-00100, Nairobi, Kenya | Email: admissions@{university.toLowerCase().replace(/\s+/g, '')}.ac.ke</p>
          </div>

          {/* Letter Body */}
          <div className="space-y-6 text-slate-800 leading-relaxed">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">Ref: KUCCPS/2025/ADM/001</p>
                <p className="font-bold mt-4">TO: {studentName}</p>
                <p>Student ID: {kcseIndex}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Date: {date}</p>
              </div>
            </div>

            <div className="py-4">
              <p className="font-bold text-lg underline">RE: PROVISIONAL ADMISSION FOR 2025/2026 ACADEMIC YEAR</p>
            </div>

            <p>Dear {studentName},</p>

            <p>
              Following your successful application through the Kenya Universities and Colleges Central Placement Service (KUCCPS), 
              we are pleased to inform you that you have been offered a provisional admission to <strong>{university}</strong> to pursue the following course:
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-center my-6">
              <h3 className="text-xl font-bold text-blue-900">{course}</h3>
            </div>

            <p>
              This offer is made on the basis of your academic qualifications and is subject to verification of your original certificates 
              during the registration process.
            </p>

            <p>
              Reporting date is scheduled for <strong>September 15th, 2025</strong> at 8:00 AM. 
              Please bring your original KCSE result slip, National ID/Birth Certificate, and two colored passport size photographs.
            </p>

            <p>
              We congratulate you on your admission and look forward to welcoming you to {university}.
            </p>

            <div className="mt-12 pt-8">
              <div className="w-48 border-b border-slate-900 mb-2"></div>
              <p className="font-bold">Prof. John Doe, PhD</p>
              <p className="text-sm text-slate-600">Academic Registrar</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
            <p>This is a system generated letter and does not require a signature.</p>
            <p>{university} is ISO 9001:2015 Certified</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
