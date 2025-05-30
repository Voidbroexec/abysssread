import os
from supabase import create_client, Client
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Please set SUPABASE_URL and SUPABASE_KEY environment variables")

supabase: Client = create_client(supabase_url, supabase_key)

def setup_database():
    """Set up the database tables"""
    try:
        # Test database connection
        result = supabase.table("content").select("count").execute()
        print("Database connection successful!")
        
        # Add pages column to chapters table
        headers = {
            'apikey': supabase_key,
            'Authorization': f'Bearer {supabase_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        # Get project reference from URL
        project_ref = supabase_url.split('.')[-2].split('/')[-1]
        
        # Use the Management API to execute SQL
        management_url = f"https://api.supabase.com/v1/projects/{project_ref}/sql"
        alter_table_sql = "ALTER TABLE chapters ADD COLUMN IF NOT EXISTS pages text[];"
        
        response = requests.post(
            management_url,
            headers=headers,
            json={'query': alter_table_sql}
        )
        
        if response.status_code == 200:
            print("Added pages column to chapters table!")
        else:
            print(f"Error adding pages column: {response.text}")
        
        return True
    except Exception as e:
        print(f"Error setting up database: {e}")
        return False

if __name__ == "__main__":
    setup_database() 