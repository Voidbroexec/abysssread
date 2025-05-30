# Manhwa Scraper Guide

This guide explains how to use the manhwa scraper to import manhwa content into your AbyssRead database.

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your environment variables by creating a `.env` file:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Usage

### Basic Usage

To start scraping manhwa and importing it into your database:

```bash
python scraper/manhwa_import.py
```

By default, this will:
1. Scrape the first page of manhwa listings
2. Import new manhwa into your database
3. Download chapter information
4. Import chapter images

### Advanced Usage

You can modify the scraping behavior by editing the script parameters:

1. Change the number of pages to scrape:
```python
await import_manhwa(num_pages=5)  # Scrape 5 pages
```

2. Only import chapter images for existing manhwa:
```python
await import_chapter_images()
```

## Configuration

The scraper's behavior can be customized through the `config.py` file:

- `delay_between_requests`: Time to wait between requests (default: 1 second)
- `max_retries`: Number of times to retry failed requests
- `timeout`: Request timeout duration
- `user_agent`: Browser user agent to use for requests

## Database Schema

The scraper uses two main tables:

### Content Table
- `id`: Unique identifier
- `title`: Manhwa title
- `description`: Synopsis
- `cover_image`: Cover image URL
- `author`: Author name
- `status`: Publication status (ongoing/completed)
- `type`: Content type (manhwa)
- `genres`: Array of genres
- `total_chapters`: Number of chapters
- `rating`: Average rating
- `source`: Source website

### Chapters Table
- `id`: Unique identifier
- `content_id`: Reference to content table
- `chapter_number`: Chapter number
- `title`: Chapter title
- `source_url`: Original chapter URL
- `pages`: Array of image URLs

## Error Handling

The scraper includes comprehensive error handling:

1. Network errors are caught and retried
2. Parsing errors are logged and skipped
3. Database errors are reported with details
4. Duplicate entries are detected and skipped

## Best Practices

1. Start with a small number of pages for testing
2. Monitor the console output for errors
3. Respect the source website's rate limits
4. Keep your dependencies updated
5. Regularly backup your database

## Troubleshooting

Common issues and solutions:

1. **Connection errors**
   - Check your internet connection
   - Verify the source website is accessible
   - Try increasing the timeout value

2. **Database errors**
   - Verify your Supabase credentials
   - Check your database permissions
   - Ensure tables exist with correct schema

3. **Parsing errors**
   - Check if the source website structure has changed
   - Update the selectors in the scraper
   - Report issues on GitHub

## Contributing

Feel free to contribute to the scraper by:

1. Reporting bugs
2. Suggesting improvements
3. Adding new features
4. Improving documentation

## Legal Notice

Please ensure you have permission to scrape content from your target websites. Always:

1. Read and respect the website's robots.txt
2. Follow the site's terms of service
3. Implement appropriate rate limiting
4. Give proper attribution to content sources

## Support

If you encounter any issues or need help:

1. Check the troubleshooting guide
2. Review the error logs
3. Open an issue on GitHub
4. Contact the development team 