import json
import os
import requests
from dotenv import load_dotenv

load_dotenv()

# Use a placeholder if no key provided, or actual logic
FREEPIK_API_KEY = os.getenv("FREEPIK_API_KEY")

# Mapping queries for better results
IMAGE_QUERIES = {
    "Latanoprost": "eye drops bottle medical packaging",
    "Timolol": "eye drop medication bottle",
    "Lisinopril": "prescription pills bottle white",
    "Artificial Tears": "lubricating eye drops blue bottle",
    "Atorvastatin": "cholesterol medication pills bottle",
    "Metformin": "white pills medical bottle",
}

# Fallback images if API fails or no key
FALLBACK_IMAGES = {
    "Latanoprost": "https://img.freepik.com/free-photo/eye-drops-bottle-composition_23-2148914652.jpg",
    "Timolol": "https://img.freepik.com/free-photo/medical-eye-dropper-bottle_23-2148566373.jpg",
    "Lisinopril": "https://img.freepik.com/free-photo/white-plastic-bottle-pills_23-2148214220.jpg",
    "Artificial Tears": "https://img.freepik.com/free-photo/eye-drops-bottle-still-life_23-2149179047.jpg",
    "Atorvastatin": "https://img.freepik.com/free-photo/pill-bottle-spilling-pills-surface_1232-2639.jpg",
    "Metformin": "https://img.freepik.com/free-photo/bottle-pills_23-2148197720.jpg"
}

def get_freepik_image(query):
    # Mock implementation for hackathon speed/reliability if no key
    # In a real scenario, this would call the API
    return FALLBACK_IMAGES.get(query.split()[0], "https://img.freepik.com/free-vector/medicine-concept-illustration_114360-3274.jpg")

def update_tonic_data_with_images():
    file_path = "mock_sites/tonic_data.json"
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    products = data.get("pharmacy_products", [])
    
    for product in products:
        # Get image based on name
        search_term = product["name"].split(" ")[0] # Simple split
        image_url = get_freepik_image(search_term)
        product["image_url"] = image_url
        print(f"Assigned image for {product['name']}: {image_url}")

    data["pharmacy_products"] = products
    
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Updated {file_path} with image URLs.")

if __name__ == "__main__":
    update_tonic_data_with_images()
