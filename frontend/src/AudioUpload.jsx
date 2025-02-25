// AudioUpload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import uploadIcon from '/img/upload.webp'; 

function AudioUpload() {
  const [audioFile, setAudioFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileName, setFileName] = useState('Nenhum arquivo selecionado');
  const [fileSubmitted, setFileSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0] || null;
    setAudioFile(file);
    if (file) {
      setFileName(file.name);
      setFileSubmitted(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!audioFile) {
      setUploadStatus('Por favor, selecione um arquivo de áudio.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const resultString = await response.text();
        setUploadStatus('Arquivo enviado com sucesso!');
        setFileSubmitted(true);
        navigate('/result', {
          state: {
            fileName,
            resultString,
          },
        });
      } else {
        setUploadStatus('Erro no envio do arquivo.');
      }
    } catch (error) {
      setUploadStatus(`Erro ao enviar arquivo: ${error.message}`);
    }
  };

  return (
    <div id="main">
      <h1>Definição das Emoções por Meio da Voz</h1>
      <p>Clique na nuvem e envie um arquivo de áudio para analisar as emoções presentes na fala.</p>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleFileChange} 
          id="file-upload" 
          style={{ display: 'none' }}
        />
        
        {!fileSubmitted ? (
          <label htmlFor="file-upload" className="custom-file-upload">
            <img 
              src={uploadIcon} 
              alt="Upload Icon" 
              className="upload-icon" 
              width="60px" 
            />
            {fileName}
          </label>
        ) : (
          <div className="file-name-display">
            {fileName}
          </div>
        )}

        {audioFile && !fileSubmitted && (
          <button type="submit" className="submit-btn">
            Enviar Áudio
          </button>
        )}
        
        {uploadStatus && <p className="status-message" style={{ color: 'red' }}>{uploadStatus}</p>}
      </form>
    </div>
  );
}

export default AudioUpload;
