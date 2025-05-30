-- Add unique constraint on source_url for content table
ALTER TABLE content
ADD CONSTRAINT content_source_url_key UNIQUE (source_url);

-- Add unique constraint for chapters
ALTER TABLE chapters
ADD CONSTRAINT chapters_content_id_chapter_number_key UNIQUE (content_id, chapter_number); 