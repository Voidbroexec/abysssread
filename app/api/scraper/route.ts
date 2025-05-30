import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// API endpoint for your scraper to send data
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key")

    // Verify API key
    if (apiKey !== process.env.API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case "manhwa":
        return await handleContentData(data, "manhwa")
      case "manga":
        return await handleContentData(data, "manga")
      case "chapter":
        return await handleChapterData(data)
      case "batch":
        return await handleBatchData(data)
      default:
        return NextResponse.json({ error: "Invalid type. Use: manhwa, manga, chapter, or batch" }, { status: 400 })
    }
  } catch (error) {
    console.error("Scraper API error:", error)
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

async function handleContentData(contentData: any, contentType: "manhwa" | "manga") {
  try {
    // Validate required fields
    if (!contentData.title || !contentData.author || !contentData.source_url) {
      return NextResponse.json({ error: "Missing required fields: title, author, source_url" }, { status: 400 })
    }

    console.log('Attempting to save content:', { contentType, title: contentData.title })

    // Insert or update content
    const { data: content, error: contentError } = await supabaseAdmin
      .from("content")
      .upsert(
        {
          title: contentData.title,
          author: contentData.author,
          artist: contentData.artist,
          description: contentData.description,
          cover_url: contentData.cover_url,
          rating: contentData.rating || 0,
          status: contentData.status || "ongoing",
          genres: contentData.genres || [],
          content_type: contentType,
          source_url: contentData.source_url,
        },
        {
          onConflict: "content_source_url_key",
          ignoreDuplicates: false,
        },
      )
      .select()
      .single()

    if (contentError) {
      console.error('Content save error:', contentError)
      throw contentError
    }

    return NextResponse.json({
      success: true,
      message: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} data saved successfully`,
      data: content,
    })
  } catch (error) {
    console.error(`Error saving ${contentType}:`, error)
    return NextResponse.json({ error: `Failed to save ${contentType} data`, details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

async function handleChapterData(chapterData: any) {
  try {
    // Validate required fields
    if (!chapterData.content_source_url || !chapterData.chapter_number || !chapterData.pages) {
      return NextResponse.json(
        { error: "Missing required fields: content_source_url, chapter_number, pages" },
        { status: 400 },
      )
    }

    console.log('Looking for content with source_url:', chapterData.content_source_url)

    // First, find the content by source_url
    const { data: content, error: contentLookupError } = await supabaseAdmin
      .from("content")
      .select("id")
      .eq("source_url", chapterData.content_source_url)
      .single()

    if (contentLookupError) {
      console.error('Content lookup error:', contentLookupError)
      throw contentLookupError
    }

    if (!content) {
      return NextResponse.json({ error: "Content not found. Please add the content first." }, { status: 404 })
    }

    console.log('Found content, attempting to save chapter:', { contentId: content.id, chapterNumber: chapterData.chapter_number })

    const { data, error } = await supabaseAdmin
      .from("chapters")
      .upsert(
        {
          content_id: content.id,
          chapter_number: chapterData.chapter_number,
          title: chapterData.title,
          pages: chapterData.pages || [],
          release_date: chapterData.release_date,
          source_url: chapterData.source_url,
        },
        {
          onConflict: "content_id,chapter_number",
          ignoreDuplicates: false,
        },
      )
      .select()

    if (error) {
      console.error('Chapter save error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Chapter data saved successfully",
      data,
    })
  } catch (error) {
    console.error("Error saving chapter:", error)
    return NextResponse.json({ error: "Failed to save chapter data", details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

async function handleBatchData(batchData: any) {
  try {
    const results = {
      manhwa: { success: 0, failed: 0 },
      manga: { success: 0, failed: 0 },
      chapters: { success: 0, failed: 0 },
    }

    // Process manhwa data
    if (batchData.manhwa && Array.isArray(batchData.manhwa)) {
      for (const manhwa of batchData.manhwa) {
        try {
          await supabaseAdmin.from("content").upsert(
            {
              title: manhwa.title,
              author: manhwa.author,
              artist: manhwa.artist,
              description: manhwa.description,
              cover_url: manhwa.cover_url,
              rating: manhwa.rating || 0,
              status: manhwa.status || "ongoing",
              genres: manhwa.genres || [],
              content_type: "manhwa",
              source_url: manhwa.source_url,
            },
            {
              onConflict: "content_source_url_key",
              ignoreDuplicates: false,
            },
          )

          results.manhwa.success++
        } catch (error) {
          console.error("Error saving manhwa:", manhwa.title, error)
          results.manhwa.failed++
        }
      }
    }

    // Process manga data
    if (batchData.manga && Array.isArray(batchData.manga)) {
      for (const manga of batchData.manga) {
        try {
          await supabaseAdmin.from("content").upsert(
            {
              title: manga.title,
              author: manga.author,
              artist: manga.artist,
              description: manga.description,
              cover_url: manga.cover_url,
              rating: manga.rating || 0,
              status: manga.status || "ongoing",
              genres: manga.genres || [],
              content_type: "manga",
              source_url: manga.source_url,
            },
            {
              onConflict: "content_source_url_key",
              ignoreDuplicates: false,
            },
          )

          results.manga.success++
        } catch (error) {
          console.error("Error saving manga:", manga.title, error)
          results.manga.failed++
        }
      }
    }

    // Process chapters data
    if (batchData.chapters && Array.isArray(batchData.chapters)) {
      for (const chapter of batchData.chapters) {
        try {
          // Find content by source_url
          const { data: content } = await supabaseAdmin
            .from("content")
            .select("id")
            .eq("source_url", chapter.content_source_url)
            .single()

          if (content) {
            await supabaseAdmin.from("chapters").upsert(
              {
                content_id: content.id,
                chapter_number: chapter.chapter_number,
                title: chapter.title,
                pages: chapter.pages || [],
                release_date: chapter.release_date,
                source_url: chapter.source_url,
              },
              {
                onConflict: "content_id,chapter_number",
                ignoreDuplicates: false,
              },
            )

            results.chapters.success++
          } else {
            results.chapters.failed++
          }
        } catch (error) {
          console.error("Error saving chapter:", chapter.title, error)
          results.chapters.failed++
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Batch data processed",
      results,
    })
  } catch (error) {
    console.error("Error processing batch data:", error)
    return NextResponse.json({ error: "Failed to process batch data" }, { status: 500 })
  }
}
