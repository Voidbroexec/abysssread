import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    // Test database connection and table structure
    const { data: contentData, error: contentError } = await supabaseAdmin
      .from('content')
      .select('*')
      .limit(1)

    const { data: chaptersData, error: chaptersError } = await supabaseAdmin
      .from('chapters')
      .select('*')
      .limit(1)

    return NextResponse.json({
      hasApiKey: !!process.env.API_KEY,
      apiKeyValue: process.env.API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      databaseStatus: {
        content: contentError ? `Error: ${contentError.message}` : 'OK',
        chapters: chaptersError ? `Error: ${chaptersError.message}` : 'OK'
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 