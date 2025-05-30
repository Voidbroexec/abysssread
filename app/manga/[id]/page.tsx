import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import MangaClient from './client';

export default async function MangaPage({ params }: { params: { id: string } }) {
  // Get cookies and create supabase client
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Fetch manga details
  const { data: manga, error: mangaError } = await supabase
    .from('content')
    .select('*')
    .eq('id', params.id)
    .single();

  if (mangaError) {
    console.error('Error fetching manga:', mangaError);
    return <div>Error loading manga</div>;
  }

  // Fetch chapters
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('content_id', params.id)
    .order('chapter_number', { ascending: true });

  if (chaptersError) {
    console.error('Error fetching chapters:', chaptersError);
    return <div>Error loading chapters</div>;
  }

  return <MangaClient manga={manga} chapters={chapters} />;
} 