'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Content } from '@/lib/supabase';
import Link from 'next/link';

interface MangaClientProps {
  manga: Content;
  chapters: any[];
}

export default function MangaClient({ manga, chapters }: MangaClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-300 hover:text-purple-100 hover:bg-purple-600/20"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold gradient-text">{manga.title}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cover Image */}
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden glass-effect border border-purple-500/20">
            <img
              src={manga.cover_image || "/placeholder.svg"}
              alt={manga.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-200">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-purple-300">Author</p>
                  <p className="text-white">{manga.author || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-300">Status</p>
                  <p className="text-white capitalize">{manga.status}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-300">Rating</p>
                  <p className="text-white">{manga.rating.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-300">Total Chapters</p>
                  <p className="text-white">{manga.total_chapters}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-purple-200">Description</h2>
              <p className="text-gray-300 leading-relaxed">{manga.description}</p>
            </div>

            {/* Genres */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-purple-200">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {manga.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-full text-sm bg-purple-500/20 border border-purple-500/30 text-purple-200"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold gradient-text">Chapters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((chapter) => (
              <Button
                key={chapter.id}
                variant="outline"
                className="w-full justify-start text-left glass-effect border-purple-500/20 hover:bg-purple-600/20"
                asChild
              >
                <a href={`/reader/${manga.id}/${chapter.chapter_number}`}>
                  <span>Chapter {chapter.chapter_number}</span>
                  {chapter.title && <span className="ml-2 text-purple-300">- {chapter.title}</span>}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 