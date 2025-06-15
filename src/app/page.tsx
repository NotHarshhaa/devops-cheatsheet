import { SearchBar } from "@/components/SearchBar";
import { HomeFilters } from "@/components/HomeFilters";
import Link from "next/link";
import { categories, TOTAL_CATEGORIES, categoryData } from "@/utils/categoryData";
import { ArrowRight, Sparkles, ChevronUp } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Suspense, useEffect, useState } from "react";
import { ExploreButton } from "@/components/ExploreButton";

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

// Particle component for the hero section
const Particle = ({ className = "" }) => (
  <div className={`absolute rounded-full mix-blend-plus-lighter filter blur-3xl opacity-20 ${className}`} />
);

// This ensures the page is static and not server-rendered
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Floating Navigation */}
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href="#top"
          className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          <ChevronUp className="w-6 h-6" />
        </a>
      </div>

      {/* Hero Section with Search */}
      <div id="top" className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <Particle className="w-[800px] h-[800px] bg-purple-500/20 top-[-400px] right-[-200px]" />
          <Particle className="w-[600px] h-[600px] bg-blue-500/20 bottom-[-300px] left-[-200px]" />
        </div>

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat [mask-image:radial-gradient(white,transparent_90%)] pointer-events-none opacity-20"
          style={{ backgroundSize: '30px 30px' }}
        />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-40">
          {/* Supercharge Badge */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 blur-lg bg-yellow-200/30 rounded-full"></div>
              <div className="relative flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium text-white">Supercharge your DevOps workflow</span>
              </div>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-center text-7xl sm:text-8xl font-black mb-8 text-white">
            DevOps Tools<br />Cheatsheet
          </h1>

          <p className="text-center text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            A comprehensive collection of DevOps tools, best practices, and
            resources for modern software development and operations.
          </p>

          {/* Search Bar Component with enhanced styling */}
          <div className="relative max-w-2xl mx-auto mb-24">
            <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-xl opacity-50"></div>
            <Suspense
              fallback={
                <div className="h-14 bg-white/20 animate-pulse rounded-2xl"></div>
              }
            >
              <SearchBar />
            </Suspense>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto relative z-20">
            {[
              { label: "Tools", value: "200+" },
              { label: "Categories", value: "8" },
              { label: "Best Practices", value: "50+" },
              { label: "Resources", value: "100+" },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-lg"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="text-4xl font-black text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-40">
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              className="fill-white dark:fill-gray-900"
              d="M0,32L48,42.7C96,53,192,75,288,101.3C384,128,480,160,576,165.3C672,171,768,149,864,128C960,107,1056,85,1152,80C1248,75,1344,85,1392,90.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Rest of the content */}
      <div className="bg-gray-50 dark:bg-gray-900">
        {/* Filters Section */}
        <div className="py-16 backdrop-blur-lg border-t border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <HomeFilters />
          </div>
        </div>

        {/* Categories Grid with enhanced cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
              Explore DevOps Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
                  className="block"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 h-full hover:shadow-lg relative group">
                    {/* Top section with icon and badge */}
                    <div className="flex items-start justify-between mb-6">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <div className="w-6 h-6 text-blue-600 dark:text-blue-400">
                          <CategoryIcon category={category} />
                        </div>
                      </div>
                      
                      {/* Tool Count Badge */}
                      <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                        {data.toolCount}+ Tools
                      </div>
                    </div>

                    {/* Category Title */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 capitalize">
                      {category.replace(/-/g, " ")}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                      {data.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Updated recently</span>
                      </div>
                      <span>5 min read</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                        <span>Explore tools</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 ml-auto">
                        <button className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                          </svg>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ width: `${Math.min(data.toolCount * 3, 100)}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Featured Section */}
        <div className="py-24 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative p-12 md:p-16 lg:p-20">
                  {/* Enhanced Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h2 className="text-4xl font-black text-white mb-8">
                      Want to Contribute?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl font-light leading-relaxed">
                      Help us make this resource better! Share your knowledge,
                      suggest improvements, or add new tools to help fellow DevOps
                      engineers.
                    </p>
                    <Link
                      href="https://github.com/yourusername/devops-cheatsheet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl transition-all duration-300 text-lg font-medium group border border-white/20 hover:border-white/40"
                    >
                      <span>Contribute on GitHub</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add these styles to your global CSS
const styles = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-gradient {
  background-size: 200% auto;
  animation: shimmer 2s linear infinite;
}

.bg-grid-white\/10 {
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}
`;
