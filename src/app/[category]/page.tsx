import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllCheatsheets } from '@/data/cheatsheets';
import { categoryIcons } from '@/utils/categories';
import { ArrowRight } from 'lucide-react';

interface Props {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: Props) {
  const cheatsheets = await getAllCheatsheets();
  const categoryCheatsheets = cheatsheets.filter(
    (cheatsheet) => cheatsheet.category === params.category
  );

  if (categoryCheatsheets.length === 0) {
    notFound();
  }

  const categoryInfo = categoryIcons[params.category as keyof typeof categoryIcons];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Header */}
        <div className="mb-8 sm:mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-4xl sm:text-5xl">
              {categoryInfo.icon}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {params.category.replace(/-/g, ' ')} Tools
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                {categoryInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoryCheatsheets.map((cheatsheet) => (
            <Link
              key={cheatsheet.slug}
              href={`/${params.category}/${cheatsheet.slug}`}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Tool Icon */}
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-2xl shrink-0">
                    {cheatsheet.icon}
                  </div>

                  {/* Tool Content */}
                  <div className="flex-1 min-w-0 w-full">
                    {/* Title and Difficulty */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {cheatsheet.title}
                      </h2>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                        cheatsheet.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                        cheatsheet.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                        'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                      }`}>
                        {cheatsheet.difficulty}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {cheatsheet.description}
                    </p>

                    {/* Tags and Action */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {cheatsheet.tags.slice(0, 2).map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 whitespace-nowrap">
                        View cheatsheet
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 