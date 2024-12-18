import { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './Pages/Login';
import NewUserRegister from './Pages/NewUserRegister';
import MainPage from './Pages/MainPage';
import Chat from './Pages/Chat';
import Messaging from './Components/Messaging'; // Import Messaging

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
    <Route path="/" element={<MainPage />}>
      <Route path="login" index element={<Login />} />
      <Route path="register" element={<NewUserRegister />} />
      <Route path="messanger" element={<Chat />}>
      <Route path="chat/user/:userId" element={<Messaging />} />
      <Route path="chat/group/:groupId" element={<Messaging />} />
    </Route>
    </Route>
  
    
  </Routes>
  
  );
}