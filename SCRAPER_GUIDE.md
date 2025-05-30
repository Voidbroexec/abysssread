# 🤖 AbyssRead Scraper Integration Guide

Complete guide for integrating your scraper with AbyssRead.

## 🔑 Authentication

All scraper requests require the API key in headers:

\`\`\`bash
x-api-key: abyssread_secure_api_key_2024_manhwa_scraper_v1
\`\`\`

## 📊 Data Structure

### Manhwa Object
\`\`\`json
{
  "title": "Solo Leveling",           // Required
  "author": "Chugong",               // Required
  "artist": "DUBU (REDICE STUDIO)",  // Optional
  "description": "Story about...",    // Optional
  "cover_url": "https://...",         // Optional
  "rating": 4.9,                     // Optional (0-5)
  "status": "completed",             // Optional: ongoing|completed|hiatus
  "genres": ["Action", "Fantasy"],   // Optional array
  "source_url": "https://..."        // Required (unique identifier)
}
\`\`\`

### Chapter Object
\`\`\`json
{
  "manhwa_source_url": "https://...", // Required (links to manhwa)
  "chapter_number": 1,                // Required (integer)
  "title": "Chapter 1: Title",        // Optional
  "pages": ["https://page1.jpg"],     // Required array of image URLs
  "release_date": "2024-01-01T...",   // Optional ISO date
  "source_url": "https://..."         // Required (unique identifier)
}
\`\`\`

## 🐍 Python Implementation

### Installation
\`\`\`bash
pip install requests
\`\`\`

### Basic Usage
\`\`\`python
from scraper_example import AbyssReadAPI

# Initialize
api = AbyssReadAPI("http://localhost:3000", "your_api_key")

# Add manhwa
manhwa_data = {
    "title": "Solo Leveling",
    "author": "Chugong",
    "description": "Hunter story...",
    "rating": 4.9,
    "status": "completed",
    "genres": ["Action", "Fantasy"],
    "source_url": "https://source.com/solo-leveling"
}

result = api.add_manhwa(manhwa_data)
print(f"Success: {result['success']}")

# Add chapter
chapter_data = {
    "manhwa_source_url": "https://source.com/solo-leveling",
    "chapter_number": 1,
    "title": "Chapter 1: The World's Weakest",
    "pages": [
        "https://example.com/page1.jpg",
        "https://example.com/page2.jpg"
    ],
    "source_url": "https://source.com/solo-leveling/chapter-1"
}

result = api.add_chapter(chapter_data)
print(f"Chapter added: {result['success']}")
\`\`\`

### Batch Processing
\`\`\`python
# Batch upload for efficiency
manhwa_list = [manhwa1, manhwa2, manhwa3]
chapters_list = [chapter1, chapter2, chapter3]

result = api.batch_upload(manhwa_list, chapters_list)
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
const { AbyssReadAPI } = require('./scraper-example');

async function main() {
    const api = new AbyssReadAPI("http://localhost:3000", "your_api_key");
    
    // Add manhwa
    const manhwaResult = await api.addManhwa({
        title: "Tower of God",
        author: "SIU",
        description: "Climb the tower...",
        rating: 4.8,
        status: "ongoing",
        genres: ["Adventure", "Fantasy"],
        source_url: "https://source.com/tower-of-god"
    });
    
    console.log("Manhwa added:", manhwaResult.success);
    
    // Add chapter
    const chapterResult = await api.addChapter({
        manhwa_source_url: "https://source.com/tower-of-god",
        chapter_number: 1,
        title: "Chapter 1: Headon's Floor",
        pages: ["https://example.com/page1.jpg"],
        source_url: "https://source.com/tower-of-god/chapter-1"
    });
    
    console.log("Chapter added:", chapterResult.success);
}

main().catch(console.error);
\`\`\`

## 🔄 Error Handling

### Response Format
\`\`\`json
{
  "success": true,
  "message": "Data saved successfully",
  "data": { ... }
}
\`\`\`

### Error Response
\`\`\`json
{
  "error": "Error message",
  "success": false
}
\`\`\`

### Common Errors
- **401 Unauthorized**: Invalid API key
- **404 Not Found**: Manhwa not found (for chapters)
- **400 Bad Request**: Invalid data format
- **500 Internal Error**: Database/server error

### Python Error Handling
\`\`\`python
try:
    result = api.add_manhwa(manhwa_data)
    if result.get('success'):
        print("Success!")
    else:
        print(f"Error: {result.get('error')}")
except requests.exceptions.RequestException as e:
    print(f"Network error: {e}")
\`\`\`

## 🚀 Best Practices

### 1. Rate Limiting
\`\`\`python
import time

for manhwa in manhwa_list:
    api.add_manhwa(manhwa)
    time.sleep(0.1)  # 100ms delay
\`\`\`

### 2. Batch Processing
\`\`\`python
# Process in batches of 50
batch_size = 50
for i in range(0, len(manhwa_list), batch_size):
    batch = manhwa_list[i:i + batch_size]
    api.batch_upload(batch, [])
\`\`\`

### 3. Retry Logic
\`\`\`python
import time
import requests

def retry_request(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except requests.exceptions.RequestException:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)  # Exponential backoff
\`\`\`

### 4. Data Validation
\`\`\`python
def validate_manhwa(data):
    required = ['title', 'author', 'source_url']
    for field in required:
        if not data.get(field):
            raise ValueError(f"Missing required field: {field}")
    
    if data.get('rating') and not 0 <= data['rating'] <= 5:
        raise ValueError("Rating must be between 0 and 5")
\`\`\`

## 📈 Monitoring

### Success Tracking
\`\`\`python
success_count = 0
error_count = 0

for manhwa in manhwa_list:
    try:
        result = api.add_manhwa(manhwa)
        if result.get('success'):
            success_count += 1
        else:
            error_count += 1
            print(f"Failed: {manhwa['title']}")
    except Exception as e:
        error_count += 1
        print(f"Error with {manhwa['title']}: {e}")

print(f"Success: {success_count}, Errors: {error_count}")
\`\`\`

## 🔧 Testing

### Test Connection
\`\`\`bash
curl -X POST http://localhost:3000/api/scraper \
  -H "x-api-key: abyssread_secure_api_key_2024_manhwa_scraper_v1" \
  -H "Content-Type: application/json" \
  -d '{"type": "manhwa", "data": {"title": "Test", "author": "Test", "source_url": "test"}}'
\`\`\`

### Validate Response
\`\`\`python
def test_api_connection():
    test_data = {
        "title": "Test Manhwa",
        "author": "Test Author",
        "source_url": "https://test.com/test"
    }
    
    result = api.add_manhwa(test_data)
    assert result.get('success'), f"API test failed: {result}"
    print("✅ API connection successful")
\`\`\`

## 📞 Support

- Check API response for error messages
- Verify API key is correct
- Ensure AbyssRead server is running
- Check network connectivity
- Review data format requirements

Happy scraping! 🕷️📚
