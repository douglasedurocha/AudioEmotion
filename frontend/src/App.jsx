import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AudioUpload from './AudioUpload';
import Result from './Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AudioUpload />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
