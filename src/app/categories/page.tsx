import { Search, Filter, Tag, ArrowDown, Grid3X3, List } from "lucide-react";
import { categories, categoryData } from "@/utils/categoryData";
import { CategoryCard } from "@/components/CategoryCard";
import { cheatsheets } from "@/data/cheatsheets";

export default function CategoriesPage() {
  const categoriesMap = cheatsheets.reduce(
    (acc, cheatsheet) => {
      if (!acc[cheatsheet.category]) {
        acc[cheatsheet.category] = [];
      }
      acc[cheatsheet.category].push(cheatsheet);
      return acc;
    },
    {} as Record<string, typeof cheatsheets>,
  );

  const totalTools = Object.values(categoriesMap).reduce(
    (acc, curr) => acc + curr.length,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/20">
      {/* Hero Section with Background */}
      <section className="relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 top-10 w-40 h-40 rounded-full bg-blue-400/10 dark:bg-blue-400/10 blur-3xl"></div>
          <div className="absolute right-0 bottom-0 w-60 h-60 rounded-full bg-purple-400/10 dark:bg-purple-400/10 blur-3xl"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 dark:opacity-10"></div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="text-center md:text-left md:flex items-center justify-between">
              <div className="mb-8 md:mb-0">
                <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                  <Tag className="w-4 h-4 text-blue-200 mr-2" />
                  <span className="text-sm font-medium">
                    Explore & Discover
                  </span>
                </div>

                <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  DevOps Categories
                </h1>
                <p className="text-xl text-blue-100 max-w-3xl">
                  Explore our comprehensive collection of DevOps tools and
                  resources, organized by category to supercharge your workflow.
                </p>
              </div>

              <div className="hidden md:block">
                <div className="w-64 h-64 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">
                      {totalTools}+
                    </div>
                    <div className="text-blue-100">Tools & Resources</div>
                    <div className="mt-4 text-white/60">
                      {categories.length} Categories
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <ArrowDown className="w-6 h-6 text-white animate-bounce" />
            </div>
          </div>

          {/* Wave divider */}
          <div className="relative w-full">
            <svg
              className="w-full h-auto text-gray-50 dark:text-gray-900 fill-current"
              viewBox="0 0 1440 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0,64L60,64C120,64,240,64,360,58.7C480,53,600,43,720,42.7C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const info = categoryData[category];
            return (
              <div
                key={category}
                className="transform hover:-translate-y-2 transition-transform duration-300"
              >
                <CategoryCard
                  title={category === 'CI-CD' ? 'CI/CD' : category.replace(/-/g, " ")}
                  description={info.description}
                  toolCount={info.toolCount}
                  category={category}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 dark:bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-blue-400 mb-2">
                {totalTools}+
              </div>
              <div className="text-gray-400">Total Tools</div>
              <div className="mt-4 text-sm text-gray-500">
                Curated resources for DevOps professionals
              </div>
            </div>

            <div className="bg-gray-800/50 dark:bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-purple-400 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-400">Categories</div>
              <div className="mt-4 text-sm text-gray-500">
                Organized for easy discovery
              </div>
            </div>

            <div className="bg-gray-800/50 dark:bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400">Community Support</div>
              <div className="mt-4 text-sm text-gray-500">
                Always here to help you succeed
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
