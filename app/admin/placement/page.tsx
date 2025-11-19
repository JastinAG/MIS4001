'use client'

import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function AdminPlacementPage() {
  const supabase = getSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleTriggerPlacement = async () => {
    if (!confirm('Are you sure you want to trigger a new placement round? This action cannot be undone.')) {
      return
    }

    try {
      setLoading(true)
      setMessage('')
      setError('')

      const response = await fetch('/api/placement/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to trigger placement')
      }

      setMessage(
        `Placement round completed! ${data.placedCount} students placed, ${data.rejectedCount} rejected.`
      )
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Placement Management</h1>
        <p className="text-gray-600">Control and monitor placement rounds</p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Trigger Placement Round</h2>
        <p className="text-gray-600 mb-6">
          Start the placement algorithm to match students to universities based on their cluster scores
          and preferences.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <p className="text-yellow-800 text-sm">
            <strong>Warning:</strong> This will update the placement status for all students. Make sure
            all universities and courses are configured correctly before proceeding.
          </p>
        </div>

        <button
          onClick={handleTriggerPlacement}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Processing...' : 'Trigger Placement Round'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Placement Algorithm</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Matches students to universities based on cluster score</li>
            <li>✓ Respects course preferences order</li>
            <li>✓ Ensures course intake capacity is not exceeded</li>
            <li>✓ One student = One placement</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Before Triggering</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Configure all universities</li>
            <li>✓ Add courses with requirements</li>
            <li>✓ Set student preferences</li>
            <li>✓ Verify course cut-off scores</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
