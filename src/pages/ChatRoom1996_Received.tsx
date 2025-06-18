import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import '../style/ChatRoom1996_Received.css';
import beep from "/src/assets/beep.png";

const ChatRoom1996_Received = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { messageId } = location.state || {};
  const [beepMessage, setBeepMessage] = useState('');
  const [fromNickname, setFromNickname] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      if (!messageId) {
        setBeepMessage('메시지 없음');
        setFromNickname('');
        return;
      }
      const docRef = doc(db, 'beepMessages', messageId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBeepMessage((data.content || '').toString().slice(0, 11));
        setFromNickname(data.fromNickname || '익명');
      } else {
        setBeepMessage('메시지 없음');
        setFromNickname('');
      }
    };

    fetchMessage();
  }, [messageId]);

  return (
    <div className="beep-container">
      <p className="beep-date">1996년 어느 날</p>
      <div className="beep-center-wrapper">
        <div className="beep-image-wrapper">
          <img src={beep} alt="받은 삐삐" className="beep-img" />
          <div className="beep-number-display">{beepMessage}</div>
          <div className="beep-sender">{fromNickname ? `from. ${fromNickname}` : ''}</div>
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
