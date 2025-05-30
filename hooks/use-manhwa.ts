"use client"

import { useState, useEffect } from "react"
import { ManhwaAPI } from "@/lib/api/manhwa"
import type { Manhwa, Chapter } from "@/lib/supabase"

export function useManhwa(
  filters: {
    page?: number
    limit?: number
    search?: string
    genre?: string
    status?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  } = {},
) {
  const [manhwa, setManhwa] = useState<Manhwa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchManhwa = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await ManhwaAPI.getManhwa(filters)
        setManhwa(result.data)
        setTotalPages(result.totalPages)
        setCount(result.count)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch manhwa")
      } finally {
        setLoading(false)
      }
    }

    fetchManhwa()
  }, [JSON.stringify(filters)])

  return { manhwa, loading, error, totalPages, count }
}

export function useManhwaDetail(id: string) {
  const [manhwa, setManhwa] = useState<Manhwa | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchManhwaDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        const [manhwaData, chaptersData] = await Promise.all([ManhwaAPI.getManhwaById(id), ManhwaAPI.getChapters(id)])

        setManhwa(manhwaData)
        setChapters(chaptersData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch manhwa details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchManhwaDetail()
    }
  }, [id])

  return { manhwa, chapters, loading, error }
}

export function useChapter(manhwaId: string, chapterNumber: number) {
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true)
        setError(null)

        const chapterData = await ManhwaAPI.getChapter(manhwaId, chapterNumber)
        setChapter(chapterData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chapter")
      } finally {
        setLoading(false)
      }
    }

    if (manhwaId && chapterNumber) {
      fetchChapter()
    }
  }, [manhwaId, chapterNumber])

  return { chapter, loading, error }
}

export function useTrendingManhwa(limit = 10) {
  const [manhwa, setManhwa] = useState<Manhwa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await ManhwaAPI.getTrendingManhwa(limit)
        setManhwa(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch trending manhwa")
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [limit])

  return { manhwa, loading, error }
}

export function useNewReleases(limit = 10) {
  const [manhwa, setManhwa] = useState<Manhwa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await ManhwaAPI.getNewReleases(limit)
        setManhwa(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch new releases")
      } finally {
        setLoading(false)
      }
    }

    fetchNewReleases()
  }, [limit])

  return { manhwa, loading, error }
}
