import { SearchBar } from '@/components/SearchBar'
import { HomeFilters } from '@/components/HomeFilters'
import Link from 'next/link'
import { categories, categoryIcons } from '@/utils/categories'
import { ArrowRight } from 'lucide-react'
import { CategoryActions } from '@/components/CategoryActions'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 dark:from-white dark:to-blue-200 animate-gradient">
              DevOps Tools Cheatsheet
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              A comprehensive collection of DevOps tools, best practices, and resources for
              modern software development and operations.
            </p>
            
            {/* Search Bar Component */}
            <SearchBar />
          </div>
        </main>
      </div>

      {/* Filters Section */}
      <div className="py-12">
        <HomeFilters />
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const info = categoryIcons[category]
            const toolCount = info.toolCount
            
            return (
              <div
                key={category}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-300 dark:hover:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  {/* Category Icon and Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center text-2xl">
                      {info.icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                      {category.replace(/-/g, ' ')}
                    </h2>
                  </div>

                  {/* Tool Count Badge */}
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium whitespace-nowrap">
                    {toolCount}+ Tools
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6 min-h-[3rem]">
                  {info.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Updated recently</span>
                  </div>
                  <span>•</span>
                  <span>5 min read</span>
                </div>

                {/* Explore Tools Button and Actions */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${category}`}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all duration-300"
                  >
                    <span className="font-medium">Explore tools</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Quick Actions */}
                  <CategoryActions category={category} />
                </div>

                {/* Progress Bar - Optional */}
                <div className="mt-6 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 dark:bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(toolCount * 3, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 