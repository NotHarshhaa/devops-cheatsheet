import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              About
            </h3>
            <p className="mt-4 text-base text-gray-500">
              A comprehensive collection of DevOps tools and best practices for modern software development and operations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/categories" className="text-base text-gray-500 hover:text-gray-900">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-base text-gray-500 hover:text-gray-900">
                  Search
                </Link>
              </li>
              <li>
                <Link href="https://github.com/NotHarshhaa/devops-cheatsheet" 
                      className="text-base text-gray-500 hover:text-gray-900"
                      target="_blank"
                      rel="noopener noreferrer">
                  GitHub Repository
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Connect
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="https://github.com/NotHarshhaa" 
                   className="text-base text-gray-500 hover:text-gray-900"
                   target="_blank"
                   rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://blog.prodevopsguy.xyz" 
                   className="text-base text-gray-500 hover:text-gray-900"
                   target="_blank"
                   rel="noopener noreferrer">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://t.me/prodevopsguy" 
                   className="text-base text-gray-500 hover:text-gray-900"
                   target="_blank"
                   rel="noopener noreferrer">
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} DevOps Cheatsheet. Built with ❤️ by{' '}
            <a href="https://github.com/NotHarshhaa" 
               className="text-primary hover:text-primary-dark"
               target="_blank"
               rel="noopener noreferrer">
              Harshhaa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
} 