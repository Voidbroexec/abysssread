"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ContentAPI } from "@/lib/api/content"
import type { Content } from "@/lib/supabase"

export default function SimplePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [allContent, setAllContent] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load content on page load
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await ContentAPI.getContent({ limit: 100 })
        setAllContent(data.data)
      } catch (error) {
        console.error("Error loading content:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadContent()
  }, [])

  // Filter content based on search
  const filteredContent = allContent.filter(
    (content) =>
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.author.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p>Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Simple Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold">AbyssRead</h1>
            </Link>

            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search manhwa/manga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Grid */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {searchQuery ? `Search Results (${filteredContent.length})` : `All Content (${allContent.length})`}
          </h2>
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No content found</h2>
            <p className="text-gray-400">
              {searchQuery ? "Try a different search term" : "Add some content using the scraper"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredContent.map((content) => (
              <SimpleContentCard key={content.id} content={content} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function SimpleContentCard({ content }: { content: Content }) {
  return (
    <Link href={`/${content.content_type}/${content.id}`}>
      <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 cursor-pointer transition-all">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={content.cover_url || "/placeholder.svg?height=300&width=200"}
              alt={content.title}
              width={200}
              height={300}
              className="w-full h-48 md:h-64 object-cover rounded-t-lg"
            />
            <Badge className="absolute top-2 left-2 bg-purple-600">{content.content_type.toUpperCase()}</Badge>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{content.title}</h3>
            <p className="text-xs text-gray-400 mb-2">{content.author}</p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span>{content.rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-400">Ch. {content.total_chapters}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
