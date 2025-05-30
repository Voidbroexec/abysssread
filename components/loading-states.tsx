"use client"

import type React from "react"

import { LoadingSpinner, PulseLoader, WaveLoader, OrbitLoader } from "@/components/ui/loading-spinner"
import { ManhwaCardSkeleton, ContinueCardSkeleton } from "@/components/ui/skeleton"
import { Sparkles, BookOpen } from "lucide-react"

export function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <BookOpen className="h-16 w-16 text-purple-400 mx-auto animate-bounce" />
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-purple-300 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold gradient-text">Loading AbyssRead</h2>
          <p className="text-purple-300/70">Preparing your reading experience...</p>
        </div>
        <OrbitLoader className="mx-auto" />
      </div>
    </div>
  )
}

export function LibraryLoader() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <LoadingSpinner size="sm" />
        <span className="text-purple-300/70">Loading library...</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {[...Array(12)].map((_, i) => (
          <ManhwaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function ContinueReadingLoader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <WaveLoader />
        <span className="text-purple-300/70">Loading your progress...</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ContinueCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function SearchLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-purple-300/70">Searching manhwa...</p>
      </div>
    </div>
  )
}

export function ChapterLoader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <PulseLoader />
        <span className="text-purple-300/70">Loading chapters...</span>
      </div>
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30 border border-purple-500/20"
          >
            <div className="space-y-1 flex-1">
              <div className="h-4 bg-gradient-to-r from-purple-900/40 via-purple-800/50 to-purple-900/40 rounded animate-shimmer bg-[length:200%_100%] w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-purple-900/40 via-purple-800/50 to-purple-900/40 rounded animate-shimmer bg-[length:200%_100%] w-1/2"></div>
            </div>
            <div className="h-6 w-12 bg-gradient-to-r from-purple-900/40 via-purple-800/50 to-purple-900/40 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ButtonLoader({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-600/20 rounded">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>{children}</div>
    </div>
  )
}
