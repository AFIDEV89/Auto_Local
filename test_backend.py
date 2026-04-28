import requests

url = "http://localhost:8000/generate-design/"
data = {
    "design_name": "Premium Diamond Tan",
    "car_model": "Thar",
    "view": "front",
    "lighting": "day"
}

try:
    response = requests.post(url, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Connection Error: {e}")
