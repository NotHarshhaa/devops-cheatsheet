'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Share2,
  Bookmark,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Check,
  List,
  Download,
  Search
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { MarkdownContent } from '@/components/MarkdownContent';
import { CheatsheetIcon } from '@/components/CheatsheetIcon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { saveItem, removeItem, isItemSaved } from '@/utils/localStorage';

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
  slug: string;
  icon: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readingTime: string;
  popularity: number;
  rawMarkdown?: string;
  sections: CheatsheetSection[];
}

export function CheatsheetTemplate({
  title,
  category,
  slug,
  icon,
  description,
  difficulty,
  readingTime,
  popularity,
  rawMarkdown,
  sections
}: CheatsheetTemplateProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');

  // Bookmark key is the canonical URL of this cheatsheet, so the Saved
  // drawer can link straight back to it.
  const savedKey = `/${category}/${slug}`;

  // Handle localStorage bookmark sync
  useEffect(() => {
    setIsSaved(isItemSaved(savedKey));
    const handleStorageChange = () => setIsSaved(isItemSaved(savedKey));
    window.addEventListener('saved-items-changed', handleStorageChange);
    return () => window.removeEventListener('saved-items-changed', handleStorageChange);
  }, [savedKey]);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter sections that have actual content
  const filteredSections = useMemo(() => {
    return sections.filter(section => {
      if (section.type === 'list') {
        return Array.isArray(section.content[0]?.value) && section.content[0].value.length > 0;
      }
      return section.content[0]?.value && section.content[0].value.toString().trim() !== '';
    });
  }, [sections]);

  // In-page search filter
  const displayedSections = useMemo(() => {
    if (!searchFilter.trim()) return filteredSections;
    const q = searchFilter.toLowerCase();
    return filteredSections.filter(sec => {
      if (sec.title.toLowerCase().includes(q)) return true;
      return sec.content.some(c => {
        if (typeof c.value === 'string') return c.value.toLowerCase().includes(q);
        if (Array.isArray(c.value)) return c.value.some(v => v.toLowerCase().includes(q));
        return false;
      });
    });
  }, [filteredSections, searchFilter]);

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(id);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        });
        toast.success('Shared successfully!');
      } catch {
        handleFallbackShare();
      }
    } else {
      handleFallbackShare();
    }
  };

  const handleFallbackShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleSave = () => {
    if (isSaved) {
      removeItem(savedKey);
      setIsSaved(false);
      toast.success('Removed from bookmarks');
    } else {
      saveItem(savedKey);
      setIsSaved(true);
      toast.success('Added to bookmarks');
    }
  };

  const handleDownloadMarkdown = () => {
    if (rawMarkdown) {
      const blob = new Blob([rawMarkdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-cheatsheet.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Downloaded cheatsheet as Markdown!');
      return;
    }

    let md = `# ${title} Cheatsheet\n\n`;
    md += `> ${description}\n\n`;
    md += `- **Domain**: ${category}\n`;
    md += `- **Difficulty**: ${difficulty}\n`;
    md += `- **Estimated Reading Time**: ${readingTime}\n\n`;
    md += `---\n\n`;

    filteredSections.forEach((sec, idx) => {
      md += `## ${idx + 1}. ${sec.title}\n\n`;
      sec.content.forEach(item => {
        if (item.type === 'text' && item.value) {
          md += `${item.value}\n\n`;
        } else if (item.type === 'code' && item.value) {
          md += `\`\`\`bash\n${item.value}\n\`\`\`\n\n`;
        } else if (item.type === 'list' && Array.isArray(item.value)) {
          item.value.forEach(li => {
            md += `- ${li}\n`;
          });
          md += `\n`;
        }
      });
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-cheatsheet.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded cheatsheet as Markdown!');
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentSection > 0) {
      setCurrentSection(currentSection - 1);
      document.getElementById(`section-${currentSection - 1}`)?.scrollIntoView({ behavior: 'smooth' });
    } else if (direction === 'next' && currentSection < displayedSections.length - 1) {
      setCurrentSection(currentSection + 1);
      document.getElementById(`section-${currentSection + 1}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-border/40">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header HUD Card */}
        <Card className="rounded-3xl border-border/80 shadow-xl overflow-hidden mb-8 bg-card/80 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <CardContent className="p-6 sm:p-10 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                  <CheatsheetIcon icon={icon} className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs text-primary font-semibold">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{category.toUpperCase()} // GUIDE</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground mb-3 font-mono">
                    {title}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            </div>

            {/* Badges & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/60">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="secondary" className="px-3 py-1 font-mono text-xs font-semibold">
                  {category}
                </Badge>
                <Badge
                  variant={
                    difficulty === 'Beginner'
                      ? 'secondary'
                      : difficulty === 'Advanced'
                      ? 'destructive'
                      : 'outline'
                  }
                  className="px-3 py-1 font-mono text-xs font-semibold"
                >
                  {difficulty}
                </Badge>
                <Badge variant="outline" className="gap-1.5 px-3 py-1 font-mono text-xs">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  {readingTime}
                </Badge>
                <Badge variant="outline" className="gap-1.5 px-3 py-1 font-mono text-xs">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  {popularity}+ uses
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadMarkdown}
                  className="gap-2 rounded-xl border-border/80 font-medium text-xs cursor-pointer font-mono"
                  title="Download clean Markdown file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2 rounded-xl border-border/80 font-medium text-xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </Button>
                <Button
                  variant={isSaved ? "default" : "outline"}
                  size="sm"
                  onClick={handleSave}
                  className="gap-2 rounded-xl font-medium text-xs cursor-pointer"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* In-Cheatsheet Search Filter Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter commands & sections in this guide (e.g. prune, restart, exec)..."
              className="pl-10 h-10 text-xs sm:text-sm rounded-xl font-mono bg-card border-border/80"
            />
            {searchFilter && (
              <Badge 
                variant="secondary" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono"
              >
                {displayedSections.length} matched
              </Badge>
            )}
          </div>
        </div>

        {/* Reader Layout with Table of Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sticky Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-3">
                <List className="w-4 h-4 text-primary" />
                <span>On This Page ({displayedSections.length})</span>
              </div>
              <nav className="space-y-1 text-xs max-h-[65vh] overflow-y-auto">
                {displayedSections.map((sec, idx) => (
                  <a
                    key={sec.id}
                    href={`#section-${idx}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentSection(idx);
                      document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`block py-1.5 px-2.5 rounded-lg transition-colors font-medium ${
                      currentSection === idx 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-70 mr-1.5">{idx + 1}.</span>
                    {sec.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Sections */}
          <div className="lg:col-span-3 space-y-8">
            {displayedSections.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-2xl bg-card border border-border text-muted-foreground font-mono text-xs">
                No commands matching &quot;{searchFilter}&quot;. Clear your search filter to see all sections.
              </div>
            ) : (
              displayedSections.map((section, index) => (
                <Card
                  key={section.id}
                  id={`section-${index}`}
                  className="scroll-mt-28 rounded-2xl border-border/80 shadow-sm overflow-hidden hover:border-primary/40 transition-colors"
                >
                  <CardContent className="p-6 sm:p-8">
                    {/* Section Title Header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
                      <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {index + 1}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        {section.title}
                      </h2>
                    </div>

                    {/* Section Content Items */}
                    <div className="space-y-6">
                      {section.content.map((item, i) => (
                        <div key={i}>
                          {item.type === 'text' && item.value && (
                            <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm sm:text-base">
                              <MarkdownContent content={item.value as string} />
                            </div>
                          )}

                          {item.type === 'code' && item.value && (
                            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl overflow-hidden font-mono text-xs sm:text-sm text-zinc-200 my-4">
                              {/* Mac window header */}
                              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                  <span className="ml-2 text-xs text-zinc-400 font-sans">
                                    terminal snippet
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyCode(item.value as string, `${index}-${i}`)}
                                  className="h-7 px-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg gap-1.5 cursor-pointer font-sans"
                                >
                                  {copiedIndex === `${index}-${i}` ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-emerald-400">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                              <pre className="p-4 sm:p-5 overflow-x-auto text-zinc-200 leading-relaxed font-mono">
                                <code>{item.value as string}</code>
                              </pre>
                            </div>
                          )}

                          {item.type === 'list' && Array.isArray(item.value) && item.value.length > 0 && (
                            <ul className="space-y-2 my-3">
                              {item.value.map((tag: string, j: number) => (
                                <li 
                                  key={j}
                                  className="flex items-center gap-2.5 text-sm text-foreground"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                  <span>{tag}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Floating Bottom Section Navigation */}
        <div className="fixed bottom-6 right-6 flex items-center gap-2 z-40">
          <AnimatePresence>
            {currentSection > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleNavigation('prev')}
                className="gap-1.5 shadow-xl bg-background/95 backdrop-blur-md rounded-xl font-mono text-xs cursor-pointer border-border"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </Button>
            )}
            {currentSection < displayedSections.length - 1 && (
              <Button
                size="sm"
                onClick={() => handleNavigation('next')}
                className="gap-1.5 shadow-xl rounded-xl font-mono text-xs cursor-pointer bg-primary text-primary-foreground font-semibold"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}