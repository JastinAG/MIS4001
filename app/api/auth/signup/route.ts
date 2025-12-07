import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calculateClusterScore } from '@/utils/grade-calculator'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xybnqhsqlaaocqibqhbn.supabase.co'

// Try multiple ways to get the service role key
const SERVICE_ROLE_KEY = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_KEY ||
  // Temporary fallback - REMOVE BEFORE PRODUCTION
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQ2NTExOCwiZXhwIjoyMDgwMDQxMTE4fQ.x6nE8dxJ2KsmDllZxHlq_A_yfk_pKmtg0jgpSj2IiZU'

// Debug logging (remove in production)
if (process.env.NODE_ENV === 'development') {
  console.log('[Signup API] Environment check:', {
    hasUrl: !!SUPABASE_URL,
    hasServiceKey: !!SERVICE_ROLE_KEY,
    serviceKeyLength: SERVICE_ROLE_KEY?.length || 0,
  })
}

const adminClient =
  SUPABASE_URL && SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

const SUBJECTS = [
  'Mathematics',
  'English',
  'Kiswahili',
  'Chemistry',
  'Biology',
  'Physics',
  'History',
  'Geography',
  'CRE',
  'Business Studies',
  'Agriculture',
  'Computer Studies',
]

const GRADE_OPTIONS = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']

const COUNTIES = [
  'Nairobi',
  'Kiambu',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Uasin Gishu',
  'Machakos',
  'Nyeri',
  'Kericho',
  'Embu',
]

function deriveFullName(email: string) {
  const prefix = email.split('@')[0] || 'student'
  const parts = prefix
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
  if (parts.length === 0) {
    return 'Student'
  }
  if (parts.length === 1) {
    return `${parts[0]} Mwangi`
  }
  return parts.slice(0, 2).join(' ')
}

function generateIndexNumber() {
  const base = Math.floor(100000000 + Math.random() * 900000000)
  return `KCSE-${base}`
}

function randomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function generateGrades(studentId: string) {
  return SUBJECTS.slice(0, 8).map((subject) => ({
    student_id: studentId,
    subject,
    grade: randomChoice(GRADE_OPTIONS),
  }))
}

export async function POST(request: Request) {
  if (!adminClient) {
    // More detailed debugging
    const allEnvKeys = Object.keys(process.env)
    const supabaseKeys = allEnvKeys.filter((k) => k.includes('SUPABASE'))
    const serviceKeyVariants = [
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      process.env.SUPABASE_KEY,
      process.env.SERVICE_ROLE_KEY,
    ]
    
    console.error('[Signup API] Admin client not initialized:', {
      hasUrl: !!SUPABASE_URL,
      hasServiceKey: !!SERVICE_ROLE_KEY,
      serviceKeyValue: SERVICE_ROLE_KEY ? `${SERVICE_ROLE_KEY.substring(0, 20)}...` : 'undefined',
      allSupabaseKeys: supabaseKeys,
      totalEnvKeys: allEnvKeys.length,
      serviceKeyVariants: serviceKeyVariants.map((v, i) => ({
        variant: ['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_KEY', 'SERVICE_ROLE_KEY'][i],
        exists: !!v,
        length: v?.length || 0,
      })),
    })
    
    return NextResponse.json(
      {
        error:
          'Supabase service role key is not configured. Set SUPABASE_SERVICE_ROLE_KEY in your .env.local file and restart the dev server.',
        hint: 'The dev server must be restarted after adding environment variables. Check terminal for detailed debug info.',
        debug: {
          hasUrl: !!SUPABASE_URL,
          hasServiceKey: !!SERVICE_ROLE_KEY,
          foundKeys: supabaseKeys,
        },
      },
      { status: 500 },
    )
  }

  const { email, password, role = 'student' } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  try {
    // Step 1: Create auth user
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      console.error('Error creating auth user:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const userId = data.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 })
    }

    // Step 2: Insert into users table
    const { error: userError } = await adminClient.from('users').insert({
      id: userId,
      email,
      role,
    })

    if (userError) {
      console.error('Error inserting user record:', userError)
      // Try to clean up auth user if possible
      await adminClient.auth.admin.deleteUser(userId).catch(() => {})
      return NextResponse.json(
        { error: `Failed to create user record: ${userError.message}` },
        { status: 500 },
      )
    }

    // Step 3: If student, create student profile with grades
    if (role === 'student') {
      const fullName = deriveFullName(email)
      const kcseIndex = generateIndexNumber()
      const county = randomChoice(COUNTIES)
      const gradeRows = generateGrades(userId)
      const gradeForCalc = gradeRows.map((g) => ({ subject: g.subject, score: g.grade }))
      const clusterScore = calculateClusterScore(gradeForCalc)
      const subjectsCount = Math.min(gradeForCalc.length, 8)
      const meanGrade = subjectsCount > 0 ? clusterScore / subjectsCount : 0

      // Insert student record
      const { error: studentError } = await adminClient.from('students').insert({
        id: userId,
        full_name: fullName,
        kcse_index_number: kcseIndex,
        kcse_mean_grade: Number(meanGrade.toFixed(1)),
        county,
        cluster_score: clusterScore,
        placement_status: 'pending',
      })

      if (studentError) {
        console.error('Error inserting student record:', studentError)
        return NextResponse.json(
          { error: `Failed to create student profile: ${studentError.message}` },
          { status: 500 },
        )
      }

      // Insert grades
      const { error: gradesError } = await adminClient.from('student_clusters').insert(gradeRows)

      if (gradesError) {
        console.error('Error inserting student grades:', gradesError)
        // Student record exists, but grades failed - this is recoverable
        return NextResponse.json(
          {
            error: `Account created but failed to save grades: ${gradesError.message}`,
            user: data.user,
          },
          { status: 207 }, // 207 Multi-Status
        )
      }
    }

    return NextResponse.json({ user: data.user, message: 'Account created successfully' })
  } catch (error: any) {
    console.error('Unexpected error during signup:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during signup' },
      { status: 500 },
    )
  }
}



