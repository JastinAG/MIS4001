'use client'

import { useState } from 'react'
import { calculateClusterScore } from '@/utils/grade-calculator'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Trash2, Plus } from 'lucide-react'

const SUBJECTS = [
  'Mathematics', 'English', 'Kiswahili', 'Chemistry', 'Biology', 'Physics',
  'History', 'Geography', 'CRE', 'Business Studies', 'Agriculture', 'Computer Studies'
]

const GRADES = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E']

interface GradesInputProps {
  onComplete: (score: number, grades: Array<{ subject: string; score: string }>) => void
}

export default function GradesInput({ onComplete }: GradesInputProps) {
  const [entries, setEntries] = useState<Array<{ subject: string; score: string }>>([
    { subject: 'Mathematics', score: '' },
    { subject: 'English', score: '' },
    { subject: 'Kiswahili', score: '' },
    { subject: '', score: '' }, // Optional 1
    { subject: '', score: '' }, // Optional 2
    { subject: '', score: '' }, // Optional 3
    { subject: '', score: '' }, // Optional 4
  ])

  const updateEntry = (index: number, field: 'subject' | 'score', value: string) => {
    const newEntries = [...entries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setEntries(newEntries)
  }

  const removeEntry = (index: number) => {
    if (entries.length <= 7) return // Minimum 7 subjects usually required for KCSE grading logic
    const newEntries = entries.filter((_, i) => i !== index)
    setEntries(newEntries)
  }

  const addEntry = () => {
    if (entries.length >= 12) return
    setEntries([...entries, { subject: '', score: '' }])
  }

  const handleSubmit = () => {
    // Filter out incomplete entries
    const validEntries = entries.filter(e => e.subject && e.score)
    
    if (validEntries.length < 7) {
      alert('Please enter at least 7 subjects to calculate cluster points accurately.')
      return
    }

    const score = calculateClusterScore(validEntries)
    onComplete(score, validEntries)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Enter Your KCSE Grades</CardTitle>
        <CardDescription>
          Input your grades for each subject to calculate your cluster points and see eligible courses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map((entry, index) => (
            <div key={index} className="flex gap-2 items-end p-3 border rounded-lg bg-slate-50">
              <div className="flex-1 space-y-2">
                <Label>Subject {index + 1}</Label>
                <Select 
                  value={entry.subject || undefined} 
                  onValueChange={(val) => updateEntry(index, 'subject', val)}
                  disabled={index < 3} // Compulsory subjects locked
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map(s => (
                      <SelectItem 
                        key={s} 
                        value={s}
                        disabled={entries.some((e, i) => i !== index && e.subject === s)}
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-24 space-y-2">
                <Label>Grade</Label>
                <Select 
                  value={entry.score || undefined} 
                  onValueChange={(val) => updateEntry(index, 'score', val)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {index >= 3 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeEntry(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={addEntry} disabled={entries.length >= 12}>
            <Plus className="mr-2 h-4 w-4" /> Add Subject
          </Button>
          
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            Calculate Points & Proceed
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
