"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthUser {
  id: string
  email: string
  username?: string
  avatar_url?: string
  created_at: string
}

interface UserPreferences {
  favorites: string[]
  bookmarks: string[]
  liked: string[]
  readingHistory: Array<{
    manhwaId: string
    chapterId: string
    timestamp: string
  }>
}

interface AuthContextType {
  user: AuthUser | null
  preferences: UserPreferences
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  toggleFavorite: (manhwaId: string) => Promise<void>
  toggleBookmark: (manhwaId: string) => Promise<void>
  toggleLike: (manhwaId: string) => Promise<void>
  updateReadingHistory: (manhwaId: string, chapterId: string) => Promise<void>
  isFavorite: (contentId: string) => boolean
  isBookmarked: (contentId: string) => boolean
  isLiked: (contentId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>({
    favorites: [],
    bookmarks: [],
    liked: [],
    readingHistory: [],
  })
  const [loading, setLoading] = useState(true)

  // Load user session and preferences
  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          await loadUserData(session.user)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await loadUserData(session.user)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setPreferences({ favorites: [], bookmarks: [], liked: [], readingHistory: [] })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (authUser: User) => {
    try {
      // Get or create user profile
      let { data: profile, error } = await supabase.from("user_profiles").select("*").eq("id", authUser.id).single()

      if (error && error.code === "PGRST116") {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await supabase
          .from("user_profiles")
          .insert({
            id: authUser.id,
            email: authUser.email!,
            username: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "",
            avatar_url: authUser.user_metadata?.avatar_url || "",
          })
          .select()
          .single()

        if (createError) throw createError
        profile = newProfile
      } else if (error) {
        throw error
      }

      setUser(profile)

      // Load preferences
      await loadPreferences(authUser.id)
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const loadPreferences = async (userId: string) => {
    try {
      const [favorites, bookmarks, liked, history] = await Promise.all([
        supabase.from("user_preferences").select("content_id").eq("user_id", userId).eq("type", "favorite"),
        supabase.from("user_preferences").select("content_id").eq("user_id", userId).eq("type", "bookmark"),
        supabase.from("user_preferences").select("content_id").eq("user_id", userId).eq("type", "like"),
        supabase
          .from("reading_history")
          .select("content_id, chapter_id, last_read_at")
          .eq("user_id", userId)
          .order("last_read_at", { ascending: false })
          .limit(50),
      ])

      setPreferences({
        favorites: favorites.data?.map((p) => p.content_id) || [],
        bookmarks: bookmarks.data?.map((p) => p.content_id) || [],
        liked: liked.data?.map((p) => p.content_id) || [],
        readingHistory:
          history.data?.map((h) => ({
            manhwaId: h.content_id,
            chapterId: h.chapter_id,
            timestamp: h.last_read_at,
          })) || [],
      })
    } catch (error) {
      console.error("Error loading preferences:", error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        await loadUserData(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const signup = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: username,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        await loadUserData(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const toggleFavorite = async (contentId: string) => {
    if (!user) return

    try {
      const isFav = preferences.favorites.includes(contentId)

      if (isFav) {
        await supabase
          .from("user_preferences")
          .delete()
          .eq("user_id", user.id)
          .eq("content_id", contentId)
          .eq("type", "favorite")
      } else {
        await supabase.from("user_preferences").insert({
          user_id: user.id,
          content_id: contentId,
          type: "favorite",
        })
      }

      setPreferences((prev) => ({
        ...prev,
        favorites: isFav ? prev.favorites.filter((id) => id !== contentId) : [...prev.favorites, contentId],
      }))
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const toggleBookmark = async (contentId: string) => {
    if (!user) return

    try {
      const isBookmarked = preferences.bookmarks.includes(contentId)

      if (isBookmarked) {
        await supabase
          .from("user_preferences")
          .delete()
          .eq("user_id", user.id)
          .eq("content_id", contentId)
          .eq("type", "bookmark")
      } else {
        await supabase.from("user_preferences").insert({
          user_id: user.id,
          content_id: contentId,
          type: "bookmark",
        })
      }

      setPreferences((prev) => ({
        ...prev,
        bookmarks: isBookmarked ? prev.bookmarks.filter((id) => id !== contentId) : [...prev.bookmarks, contentId],
      }))
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  const toggleLike = async (contentId: string) => {
    if (!user) return

    try {
      const isLiked = preferences.liked.includes(contentId)

      if (isLiked) {
        await supabase
          .from("user_preferences")
          .delete()
          .eq("user_id", user.id)
          .eq("content_id", contentId)
          .eq("type", "like")
      } else {
        await supabase.from("user_preferences").insert({
          user_id: user.id,
          content_id: contentId,
          type: "like",
        })
      }

      setPreferences((prev) => ({
        ...prev,
        liked: isLiked ? prev.liked.filter((id) => id !== contentId) : [...prev.liked, contentId],
      }))
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const updateReadingHistory = async (contentId: string, chapterId: string) => {
    if (!user) return

    try {
      await supabase.from("reading_history").upsert(
        {
          user_id: user.id,
          content_id: contentId,
          chapter_id: chapterId,
          progress: 100,
          last_read_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,content_id,chapter_id",
        },
      )

      // Update local state
      setPreferences((prev) => ({
        ...prev,
        readingHistory: [
          { manhwaId: contentId, chapterId, timestamp: new Date().toISOString() },
          ...prev.readingHistory.filter((h) => !(h.manhwaId === contentId && h.chapterId === chapterId)),
        ].slice(0, 50), // Keep only last 50 entries
      }))
    } catch (error) {
      console.error("Error updating reading history:", error)
    }
  }

  const isFavorite = (contentId: string) => preferences.favorites.includes(contentId)
  const isBookmarked = (contentId: string) => preferences.bookmarks.includes(contentId)
  const isLiked = (contentId: string) => preferences.liked.includes(contentId)

  return (
    <AuthContext.Provider
      value={{
        user,
        preferences,
        loading,
        login,
        signup,
        logout,
        toggleFavorite,
        toggleBookmark,
        toggleLike,
        updateReadingHistory,
        isFavorite,
        isBookmarked,
        isLiked,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
