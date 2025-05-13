'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Copy, Share2, Bookmark, ArrowRight, Github, Clock, BookOpen, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import DOMPurify from 'isomorphic-dompurify';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section without banner */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
              {icon}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{title}</h1>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm">
              {category}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              difficulty === 'Beginner' ? 'bg-green-500/20' :
              difficulty === 'Intermediate' ? 'bg-yellow-500/20' :
              'bg-red-500/20'
            }`}>
              {difficulty}
            </span>
            <span className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              {readingTime}
            </span>
            <span className="flex items-center gap-2 text-sm">
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
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200"
          >
            <Copy className="w-4 h-4" />
            Copy Code
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all border ${
              isSaved ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </motion.button>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {filteredSections.map((section, index) => (
            <section 
              key={section.id} 
              id={`section-${index}`}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8"
            >
              <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              <div className="space-y-6">
                {section.content.map((item, i) => (
                  <div key={i} className="mt-4">
                    {item.type === 'text' && item.value && (
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: DOMPurify.sanitize(item.value as string) 
                        }} 
                      />
                    )}
                    {item.type === 'list' && Array.isArray(item.value) && item.value.length > 0 && (
                      <ul className="list-disc pl-6">
                        {item.value.map((tag: string, j: number) => (
                          <li key={j}>{tag}</li>
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
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
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