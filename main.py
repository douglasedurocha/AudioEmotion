from fastapi import FastAPI, File, UploadFile
import librosa
import numpy as np
import pickle
import io
from pydantic import BaseModel

app = FastAPI()

# Carregar modelo pré-treinado
with open("emotion_model.pkl", "rb") as f:
    model = pickle.load(f)

# Classes de emoções
EMOTIONS = ["feliz", "neutro", "triste", "raiva", "medo", "surpreso", "calmo", "tédio", "cansado", "irritado"]

# Função para extrair características do áudio
def extract_features(audio_data, sr):
    mfccs = librosa.feature.mfcc(y=audio_data, sr=sr, n_mfcc=13)
    mean_mfccs = np.mean(mfccs, axis=1)
    return mean_mfccs

@app.post("/predict_emotion/")
async def predict_emotion(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()
        audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=22050)
        
        # Extrair características
        features = extract_features(audio, sr).reshape(1, -1)
        
        # Fazer previsão
        prediction = model.predict(features)
        predicted_emotion = EMOTIONS[int(prediction[0])]
        
        return {"emotion": predicted_emotion}
    except Exception as e:
        return {"error": str(e)}
