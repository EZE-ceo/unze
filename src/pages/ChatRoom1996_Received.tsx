import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/ChatRoom1996_Received.css';
import beepImage from '../assets/beep.png';

const ChatRoom1996_Received = () => {
  const navigate = useNavigate();

  // 로컬스토리지에서 삐삐 메시지 불러오기
  const storedMessage = localStorage.getItem('beepMessage1996') || '01099786585';

  return (
    <div className="beep-container">
      <p className="beep-date">1996년 10월 30일</p>

      <div className="beep-center-wrapper">
        <div className="beep-image-wrapper">
          <img src={beepImage} alt="받은 삐삐" className="beep-img" />
          <div className="beep-number-display">{storedMessage}</div>
        </div>

        <div className="beep-buttons">
          <button className="exit-btn" onClick={() => navigate('/mypage')}>나가기</button>
          <button className="reply-btn" onClick={() => navigate('/chatroom/1996')}>회신하기</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom1996_Received;
