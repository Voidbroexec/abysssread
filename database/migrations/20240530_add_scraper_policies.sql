-- Drop any conflicting policies first
DROP POLICY IF EXISTS "Service role can manage content" ON content;
DROP POLICY IF EXISTS "Service role can manage chapters" ON chapters;

-- Allow service role to manage content
CREATE POLICY "Service role can manage content" ON content
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Allow service role to manage chapters
CREATE POLICY "Service role can manage chapters" ON chapters
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Ensure the service role can bypass RLS
ALTER TABLE content FORCE ROW LEVEL SECURITY;
ALTER TABLE chapters FORCE ROW LEVEL SECURITY; 