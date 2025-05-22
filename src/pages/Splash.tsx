import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Splash.css';
import logo from "../assets/unze_full_logo.png";

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
    <div className={`splash-container ${fadeOut ? 'fade-out' : ''}`}>
      <img src={logo} alt="UN:ZE Logo" className="unze_logo" />
    </div>
  );
};

export default Splash;
