import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Import Routes
import Chatbot from './pages/Chatbot';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/chatbot' element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;