import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Nickname.css';
import logo from "../assets/unze_full_logo.png";

const Nickname = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedNickname = localStorage.getItem('unzeNickname');
    const fromLogin = sessionStorage.getItem('fromLogin');

    if (savedNickname && !fromLogin) {
      navigate("/select-time"); // ✅ 소문자로 변경
    }

    sessionStorage.removeItem('fromLogin');
  }, []);

  const handleConfirm = () => {
    if (nickname.trim()) {
      localStorage.setItem('unzeNickname', nickname);
      navigate("/select-time"); // ✅ 소문자로 변경
    }
  };

  return (
    <div className="nickname-container">
      <img src={logo} alt="UN:ZE Logo" className="logo" />
      <h2 className="title">당신은 어떤 이름으로 기억되고 싶나요?</h2>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="닉네임 입력"
        className="input"
      />
      <button className="next-button" onClick={handleConfirm}>확인</button>
    </div>
  );
};

export default Nickname;
