'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Share2, Bookmark, Clock, Star, ChevronRight, ChevronLeft, Activity, Box, Cloud, Shield, GitBranch, Server, Network, BarChart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DOMPurify from 'isomorphic-dompurify';
import { MarkdownContent } from '@/components/MarkdownContent';

// Define the CSS for dark mode and scrollbars
const darkModeStyles = `
  .dark .prose {
    color: rgba(229, 231, 235, 1);
  }
  
  .dark .prose strong {
    color: white;
  }
  
  .dark .prose h1,
  .dark .prose h2,
  .dark .prose h3,
  .dark .prose h4 {
    color: white;
  }
  
  .dark .prose a {
    color: #93c5fd;
  }
  
  .dark .prose code {
    color: #e5e7eb;
    background-color: rgba(31, 41, 55, 0.5);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
  }

  .dark .prose p {
    color: rgba(229, 231, 235, 1);
  }

  .dark .prose li {
    color: rgba(229, 231, 235, 1);
  }

  .dark .prose blockquote {
    color: rgba(209, 213, 219, 1);
    border-left-color: rgba(75, 85, 99, 1);
  }
  
  /* Custom scrollbar for code blocks */
  pre::-webkit-scrollbar {
    height: 10px;
  }
  
  pre::-webkit-scrollbar-track {
    background: transparent;
  }
  
  pre::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }
  
  .dark pre::-webkit-scrollbar-thumb {
    background-color: rgba(75, 85, 99, 0.7);
  }
  
  pre::-webkit-scrollbar-thumb:hover {
    background-color: rgba(107, 114, 128, 0.7);
  }
  
  .dark pre::-webkit-scrollbar-thumb:hover {
    background-color: rgba(107, 114, 128, 0.8);
  }

  /* Improved code blocks */
  .dark pre {
    background-color: #1e293b !important;
    border: 1px solid #334155 !important;
    position: relative;
  }

  .dark pre code {
    color: #e2e8f0 !important;
    background-color: transparent !important;
    padding: 0 !important;
  }

  /* Copy button styles */
  .copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(229, 231, 235, 0.1);
    border-radius: 6px;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    z-index: 10;
  }

  .copy-button:hover {
    background-color: rgba(229, 231, 235, 0.2);
  }

  .dark .copy-button {
    background-color: rgba(51, 65, 85, 0.9);
    color: rgba(226, 232, 240, 1);
  }

  .dark .copy-button:hover {
    background-color: rgba(71, 85, 105, 0.9);
  }
`;

interface CheatsheetSection {
  type: string;
  id: string;
  title: string;
  content: {
    type: 'text' | 'code' | 'list';
    value: string | string[];
  }[];
}

interface CheatsheetTemplateProps {
  title: string;
  category: string;
  icon: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readingTime: string;
  popularity: number;
  sections: CheatsheetSection[];
}

// Helper function to get the icon component
const getIconComponent = (iconString: string) => {
  const iconMap = {
    '<Activity />': Activity,
    '<Box />': Box,
    '<Cloud />': Cloud,
    '<Shield />': Shield,
    '<GitBranch />': GitBranch,
    '<Server />': Server,
    '<Network />': Network,
    '<BarChart />': BarChart,
  };
  
  const IconComponent = iconMap[iconString as keyof typeof iconMap];
  return IconComponent ? <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" /> : null;
};

export function CheatsheetTemplate({
  title,
  category,
  icon,
  description,
  difficulty,
  readingTime,
  popularity,
  sections
}: CheatsheetTemplateProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show sections that have content
  const filteredSections = sections.filter(section => {
    if (section.type === 'list') {
      return Array.isArray(section.content[0]?.value) && section.content[0].value.length > 0;
    }
    return section.content[0]?.value && section.content[0].value.toString().trim() !== '';
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentSection > 0) {
      setCurrentSection(currentSection - 1);
      document.getElementById(`section-${currentSection - 1}`)?.scrollIntoView({ behavior: 'smooth' });
    } else if (direction === 'next' && currentSection < filteredSections.length - 1) {
      setCurrentSection(currentSection + 1);
      document.getElementById(`section-${currentSection + 1}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: darkModeStyles }} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 mb-8 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10" />
          
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-0.5"
              >
                <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  {getIconComponent(icon)}
                </div>
              </motion.div>
              <div className="flex-1">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                >
                  {title}
                </motion.h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">{description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {category}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' :
                'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
              }`}>
                {difficulty}
              </span>
              <span className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4" />
                {readingTime}
              </span>
              <span className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 text-yellow-500" />
                {popularity}+ uses
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
            onClick={() => handleCopyCode('example-code')}
          >
            <Copy className="w-5 h-5" />
            Copy Code
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all ${
              isSaved 
                ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </motion.button>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <AnimatePresence mode="wait">
            {filteredSections.map((section, index) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                id={`section-${index}`}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 mb-8 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.content.map((item, i) => (
                    <div key={i} className="mt-4">
                      {item.type === 'text' && item.value && (
                        <MarkdownContent content={item.value as string} />
                      )}
                      {item.type === 'code' && item.value && (
                        <div className="relative mt-6 group">
                          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
                          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-200/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                              <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                              </div>
                              <button
                                onClick={() => handleCopyCode(item.value as string)}
                                className="copy-button"
                                aria-label="Copy code"
                              >
                                <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                              </button>
                            </div>
                            <pre className="p-4 overflow-x-auto text-gray-900 dark:text-gray-100 relative">
                              <code className="text-sm leading-relaxed font-mono">{item.value as string}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                      {item.type === 'list' && Array.isArray(item.value) && item.value.length > 0 && (
                        <ul className="space-y-2">
                          {item.value.map((tag: string, j: number) => (
                            <li 
                              key={j}
                              className="flex items-center gap-2 text-gray-800 dark:text-gray-300"
                            >
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-8 right-8 flex gap-4">
          <AnimatePresence>
            {currentSection > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => handleNavigation('prev')}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </motion.button>
            )}
            {currentSection < filteredSections.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => handleNavigation('next')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
              >
                Next Section
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
} 