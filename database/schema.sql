-- Drop functions and triggers first (if they exist)
DROP FUNCTION IF EXISTS update_content_total_chapters() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_search_vector() CASCADE;

-- Drop tables in correct order (dependent tables first)
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS reading_progress CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS content CASCADE;

-- Drop types
DROP TYPE IF EXISTS content_rating CASCADE;
DROP TYPE IF EXISTS content_status CASCADE;
DROP TYPE IF EXISTS content_type CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set up storage for user avatars and content images
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- Create custom types
CREATE TYPE content_rating AS ENUM ('safe', 'suggestive', 'mature');
CREATE TYPE content_status AS ENUM ('ongoing', 'completed', 'hiatus');
CREATE TYPE content_type AS ENUM ('manga', 'manhwa');

-- Create content table
CREATE TABLE content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    genres TEXT[],
    tags TEXT[],
    authors TEXT[],
    artists TEXT[],
    status content_status DEFAULT 'ongoing',
    content_rating content_rating DEFAULT 'safe',
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    total_chapters INTEGER DEFAULT 0,
    content_type content_type NOT NULL,
    source_url TEXT UNIQUE,
    last_chapter_update TIMESTAMP WITH TIME ZONE,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    search_vector tsvector
);

-- Create chapters table
CREATE TABLE chapters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    chapter_number TEXT NOT NULL,
    title TEXT,
    source_url TEXT UNIQUE,
    pages TEXT[],
    language TEXT DEFAULT 'en',
    scanlation_group TEXT,
    publish_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user preferences tables
CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id)
);

CREATE TABLE bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id)
);

CREATE TABLE likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id)
);

CREATE TABLE reading_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id, chapter_id)
);

-- Create indexes
CREATE INDEX content_search_idx ON content USING GIN(search_vector);
CREATE INDEX content_title_idx ON content USING GIN(to_tsvector('english', title));
CREATE INDEX content_genres_idx ON content USING GIN(genres);
CREATE INDEX content_tags_idx ON content USING GIN(tags);
CREATE INDEX chapters_content_id_idx ON chapters(content_id);
CREATE INDEX reading_progress_user_content_idx ON reading_progress(user_id, content_id);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_updated_at
    BEFORE UPDATE ON content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER chapters_updated_at
    BEFORE UPDATE ON chapters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
DECLARE
    title_vector tsvector;
    desc_vector tsvector;
    tags_vector tsvector;
    genres_vector tsvector;
    authors_vector tsvector;
    artists_vector tsvector;
BEGIN
    -- Create individual vectors with proper weights
    title_vector := setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A');
    desc_vector := setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
    tags_vector := setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
    genres_vector := setweight(to_tsvector('english', COALESCE(array_to_string(NEW.genres, ' '), '')), 'C');
    authors_vector := setweight(to_tsvector('english', COALESCE(array_to_string(NEW.authors, ' '), '')), 'B');
    artists_vector := setweight(to_tsvector('english', COALESCE(array_to_string(NEW.artists, ' '), '')), 'B');

    -- Combine all vectors
    NEW.search_vector := title_vector || desc_vector || tags_vector || genres_vector || authors_vector || artists_vector;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create trigger for search vector updates
CREATE TRIGGER update_content_search_vector
    BEFORE INSERT OR UPDATE OF title, description, tags, genres, authors, artists
    ON content
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();

-- Create indexes for efficient filtering and searching
CREATE INDEX content_type_idx ON content(content_type);
CREATE INDEX content_status_idx ON content(status);
CREATE INDEX content_rating_idx ON content(content_rating);
CREATE INDEX content_updated_idx ON content(updated_at DESC);
CREATE INDEX content_created_idx ON content(created_at DESC);
CREATE INDEX content_views_idx ON content(views DESC);
CREATE INDEX content_likes_idx ON content(likes DESC);
CREATE INDEX content_last_chapter_idx ON content(last_chapter_update DESC);

-- Create function to update total chapters count
CREATE OR REPLACE FUNCTION update_content_total_chapters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE content
        SET total_chapters = (
            SELECT COUNT(*)
            FROM chapters
            WHERE content_id = NEW.content_id
        )
        WHERE id = NEW.content_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE content 
        SET total_chapters = (
            SELECT COUNT(*) 
            FROM chapters 
            WHERE content_id = OLD.content_id
        )
        WHERE id = OLD.content_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update total chapters
CREATE TRIGGER update_content_chapters_count
    AFTER INSERT OR UPDATE OR DELETE ON chapters
    FOR EACH ROW
    EXECUTE FUNCTION update_content_total_chapters();

-- Create RLS policies
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on content" ON content
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on chapters" ON chapters
    FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access on content" ON content
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on chapters" ON chapters
    FOR ALL USING (auth.role() = 'service_role');

-- Allow public read access to safe content
CREATE POLICY "Public can view safe content" ON content
    FOR SELECT
    USING (content_rating = 'safe');

-- Allow authenticated users to view suggestive content
CREATE POLICY "Authenticated users can view suggestive content" ON content
    FOR SELECT
    USING (content_rating = 'suggestive' AND auth.role() = 'authenticated');

-- Allow service role to manage all content
CREATE POLICY "Service role can manage content" ON content
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Allow public read access to chapters of safe content
CREATE POLICY "Public can view safe content chapters" ON chapters
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM content
            WHERE content.id = chapters.content_id
            AND content.content_rating = 'safe'
        )
    );

-- Allow authenticated users to view suggestive content chapters
CREATE POLICY "Authenticated users can view suggestive content chapters" ON chapters
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM content
            WHERE content.id = chapters.content_id
            AND content.content_rating = 'suggestive'
            AND auth.role() = 'authenticated'
        )
    );

-- Allow service role to manage all chapters
CREATE POLICY "Service role can manage chapters" ON chapters
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
