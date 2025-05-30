"use client"

import { ArrowLeft, User, Calendar, Heart, Bookmark, ThumbsUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function ProfilePage() {
  const { user, preferences } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please sign in to view your profile</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: "Favorites",
      value: preferences.favorites.length,
      icon: Heart,
      color: "text-red-500",
      href: "/favorites",
    },
    {
      label: "Bookmarks",
      value: preferences.bookmarks.length,
      icon: Bookmark,
      color: "text-blue-500",
      href: "/bookmarks",
    },
    {
      label: "Liked",
      value: preferences.liked.length,
      icon: ThumbsUp,
      color: "text-green-500",
      href: "#",
    },
    {
      label: "Reading History",
      value: preferences.readingHistory.length,
      icon: Clock,
      color: "text-purple-500",
      href: "#",
    },
  ]

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
              <User className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl font-bold">Profile</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Info */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                  <AvatarFallback className="bg-blue-600 text-2xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{user.username}</h2>
                  <p className="text-gray-400 mb-2">{user.email}</p>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="outline" className="border-gray-600">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <span>Recent Reading Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {preferences.readingHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No reading history yet</p>
                  <p className="text-sm text-gray-500">Start reading to see your activity here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {preferences.readingHistory.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">Manhwa ID: {activity.manhwaId}</p>
                        <p className="text-sm text-gray-400">Chapter {activity.chapterId}</p>
                      </div>
                      <div className="text-sm text-gray-400">{new Date(activity.timestamp).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
