import Link from 'next/link'
import LoginForm from '@/components/auth/login-form'

export const metadata = {
  title: 'Login - Student Placement System',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600">
              Access your student placement account
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
