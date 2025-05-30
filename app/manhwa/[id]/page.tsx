"use client"
import { useState, useEffect } from "react"
import { ArrowLeft, Star, Bookmark, Share2, Play, Heart, ThumbsUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { PageLoader, ChapterLoader, ButtonLoader } from "@/components/loading-states"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Mock manhwa details
const manhwaDetails = {
  1: {
    id: 1,
    title: "Solo Leveling",
    author: "Chugong",
    artist: "DUBU (REDICE STUDIO)",
    cover: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
    totalChapters: 179,
    status: "Completed",
    genres: ["Action", "Fantasy", "Adventure"],
    description:
      "10 years ago, after 'the Gate' that connected the real world with the monster world opened, some of the ordinary, everyday people received the power to hunt monsters within the Gate. They are known as 'Hunters'. However, not all Hunters are powerful. My name is Sung Jin-Woo, an E-rank Hunter. I'm someone who has to risk his life in the lowliest of dungeons, the 'World's Weakest'. Having no skills whatsoever to display, I barely earned the required money by fighting in low-leveled dungeons... at least until I found a hidden dungeon with the hardest difficulty within the D-rank dungeons! In the end, as I was accepting death, I suddenly received a strange power, a quest log that only I could see, a secret to leveling up that only I know about! If I trained in accordance with my quests and hunted monsters, my level would rise. Changing from the weakest Hunter to the strongest S-rank Hunter!",
    chapters: Array.from({ length: 179 }, (_, i) => ({
      id: i + 1,
      title: `Chapter ${i + 1}`,
      releaseDate: new Date(2024, 0, 1 + i).toLocaleDateString(),
      isRead: i < 45,
    })),
  },
}

export default function ManhwaDetailPage() {
  const params = useParams()
  const manhwaId = Number.parseInt(params.id as string)
  const manhwa = manhwaDetails[manhwaId as keyof typeof manhwaDetails]
  const { user, toggleBookmark, toggleFavorite, toggleLike, isBookmarked, isFavorite, isLiked } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [chaptersLoading, setChaptersLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleAction = async (action: string, callback: () => void) => {
    setActionLoading(action)
    await new Promise((resolve) => setTimeout(resolve, 800))
    callback()
    setActionLoading(null)
  }

  if (isLoading) {
    return <PageLoader />
  }

  if (!manhwa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white flex items-center justify-center">
        <p>Manhwa not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white page-transition">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="button-3d hover:bg-purple-600/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold truncate gradient-text">{manhwa.title}</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative card-3d">
              <Image
                src={manhwa.cover || "/placeholder.svg"}
                alt={manhwa.title}
                width={300}
                height={400}
                className="w-48 md:w-64 h-auto object-cover rounded-lg mx-auto border border-purple-500/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-lg"></div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 gradient-text">{manhwa.title}</h1>
              <p className="text-purple-300/80">by {manhwa.author}</p>
              {manhwa.artist && <p className="text-purple-300/80">Art by {manhwa.artist}</p>}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold text-purple-100">{manhwa.rating}</span>
              </div>
              <Badge
                variant={manhwa.status === "Ongoing" ? "default" : "secondary"}
                className={
                  manhwa.status === "Ongoing"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-gray-500 to-gray-600"
                }
              >
                {manhwa.status}
              </Badge>
              <span className="text-purple-300/70">{manhwa.totalChapters} chapters</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {manhwa.genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={`/reader/${manhwa.id}/1`}>
                <Button className="button-3d bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0">
                  <Play className="h-4 w-4 mr-2" />
                  Start Reading
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              {user && (
                <>
                  <ButtonLoader isLoading={actionLoading === "bookmark"}>
                    <Button
                      variant="outline"
                      onClick={() => handleAction("bookmark", () => toggleBookmark(manhwa.id))}
                      className={`button-3d border-purple-500/30 ${
                        isBookmarked(manhwa.id)
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500"
                          : "hover:bg-purple-600/20"
                      }`}
                      disabled={actionLoading === "bookmark"}
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      {isBookmarked(manhwa.id) ? "Bookmarked" : "Bookmark"}
                    </Button>
                  </ButtonLoader>

                  <ButtonLoader isLoading={actionLoading === "favorite"}>
                    <Button
                      variant="outline"
                      onClick={() => handleAction("favorite", () => toggleFavorite(manhwa.id))}
                      className={`button-3d border-purple-500/30 ${
                        isFavorite(manhwa.id)
                          ? "bg-gradient-to-r from-red-600 to-red-700 border-red-500"
                          : "hover:bg-purple-600/20"
                      }`}
                      disabled={actionLoading === "favorite"}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      {isFavorite(manhwa.id) ? "Favorited" : "Favorite"}
                    </Button>
                  </ButtonLoader>

                  <ButtonLoader isLoading={actionLoading === "like"}>
                    <Button
                      variant="outline"
                      onClick={() => handleAction("like", () => toggleLike(manhwa.id))}
                      className={`button-3d border-purple-500/30 ${
                        isLiked(manhwa.id)
                          ? "bg-gradient-to-r from-green-600 to-green-700 border-green-500"
                          : "hover:bg-purple-600/20"
                      }`}
                      disabled={actionLoading === "like"}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {isLiked(manhwa.id) ? "Liked" : "Like"}
                    </Button>
                  </ButtonLoader>
                </>
              )}

              <Button variant="outline" className="button-3d border-purple-500/30 hover:bg-purple-600/20">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="description"
          className="mt-8"
          onValueChange={(value) => {
            if (value === "chapters") {
              setChaptersLoading(true)
              setTimeout(() => setChaptersLoading(false), 1000)
            }
          }}
        >
          <TabsList className="bg-gray-900/50 glass-effect border border-purple-500/20">
            <TabsTrigger
              value="description"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="chapters"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 relative"
            >
              {chaptersLoading && <LoadingSpinner size="sm" className="absolute left-2" />}
              Chapters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card className="card-3d bg-gray-900/50 border-purple-500/20 glass-effect">
              <CardContent className="p-6">
                <p className="text-purple-100/90 leading-relaxed">{manhwa.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chapters" className="mt-6">
            <Card className="card-3d bg-gray-900/50 border-purple-500/20 glass-effect">
              <CardContent className="p-6">
                {chaptersLoading ? (
                  <ChapterLoader />
                ) : (
                  <div className="space-y-2">
                    {manhwa.chapters.reverse().map((chapter) => (
                      <Link key={chapter.id} href={`/reader/${manhwa.id}/${chapter.id}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-600/20 transition-all duration-300 border border-transparent hover:border-purple-500/30 card-3d">
                          <div>
                            <h3 className="font-medium text-purple-100">{chapter.title}</h3>
                            <p className="text-sm text-purple-300/70">{chapter.releaseDate}</p>
                          </div>
                          {chapter.isRead && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">Read</Badge>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
