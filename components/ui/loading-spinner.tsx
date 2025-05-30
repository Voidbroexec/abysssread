"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-purple-500/20"></div>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin"></div>
      <div className="absolute inset-1 rounded-full border border-transparent border-t-blue-400 animate-spin animation-delay-150"></div>
    </div>
  )
}

export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-2", className)}>
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-200"></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-400"></div>
    </div>
  )
}

export function WaveLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end space-x-1", className)}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-2 bg-gradient-to-t from-purple-600 to-blue-500 rounded-full animate-wave"
          style={{
            height: "20px",
            animationDelay: `${i * 0.1}s`,
          }}
        ></div>
      ))}
    </div>
  )
}

export function OrbitLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-12 h-12", className)}>
      <div className="absolute inset-0 rounded-full border border-purple-500/30"></div>
      <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 bg-purple-500 rounded-full animate-orbit"></div>
      <div className="absolute top-1/2 right-0 w-2 h-2 -mr-1 -mt-1 bg-blue-500 rounded-full animate-orbit-reverse"></div>
    </div>
  )
}
