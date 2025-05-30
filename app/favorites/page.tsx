"use client"

import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

// Import the manhwa data (in a real app, this would come from an API)
const manhwaData = [
  {
    id: 1,
    title: "Solo Leveling",
    author: "Chugong",
    cover: "/placeholder.svg?height=300&width=200",
    rating: 4.9,
    chapters: 179,
    status: "Completed",
    genre: ["Action", "Fantasy"],
    lastRead: 45,
    isNew: false,
  },
  {
    id: 2,
    title: "Tower of God",
    author: "SIU",
    cover: "/placeholder.svg?height=300&width=200",
    rating: 4.8,
    chapters: 588,
    status: "Ongoing",
    genre: ["Adventure", "Fantasy"],
    lastRead: 120,
    isNew: false,
  },
  {
    id: 3,
    title: "The Beginning After The End",
    author: "TurtleMe",
    cover: "/placeholder.svg?height=300&width=200",
    rating: 4.7,
    chapters: 156,
    status: "Ongoing",
    genre: ["Fantasy", "Adventure"],
    lastRead: 0,
    isNew: true,
  },
  {
    id: 4,
    title: "Omniscient Reader",
    author: "Sing Shong",
    cover: "/placeholder.svg?height=300&width=200",
    rating: 4.9,
    chapters: 200,
    status: "Ongoing",
    genre: ["Action", "Fantasy"],
    lastRead: 67,
    isNew: false,
  },
]

export default function FavoritesPage() {
  const { user, preferences, toggleFavorite } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please sign in to view your favorites</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const favoriteManhwa = manhwaData.filter((manhwa) => preferences.favorites.includes(manhwa.id))

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <h1 className="text-2xl font-bold">My Favorites</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {favoriteManhwa.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-gray-400 mb-6">Start adding manhwa to your favorites to see them here</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">Browse Manhwa</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {favoriteManhwa.map((manhwa) => (
              <ManhwaCard key={manhwa.id} manhwa={manhwa} onRemoveFavorite={toggleFavorite} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function ManhwaCard({ manhwa, onRemoveFavorite }: { manhwa: any; onRemoveFavorite: (id: number) => void }) {
  return (
    <div className="relative group">
      <Link href={`/manhwa/${manhwa.id}`}>
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer">
          <div className="relative">
            <img
              src={manhwa.cover || "/placeholder.svg"}
              alt={manhwa.title}
              className="w-full h-48 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Read Now
              </Button>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{manhwa.title}</h3>
            <p className="text-xs text-gray-400 mb-2">{manhwa.author}</p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">★</span>
                <span>{manhwa.rating}</span>
              </div>
              <span className="text-gray-400">Ch. {manhwa.chapters}</span>
            </div>
          </div>
        </div>
      </Link>

      <Button
        size="icon"
        variant="secondary"
        className="absolute top-2 right-2 h-8 w-8 bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.preventDefault()
          onRemoveFavorite(manhwa.id)
        }}
      >
        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
      </Button>
    </div>
  )
}
