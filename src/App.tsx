// ✅ src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Splash from './pages/Splash';
import LoginPage from './pages/LoginPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms'; 
import SignupPage from './pages/SignupPage';
import Nickname from './pages/Nickname';
import SelectEra from './pages/SelectEra';
import SelectTime from './pages/SelectTime';
import ChatRoom1984_Send from './pages/ChatRoom1984_Send';
import ChatRoom1984_Received from './pages/ChatRoom1984_Received';
import ChatRoom1984_Inbox from './pages/ChatRoom1984_Inbox';
import ChatRoom1990 from './pages/ChatRoom1990';
import ChatRoom1991 from './pages/ChatRoom1991';
import ChatRoom1992 from './pages/ChatRoom1992';
import ChatRoom1993 from './pages/ChatRoom1993';
import ChatRoom1994 from './pages/ChatRoom1994';
import ChatRoom1995 from './pages/ChatRoom1995';
import ChatRoom1996 from './pages/ChatRoom1996';
import ChatRoom1996_Send from './pages/ChatRoom1996_Send';
import ChatRoom1996_Received from './pages/ChatRoom1996_Received';
import ChatRoom1997 from './pages/ChatRoom1997';
import ChatRoom1998 from './pages/ChatRoom1998';
import ChatRoom1999 from './pages/ChatRoom1999';
import ChatRoom2000 from './pages/ChatRoom2000';
import ChatRoom2001 from './pages/ChatRoom2001';
import ChatRoom2002 from './pages/ChatRoom2002';
import ChatRoom2003 from './pages/ChatRoom2003';
import ChatRoom2004 from './pages/ChatRoom2004';
import ChatRoom2005 from './pages/ChatRoom2005';
import ChatRoom2006 from './pages/ChatRoom2006';
import ChatRoom2007 from './pages/ChatRoom2007';
import ChatRoom2008 from './pages/ChatRoom2008';
import ChatRoom2009 from './pages/ChatRoom2009';
import MyPage from './pages/MyPage';
import Invite from './pages/Invite';
import ReportPage from './pages/ReportPage';


const App = () => {
  const location = useLocation();
  const path = location.pathname;

  const showFooter = path === '/login';

  const getWrapperClass = () => {
    if (
      path === '/' ||
      path === '/loginpage' ||
      path === '/signup' ||
      path === '/nickname' ||
      path === '/select-time' ||
      path === '/select-era' || 
      path === '/mypage' ||
      path === '/privacy' ||
      path === '/terms'
    ) return 'default-page';

    if (path.startsWith('/chatroom/1990')) return 'chat1990';
    if (path.startsWith('/chatroom/2000')) return 'chat2000';
    if (path.startsWith('/chatroom/1996') || path.includes('beep-1996')) return 'chat1996';
    if (path.startsWith('/chatroom/1984') || path.includes('letter-1984')) return 'chat1984';

    return '';
  };

  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  return (
    <div
      className={`app-container ${getWrapperClass()}`}
      style={{
        minHeight: 'calc(var(--vh, 1vh) * 100)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* 본문 */}
      <div style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/nickname" element={<Nickname />} />
          <Route path="/select-era" element={<SelectEra />} />
          <Route path="/select-time" element={<SelectTime />} />
          <Route path="/chatroom/1984_send" element={<ChatRoom1984_Send />} />
          <Route path="/received-letter-1984" element={<ChatRoom1984_Received />} />
          <Route path="/chatroom1984_inbox" element={<ChatRoom1984_Inbox />} />
          <Route path="/chatroom/1990" element={<ChatRoom1990 />} />
          <Route path="/chatroom/1991" element={<ChatRoom1991 />} />
          <Route path="/chatroom/1992" element={<ChatRoom1992 />} />
          <Route path="/chatroom/1993" element={<ChatRoom1993 />} />
          <Route path="/chatroom/1994" element={<ChatRoom1994 />} />
          <Route path="/chatroom/1995" element={<ChatRoom1995 />} />
          <Route path="/chatroom/1996" element={<ChatRoom1996 />} />
          <Route path="/chatroom/1996_send" element={<ChatRoom1996_Send />} />
          <Route path="/received-beep-1996" element={<ChatRoom1996_Received />} />
          <Route path="/chatroom/1997" element={<ChatRoom1997 />} />
          <Route path="/chatroom/1998" element={<ChatRoom1998 />} />
          <Route path="/chatroom/1999" element={<ChatRoom1999 />} />
          <Route path="/chatroom/2000" element={<ChatRoom2000 />} />
          <Route path="/chatroom/2001" element={<ChatRoom2001 />} />
          <Route path="/chatroom/2002" element={<ChatRoom2002 />} />
          <Route path="/chatroom/2003" element={<ChatRoom2003 />} />
          <Route path="/chatroom/2004" element={<ChatRoom2004 />} />
          <Route path="/chatroom/2005" element={<ChatRoom2005 />} />
          <Route path="/chatroom/2006" element={<ChatRoom2006 />} />
          <Route path="/chatroom/2007" element={<ChatRoom2007 />} />
          <Route path="/chatroom/2008" element={<ChatRoom2008 />} />
          <Route path="/chatroom/2009" element={<ChatRoom2009 />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/report/:year" element={<ReportPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
