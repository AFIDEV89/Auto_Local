from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
import uvicorn
import os
import io
from dotenv import load_dotenv
from utils.ai_engine import call_gemini_api
from utils.watermark import apply_watermark

# Load environment variables from the same directory as main.py
env_path = os.path.join(os.path.dirname(__file__), '.env')
print(f"[DEBUG] App: Loading .env from {env_path}")
print(f"[DEBUG] App: .env exists? {os.path.exists(env_path)}")
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="Autoform AI Visualizer API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LOGO_PATH = "assets/logo.png"

@app.get("/")
async def root():
    return {"message": "Autoform AI Visualizer API is active"}

@app.post("/generate-design/")
async def generate_design(
    design_file: UploadFile = File(None),
    design_name: str = Form(...),
    car_model: str = Form(...),
    view: str = Form("front"), # front or rear
    lighting: str = Form("day") # day or night
):
    try:
        # 1. Determine paths
        print(f"[DEBUG] Starting generation for Model: {car_model}, View: {view}, Design: {design_name}")
        
        # Looking for {car_model}_{view}_base.jpg
        base_car_filename = f"{car_model}_{view}_base.jpg"
        base_car_path = os.path.join("assets", "interiors", base_car_filename)
        print(f"[DEBUG] Initial target interior path: {base_car_path}")
        
        # fallback to simple {car_model}_base.jpg if specific view doesn't exist
        if not os.path.exists(base_car_path):
            print(f"[DEBUG] View-specific interior not found. Falling back to base model.")
            base_car_path = os.path.join("assets", "interiors", f"{car_model}_base.jpg")
        
        print(f"[DEBUG] Final interior path used: {base_car_path}")
        if not os.path.exists(base_car_path):
            print(f"[ERROR] Critical: Base car image missing at {base_car_path}")
        
        # 2. Get design image
        if design_file:
            design_data = await design_file.read()
        else:
            design_slug = design_name.lower().replace(" ", "_")
            design_path = None
            for ext in [".jpg", ".png", ".jpeg"]:
                candidate = os.path.join("assets", "designs", f"{design_slug}{ext}")
                if os.path.exists(candidate):
                    design_path = candidate
                    break
            
            if design_path:
                print(f"[DEBUG] Loading design asset from: {design_path}")
                with open(design_path, "rb") as f:
                    design_data = f.read()
            else:
                print(f"[ERROR] Design asset not found for {design_name}")
                return JSONResponse(
                    status_code=404,
                    content={"status": "error", "message": f"Asset {design_name} not found. Looked for: {design_slug}.jpg/.png/.jpeg in assets/designs/"}
                )

        # 3. Call Gemini AI Engine with Generative Context
        print(f"[DEBUG] Calling Gemini Generative Engine (Lighting: {lighting})...")
        generated_img_bytes = call_gemini_api(design_data, base_car_path, lighting)
        print(f"[DEBUG] Gemini process complete. Image size: {len(generated_img_bytes)} bytes")
        
        # 4. Apply Watermark
        print(f"[DEBUG] Checking for logo at: {LOGO_PATH}")
        if os.path.exists(LOGO_PATH):
            print(f"[DEBUG] Applying Autoform watermark...")
            final_img_bytes = apply_watermark(generated_img_bytes, LOGO_PATH)
        else:
            print(f"[DEBUG] Logo not found. Skipping watermark.")
            final_img_bytes = generated_img_bytes

        print(f"[DEBUG] Request finished successfully.")

        # 5. Return binary
        return Response(content=final_img_bytes, media_type="image/jpeg")

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"Server Error: {str(e)}"}
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
