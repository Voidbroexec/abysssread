import os
import json
import asyncio
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime

import aiohttp
from dotenv import load_dotenv
from supabase import create_client, Client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

class MangaDexScraper:
    def __init__(self):
        """Initialize the scraper with Supabase client"""
        load_dotenv('.env.local')
        
        supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not supabase_url or not supabase_key:
            raise ValueError("Missing Supabase credentials")
            
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.base_url = "https://api.mangadex.org"
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        """Create aiohttp session"""
        if not self.session:
            self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Close aiohttp session"""
        if self.session:
            await self.session.close()
            self.session = None

    async def fetch_manga_list(self, offset: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Fetch a list of manga from MangaDex"""
        if not self.session:
            raise RuntimeError("Session not initialized. Use async with context.")
            
        params = {
            'limit': limit,
            'offset': offset,
            'contentRating[]': ['safe', 'suggestive'],
            'hasAvailableChapters': 'true',
            'order[latestUploadedChapter]': 'desc',
            'includes[]': ['author', 'artist', 'cover_art']
        }
        
        async with self.session.get(f"{self.base_url}/manga", params=params) as response:
            if response.status == 200:
                data = await response.json()
                return data.get('data', [])
            else:
                logger.error(f"Failed to fetch manga list: {response.status}")
                return []

    async def fetch_manga_details(self, manga_id: str) -> Optional[Dict[str, Any]]:
        """Fetch detailed information about a manga"""
        if not self.session:
            raise RuntimeError("Session not initialized. Use async with context.")
            
        params = {
            'includes[]': ['author', 'artist', 'cover_art']
        }
        async with self.session.get(f"{self.base_url}/manga/{manga_id}", params=params) as response:
            if response.status == 200:
                data = await response.json()
                return self.process_manga_data(data['data'])
            else:
                logger.error(f"Failed to fetch manga {manga_id}: {response.status}")
                return None

    def process_manga_data(self, manga_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process manga data into our format"""
        attributes = manga_data['attributes']
        relationships = manga_data['relationships']
        
        # Get cover art
        cover_file = next((rel for rel in relationships if rel['type'] == 'cover_art'), None)
        cover_filename = cover_file['attributes']['fileName'] if cover_file and 'attributes' in cover_file else None
        cover_url = f"https://uploads.mangadex.org/covers/{manga_data['id']}/{cover_filename}" if cover_filename else ''
        
        # Get authors and artists
        authors = []
        artists = []
        for rel in relationships:
            if rel['type'] == 'author' and 'attributes' in rel:
                authors.append(rel['attributes']['name'])
            elif rel['type'] == 'artist' and 'attributes' in rel:
                artists.append(rel['attributes']['name'])
        
        # Get genres and tags from tags
        genres = []
        tags = []
        for tag in attributes.get('tags', []):
            if 'attributes' in tag and 'name' in tag['attributes']:
                name = tag['attributes']['name'].get('en')
                if name:
                    if tag['attributes'].get('group') == 'genre':
                        genres.append(name)
                    else:
                        tags.append(name)
        
        # Map status to our enum values
        status_map = {
            'ongoing': 'ongoing',
            'completed': 'completed',
            'hiatus': 'hiatus',
            'cancelled': 'completed'  # Map cancelled to completed for our schema
        }
        
        # Map content rating to our enum values
        content_rating_map = {
            'safe': 'safe',
            'suggestive': 'suggestive',
            'erotica': 'mature',
            'pornographic': 'mature'
        }
        
        # Calculate numerical rating (default to 4.0 if not available)
        rating = 4.0
        if attributes.get('rating'):
            try:
                bayesian_rating = float(attributes['rating'].get('bayesian', 4.0))
                rating = max(0.0, min(5.0, bayesian_rating))  # Clamp between 0 and 5
            except (ValueError, TypeError, AttributeError):
                pass
        
        return {
            'title': attributes['title'].get('en') or next(iter(attributes['title'].values())),
            'description': attributes['description'].get('en', ''),
            'cover_image': cover_url,
            'genres': genres,
            'tags': tags,
            'authors': authors,
            'artists': artists,
            'status': status_map.get(attributes.get('status', 'ongoing'), 'ongoing'),
            'content_rating': content_rating_map.get(attributes.get('contentRating', 'safe'), 'safe'),
            'rating': rating,  # Store as a float
            'total_chapters': 0,  # Will be updated after fetching chapters
            'content_type': 'manga',
            'source_url': f"https://mangadex.org/title/{manga_data['id']}",
            'last_chapter_update': attributes.get('lastChapterUpdateAt'),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }

    async def fetch_chapters(self, manga_id: str) -> List[Dict[str, Any]]:
        """Fetch chapters for a manga"""
        if not self.session:
            raise RuntimeError("Session not initialized. Use async with context.")
            
        params = {
            'manga': manga_id,
            'translatedLanguage[]': ['en'],
            'order[chapter]': 'asc',
            'includes[]': ['scanlation_group']
        }
        
        async with self.session.get(f"{self.base_url}/chapter", params=params) as response:
            if response.status == 200:
                data = await response.json()
                return [self.process_chapter_data(chapter) for chapter in data['data']]
            else:
                logger.error(f"Failed to fetch chapters for {manga_id}: {response.status}")
                return []

    def process_chapter_data(self, chapter_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process chapter data into our format"""
        attributes = chapter_data['attributes']
        relationships = chapter_data['relationships']
        
        # Get scanlation group
        scanlation_group = next((rel for rel in relationships if rel['type'] == 'scanlation_group'), None)
        group_name = scanlation_group['attributes']['name'] if scanlation_group and 'attributes' in scanlation_group else 'Unknown'
        
        return {
            'chapter_number': attributes.get('chapter', '0'),
            'title': attributes.get('title', ''),
            'source_url': f"https://mangadex.org/chapter/{chapter_data['id']}",
            'language': attributes.get('translatedLanguage', 'en'),
            'scanlation_group': group_name,
            'publish_at': attributes.get('publishAt'),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }

    async def store_manga(self, manga_data: Dict[str, Any]) -> Optional[str]:
        """Store manga data in Supabase"""
        try:
            result = self.supabase.table('content').insert(manga_data).execute()
            content_id = result.data[0]['id']
            logger.info(f"Stored manga: {manga_data['title']}")
            return content_id
        except Exception as e:
            logger.error(f"Error storing manga {manga_data['title']}: {e}")
            return None

    async def store_chapters(self, chapters: List[Dict[str, Any]], content_id: str):
        """Store chapter data in Supabase"""
        if not chapters:
            return

        try:
            # Update total chapters count in content table
            total_chapters = len(chapters)
            self.supabase.table('content').update({
                'total_chapters': total_chapters,
                'updated_at': datetime.now().isoformat()
            }).eq('id', content_id).execute()
            logger.info(f"Updated total chapters count to {total_chapters} for content {content_id}")

            # Store chapters in batches
            batch_size = 50
            for i in range(0, len(chapters), batch_size):
                batch = chapters[i:i + batch_size]
                for chapter in batch:
                    chapter['content_id'] = content_id
                self.supabase.table('chapters').insert(batch).execute()
                logger.info(f"Stored {len(batch)} chapters")
        except Exception as e:
            logger.error(f"Error storing chapters: {e}")

    async def scrape_all_manga(self, limit: int = 100):
        """Scrape manga and chapters from MangaDex"""
        offset = 0
        total_processed = 0
        
        while True:
            manga_list = await self.fetch_manga_list(offset, limit)
            if not manga_list:
                break
                
            for manga in manga_list:
                try:
                    manga_data = await self.fetch_manga_details(manga['id'])
                    if not manga_data:
                        continue
                        
                    # Check if manga already exists
                    existing = self.supabase.table('content').select('id').eq('source_url', manga_data['source_url']).execute()
                    if existing.data:
                        content_id = existing.data[0]['id']
                        logger.info(f"Manga already exists: {manga_data['title']}")
                    else:
                        content_id = await self.store_manga(manga_data)
                        if not content_id:
                            continue
                    
                    # Fetch and store chapters
                    chapters = await self.fetch_chapters(manga['id'])
                    await self.store_chapters(chapters, content_id)
                    
                    total_processed += 1
                    logger.info(f"Processed {total_processed} manga")
                    
                    # Add delay between manga
                    await asyncio.sleep(2)
                    
                except Exception as e:
                    logger.error(f"Error processing manga {manga['id']}: {e}")
                    continue
            
            offset += limit
            # Add delay between pages
            await asyncio.sleep(5)

async def main():
    """Main entry point"""
    try:
        async with MangaDexScraper() as scraper:
            await scraper.scrape_all_manga()
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main()) 