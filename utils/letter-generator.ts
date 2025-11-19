import jsPDF from 'jspdf'

export async function generateAdmissionLetterPDF(letterData: {
  studentName: string
  universityName: string
  courseName: string
  letterDate: string
  admissionDate: string
  kcseIndex: string
}): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20

  let yPosition = margin

  // Header
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('ADMISSION LETTER', pageWidth / 2, yPosition, { align: 'center' })

  yPosition += 15
  doc.setFontSize(12)
  doc.setFont(undefined, 'normal')
  doc.text('Student Placement System', pageWidth / 2, yPosition, { align: 'center' })

  // Date
  yPosition += 15
  doc.setFontSize(10)
  doc.text(`Date: ${new Date(letterData.letterDate).toLocaleDateString()}`, margin, yPosition)

  // Greeting
  yPosition += 15
  doc.setFontSize(11)
  doc.text('Dear Student,', margin, yPosition)

  // Body
  yPosition += 10
  const bodyText = `Congratulations! We are pleased to inform you that you have been successfully admitted to the following institution and programme:`

  const bodyLines = doc.splitTextToSize(bodyText, pageWidth - 2 * margin)
  doc.text(bodyLines, margin, yPosition)
  yPosition += bodyLines.length * 7 + 5

  // University and Course Details
  doc.setFillColor(230, 240, 255)
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F')

  doc.setFont(undefined, 'bold')
  doc.setFontSize(12)
  doc.text(letterData.universityName, margin + 5, yPosition + 8)

  doc.setFont(undefined, 'normal')
  doc.setFontSize(10)
  doc.text(`Programme: ${letterData.courseName}`, margin + 5, yPosition + 16)
  doc.text(`KCSE Index: ${letterData.kcseIndex}`, margin + 5, yPosition + 23)

  yPosition += 35

  // Admission details
  const admissionText = `Your admission is effective from ${new Date(letterData.admissionDate).toLocaleDateString()}. Please ensure that you report to the institution on or before this date with all required documentation.`

  const admissionLines = doc.splitTextToSize(admissionText, pageWidth - 2 * margin)
  doc.setFont(undefined, 'normal')
  doc.setFontSize(10)
  doc.text(admissionLines, margin, yPosition)
  yPosition += admissionLines.length * 7 + 10

  // Closing
  const closingText =
    'Should you have any questions regarding your admission, please contact the admissions office of the respective university.'

  const closingLines = doc.splitTextToSize(closingText, pageWidth - 2 * margin)
  doc.text(closingLines, margin, yPosition)
  yPosition += closingLines.length * 7 + 10

  doc.text('We wish you all the best in your academic journey.', margin, yPosition)

  // Signature area
  yPosition = pageHeight - 40
  doc.setFont(undefined, 'normal')
  doc.setFontSize(10)
  doc.text('_____________________________', margin, yPosition)
  doc.text('Director of Admissions', margin, yPosition + 7)

  // Convert to blob
  return doc.output('blob')
}
