# Quick Start Guide

## Project Status

This project is currently in development and on hold. The main scraping functionality is paused due to website access restrictions and ethical considerations.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install Playwright browsers:
```bash
playwright install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Project Structure

- `scraper/` - Contains scraping utilities and scripts
- `app/` - Next.js web application
- `database/` - Database schemas and utilities
- `components/` - React components
- `lib/` - Shared utilities

## Development

1. Start the development server:
```bash
pnpm dev
```

2. Run database setup:
```bash
python scraper/setup_db.py
```

## Notes

- Scraping functionality is currently on hold
- The web interface is functional for browsing local data
- Please respect website terms of service and robots.txt when scraping

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details
