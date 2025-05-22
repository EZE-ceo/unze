// ✅ src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import LoginPage from "./pages/LoginPage";
import SignupPage from './pages/SignupPage';
import Nickname from './pages/Nickname';
import SelectTime from './pages/SelectTime';
import ChatRoom1984_Send from './pages/ChatRoom1984_Send';
import ChatRoom1984_Received from './pages/ChatRoom1984_Received';
import ChatRoom1990 from './pages/ChatRoom1990';
import ChatRoom1996 from './pages/ChatRoom1996';
import ChatRoom1996_Received from './pages/ChatRoom1996_Received';
import ChatRoom2000 from './pages/ChatRoom2000';
import MyPage from './pages/MyPage';

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/nickname" element={<Nickname />} />
        <Route path="/select-time" element={<SelectTime />} />
        <Route path="/chatroom/1984" element={<ChatRoom1984_Send />} />
        <Route path="/received-letter-1984" element={<ChatRoom1984_Received />} />
        <Route path="/chatroom/1990s" element={<ChatRoom1990 />} />
        <Route path="/chatroom/1996" element={<ChatRoom1996 />} />
        <Route path="/received-beep-1996" element={<ChatRoom1996_Received />} />
        <Route path="/chatroom/2000s" element={<ChatRoom2000 />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </div>
  );
};

export default App;
