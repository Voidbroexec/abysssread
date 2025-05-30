import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ReaderClient from './client';

export default async function ReaderPage({ 
  params 
}: { 
  params: { mangaId: string; chapterId: string } 
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Fetch chapter by chapter number and manga ID
  const { data: chapter, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('content_id', params.mangaId)
    .eq('chapter_number', params.chapterId)
    .single();

  if (error) {
    console.error('Error fetching chapter:', error);
    return <div>Error loading chapter</div>;
  }

  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  // Fetch pages from MangaDex
  const mangaDexChapterId = chapter.source_url.split('/').pop();
  const response = await fetch(`https://api.mangadex.org/at-home/server/${mangaDexChapterId}`);
  const chapterData = await response.json();
  
  const pages = chapterData.chapter.data.map((page: string) => 
    `${chapterData.baseUrl}/data/${chapterData.chapter.hash}/${page}`
  );

  return <ReaderClient chapter={{ ...chapter, pages }} mangaId={params.mangaId} />;
} 