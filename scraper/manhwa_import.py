import asyncio
import os
from supabase import create_client, Client
from manhwa_scraper import ManhwaScraper
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Please set SUPABASE_URL and SUPABASE_KEY environment variables")

supabase: Client = create_client(supabase_url, supabase_key)

async def import_manhwa(num_pages: int = 1):
    """Import manhwa data into Supabase"""
    scraper = ManhwaScraper()
    await scraper.initialize()
    
    try:
        total_imported = 0
        for page in range(1, num_pages + 1):
            print(f"Processing page {page}...")
            manhwa_list = await scraper.get_manhwa_list(page)
            
            for manhwa in manhwa_list:
                print(f"Processing {manhwa['title']}...")
                
                # Get chapters
                chapters = await scraper.get_chapter_list(manhwa['url'])
                
                # Insert manhwa
                try:
                    result = supabase.table('manhwa').insert({
                        'title': manhwa['title'],
                        'slug': manhwa['slug'],
                        'rating': manhwa['rating'],
                        'genres': manhwa['genres'],
                        'cover_url': manhwa['cover_url'],
                        'source': 'zeroscans'
                    }).execute()
                    
                    manhwa_id = result.data[0]['id']
                    print(f"Inserted manhwa {manhwa['title']} with ID {manhwa_id}")
                    
                    # Insert chapters
                    for chapter in chapters:
                        try:
                            # Get chapter images
                            images = await scraper.get_chapter_images(chapter['url'])
                            
                            # Insert chapter
                            supabase.table('chapters').insert({
                                'manhwa_id': manhwa_id,
                                'title': chapter['title'],
                                'chapter_number': chapter['chapter_number'],
                                'date': chapter['date'],
                                'url': chapter['url'],
                                'pages': images
                            }).execute()
                            print(f"Inserted chapter {chapter['title']}")
                            
                        except Exception as e:
                            print(f"Error inserting chapter {chapter['title']}: {e}")
                            continue
                    
                    total_imported += 1
                    print(f"Successfully imported {manhwa['title']}")
                    
                except Exception as e:
                    print(f"Error inserting manhwa {manhwa['title']}: {e}")
                    continue
                
            print(f"Imported {total_imported} manhwa from page {page}")
            
    finally:
        await scraper.close()

if __name__ == "__main__":
    asyncio.run(import_manhwa(1)) 