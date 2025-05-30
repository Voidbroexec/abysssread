"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, Star, Clock, TrendingUp, Heart, ThumbsUp, Sparkles, Book, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { LoginDialog } from "@/components/auth/login-dialog"
import { UserMenu } from "@/components/auth/user-menu"
import { LibraryLoader, ContinueReadingLoader, SearchLoader, PageLoader } from "@/components/loading-states"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ContentAPI, UserAPI } from "@/lib/api"
import type { Content } from "@/lib/supabase"
import { SetupBanner } from "@/components/setup-banner"
import { Pagination } from "@/components/ui/pagination"

export default function HomePage() {
  const { user, isFavorite, isLiked } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("library")
  const [contentType, setContentType] = useState<"manhwa" | "manga">("manhwa")
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [tabLoading, setTabLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 24

  // Real data from Supabase
  const [allContent, setAllContent] = useState<Content[]>([])
  const [trendingContent, setTrendingContent] = useState<Content[]>([])
  const [newContent, setNewContent] = useState<Content[]>([])
  const [continueReading, setContinueReading] = useState<any[]>([])
  const [searchResults, setSearchResults] = useState<Content[]>([])

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Load all content with pagination
        const [allData, trendingData, newData] = await Promise.all([
          ContentAPI.getContent({ 
            limit: itemsPerPage, 
            offset: (currentPage - 1) * itemsPerPage,
            contentType 
          }),
          ContentAPI.getTrendingContent(contentType, 12),
          ContentAPI.getNewReleases(contentType, 12),
        ])

        console.log('Content data:', {
          all: allData.data,
          trending: trendingData,
          new: newData
        })

        setAllContent(allData.data)
        setTotalPages(Math.ceil(allData.count / itemsPerPage))
        setTrendingContent(trendingData)
        setNewContent(newData)

        // Load continue reading if user is logged in
        if (user) {
          const continueData = await UserAPI.getContinueReading(user.id, 10)
          setContinueReading(continueData)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user, contentType, currentPage])

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true)
        try {
          const results = await ContentAPI.searchContent(searchQuery, contentType, itemsPerPage, (currentPage - 1) * itemsPerPage)
          setSearchResults(results.data)
          setTotalPages(Math.ceil(results.count / itemsPerPage))
        } catch (error) {
          console.error("Error searching:", error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setIsSearching(false)
        // Reset to initial data pagination
        const allData = await ContentAPI.getContent({ 
          limit: itemsPerPage, 
          offset: (currentPage - 1) * itemsPerPage,
          contentType 
        })
        setAllContent(allData.data)
        setTotalPages(Math.ceil(allData.count / itemsPerPage))
      }
    }

    const debounceTimer = setTimeout(handleSearch, 500)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, contentType, currentPage])

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setTabLoading(true)
    setTimeout(() => {
      setActiveTab(value)
      setCurrentPage(1) // Reset to first page when changing tabs
      setTabLoading(false)
    }, 300)
  }

  // Handle content type change
  const handleContentTypeChange = (type: "manhwa" | "manga") => {
    setContentType(type)
    setSearchQuery("")
    setSearchResults([])
    setCurrentPage(1) // Reset to first page when changing content type
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return <PageLoader />
  }

  const displayContent = searchQuery ? searchResults : allContent

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white page-transition">
      <SetupBanner />
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full floating opacity-60"></div>
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-500 rounded-full floating opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400 rounded-full floating opacity-50"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-purple-300 hover:text-purple-100 hover:bg-purple-600/20"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </Button>
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <BookOpen className="h-8 w-8 text-purple-400 pulse-glow group-hover:scale-110 transition-transform duration-300" />
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-purple-300 animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300 cursor-pointer">
                  AbyssRead
                </h1>
              </Link>
            </div>

            {/* Content Type Toggle */}
            <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-1 glass-effect border border-purple-500/20">
              <Button
                variant={contentType === "manhwa" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleContentTypeChange("manhwa")}
                className={`button-3d ${
                  contentType === "manhwa"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "text-purple-200 hover:bg-purple-600/20"
                }`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Manhwa
              </Button>
              <Button
                variant={contentType === "manga" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleContentTypeChange("manga")}
                className={`button-3d ${
                  contentType === "manga"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "text-purple-200 hover:bg-purple-600/20"
                }`}
              >
                <Book className="h-4 w-4 mr-2" />
                Manga
              </Button>
            </div>

            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                {isSearching && (
                  <LoadingSpinner size="sm" className="absolute right-3 top-1/2 transform -translate-y-1/2" />
                )}
                <Input
                  placeholder={`Search ${contentType}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-gray-900/50 border-purple-500/30 text-white placeholder-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20 glass-effect"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu />
              {!user && <LoginDialog />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 glass-effect border border-purple-500/20">
            <TabsTrigger
              value="library"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 relative"
            >
              {tabLoading && activeTab === "library" && <LoadingSpinner size="sm" className="absolute left-2" />}
              Library
            </TabsTrigger>
            <TabsTrigger
              value="continue"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 relative"
            >
              {tabLoading && activeTab === "continue" && <LoadingSpinner size="sm" className="absolute left-2" />}
              Continue
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 relative"
            >
              {tabLoading && activeTab === "new" && <LoadingSpinner size="sm" className="absolute left-2" />}
              New
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 relative"
            >
              {tabLoading && activeTab === "trending" && <LoadingSpinner size="sm" className="absolute left-2" />}
              Trending
            </TabsTrigger>
          </TabsList>

          {isSearching && searchQuery ? (
            <SearchLoader />
          ) : (
            <>
              <TabsContent value="library" className="mt-6">
                {tabLoading ? (
                  <LibraryLoader />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold gradient-text">
                        {contentType === "manhwa" ? "Manhwa" : "Manga"} Library
                      </h2>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-200">
                        {displayContent.length} {contentType}
                      </Badge>
                    </div>
                    {displayContent.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">No {contentType} found</h2>
                        <p className="text-gray-400 mb-6">
                          {searchQuery ? "Try a different search term" : `Add some ${contentType} to get started`}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                          {displayContent.map((content) => (
                            <ContentCard key={content.id} content={content} user={user} />
                          ))}
                        </div>
                        <div className="mt-8">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="continue" className="mt-6">
                {tabLoading ? (
                  <ContinueReadingLoader />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold gradient-text">Continue Reading</h2>
                    </div>
                    {continueReading.length === 0 ? (
                      <div className="text-center py-12">
                        <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">No reading history</h2>
                        <p className="text-gray-400 mb-6">Start reading to see your progress here</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {continueReading.map((item) => (
                          <ContinueCard key={item.id} item={item} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="new" className="mt-6">
                {tabLoading ? (
                  <LibraryLoader />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold gradient-text">
                        New {contentType === "manhwa" ? "Manhwa" : "Manga"} Releases
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                      {newContent.map((content) => (
                        <ContentCard key={content.id} content={content} user={user} isNew />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trending" className="mt-6">
                {tabLoading ? (
                  <LibraryLoader />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold gradient-text">
                        Trending {contentType === "manhwa" ? "Manhwa" : "Manga"}
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                      {trendingContent.map((content) => (
                        <ContentCard key={content.id} content={content} user={user} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  )
}

function ContentCard({
  content,
  user,
  isNew = false,
}: {
  content: Content
  user: any
  isNew?: boolean
}) {
  const [imageLoading, setImageLoading] = useState(true)
  const author = content.author || "Unknown"

  console.log('ContentCard data:', {
    title: content.title,
    coverImage: content.cover_image,
    imageLoading
  })

  return (
    <div className="relative group">
      <Link href={`/${content.content_type}/${content.id}`}>
        <Card className="card-3d bg-gray-900/50 border-purple-500/20 hover:border-purple-400/50 cursor-pointer glass-effect shimmer">
          <CardContent className="p-0 relative">
            <div className="relative overflow-hidden rounded-t-lg">
              {imageLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-purple-800/30 to-purple-900/20 animate-shimmer bg-[length:200%_100%] flex items-center justify-center">
                  <LoadingSpinner size="md" />
                </div>
              )}
              <Image
                src={content.cover_image || "/placeholder.svg?height=300&width=200"}
                alt={content.title}
                width={200}
                height={300}
                className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                onLoad={() => {
                  console.log('Image loaded:', content.cover_image);
                  setImageLoading(false);
                }}
                onError={(e) => {
                  console.error('Image load error:', content.cover_image, e);
                  setImageLoading(false);
                }}
              />
              {isNew && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 pulse-glow">
                  NEW
                </Badge>
              )}
              {/* Content type badge */}
              <Badge
                className={`absolute top-2 left-2 ${
                  content.content_type === "manhwa"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}
              >
                {content.content_type.toUpperCase()}
              </Badge>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                <Button
                  size="sm"
                  className="button-3d bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Read Now
                </Button>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-b from-gray-900/80 to-gray-900/90">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-purple-100">{content.title}</h3>
              <p className="text-xs text-purple-300/70 mb-2">{author}</p>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-purple-200">{content.rating.toFixed(1)}</span>
                </div>
                <span className="text-purple-300/70">Ch. {content.total_chapters}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {user && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 button-3d bg-black/60 hover:bg-purple-600/80 border border-purple-500/30"
            onClick={(e) => {
              e.preventDefault()
              // toggleFavorite will be implemented when user context is properly set up
            }}
          >
            <Heart className="h-4 w-4 transition-all duration-300 text-white" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 button-3d bg-black/60 hover:bg-purple-600/80 border border-purple-500/30"
            onClick={(e) => {
              e.preventDefault()
              // toggleFavorite will be implemented when user context is properly set up
            }}
          >
            <ThumbsUp className="h-4 w-4 transition-all duration-300 text-white" />
          </Button>
        </div>
      )}
    </div>
  )
}

function ContinueCard({ item }: { item: any }) {
  const progress = (item.pages_read / item.total_pages) * 100

  return (
    <Link href={`/reader/${item.content_id}/${item.chapter.chapter_number}`}>
      <Card className="card-3d bg-gray-900/50 border-purple-500/20 hover:border-purple-400/50 cursor-pointer glass-effect">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="relative overflow-hidden rounded">
              <Image
                src={item.content.cover_image || "/placeholder.svg?height=120&width=80"}
                alt={item.content.title}
                width={80}
                height={120}
                className="w-16 h-24 object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold line-clamp-2 text-purple-100">{item.content.title}</h3>
              <p className="text-sm text-purple-300/70">Chapter {item.chapter.chapter_number}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-purple-300/70">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 glow-purple"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <Button
                size="sm"
                className="w-full button-3d bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Continue Reading
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
