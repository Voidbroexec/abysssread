"use client"

import type React from "react"

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-purple-900/20 via-purple-800/30 to-purple-900/20 bg-[length:200%_100%] animate-shimmer",
        className,
      )}
      {...props}
    />
  )
}

function ManhwaCardSkeleton() {
  return (
    <div className="card-3d bg-gray-900/50 border-purple-500/20 glass-effect rounded-lg overflow-hidden">
      <div className="relative">
        <Skeleton className="w-full h-48 md:h-64" />
        <div className="absolute top-2 right-2">
          <Skeleton className="w-12 h-6 rounded-full" />
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

function ContinueCardSkeleton() {
  return (
    <div className="card-3d bg-gray-900/50 border-purple-500/20 glass-effect rounded-lg p-4">
      <div className="flex space-x-4">
        <Skeleton className="w-16 h-24 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="space-y-1">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          <Skeleton className="h-8 w-full rounded" />
        </div>
      </div>
    </div>
  )
}

export { Skeleton, ManhwaCardSkeleton, ContinueCardSkeleton }
