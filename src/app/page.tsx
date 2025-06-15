import { SearchBar } from "@/components/SearchBar";
import { HomeFilters } from "@/components/HomeFilters";
import Link from "next/link";
import { categories, TOTAL_CATEGORIES, categoryData } from "@/utils/categoryData";
import { ArrowRight, Sparkles } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Suspense } from "react";
import { ExploreButton } from "@/components/ExploreButton";

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

// This ensures the page is static and not server-rendered
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-gray-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-black">
      {/* Hero Section with Search */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-purple-400 blur-3xl"></div>
          <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-400 blur-3xl"></div>
          <div className="absolute grid grid-cols-6 gap-5 top-0 left-0 right-0 bottom-0 opacity-10">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md bg-white/20"
              ></div>
            ))}
          </div>
        </div>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-white/10 backdrop-blur-sm">
                Supercharge your DevOps workflow
              </span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-100 drop-shadow-sm animate-gradient">
              DevOps Tools Cheatsheet
            </h1>

            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              A comprehensive collection of DevOps tools, best practices, and
              resources for modern software development and operations.
            </p>

            {/* Search Bar Component with enhanced styling */}
            <div className="relative z-10 max-w-2xl mx-auto transform transition-all animate-fade-in-up">
              <Suspense
                fallback={
                  <div className="h-14 bg-white/20 animate-pulse rounded-2xl"></div>
                }
              >
                <SearchBar />
              </Suspense>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto px-4">
            {[
              { label: "Tools", value: "200+" },
              { label: "Categories", value: TOTAL_CATEGORIES.toString() },
              { label: "Best Practices", value: "50+" },
              { label: "Resources", value: "100+" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-all"
              >
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </main>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 200"
            className="w-full h-auto fill-gray-50 dark:fill-gray-900"
          >
            <path d="M0,128L60,133.3C120,139,240,149,360,144C480,139,600,117,720,117.3C840,117,960,139,1080,138.7C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Filters Section with improved styling */}
      <div className="py-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <HomeFilters />
        </div>
      </div>

      {/* Categories Grid with enhanced cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Explore DevOps Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover specialized tools and resources organized by category to
            optimize your DevOps workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const data = categoryData[category];

            return (
              <Link
                key={category}
                href={`/${category}/`}
                className="group bg-white dark:bg-gray-800/80 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-700 relative overflow-hidden"
              >
                {/* Gradient background effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-5 relative z-10">
                  {/* Category Icon and Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/70 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 border border-blue-200 dark:border-blue-800">
                      <CategoryIcon category={category} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight capitalize">
                      {category.replace(/-/g, " ")}
                    </h2>
                  </div>

                  {/* Tool Count Badge */}
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium whitespace-nowrap shadow-sm border border-blue-200 dark:border-blue-800">
                    {data.toolCount}+ Tools
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[4rem] relative z-10">
                  {data.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Updated recently</span>
                  </div>
                  <span>•</span>
                  <span>5 min read</span>
                </div>

                {/* Explore Tools Button and Actions */}
                <ExploreButton category={category} />

                {/* Progress Bar - Enhanced */}
                <div className="mt-6 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative z-10">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-full"
                    style={{ width: `${Math.min(data.toolCount * 3, 100)}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured Section */}
      <div className="py-20 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 dark:bg-blue-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="relative p-8 md:p-12 lg:p-16">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M0 0h40v40H0z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Content */}
              <div className="relative">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Want to Contribute?
                </h2>
                <p className="text-blue-100 mb-8 max-w-2xl">
                  Help us make this resource better! Share your knowledge,
                  suggest improvements, or add new tools to help fellow DevOps
                  engineers.
                </p>
                <Link
                  href="https://github.com/yourusername/devops-cheatsheet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-200"
                >
                  <span>Contribute on GitHub</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
