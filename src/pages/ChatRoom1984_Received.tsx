// src/pages/ChatRoom1984_Received.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/ChatRoom1984_Send.css'; // 동일 스타일 사용

const ChatRoom1984_Received = () => {
  const navigate = useNavigate();
  const nickname = localStorage.getItem('unzeNickname') || '나';
  const letter = JSON.parse(localStorage.getItem('receivedLetter1984') || '{}');

  const handleReply = () => {
    navigate('/chatroom1984_send'); // ✅ 라우터 경로 일치해야 작동함
  };

  return (
    <div className="background-1984">
      <div className="chatroom-1984-wrapper">
        <div className="letter-container">
          {/* 상단 날짜 + 나가기 */}
          <div className="top-line">
            <span className="date-text">1984년 5월 18일</span>
            <button className="exit-button" onClick={() => navigate('/MyPage')}>나가기 →</button>
          </div>

          {/* 받는 사람 */}
          <div
            style={{
              fontSize: '20px',
              fontFamily: 'NanumGaram',
              color: '#1a237e',
              marginBottom: '12px',
              textAlign: 'left',
              paddingLeft: '8px',
            }}
          >
            {nickname}에게
          </div>

          {/* 본문 */}
          <div
            className="letter-paper"
            style={{
              textAlign: 'left',
              paddingLeft: '8px',
              fontFamily: 'NanumGaram',
              fontSize: '20px',
              whiteSpace: 'pre-line',
              color: '#333',
            }}
          >
            {letter.content || ''}
          </div>

          {/* 하단: 보낸 사람 */}
          <div className="letter-footer">
            <div
              className="sender-name"
              style={{ paddingLeft: '8px', fontSize: '18px', fontFamily: 'NanumGaram' }}
            >
              [{letter.sender || '익명'}]으로부터
            </div>
            <button className="send-button" onClick={() => navigate('/chatroom/1984')}>
              답장 보내기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom1984_Received;
