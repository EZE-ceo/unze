// ✅ src/App.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Splash from './pages/Splash';
import LoginPage from './pages/LoginPage';
import Privacy from './pages/Privacy';
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
  const location = useLocation();
  const path = location.pathname.toLowerCase().replace(/\/$/, '');
  const showFooter = path === '/login';

  console.log('현재 경로:', location.pathname);
  console.log('푸터 보여줘?', showFooter);

  return (
    <div
      className="app-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/privacy" element={<Privacy />} />
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
      {showFooter && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            textAlign: 'center',
            fontSize: '12px',
            backgroundColor: '#000', 
            color: '#888888',
            zIndex: 9999,
          }}
        >
          © 2025 UN:ZE ·{' '}
          <a href="/privacy" 
          style={{ color: '#888888', textDecoration: 'underline' }}>
            개인정보처리방침
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
