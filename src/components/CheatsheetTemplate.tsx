'use client';

import { motion } from 'framer-motion';
import { Copy, Share2, Bookmark, Clock, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import DOMPurify from 'isomorphic-dompurify';

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
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 10;
  }

  pre:hover .copy-button {
    opacity: 1;
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
      {/* Include the style tag for dark mode styles */}
      <style dangerouslySetInnerHTML={{ __html: darkModeStyles }} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section without banner */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
              {icon}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold dark:text-white">{title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-3 py-1 bg-blue-500/20 dark:bg-blue-500/30 rounded-full text-sm dark:text-blue-300">
              {category}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              difficulty === 'Beginner' ? 'bg-green-500/20 dark:bg-green-500/30 dark:text-green-300' :
              difficulty === 'Intermediate' ? 'bg-yellow-500/20 dark:bg-yellow-500/30 dark:text-yellow-300' :
              'bg-red-500/20 dark:bg-red-500/30 dark:text-red-300'
            }`}>
              {difficulty}
            </span>
            <span className="flex items-center gap-2 text-sm dark:text-gray-300">
              <Clock className="w-4 h-4" />
              {readingTime}
            </span>
            <span className="flex items-center gap-2 text-sm dark:text-gray-300">
              <Star className="w-4 h-4" />
              {popularity}+ uses
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCopyCode('example-code')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
          >
            <Copy className="w-4 h-4" />
            Copy Code
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all border ${
              isSaved ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </motion.button>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {filteredSections.map((section, index) => (
            <section 
              key={section.id} 
              id={`section-${index}`}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-8"
            >
              <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              <div className="space-y-6">
                {section.content.map((item, i) => (
                  <div key={i} className="mt-4">
                    {item.type === 'text' && item.value && (
                      <div 
                        className="prose max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ 
                          __html: DOMPurify.sanitize(item.value as string) 
                        }} 
                        style={{ color: 'inherit' }}
                        ref={(el) => {
                          // Add copy buttons to code blocks rendered within HTML content
                          if (el) {
                            const codeBlocks = el.querySelectorAll('pre code');
                            codeBlocks.forEach((codeBlock, index) => {
                              const pre = codeBlock.parentElement;
                              if (pre && !pre.querySelector('.copy-button')) {
                                // Create container for position relative
                                pre.style.position = 'relative';
                                
                                // Create copy button
                                const copyButton = document.createElement('button');
                                copyButton.className = 'copy-button p-2 bg-white/90 dark:bg-gray-700/90 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 absolute top-2 right-2';
                                copyButton.setAttribute('aria-label', 'Copy code');
                                copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                                
                                // Add click event
                                copyButton.addEventListener('click', () => {
                                  const code = codeBlock.textContent || '';
                                  navigator.clipboard.writeText(code);
                                  toast.success('Code copied to clipboard!');
                                });
                                
                                // Append button to pre element
                                pre.appendChild(copyButton);
                              }
                            });
                          }
                        }}
                      />
                    )}
                    {item.type === 'code' && item.value && (
                      <div className="relative mt-4">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                          <pre className="p-4 overflow-x-auto text-gray-900 dark:text-gray-100" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent' }}>
                            <code className="text-sm leading-relaxed font-mono">{item.value as string}</code>
                          </pre>
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => handleCopyCode(item.value as string)}
                              className="p-2 bg-white/90 dark:bg-gray-700/90 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200"
                              aria-label="Copy code"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {item.type === 'list' && Array.isArray(item.value) && item.value.length > 0 && (
                      <ul className="list-disc pl-6 dark:text-gray-300">
                        {item.value.map((tag: string, j: number) => (
                          <li key={j} className="text-gray-800 dark:text-gray-300 mb-1">{tag}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-8 right-8 flex gap-4">
          {currentSection > 0 && (
            <button
              onClick={() => handleNavigation('prev')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
          )}
          {currentSection < filteredSections.length - 1 && (
            <button
              onClick={() => handleNavigation('next')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
              Next Section
            </button>
          )}
        </div>
      </main>
    </div>
  );
} 