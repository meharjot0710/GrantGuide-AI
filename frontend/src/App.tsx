import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chatbot from './pages/Chatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileForm from './pages/ProfileForm';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile-form' element={<PrivateRoute><ProfileForm /></PrivateRoute>} />
        <Route path='/chatbot' element={<PrivateRoute><Chatbot /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;