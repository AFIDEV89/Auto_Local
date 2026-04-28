import requests
import os
from dotenv import load_dotenv

load_dotenv(r'd:\Autoform_Local\autoform-ai-configurator\backend\.env')
api_key = os.getenv("GOOGLE_API_KEY")

url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key={api_key}"
payload = {
    "instances": [{"prompt": "Photorealistic car interior with luxury tan seat covers."}],
    "parameters": {"sampleCount": 1}
}

try:
    response = requests.post(url, json=payload)
    print(response.status_code)
    print(response.text[:200])
except Exception as e:
    print(f"Error: {e}")
