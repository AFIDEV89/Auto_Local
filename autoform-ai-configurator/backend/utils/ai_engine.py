import google.generativeai as genai
import os
from PIL import Image
import io
from dotenv import load_dotenv

# Ensure .env is loaded from the backend directory
parent_dir = os.path.dirname(os.path.dirname(__file__))
env_path = os.path.join(parent_dir, '.env')
load_dotenv(dotenv_path=env_path)

# Configure the standard Generation API
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def call_gemini_api(design_image_bytes, base_car_image_path, lighting="day"):
    """
    Executes the Pure Gemini Generative Pipeline using dedicated Master Prompts
    for Front Row and Rear Row generation.
    """
    if not os.path.exists(base_car_image_path):
        print(f"Warning: Base car image {base_car_image_path} not found.")
        return design_image_bytes

    with open(base_car_image_path, "rb") as f:
        base_car_bytes = f.read()

    try:
        print(f"[DEBUG] Initiating Dedicated Gemini Image Generation Pipeline...")
        
        # Load multimodal inputs
        car_img = Image.open(io.BytesIO(base_car_bytes))
        design_img = Image.open(io.BytesIO(design_image_bytes))

        is_rear = "rear" in base_car_image_path.lower()
        
        if not is_rear:
            vision_prompt = (
                f"Instruction: Act as an automotive design AI. I have provided a Front Row Interior photo and a Design Specification image of a single car seat.\n\n"
                f"Your task is to generate a high-resolution, photorealistic (8k) image of the front row, with the specified seat covers perfectly installed on both the driver and passenger seats.\n\n"
                f"Main Color & Accents: Identify the primary and accent colors from the Design image. Use these to map the main seat body, side bolsters, and all piping on both front seats to match.\n\n"
                f"Mapping the Pattern (Crucial): Identify the central stitching pattern (e.g., diamond quilt, honeycomb, perforated). Apply this exact texture to the central panels of the front backrests, seat bases, and fully covering the entire front headrests, ensuring no stock headrest material is visible.\n\n"
                f"Logo Placement: If a logo is present in the Design image, place it accurately and symmetrically on the upper backrest of both the driver and passenger seats.\n\n"
                f"Integration & Perspective: Maintain the existing interior environment, lighting ({lighting.upper()}), door trims, and center console of the interior photo."
            )
        else:
            vision_prompt = (
                f"Instruction: Act as an automotive design AI. I have provided a Rear Row Interior photo and a Design Specification image of a single car seat.\n\n"
                f"Your task is to generate a high-resolution, photorealistic (8k) image of the complete rear row bench seat, showing the seat covers installed with the specified design specification.\n\n"
                f"Bench Mapping (Main Design): Map the primary and accent colors to the large sections of the rear bench (seat cushion and backrest sections). The colors should match the primary and accent colors from the Design image.\n\n"
                f"Pattern Extension: Adapt the central stitching pattern (e.g., diamond quilt) from the Design image. This pattern must be extended and applied across the central sections of the rear bench seat.\n\n"
                f"Rear Headrests & Side Details: The central pattern must fully cover all rear headrests (often three positions). The side bolsters of the bench must feature the matching accent piping.\n\n"
                f"Special Rear Features: If the rear seat has a fold-down armrest or specific center console, the design must be applied around them, and any logo from the design image should be placed logically on the central upper section of the rear backrest. Maintain the existing background/exterior visible through the rear windows. Lighting: {lighting.upper()}."
            )

        model = genai.GenerativeModel('gemini-1.5-pro')
        print(f"[DEBUG] Executing Master Prompt ('{'Rear' if is_rear else 'Front'} Row')...")
        response = model.generate_content([vision_prompt, car_img, design_img])
        
        # Logging standard Gemini Response
        print(f"[DEBUG] Gemini Image Generation Engine Output: {response.text[:200]}...")
        
    except Exception as e:
        print(f"[ERROR] Gemini Generative API Fail: {e}")

    # ========================================================
    # FALLBACK DELETED AS REQUESTED.
    # The pipeline is now strictly a Gemini prompt pipeline.
    # We return the base car bytes so the UI doesn't crash from binary format errors.
    # ========================================================
    return base_car_bytes

