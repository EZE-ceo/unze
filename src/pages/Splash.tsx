import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Splash.css';
import logo from '../assets/unze_full_logo.png';

const Splash = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const showTimeout = setTimeout(() => setFadeOut(true), 1000);
    const navTimeout = setTimeout(() => navigate('/Login'), 1500);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(navTimeout);
    };
  }, [navigate]);

  return (
    <div
      className={`splash-container ${fadeOut ? 'fade-out' : ''}`}
      style={{
        height: 'calc(var(--vh, 1vh) * 100)', // ✅ 모바일 반응형 대응
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}
    >
      <img
        src={logo}
        alt="UN:ZE Logo"
        className="unze-logo"
        style={{
          width: '150px',
          marginTop: '40px', // ✅ 너무 위로 붙는 문제 해결
        }}
      />
    </div>
  );
};

export default Splash;
