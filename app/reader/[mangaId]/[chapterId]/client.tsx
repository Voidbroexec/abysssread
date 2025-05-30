'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowLeft as ArrowBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface ReaderClientProps {
  chapter: {
    id: string;
    chapter_number: string;
    title: string;
    pages: string[];
  };
  mangaId: string;
}

export default function ReaderClient({ chapter, mangaId }: ReaderClientProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrollMode, setIsScrollMode] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const nextPage = () => {
    if (!isScrollMode && currentPage < chapter.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (!isScrollMode && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle keyboard navigation
  const handleKeyPress = (e: KeyboardEvent) => {
    if (isScrollMode) return;
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextPage();
    } else if (e.key === 'ArrowLeft') {
      prevPage();
    }
  };

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isScrollMode]);

  // Handle image loading
  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
    if (index === currentPage) {
      setIsLoading(false);
    }
  };

  const handleImageError = (index: number) => {
    console.error(`Error loading image ${index}`);
    setLoadedImages(prev => ({ ...prev, [index]: false }));
    if (index === currentPage) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/manga/${mangaId}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-300 hover:text-purple-100 hover:bg-purple-600/20"
                >
                  <ArrowBack className="h-5 w-5 mr-1" />
                  Back to Manga
                </Button>
              </Link>
              <h1 className="text-xl font-bold gradient-text">
                Chapter {chapter.chapter_number}
                {chapter.title && <span className="ml-2 text-purple-300">- {chapter.title}</span>}
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="scroll-mode"
                  checked={isScrollMode}
                  onCheckedChange={setIsScrollMode}
                  className="data-[state=checked]:bg-purple-600"
                />
                <Label htmlFor="scroll-mode" className="text-sm text-purple-200">
                  Scroll Mode
                </Label>
              </div>
              {!isScrollMode && (
                <div className="text-sm text-purple-300">
                  Page {currentPage + 1} of {chapter.pages.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Reader */}
      <main className="container mx-auto px-4 py-8">
        <div className={`relative max-w-4xl mx-auto ${isScrollMode ? 'space-y-8' : ''}`}>
          {!isScrollMode && (
            <>
              {/* Navigation buttons */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="text-purple-300 hover:text-purple-100 hover:bg-purple-600/20"
                >
                  <ArrowLeft className="h-8 w-8" />
                </Button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={nextPage}
                  disabled={currentPage === chapter.pages.length - 1}
                  className="text-purple-300 hover:text-purple-100 hover:bg-purple-600/20"
                >
                  <ArrowRight className="h-8 w-8" />
                </Button>
              </div>
            </>
          )}

          {/* Page images */}
          {isScrollMode ? (
            // Scroll mode - show all pages
            chapter.pages.map((page, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden glass-effect border border-purple-500/20"
              >
                {(!loadedImages[index] || isLoading) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                    <div className="loading-spinner" />
                  </div>
                )}
                <img
                  src={page}
                  alt={`Page ${index + 1}`}
                  className="w-full h-auto"
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              </div>
            ))
          ) : (
            // Single page mode
            <div className="relative aspect-auto rounded-lg overflow-hidden glass-effect border border-purple-500/20">
              {(!loadedImages[currentPage] || isLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                  <div className="loading-spinner" />
                </div>
              )}
              <img
                src={chapter.pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-auto"
                onLoad={() => handleImageLoad(currentPage)}
                onError={() => handleImageError(currentPage)}
              />
            </div>
          )}

          {/* Mobile navigation */}
          {!isScrollMode && (
            <div className="mt-6 flex justify-center space-x-4 md:hidden">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="glass-effect border-purple-500/20 hover:bg-purple-600/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === chapter.pages.length - 1}
                className="glass-effect border-purple-500/20 hover:bg-purple-600/20"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 