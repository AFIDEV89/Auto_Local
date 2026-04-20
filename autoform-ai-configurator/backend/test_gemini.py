from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

env_path = r'd:\Autoform_Local\autoform-ai-configurator\backend\.env'
load_dotenv(dotenv_path=env_path)
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

model = 'gemini-1.5-flash'
prompt = "Are you capable of generating an image directly as an output, or do you only output text?"

try:
    response = client.models.generate_content(
        model=model,
        contents=[prompt]
    )
    print("Response:")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
