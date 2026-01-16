import os
import requests
from dotenv import load_dotenv

load_dotenv()

FREEPIK_API_KEY = os.getenv("FREEPIK_API_KEY")

def search_freepik_image(query):
    """
    Searches Freepik for an image matching the query and returns the URL.
    This is a mock implementation as the actual Freepik API might have specific endpoints and rate limits.
    For a hackathon, we might want to pre-fetch or use a specific set of images.
    """
    if not FREEPIK_API_KEY:
        print("Warning: FREEPIK_API_KEY not found.")
        return None

    url = "https://api.freepik.com/v1/resources"  # Example endpoint, verify with documentation
    headers = {
        "x-freepik-api-key": FREEPIK_API_KEY
    }
    params = {
        "locale": "en-US",
        "page": 1,
        "limit": 1,
        "term": query,
        "filters": {
            "content_type": "photo" # or vector
        }
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        if data and data.get('data'):
            return data['data'][0]['image']['source']['url'] # Simplified path
    except Exception as e:
        print(f"Error fetching image from Freepik: {e}")
        return None

# For the static site, we can run a script to populate the JSON or just fetch dynamically if we had a backend.
# Since we are "pre-baking", we can run a script to update the tonic_data.json with image URLs.
