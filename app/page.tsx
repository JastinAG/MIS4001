import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Student Placement System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Automated university placement based on KCSE grades and preferences
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Register</h3>
              <p className="text-gray-600">
                Create an account with your KCSE details and preferred courses
              </p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Get Placed</h3>
              <p className="text-gray-600">
                Our algorithm matches you to universities based on your grades
              </p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Get Admission Letter</h3>
              <p className="text-gray-600">
                Download your admission letter and start your journey
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
