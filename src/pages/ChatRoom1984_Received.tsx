// src/pages/ChatRoom1984_Received.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import '../style/ChatRoom1984_Send.css';

const db = getFirestore();

const ChatRoom1984_Received: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { messageId } = location.state || {}; // 마이페이지에서 넘기는 messageId

  const [letter, setLetter] = useState<any>(null);
  const nickname = localStorage.getItem('unzeNickname') || '나';

  useEffect(() => {
    if (!messageId) return;
    const fetchLetter = async () => {
      const ref = doc(db, 'letters', messageId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setLetter(snap.data());
      } else {
        setLetter(null);
      }
    };
    fetchLetter();
  }, [messageId]);

  if (!messageId) {
    return <div>잘못된 접근입니다.</div>;
  }
  if (!letter) {
    return (
      <div className="background-1984">
        <div className="chatroom-1984-wrapper">
          <div className="letter-container" style={{ textAlign: 'center', marginTop: '40%' }}>
            <div style={{ fontFamily: 'NanumGaram', fontSize: 20, color: '#aaa' }}>
              편지 정보를 불러올 수 없습니다.
            </div>
            <button className="exit-button" onClick={() => navigate('/MyPage')}>나가기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="background-1984">
      <div className="chatroom-1984-wrapper">
        <div className="letter-container">
          {/* 상단 날짜 + 나가기 */}
          <div className="top-line">
            <span className="date-text">
              {letter.timestamp
                ? new Date(letter.timestamp.seconds * 1000).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) + ' ' + new Date(letter.timestamp.seconds * 1000).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
                : '1984년 어느 날'}
            </span>
            <button className="exit-button" onClick={() => navigate('/MyPage')}>나가기</button>
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
            {letter.message || ''}
          </div>
          {/* 하단: 보낸 사람 */}
          <div className="letter-footer">
            <div
              className="sender-name"
              style={{ paddingLeft: '8px', fontSize: '18px', fontFamily: 'NanumGaram' }}
            >
              [{letter.senderNickname || '익명'}]으로부터
            </div>
            {/* 필요하면 답장 버튼 활성화 */}
            {/* <button className="send-button" onClick={() => navigate('/chatroom/1984')}>답장 보내기</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom1984_Received;
