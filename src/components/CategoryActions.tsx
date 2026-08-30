'use client';

import { useState, useEffect } from 'react';
import { saveItem, removeItem, isItemSaved } from '@/utils/localStorage';
import { toast } from 'react-hot-toast';
import { Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface CategoryActionsProps {
  category: string;
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isItemSaved(category));
  }, [category]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/${category}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `DevOps Cheatsheet - ${category}`,
          text: `Check out these ${category} tools and resources!`,
          url: url,
        });
        toast.success('Shared successfully!');
      } catch {
        handleFallbackShare(url);
      }
    } else {
      handleFallbackShare(url);
    }
  };

  const handleFallbackShare = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleSave}
              aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
              className={isSaved ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
            />
          }
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSaved ? 'Remove from saved' : 'Save for later'}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleShare}
              aria-label="Share"
              className="text-muted-foreground hover:text-foreground"
            />
          }
        >
          <Share2 className="w-4 h-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Share category</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}