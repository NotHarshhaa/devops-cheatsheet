import { getAllCheatsheets } from '@/utils/markdown';
import { categories, categoryIcons } from '@/utils/categories';
import { CategoryCard } from '@/components/CategoryCard';

export default async function CategoriesPage() {
  const cheatsheets = await getAllCheatsheets();
  const categoriesMap = cheatsheets.reduce((acc, cheatsheet) => {
    if (!acc[cheatsheet.category]) {
      acc[cheatsheet.category] = [];
    }
    acc[cheatsheet.category].push(cheatsheet);
    return acc;
  }, {} as Record<string, typeof cheatsheets>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-bold mb-6">
            DevOps Categories
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Explore our comprehensive collection of DevOps tools and resources, organized by category.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          DevOps Categories
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const info = categoryIcons[category];
            return (
              <CategoryCard
                key={category}
                icon={info.icon}
                title={category.replace(/-/g, ' ')}
                description={info.description}
                toolCount={info.toolCount}
                category={category}
              />
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {Object.values(categoriesMap).reduce((acc, curr) => acc + curr.length, 0)}+
              </div>
              <div className="text-gray-400">Total Tools</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {Object.keys(categoriesMap).length}
              </div>
              <div className="text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">
                24/7
              </div>
              <div className="text-gray-400">Community Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 