# 📚 AbyssRead Manga & Manhwa Scraper Guide

Complete guide for integrating both manga and manhwa scrapers with AbyssRead.

## 🔑 Authentication

All scraper requests require the API key in headers:

\`\`\`bash
x-api-key: abyssread_secure_api_key_2024_manhwa_scraper_v1
\`\`\`

## 📊 Data Structure

### Manga Object
\`\`\`json
{
  "title": "One Piece",                // Required
  "author": "Eiichiro Oda",          // Required
  "artist": "Eiichiro Oda",          // Optional (often same as author for manga)
  "description": "Pirate adventure...", // Optional
  "cover_url": "https://...",         // Optional
  "rating": 4.9,                     // Optional (0-5)
  "status": "ongoing",               // Optional: ongoing|completed|hiatus
  "genres": ["Adventure", "Comedy"], // Optional array
  "source_url": "https://..."        // Required (unique identifier)
}
\`\`\`

### Manhwa Object
\`\`\`json
{
  "title": "Solo Leveling",           // Required
  "author": "Chugong",               // Required
  "artist": "DUBU (REDICE STUDIO)",  // Optional (often different from author)
  "description": "Hunter story...",   // Optional
  "cover_url": "https://...",         // Optional
  "rating": 4.9,                     // Optional (0-5)
  "status": "completed",             // Optional: ongoing|completed|hiatus
  "genres": ["Action", "Fantasy"],   // Optional array
  "source_url": "https://..."        // Required (unique identifier)
}
\`\`\`

### Chapter Object (Same for both manga and manhwa)
\`\`\`json
{
  "content_source_url": "https://...", // Required (links to manga/manhwa)
  "chapter_number": 1,                 // Required (integer)
  "title": "Chapter 1: Title",         // Optional
  "pages": ["https://page1.jpg"],      // Required array of image URLs
  "release_date": "2024-01-01T...",    // Optional ISO date
  "source_url": "https://..."          // Required (unique identifier)
}
\`\`\`

## 🐍 Python Implementation

### Installation
\`\`\`bash
pip install requests
\`\`\`

### Basic Usage
\`\`\`python
from manga_scraper_example import AbyssReadAPI

# Initialize
api = AbyssReadAPI("http://localhost:3000", "your_api_key")

# Add manga
manga_data = {
    "title": "One Piece",
    "author": "Eiichiro Oda",
    "description": "Pirate adventure story...",
    "rating": 4.9,
    "status": "ongoing",
    "genres": ["Adventure", "Comedy", "Action"],
    "source_url": "https://manga-source.com/one-piece"
}

result = api.add_manga(manga_data)
print(f"Manga added: {result['success']}")

# Add manhwa
manhwa_data = {
    "title": "Solo Leveling",
    "author": "Chugong",
    "artist": "DUBU (REDICE STUDIO)",
    "description": "Hunter story...",
    "rating": 4.9,
    "status": "completed",
    "genres": ["Action", "Fantasy"],
    "source_url": "https://manhwa-source.com/solo-leveling"
}

result = api.add_manhwa(manhwa_data)
print(f"Manhwa added: {result['success']}")

# Add chapter (works for both)
chapter_data = {
    "content_source_url": "https://manga-source.com/one-piece",
    "chapter_number": 1,
    "title": "Chapter 1: Romance Dawn",
    "pages": [
        "https://example.com/page1.jpg",
        "https://example.com/page2.jpg"
    ],
    "source_url": "https://manga-source.com/one-piece/chapter-1"
}

result = api.add_chapter(chapter_data)
print(f"Chapter added: {result['success']}")
\`\`\`

### Batch Processing
\`\`\`python
# Batch upload for efficiency
manga_list = [manga1, manga2, manga3]
manhwa_list = [manhwa1, manhwa2, manhwa3]
chapters_list = [chapter1, chapter2, chapter3]

result = api.batch_upload(manhwa_list, manga_list, chapters_list)
print(f"Manga: {result['results']['manga']}")
print(f"Manhwa: {result['results']['manhwa']}")
print(f"Chapters: {result['results']['chapters']}")
\`\`\`

## 🟨 JavaScript/Node.js Implementation

### Installation
\`\`\`bash
npm install node-fetch
\`\`\`

### Basic Usage
\`\`\`javascript
const { AbyssReadAPI } = require('./manga-scraper-example');

async function main() {
    const api = new AbyssReadAPI("http://localhost:3000", "your_api_key");
    
    // Add manga
    const mangaResult = await api.addManga({
        title: "One Piece",
        author: "Eiichiro Oda",
        description: "Pirate adventure...",
        rating: 4.9,
        status: "ongoing",
        genres: ["Adventure", "Comedy", "Action"],
        source_url: "https://manga-source.com/one-piece"
    });
    
    console.log("Manga added:", mangaResult.success);
    
    // Add manhwa
    const manhwaResult = await api.addManhwa({
        title: "Solo Leveling",
        author: "Chugong",
        artist: "DUBU (REDICE STUDIO)",
        description: "Hunter story...",
        rating: 4.9,
        status: "completed",
        genres: ["Action", "Fantasy"],
        source_url: "https://manhwa-source.com/solo-leveling"
    });
    
    console.log("Manhwa added:", manhwaResult.success);
    
    // Add chapter
    const chapterResult = await api.addChapter({
        content_source_url: "https://manga-source.com/one-piece",
        chapter_number: 1,
        title: "Chapter 1: Romance Dawn",
        pages: ["https://example.com/page1.jpg"],
        source_url: "https://manga-source.com/one-piece/chapter-1"
    });
    
    console.log("Chapter added:", chapterResult.success);
}

main().catch(console.error);
\`\`\`

## 🔄 API Endpoints

### Add Manga
\`\`\`bash
curl -X POST http://localhost:3000/api/scraper \
  -H "x-api-key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "manga",
    "data": {
      "title": "One Piece",
      "author": "Eiichiro Oda",
      "description": "Pirate adventure...",
      "rating": 4.9,
      "status": "ongoing",
      "genres": ["Adventure", "Comedy"],
      "source_url": "https://manga-source.com/one-piece"
    }
  }'
\`\`\`

### Add Manhwa
\`\`\`bash
curl -X POST http://localhost:3000/api/scraper \
  -H "x-api-key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "manhwa",
    "data": {
      "title": "Solo Leveling",
      "author": "Chugong",
      "artist": "DUBU (REDICE STUDIO)",
      "description": "Hunter story...",
      "rating": 4.9,
      "status": "completed",
      "genres": ["Action", "Fantasy"],
      "source_url": "https://manhwa-source.com/solo-leveling"
    }
  }'
\`\`\`

### Add Chapter (for both manga and manhwa)
\`\`\`bash
curl -X POST http://localhost:3000/api/scraper \
  -H "x-api-key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chapter",
    "data": {
      "content_source_url": "https://manga-source.com/one-piece",
      "chapter_number": 1,
      "title": "Chapter 1: Romance Dawn",
      "pages": ["https://example.com/page1.jpg"],
      "source_url": "https://manga-source.com/one-piece/chapter-1"
    }
  }'
\`\`\`

### Batch Upload
\`\`\`bash
curl -X POST http://localhost:3000/api/scraper \
  -H "x-api-key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "batch",
    "data": {
      "manga": [...],
      "manhwa": [...],
      "chapters": [...]
    }
  }'
\`\`\`

## 🎯 Best Practices

### 1. Content Type Separation
\`\`\`python
# Separate your scrapers by content type
manga_scraper = MangaScraper()
manhwa_scraper = ManhwaScraper()

# Use appropriate endpoints
api.add_manga(manga_data)
api.add_manhwa(manhwa_data)
\`\`\`

### 2. Genre Mapping
\`\`\`python
# Map genres appropriately for each type
manga_genres = {
    "shounen": "Action",
    "shoujo": "Romance",
    "seinen": "Drama",
    "josei": "Slice of Life"
}

manhwa_genres = {
    "action": "Action",
    "fantasy": "Fantasy",
    "romance": "Romance",
    "drama": "Drama"
}
\`\`\`

### 3. Error Handling by Type
\`\`\`python
def add_content_with_retry(api, content_data, content_type):
    max_retries = 3
    for attempt in range(max_retries):
        try:
            if content_type == "manga":
                result = api.add_manga(content_data)
            elif content_type == "manhwa":
                result = api.add_manhwa(content_data)
            
            if result.get('success'):
                return result
            else:
                print(f"Failed to add {content_type}: {result.get('error')}")
                
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)
\`\`\`

## 📈 Monitoring

### Content Type Statistics
\`\`\`python
def track_content_stats():
    stats = {
        "manga": {"success": 0, "failed": 0},
        "manhwa": {"success": 0, "failed": 0},
        "chapters": {"success": 0, "failed": 0}
    }
    
    # Track each upload
    for content in content_list:
        try:
            if content["type"] == "manga":
                result = api.add_manga(content["data"])
                if result.get("success"):
                    stats["manga"]["success"] += 1
                else:
                    stats["manga"]["failed"] += 1
            # Similar for manhwa...
        except Exception:
            stats[content["type"]]["failed"] += 1
    
    return stats
\`\`\`

## 🔧 Testing

### Test Both Content Types
\`\`\`bash
# Test manga endpoint
curl -X POST http://localhost:3000/api/scraper \
  -H "x-api-key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"type": "manga", "data": {"title": "Test Manga", "author": "Test", "source_url": "test-manga"}}'

# Test manhwa endpoint
curl -X POST http://localhost:3000/api/scraper \
  -H "x-api-key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"type": "manhwa", "data": {"title": "Test Manhwa", "author": "Test", "source_url": "test-manhwa"}}'
\`\`\`

## 🎨 UI Features

### Content Type Toggle
- Switch between manga and manhwa views
- Separate trending lists for each type
- Type-specific search and filtering
- Visual badges to distinguish content types

### Reading Experience
- Same reader works for both manga and manhwa
- Progress tracking across both types
- Unified favorites and bookmarks
- Cross-type recommendations

Happy scraping both manga and manhwa! 🕷️📚🎌
