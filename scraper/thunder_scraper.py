import asyncio
import logging
import random
import time
from datetime import datetime
from typing import Dict, List, Optional, Any
from playwright.async_api import async_playwright, Page, Browser, BrowserContext
import re
from dotenv import load_dotenv
from supabase import create_client, Client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# List of user agents to rotate through
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
]

class ThunderScraper:
    def __init__(self):
        """Initialize the Thunder Scans scraper"""
        load_dotenv('.env.local')
        self.base_url = "https://en-thunderscans.com"
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        self.max_retries = 3
        self.retry_delay = 5  # seconds

    async def setup_browser(self) -> None:
        """Set up browser with enhanced stealth settings"""
        playwright = await async_playwright().start()
        
        # Launch browser with additional arguments
        self.browser = await playwright.chromium.launch(
            headless=False,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-features=IsolateOrigins,site-per-process',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-sandbox',
                '--window-size=1920,1080',
            ]
        )
        
        # Create context with enhanced stealth settings
        self.context = await self.browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent=random.choice(USER_AGENTS),
            bypass_csp=True,
            extra_http_headers={
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
            }
        )
        
        # Add extensive stealth scripts
        await self.context.add_init_script("""
            // Overwrite the 'webdriver' property
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });

            // Overwrite the 'plugins' property
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5].map(() => ({
                    name: 'Chrome PDF Plugin',
                    filename: 'internal-pdf-viewer',
                    description: 'Portable Document Format'
                }))
            });

            // Add chrome object
            window.chrome = {
                runtime: {},
                loadTimes: function() {},
                csi: function() {},
                app: {}
            };

            // Modify permissions
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
            );
        """)
        
        self.page = await self.context.new_page()
        
        # Add additional page configurations
        await self.page.set_extra_http_headers({
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
        })

    async def handle_cloudflare(self, timeout: int = 60) -> bool:
        """
        Handle Cloudflare protection with improved detection and waiting
        Returns True if successfully bypassed, False otherwise
        """
        try:
            logger.info("Checking for Cloudflare...")
            
            # Wait for initial page load
            await self.page.wait_for_load_state('domcontentloaded')
            
            # Add random delay to appear more human-like
            await asyncio.sleep(random.uniform(2, 4))
            
            # Check for Cloudflare elements
            cloudflare_selectors = [
                'iframe[src*="cloudflare"]',
                '#challenge-form',
                '#cf-challenge-running',
                '.cf-browser-verification',
                '#cf_captcha_container'
            ]
            
            for selector in cloudflare_selectors:
                if await self.page.query_selector(selector):
                    logger.info(f"Cloudflare challenge detected ({selector})")
                    logger.info("Waiting for manual completion...")
                    
                    # Wait for main content to appear (indicating Cloudflare is passed)
                    try:
                        await self.page.wait_for_selector('nav, .menu, .navbar', 
                                                        timeout=timeout * 1000,
                                                        state='visible')
                        logger.info("Cloudflare challenge completed!")
                        return True
                    except Exception as e:
                        logger.error(f"Timeout waiting for Cloudflare completion: {e}")
                        return False
            
            logger.info("No Cloudflare challenge detected")
            return True
            
        except Exception as e:
            logger.error(f"Error handling Cloudflare: {e}")
            return False

    async def safe_navigate(self, url: str, max_retries: int = 3) -> bool:
        """Safely navigate to a URL with retries and error handling"""
        for attempt in range(max_retries):
            try:
                logger.info(f"Navigating to {url} (attempt {attempt + 1}/{max_retries})")
                
                # Random delay between attempts
                if attempt > 0:
                    delay = random.uniform(2, 5) * attempt
                    logger.info(f"Waiting {delay:.1f} seconds before retry...")
                    await asyncio.sleep(delay)
                
                # Navigate to the page
                response = await self.page.goto(url, wait_until='domcontentloaded')
                
                if not response:
                    logger.error("No response received")
                    continue
                
                if response.status == 403:
                    logger.warning("Received 403 Forbidden - possible blocking")
                    # Take screenshot for debugging
                    await self.page.screenshot(path=f'error_403_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png')
                    continue
                
                # Handle Cloudflare
                if not await self.handle_cloudflare():
                    continue
                
                # Wait for network to be idle
                await self.page.wait_for_load_state('networkidle')
                
                return True
                
            except Exception as e:
                logger.error(f"Navigation error (attempt {attempt + 1}): {e}")
                await self.page.screenshot(path=f'error_nav_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png')
                
                if attempt == max_retries - 1:
                    logger.error("Max retries reached, giving up")
                    return False
        
        return False

    async def __aenter__(self):
        """Initialize browser and page with anti-detection measures"""
        await self.setup_browser()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Close browser"""
        if self.browser:
            await self.browser.close()

    async def analyze_site_structure(self):
        """Analyze the site structure and navigation"""
        try:
            logger.info("Starting site structure analysis...")
            
            # Attempt to navigate to main page
            if not await self.safe_navigate(self.base_url):
                logger.error("Failed to access the site")
                return None
            
            # Find navigation elements
            logger.info("Analyzing navigation structure...")
            nav_items = await self.page.query_selector_all('nav a, .menu a, .navbar a, header a')
            nav_structure = {}
            
            for item in nav_items:
                try:
                    text = await item.text_content()
                    href = await item.get_attribute('href')
                    if text and href:
                        nav_structure[text.strip()] = href
                except Exception as e:
                    logger.warning(f"Error processing nav item: {e}")
                    continue
                
            logger.info("\nNavigation structure:")
            for text, href in nav_structure.items():
                logger.info(f"- {text}: {href}")
            
            # Look specifically for manhwa/manhua sections
            logger.info("\nSearching for manhwa/manhua sections...")
            content_links = await self.page.query_selector_all(', '.join([
                'a[href*="manhwa"]',
                'a[href*="manhua"]',
                'a:text("manhwa")',
                'a:text("manhua")',
                '.menu a',
                '.genres a'
            ]))
            
            logger.info("Content type links found:")
            for link in content_links:
                try:
                    text = await link.text_content()
                    href = await link.get_attribute('href')
                    if text and href:
                        logger.info(f"- {text}: {href}")
                except Exception as e:
                    logger.warning(f"Error processing content link: {e}")
                    continue
            
            # Take a screenshot for analysis
            await self.page.screenshot(path='thunder_structure.png')
            logger.info("\nSaved site structure screenshot to thunder_structure.png")
            
            return nav_structure
            
        except Exception as e:
            logger.error(f"Error analyzing site structure: {e}")
            await self.page.screenshot(path=f'error_screenshot_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png')
            return None

async def main():
    """Main entry point for reconnaissance"""
    try:
        async with ThunderScraper() as scraper:
            logger.info("Starting Thunder Scans reconnaissance...")
            structure = await scraper.analyze_site_structure()
            
            if structure:
                logger.info("\nReconnaissance completed successfully!")
                logger.info("Press Enter to exit...")
                input()
            else:
                logger.error("Failed to analyze site structure")
            
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main()) 