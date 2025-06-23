#!/usr/bin/env python3
"""
Standalone Genkit server for script generation.
Run this with: python genkit_server.py
"""

import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aige.settings')
django.setup()

from genkit import genkit
from genkit.models import gemini
from ads.genkit_service import generate_ad_script

if __name__ == "__main__":
    print("🚀 Starting Genkit server for AIGE script generation...")
    print("📡 Server will be available at http://localhost:3400")
    print("🔑 Make sure GOOGLE_API_KEY is set in your .env file")
    
    # Start the Genkit development server
    genkit.start_server(port=3400)