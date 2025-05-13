import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllCheatsheets } from '@/utils/markdown';
import { categoryIcons } from '@/utils/categories';
import { toolIcons } from '@/utils/toolIcons';

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

  const getToolIcon = (slug: string) => {
    return toolIcons[slug] || toolIcons.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <div className="mb-12 bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-50 text-5xl">
              {categoryInfo.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {params.category.replace(/-/g, ' ')} Tools
              </h1>
              <p className="text-lg text-gray-600">
                {categoryInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryCheatsheets.map((cheatsheet) => {
            const toolIcon = getToolIcon(cheatsheet.slug);
            return (
              <Link
                key={cheatsheet.slug}
                href={`/${params.category}/${cheatsheet.slug}`}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-6">
                  {/* Tool Icon and Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${toolIcon.color} transition-colors duration-300`}>
                      <span className="text-2xl">{toolIcon.icon}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {cheatsheet.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 line-clamp-2">
                    {cheatsheet.description}
                  </p>

                  {/* View Button */}
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                    <span className="mr-2">View cheatsheet</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
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

                  {/* Bottom Border Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
} 