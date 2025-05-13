import Link from 'next/link';
import { FaGithub, FaTelegram, FaLinkedin, FaRocket } from 'react-icons/fa';
import { HiChevronRight } from 'react-icons/hi';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <FaRocket className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">DevOps Cheatsheet</span>
            </Link>
            <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              A comprehensive collection of DevOps tools, best practices, and resources for
              modern software development and operations.
            </p>
            
            {/* Newsletter section - Consider adding this later */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white">Stay updated</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Follow our socials for the latest updates</p>
              <div className="flex gap-3 mt-4">
                <a 
                  href="https://github.com/NotHarshhaa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaGithub className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </a>
                <a 
                  href="https://t.me/NotHarshhaa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaTelegram className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </a>
                <a 
                  href="https://linkedin.com/in/harshhaa-vardhan-reddy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaLinkedin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/categories" 
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <HiChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Categories</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/search" 
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <HiChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Search</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contribute" 
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <HiChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Contribute</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Community</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://github.com/NotHarshhaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                    <FaGithub className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://t.me/prodevopsguy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                    <FaTelegram className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span>Telegram</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/in/harshhaa-vardhan-reddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                    <FaLinkedin className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} DevOps Cheatsheet. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-gray-500 dark:text-gray-400 text-sm">
            Made with ❤️ by H A R S H H A A
          </div>
        </div>
      </div>
    </footer>
  );
} 