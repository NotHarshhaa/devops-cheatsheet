export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header Skeleton */}
        <div className="mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-800 animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
            </div>
          </div>
        </div>

        {/* Tools Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
              <div className="mt-6 flex items-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full ml-2"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 