from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import librosa
import numpy as np
import tempfile
import os
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification

# Initialize FastAPI
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and feature extractor
model_name = "firdhokk/speech-emotion-recognition-with-openai-whisper-large-v3"
feature_extractor = AutoFeatureExtractor.from_pretrained(model_name)
model = AutoModelForAudioClassification.from_pretrained(model_name)

# Define emotions list (as per model configuration)
emotions = ['angry', 'calm', 'disgust', 'fearful', 'happy', 'neutral', 'sad', 'surprised']

@app.post("/predict")
async def predict_emotion(file: UploadFile = File(...)):
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Load and preprocess audio
        waveform, sample_rate = librosa.load(
            tmp_path,
            sr=feature_extractor.sampling_rate,
            mono=True
        )
        os.unlink(tmp_path)  # Delete temporary file

        # Feature extraction
        inputs = feature_extractor(
            waveform,
            sampling_rate=feature_extractor.sampling_rate,
            return_tensors="pt",
            padding=True
        )

        # Model prediction
        with torch.no_grad():
            logits = model(**inputs).logits

        # Process output
        probabilities = torch.nn.functional.softmax(logits, dim=-1)
        predicted_class = torch.argmax(probabilities, dim=-1).item()
        emotion = model.config.id2label[predicted_class]

        return {"emotion": emotion, "confidence": probabilities[0][predicted_class].item()}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)