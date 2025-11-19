import Link from 'next/link'
import RegisterForm from '@/components/auth/register-form'

export const metadata = {
  title: 'Register - Student Placement System',
  description: 'Create a new student account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">
              Register to participate in the student placement system
            </p>
          </div>

          <RegisterForm />

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
