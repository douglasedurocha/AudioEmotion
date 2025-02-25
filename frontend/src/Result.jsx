import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Dados mock para visualização enquanto integra com o backend
const mockData = {
  fileName: "teste.mp3",
  resultString: "surprised"  
};

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state || mockData;

//habilitar após integração
//   useEffect(() => {
    
//     if (!location.state) {
//       navigate('/');
//     }
//   }, [location, navigate]);
  

  const { fileName, resultString } = state;

  const emotionMapping = {
    angry: { 
      emoji: String.fromCodePoint(0x1F621), 
      message: "A vingança nunca é plena, mata a alma e a envenena." 
    },
    happy: { 
      emoji: String.fromCodePoint(0x1F600), 
      message: "Felicidade irradia energia positiva!" 
    },
    sad: { 
      emoji: String.fromCodePoint(0x1F62D), 
      message: "A tristeza nos ensina a valorizar os momentos felizes." 
    },
    fearful: { 
      emoji: String.fromCodePoint(0x1F628), 
      message: "O medo é um alerta para que tomemos cuidado." 
    },
    disgusted: { 
      emoji: String.fromCodePoint(0x1F974), 
      message: "Sentir desgosto pode ser uma reação a algo inaceitável." 
    },
    neutral: { 
      emoji: String.fromCodePoint(0x1F610), 
      message: "Uma emoção neutra, sem extremos." 
    },
    surprised: { 
      emoji: String.fromCodePoint(0x1F632), 
      message: "Que surpresa inesperada!" 
    }
  };

  const emotionKey = resultString.trim().toLowerCase();
  const { emoji, message } = emotionMapping[emotionKey] || { emoji: '', message: 'Emoção não reconhecida.' };

  return (
    <div className='result'>
      <div className="container">
        <h1>Emoção Detectada:</h1>
        <div className="emoji">
          {emoji}
          <span>{mockData.resultString}</span>
        </div>
        <p className='emotionText'>{message}</p>
        <p>Arquivo enviado: {fileName}</p>
        <button className='submit-btn' onClick={()=>{
            navigate('/')
        }}>Enviar novo áudio</button>
      </div>
    </div>
  );
}

export default Result;
