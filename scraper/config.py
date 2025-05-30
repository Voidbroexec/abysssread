import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Scraper configuration
SCRAPER_CONFIG = {
    "delay_between_requests": 1,  # Delay in seconds between requests
    "max_retries": 3,  # Maximum number of retries for failed requests
    "timeout": 30,  # Request timeout in seconds
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "headers": {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
        "DNT": "1",
        "Upgrade-Insecure-Requests": "1",
    }
}

# Source configuration
SOURCES = {
    "asura": {
        "base_url": "https://asura.gg",
        "manga_list_path": "/manga/",
        "page_param": "page",
        "order_param": "order",
        "default_order": "update"
    }
}

# Database tables
TABLES = {
    "content": "content",
    "chapters": "chapters"
}

# Content types
CONTENT_TYPES = {
    "MANHWA": "manhwa",
    "MANGA": "manga"
}

# Status mappings
STATUS_MAPPINGS = {
    "ongoing": "ongoing",
    "completed": "completed",
    "dropped": "dropped",
    "hiatus": "hiatus"
} 