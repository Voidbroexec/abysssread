import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Please set SUPABASE_URL and SUPABASE_KEY environment variables")

supabase: Client = create_client(supabase_url, supabase_key)

def clear_database():
    """Clear all manga and chapter data from the database"""
    try:
        # Delete all chapters first (due to foreign key constraints)
        chapters_response = supabase.table('chapters').delete().gte('id', '00000000-0000-0000-0000-000000000000').execute()
        print(f"Deleted {len(chapters_response.data)} chapters")
        
        # Delete all content
        content_response = supabase.table('content').delete().gte('id', '00000000-0000-0000-0000-000000000000').execute()
        print(f"Deleted {len(content_response.data)} content items")
        
        return True
    except Exception as e:
        print(f"Error clearing database: {e}")
        return False

if __name__ == "__main__":
    clear_database() 