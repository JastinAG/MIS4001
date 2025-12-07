'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'

interface TestResult {
  name: string
  status: 'pending' | 'pass' | 'fail'
  message: string
  details?: any
}

export default function TestPage() {
  const { user, signUp, signIn, signOut, userRole } = useAuth()
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)
  const [testEmail, setTestEmail] = useState(`test-${Date.now()}@example.com`)
  const [testPassword, setTestPassword] = useState('testpassword123')

  const updateResult = (name: string, status: 'pass' | 'fail', message: string, details?: any) => {
    setResults((prev) => {
      const existing = prev.find((r) => r.name === name)
      if (existing) {
        return prev.map((r) => (r.name === name ? { ...r, status, message, details } : r))
      }
      return [...prev, { name, status, message, details }]
    })
  }

  const testConnection = async () => {
    updateResult('Backend Connection', 'pending', 'Testing...')
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from('universities').select('count').limit(1)

      if (error) throw error

      updateResult('Backend Connection', 'pass', 'Successfully connected to Supabase', {
        connection: 'OK',
        tables: 'Accessible',
      })
    } catch (error: any) {
      updateResult('Backend Connection', 'fail', `Connection failed: ${error.message}`, {
        error: error.message,
        hint: 'Check your environment variables and Supabase configuration',
      })
    }
  }

  const testTables = async () => {
    updateResult('Database Tables', 'pending', 'Checking tables...')
    try {
      const supabase = getSupabaseClient()
      const tables = ['users', 'students', 'student_clusters', 'universities', 'courses']

      const results: Record<string, boolean> = {}
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('count').limit(1)
          results[table] = !error
        } catch {
          results[table] = false
        }
      }

      const allExist = Object.values(results).every((v) => v)
      const missing = Object.entries(results)
        .filter(([_, exists]) => !exists)
        .map(([table]) => table)

      if (allExist) {
        updateResult('Database Tables', 'pass', 'All required tables exist', results)
      } else {
        updateResult('Database Tables', 'fail', `Missing tables: ${missing.join(', ')}`, results)
      }
    } catch (error: any) {
      updateResult('Database Tables', 'fail', `Error checking tables: ${error.message}`)
    }
  }

  const testSignup = async () => {
    updateResult('User Signup', 'pending', 'Testing signup...')
    try {
      const email = `test-signup-${Date.now()}@example.com`
      const password = 'testpassword123'

      await signUp(email, password)

      // Check if user was created in database
      const supabase = getSupabaseClient()
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (userError) throw new Error(`User record not found: ${userError.message}`)

      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', userData.id)
        .single()

      if (studentError) throw new Error(`Student record not found: ${studentError.message}`)

      const { data: gradesData, error: gradesError } = await supabase
        .from('student_clusters')
        .select('*')
        .eq('student_id', userData.id)

      if (gradesError) throw new Error(`Grades not found: ${gradesError.message}`)

      updateResult('User Signup', 'pass', 'Signup successful - user, student, and grades created', {
        userId: userData.id,
        email: userData.email,
        role: userData.role,
        studentName: studentData.full_name,
        gradesCount: gradesData?.length || 0,
      })
    } catch (error: any) {
      updateResult('User Signup', 'fail', `Signup failed: ${error.message}`, {
        error: error.message,
        hint: 'Check your SUPABASE_SERVICE_ROLE_KEY in .env.local',
      })
    }
  }

  const testLogin = async () => {
    updateResult('User Login', 'pending', 'Testing login...')
    try {
      // First sign up a test user
      const email = `test-login-${Date.now()}@example.com`
      const password = 'testpassword123'

      await signUp(email, password)
      await signOut()

      // Wait a bit for session to clear
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Now try to log in
      await signIn(email, password, 'student')

      if (!user) {
        throw new Error('User session not established after login')
      }

      updateResult('User Login', 'pass', 'Login successful', {
        userId: user.id,
        email: user.email,
        role: userRole,
      })
    } catch (error: any) {
      updateResult('User Login', 'fail', `Login failed: ${error.message}`, {
        error: error.message,
      })
    }
  }

  const testDataFetch = async () => {
    updateResult('Data Fetching', 'pending', 'Testing data fetching...')
    try {
      const supabase = getSupabaseClient()

      // Test fetching universities
      const { data: universities, error: univError } = await supabase
        .from('universities')
        .select('*')
        .limit(5)

      if (univError) throw new Error(`Universities fetch failed: ${univError.message}`)

      // Test fetching courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*, universities(name)')
        .limit(5)

      if (coursesError) throw new Error(`Courses fetch failed: ${coursesError.message}`)

      // If user is logged in, test fetching student data
      let studentData = null
      if (user) {
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!studentError && student) {
          const { data: grades } = await supabase
            .from('student_clusters')
            .select('*')
            .eq('student_id', user.id)

          studentData = {
            student,
            grades: grades || [],
          }
        }
      }

      updateResult('Data Fetching', 'pass', 'Data fetching successful', {
        universities: universities?.length || 0,
        courses: courses?.length || 0,
        studentData: studentData ? 'Available' : 'Not logged in',
      })
    } catch (error: any) {
      updateResult('Data Fetching', 'fail', `Data fetching failed: ${error.message}`, {
        error: error.message,
      })
    }
  }

  const testRLSPolicies = async () => {
    updateResult('RLS Policies', 'pending', 'Checking RLS policies...')
    try {
      const supabase = getSupabaseClient()

      // Try to access data as current user
      if (!user) {
        updateResult('RLS Policies', 'fail', 'Must be logged in to test RLS policies', {
          hint: 'Sign up or log in first',
        })
        return
      }

      // Test reading own student data
      const { data: ownData, error: ownError } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .single()

      if (ownError && ownError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is OK if user doesn't have student record
        throw new Error(`Cannot read own data: ${ownError.message}`)
      }

      // Test reading universities (should be public)
      const { error: univError } = await supabase.from('universities').select('count').limit(1)

      if (univError) throw new Error(`Cannot read universities: ${univError.message}`)

      updateResult('RLS Policies', 'pass', 'RLS policies working correctly', {
        canReadOwnData: !ownError || ownError.code === 'PGRST116',
        canReadPublicData: !univError,
      })
    } catch (error: any) {
      updateResult('RLS Policies', 'fail', `RLS test failed: ${error.message}`, {
        error: error.message,
      })
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    setResults([])

    // Run tests in sequence
    await testConnection()
    await new Promise((resolve) => setTimeout(resolve, 500))

    await testTables()
    await new Promise((resolve) => setTimeout(resolve, 500))

    await testSignup()
    await new Promise((resolve) => setTimeout(resolve, 500))

    await testLogin()
    await new Promise((resolve) => setTimeout(resolve, 500))

    await testDataFetch()
    await new Promise((resolve) => setTimeout(resolve, 500))

    await testRLSPolicies()

    setTesting(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'pending':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
      default:
        return null
    }
  }

  const passedTests = results.filter((r) => r.status === 'pass').length
  const failedTests = results.filter((r) => r.status === 'fail').length
  const totalTests = results.length

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Supabase Connection Tests</h1>
        <p className="text-gray-600">
          Test your Supabase backend connection, authentication, and data fetching
        </p>
      </div>

      {/* Current Session Info */}
      {user && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Logged in as:</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">Role: {userRole || 'N/A'}</p>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>Run individual tests or all tests at once</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button onClick={testConnection} disabled={testing} variant="outline" size="sm">
              Test Connection
            </Button>
            <Button onClick={testTables} disabled={testing} variant="outline" size="sm">
              Test Tables
            </Button>
            <Button onClick={testSignup} disabled={testing} variant="outline" size="sm">
              Test Signup
            </Button>
            <Button onClick={testLogin} disabled={testing} variant="outline" size="sm">
              Test Login
            </Button>
            <Button onClick={testDataFetch} disabled={testing} variant="outline" size="sm">
              Test Data Fetch
            </Button>
            <Button onClick={testRLSPolicies} disabled={testing} variant="outline" size="sm">
              Test RLS
            </Button>
          </div>
          <Button onClick={runAllTests} disabled={testing} className="w-full" size="lg">
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run All Tests'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Test Results Summary */}
      {totalTests > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-600">{passedTests} Passed</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-600">{failedTests} Failed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Total: {totalTests}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
          {results.map((result, index) => (
            <Card
              key={index}
              className={
                result.status === 'pass'
                  ? 'border-green-200 bg-green-50'
                  : result.status === 'fail'
                    ? 'border-red-200 bg-red-50'
                    : 'border-blue-200 bg-blue-50'
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    {result.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                      View Details
                    </summary>
                    <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
                {result.status === 'fail' && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-xs text-yellow-800">
                        <p className="font-semibold mb-1">Troubleshooting:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Check your .env.local file has all required variables</li>
                          <li>Verify Supabase project URL and keys are correct</li>
                          <li>Ensure database schema and RLS policies are set up</li>
                          <li>Check browser console for detailed error messages</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Instructions */}
      <Card className="mt-6 border-gray-200">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>1. Click "Run All Tests" to test everything at once, or run individual tests</p>
          <p>2. Green results mean the test passed, red means it failed</p>
          <p>3. Check the details section for more information about each test</p>
          <p>4. If tests fail, check the troubleshooting tips and verify your Supabase setup</p>
          <p className="pt-2 text-xs text-gray-500">
            Note: Some tests require you to be logged in. Sign up or log in first if needed.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

