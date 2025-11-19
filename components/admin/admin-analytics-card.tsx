'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Stats {
  totalStudents: number
  placed: number
  rejected: number
  pending: number
  universities: number
  courses: number
}

export default function AdminAnalyticsCard({ stats }: { stats: Stats }) {
  const chartData = [
    {
      name: 'Placed',
      value: stats.placed,
      fill: '#10b981',
    },
    {
      name: 'Rejected',
      value: stats.rejected,
      fill: '#ef4444',
    },
    {
      name: 'Pending',
      value: stats.pending,
      fill: '#f59e0b',
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Placement Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Summary</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Placement Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.totalStudents > 0
                ? ((stats.placed / stats.totalStudents) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Avg. Placements per University</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.universities > 0 ? (stats.placed / stats.universities).toFixed(1) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
