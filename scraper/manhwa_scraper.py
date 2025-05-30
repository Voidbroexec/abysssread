import asyncio
import json
import os
from typing import Dict, List, Optional
from datetime import datetime
import re
from urllib.parse import urljoin
from playwright.async_api import async_playwright, Page, Browser, Playwright, TimeoutError

class ManhwaScraper:
    def __init__(self):
        self.base_url = "https://madarascans.com"
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None
        self.playwright: Optional[Playwright] = None

    async def initialize(self):
        """Initialize Playwright browser"""
        print("Initializing browser...")
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=False,  # Show the browser
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        self.page = await self.browser.new_page()
        await self.page.set_viewport_size({"width": 1920, "height": 1080})
        
        # Set a realistic user agent
        await self.page.set_extra_http_headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })
        
        print("Waiting for initial setup (5 seconds for manual intervention if needed)...")
        await asyncio.sleep(5)  # Wait for manual intervention if needed

    async def close(self):
        """Close browser and playwright"""
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def wait_for_load(self, selector: str, timeout: int = 30000) -> bool:
        """Wait for an element to load with timeout handling"""
        try:
            await self.page.wait_for_selector(selector, timeout=timeout)
            return True
        except TimeoutError:
            print(f"Timeout waiting for selector: {selector}")
            return False

    async def get_manhwa_list(self, page_num: int = 1) -> List[Dict]:
        """Get list of manhwa from the archive page"""
        print(f"Getting manhwa list from page {page_num}")
        url = f"{self.base_url}/series/page/{page_num}/"
        
        try:
            await self.page.goto(url, wait_until="networkidle", timeout=60000)
            await asyncio.sleep(2)  # Give JavaScript time to execute
            
            # Wait for the manhwa cards to load
            if not await self.wait_for_load(".bsx"):
                print("No manhwa cards found")
                return []
            
            # Extract manhwa data
            manhwa_list = await self.page.evaluate("""
                () => {
                    const cards = document.querySelectorAll('.bsx');
                    return Array.from(cards).map(card => {
                        const linkEl = card.querySelector('a');
                        const titleEl = card.querySelector('.tt');
                        const coverEl = card.querySelector('img');
                        const ratingEl = card.querySelector('.rating');
                        const colorEl = card.querySelector('.colored');
                        
                        if (!linkEl || !titleEl) return null;
                        
                        const href = linkEl.getAttribute('href');
                        const slug = href ? href.split('/series/')[1]?.replace(/\\/$/, '') : '';
                        
                        return {
                            title: titleEl.textContent.trim(),
                            url: href,
                            slug: slug,
                            rating: ratingEl ? parseFloat(ratingEl.textContent) : 0.0,
                            is_colored: !!colorEl,
                            cover_url: coverEl ? coverEl.getAttribute('src') : null
                        };
                    }).filter(Boolean);
                }
            """)
            
            print(f"Found {len(manhwa_list)} manhwa on page {page_num}")
            return manhwa_list
            
        except Exception as e:
            print(f"Error getting manhwa list: {e}")
            return []

    async def get_chapter_list(self, manhwa_url: str) -> List[Dict]:
        """Get list of chapters for a manhwa"""
        print(f"Getting chapter list from {manhwa_url}")
        full_url = urljoin(self.base_url, manhwa_url)
        
        try:
            await self.page.goto(full_url, wait_until="networkidle", timeout=60000)
            await asyncio.sleep(2)  # Give JavaScript time to execute
            
            # Wait for the chapter list to load
            if not await self.wait_for_load(".chbox"):
                print("No chapter list found")
                return []
            
            # Extract chapter data
            chapters = await self.page.evaluate("""
                () => {
                    const items = document.querySelectorAll('li[data-num]');
                    return Array.from(items).map(item => {
                        const linkEl = item.querySelector('a');
                        const numberEl = item.querySelector('.chapternum');
                        const dateEl = item.querySelector('.chapter-date');
                        
                        if (!linkEl || !numberEl) return null;
                        
                        const chapterNumber = parseFloat(item.getAttribute('data-num'));
                        
                        return {
                            title: numberEl.textContent.trim(),
                            url: linkEl.getAttribute('href'),
                            chapter_number: chapterNumber,
                            date: dateEl ? dateEl.textContent.trim() : null
                        };
                    }).filter(Boolean).sort((a, b) => b.chapter_number - a.chapter_number);
                }
            """)
            
            print(f"Found {len(chapters)} chapters")
            return chapters
            
        except Exception as e:
            print(f"Error getting chapter list: {e}")
            return []

    async def get_chapter_images(self, chapter_url: str) -> List[str]:
        """Get list of image URLs for a chapter"""
        print(f"Getting chapter images from {chapter_url}")
        full_url = urljoin(self.base_url, chapter_url)
        
        try:
            await self.page.goto(full_url, wait_until="networkidle", timeout=60000)
            await asyncio.sleep(2)  # Give JavaScript time to execute
            
            # Wait for the reader to load
            if not await self.wait_for_load(".reading-content img"):
                print("No images found")
                return []
            
            # Extract image URLs
            images = await self.page.evaluate("""
                () => {
                    const images = document.querySelectorAll('.reading-content img');
                    return Array.from(images)
                        .map(img => img.getAttribute('src') || img.getAttribute('data-src'))
                        .filter(src => src && !src.includes('loading.gif'));
                }
            """)
            
            print(f"Found {len(images)} images")
            return images
            
        except Exception as e:
            print(f"Error getting chapter images: {e}")
            return []

    async def get_manhwa_details(self, url: str) -> Dict:
        """Get detailed information about a specific manhwa"""
        print(f"Getting manhwa details from {url}")
        full_url = urljoin(self.base_url, url)
        
        try:
            await self.page.goto(full_url, wait_until="networkidle", timeout=60000)
            await asyncio.sleep(2)  # Give JavaScript time to execute
            
            # Wait for content to load
            if not await self.wait_for_load(".tt"):
                print("No manhwa details found")
                return {}
            
            # Extract manhwa details
            details = await self.page.evaluate("""
                () => {
                    const title = document.querySelector('.tt')?.textContent.trim();
                    const description = document.querySelector('.entry-content')?.textContent.trim();
                    const coverImg = document.querySelector('.thumb img');
                    const genreEls = document.querySelectorAll('.genres a');
                    const statusEl = document.querySelector('.status');
                    const ratingEl = document.querySelector('.rating');
                    
                    return {
                        title: title || '',
                        description: description || '',
                        cover_url: coverImg ? coverImg.getAttribute('src') : null,
                        genres: Array.from(genreEls).map(el => el.textContent.trim()),
                        status: statusEl ? statusEl.textContent.trim().toLowerCase() : 'ongoing',
                        rating: ratingEl ? parseFloat(ratingEl.textContent) : 0.0
                    };
                }
            """)
            
            # Get chapters
            chapters = await self.get_chapter_list(url)
            details['chapters'] = chapters
            details['total_chapters'] = len(chapters)
            
            return details
            
        except Exception as e:
            print(f"Error getting manhwa details: {e}")
            return {}

async def main():
    """Test the scraper"""
    scraper = ManhwaScraper()
    await scraper.initialize()
    
    try:
        # Test getting manhwa list
        print("\nTesting manhwa list...")
        manhwa_list = await scraper.get_manhwa_list(1)
        print(f"Found {len(manhwa_list)} manhwa")
        
        if manhwa_list:
            # Test getting manhwa details
            print("\nTesting manhwa details...")
            first_manhwa = manhwa_list[0]
            details = await scraper.get_manhwa_details(first_manhwa['url'])
            print(f"Got details for: {details.get('title', 'Unknown')}")
            
            # Test getting chapter images
            if details['chapters']:
                print("\nTesting chapter images...")
                first_chapter = details['chapters'][0]
                images = await scraper.get_chapter_images(first_chapter['url'])
                print(f"Found {len(images)} images in chapter")
        
    finally:
        await scraper.close()

if __name__ == "__main__":
    asyncio.run(main()) 