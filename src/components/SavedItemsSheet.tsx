'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Terminal, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSavedItems, removeItem, clearAllSavedItems } from '@/utils/localStorage';
import { toast } from 'react-hot-toast';

export function SavedItemsSheet() {
  const [savedItems, setSavedItems] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);

  const loadItems = React.useCallback(() => {
    setSavedItems(getSavedItems());
  }, []);

  React.useEffect(() => {
    loadItems();
    window.addEventListener('saved-items-changed', loadItems);
    return () => window.removeEventListener('saved-items-changed', loadItems);
  }, [loadItems]);

  const handleRemove = (item: string) => {
    removeItem(item);
    toast.success(`Removed from saved`);
  };

  const handleClearAll = () => {
    clearAllSavedItems();
    toast.success('Cleared all saved items');
  };

  const formatItemPath = (item: string) => {
    if (item.startsWith('/')) return item;
    return `/${item.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-2.5 rounded-xl border-border/60 bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground relative cursor-pointer gap-1.5 font-mono text-xs"
            aria-label="View Saved Cheatsheets"
          />
        }
      >
        <Bookmark className="w-3.5 h-3.5 text-cyan-500" />
        <span className="hidden xl:inline">Saved</span>
        {savedItems.length > 0 && (
          <Badge className="h-4 min-w-4 px-1 text-[9px] font-mono bg-cyan-500 text-white rounded-full flex items-center justify-center">
            {savedItems.length}
          </Badge>
        )}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-2xl border-l border-border/80 p-0 flex flex-col justify-between">
        <div>
          <SheetHeader className="p-6 border-b border-border/60">
            <div className="flex items-center gap-2 text-primary text-xs font-mono mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>SAVED REPOSITORIES</span>
            </div>
            <SheetTitle className="text-xl font-bold font-mono text-foreground flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-cyan-500 fill-cyan-500/20" />
              <span>Pinned Guides</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Your quick-access list of bookmarked DevOps categories and cheatsheets.
            </SheetDescription>
          </SheetHeader>

          {/* Items List */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)] space-y-3">
            {savedItems.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
                  <Bookmark className="w-6 h-6 opacity-40" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">No Pinned Guides Yet</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
                    Bookmark any category or cheatsheet to save it here for fast reference.
                  </p>
                </div>
                <Link href="/categories" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="mt-2 text-xs rounded-xl gap-2 font-mono">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Browse Categories</span>
                  </Button>
                </Link>
              </div>
            ) : (
              savedItems.map((item) => {
                const path = formatItemPath(item);
                return (
                  <div
                    key={item}
                    className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-all group"
                  >
                    <Link
                      href={path}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 min-w-0 flex-1 mr-2"
                    >
                      <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors capitalize">
                          {item.replace(/-/g, ' ')}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono truncate">
                          {path}
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center gap-1 shrink-0">
                      <Link href={path} onClick={() => setOpen(false)}>
                        <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground hover:text-primary">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemove(item)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer actions */}
        {savedItems.length > 0 && (
          <SheetFooter className="p-6 border-t border-border/60 bg-muted/20 flex flex-row items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              {savedItems.length} {savedItems.length === 1 ? 'guide' : 'guides'} pinned
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30 rounded-xl"
            >
              Clear All
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
