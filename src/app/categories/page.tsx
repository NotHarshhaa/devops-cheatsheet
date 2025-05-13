import { getAllCheatsheets } from '@/utils/markdown';
import Link from 'next/link';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        DevOps Categories
      </h1>

      <div className="space-y-12">
        {Object.entries(categoriesMap).map(([category, categoryCheatsheets]) => (
          <div key={category} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryCheatsheets.map((cheatsheet) => (
                <Link
                  key={cheatsheet.slug}
                  href={`/${category}/${cheatsheet.slug}`}
                  className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{cheatsheet.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {cheatsheet.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {cheatsheet.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 