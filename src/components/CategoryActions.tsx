'use client';

import { useState, useEffect } from 'react';
import { saveItem, removeItem, isItemSaved } from '@/utils/localStorage';
import { toast } from 'react-hot-toast';

interface CategoryActionsProps {
  category: string;
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isItemSaved(category));
  }, [category]);

  const handleSave = () => {
    if (isSaved) {
      removeItem(category);
      setIsSaved(false);
      toast.success('Removed from saved items');
    } else {
      saveItem(category);
      setIsSaved(true);
      toast.success('Added to saved items');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${category}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `DevOps Cheatsheet - ${category}`,
          text: `Check out these ${category} tools and resources!`,
          url: url,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          handleFallbackShare(url);
        }
      }
    } else {
      handleFallbackShare(url);
    }
  };

  const handleFallbackShare = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className={`p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
          isSaved ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        title={isSaved ? 'Remove from saved' : 'Save for later'}
        onClick={handleSave}
      >
        <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
      <button
        className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        title="Share"
        onClick={handleShare}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>
    </div>
  );
} 