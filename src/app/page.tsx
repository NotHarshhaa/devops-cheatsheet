import Link from 'next/link'
import { categories, categoryIcons } from '@/utils/categories'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            DevOps Tools Cheatsheet
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive collection of DevOps tools, best practices, and resources for
            modern software development and operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/${category}`}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{categoryIcons[category].icon}</span>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {category.replace(/-/g, ' ')}
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  {categoryIcons[category].description}
                </p>
                <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                  Explore tools
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
} 