from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from torchvision import transforms
from PIL import Image
import torch
import io
import json
import logging
from typing import Optional
from identify_plant import load_model

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS - Essential for frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load class names from JSON file
try:
    with open("class_names.json", "r") as f:
        class_names = json.load(f)
    NUM_CLASSES = len(class_names)
    logger.info(f"Loaded {NUM_CLASSES} class names.")
except Exception as e:
    logger.error(f"Failed to load class names: {str(e)}")
    raise RuntimeError("Could not initialize the application: missing or invalid class_names.json")

# Load the trained model
try:
    model = load_model(num_classes=NUM_CLASSES, path="identify_plant.pth")
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Model loading failed: {str(e)}")
    raise RuntimeError("Could not initialize the model")

# Image transformation pipeline
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Match ViT input size
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])  # Normalize RGB
])

@app.post("/api/identify")
async def predict(
    file: UploadFile = File(...),
    confidence_threshold: Optional[float] = 0.4
):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        logger.info(f"Received image: {file.filename}")

        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        input_tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            output = model(input_tensor)
            probs = torch.nn.functional.softmax(output, dim=1)
            confidence, predicted_class = probs.max(1)
            confidence = confidence.item()
            predicted_index = predicted_class.item()

        label = (
            "Unknown plant" if confidence < confidence_threshold
            else class_names[predicted_index]
        )

        response = {
            "predicted_class": label,
            "confidence": round(confidence, 4),
            "success": True
        }

        logger.info(f"Prediction: {label} ({confidence:.2f})")
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/healthcheck")
async def healthcheck():
    return {"status": "healthy", "model_loaded": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
