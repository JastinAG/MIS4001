'use client'

interface Stats {
  totalStudents: number
  placed: number
  universities: number
  courses: number
}

export default function AdminQuickStats({ stats }: { stats: Stats }) {
  const placementRate = stats.totalStudents > 0 
    ? ((stats.placed / stats.totalStudents) * 100).toFixed(1)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Total Students</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Placed</h3>
        <p className="text-3xl font-bold text-green-600">{stats.placed}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Universities</h3>
        <p className="text-3xl font-bold text-purple-600">{stats.universities}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Placement Rate</h3>
        <p className="text-3xl font-bold text-indigo-600">{placementRate}%</p>
      </div>
    </div>
  )
}
