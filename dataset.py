import librosa
import numpy as np
import pickle
import pandas as pd
from datasets import load_dataset

# Função para extrair características (MFCCs)
def extract_features(audio_array, sr):
    print("Extraindo características...")
    mfccs = librosa.feature.mfcc(y=audio_array, sr=sr, n_mfcc=13)
    mean_mfccs = np.mean(mfccs, axis=1)  # Média dos MFCCs para reduzir dimensionalidade
    return mean_mfccs

# Carregar dataset do Hugging Face
dataset = load_dataset("Hemg/Emotion-audio-Dataset")

# Listas para armazenar características e rótulos
features_list = []
labels_list = []

# Processar o dataset
for sample in dataset["train"]:
    audio_array = sample["audio"]["array"]
    sample_rate = sample["audio"]["sampling_rate"]
    label = sample["label"]

    # Extrair características
    features = extract_features(audio_array, sample_rate)
    
    # Armazenar os dados
    features_list.append(features)
    labels_list.append(label)

# Criar DataFrame com os dados
df = pd.DataFrame(features_list)
df["label"] = labels_list

# Salvar em arquivo .pkl
with open("dataset.pkl", "wb") as f:
    pickle.dump(df, f)

print("Arquivo dataset.pkl gerado com sucesso!")
