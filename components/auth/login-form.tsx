'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function LoginForm() {
  const router = useRouter()
  const { signIn } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' as 'student' | 'admin',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      setLoading(true)
      await signIn(formData.email, formData.password, formData.role)
      router.push(formData.role === 'admin' ? '/admin' : '/dashboard')
      router.refresh()
    } catch (error: any) {
      setErrors({ submit: error.message || 'Login failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {errors.submit}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Login As
        </label>
        <Select
          value={formData.role}
          onValueChange={(value: 'student' | 'admin') => setFormData({ ...formData, role: value })}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="text"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={loading}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={loading}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      <p className="text-center text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline font-medium">
          Register here
        </a>
      </p>
    </form>
  )
}
