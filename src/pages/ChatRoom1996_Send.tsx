import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // ✅ addDoc 추가
import { db } from '../firebase-config';
import '../style/ChatRoom1996_Send.css';

interface Friend {
  nickname: string;
  email: string;
  uid: string;
}

const ChatRoom1996_Send: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState('');
  const [showFriendList, setShowFriendList] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showSentPopup, setShowSentPopup] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('unzeFriends') || '[]');
    setFriends(saved);
  }, []);

  const handleButtonClick = async (value: string) => {
    if (value === 'OK') {
      if (isSending) return; // ⭐️ 이미 전송 중이면 아무 동작 안함
      setIsSending(true);    // ⭐️ 전송 중 상태로 바꿈
  
      if (selectedFriend && input.trim() !== '') {
        const toEmail = selectedFriend.email;
        const toNickname = selectedFriend.nickname;
        const fromUser = JSON.parse(localStorage.getItem('unzeUser') || '{}');
        const myEmail = fromUser?.email;
        const myNickname = localStorage.getItem('unzeNickname') || '익명';
  
        if (!toEmail || !myEmail) {
          alert('이메일 정보가 없습니다.');
          setIsSending(false);   // ⭐️ 실패 시 전송상태 해제
          return;
        }
        if (toEmail === myEmail) {
          alert('자기 자신에게는 삐삐를 보낼 수 없습니다.');
          setIsSending(false);   // ⭐️ 실패 시 전송상태 해제
          return;
        }
        try {
          await addDoc(collection(db, 'beepMessages'), {
            fromEmail: myEmail,
            fromNickname: myNickname,
            toEmail: toEmail,
            toNickname: toNickname,
            content: input,
            createdAt: serverTimestamp(),
            type: 'beep',
          });
          setShowSentPopup(true);
          setInput('');
          setSelectedFriend(null);
        } catch (err) {
          console.error('삐삐 전송 실패:', err);
          alert('메시지 전송 실패');
        } finally {
          setIsSending(false);   // ⭐️ 성공/실패 모두 전송상태 해제
        }
      } else {
        alert('보낼 친구와 메시지를 입력해주세요.');
        setIsSending(false);     // ⭐️ 입력 없을 때도 전송상태 해제
      }
    } else {
      if (input.length < 11 && /^[0-9*#]+$/.test(value)) {
        setInput((prev) => prev + value);
      } else if (input.length >= 11) {
        alert('최대 11자리까지만 입력할 수 있습니다.');
      }
    }
  };

  const handleConfirmPopup = () => {
    setInput('');
    setSelectedFriend(null);
    setShowSentPopup(false);
  };

  return (
    <div className="send-container">
      <div className="top-bar">
        <button className="menu-button" onClick={() => setShowFriendList(true)}>전화번호부</button>
        <div className="date">1996년 어느 날</div>
        <button className="exit-button" onClick={() => navigate('/select-time')}>나가기</button>
      </div>

      <div className="display">
        {selectedFriend && (
          <div style={{ fontSize: '16px', marginBottom: '4px' }}>
            {selectedFriend.nickname} ▶
          </div>
        )}
        <div style={{ fontSize: '18px', fontFamily: 'Galmuri14' }}>{input}</div>
      </div>

      <div className="keypad">
        {['1','2','3','4','5','6','7','8','9','*','0','#'].map((key) => (
          <button key={key} className="key-button" onClick={() => handleButtonClick(key)}>
            {key}
          </button>
        ))}
        <button className="ok-button" onClick={() => handleButtonClick('OK')}>OK</button>
      </div>

      {showFriendList && (
        <div className="friend-popup">
          <div className="popup-box">
            <h4 className="popup-title">누구에게 보낼까요?</h4>
            <ul className="friend-list">
              {friends.length > 0 ? friends.map((friend, idx) => (
                <li key={idx} className="friend-item" onClick={() => setSelectedFriend(friend)}>
                  {friend.nickname}
                </li>
              )) : (
                <li className="friend-item">추가된 친구가 없습니다</li>
              )}
            </ul>
            <div className="popup-actions">
              <button className="popup-btn" onClick={() => setShowFriendList(false)}>취소</button>
              <button className="popup-btn" onClick={() => setShowFriendList(false)}>확인</button>
            </div>
          </div>
        </div>
      )}

      {showSentPopup && (
        <div className="friend-popup">
          <div className="popup-box">
            <h4 className="popup-title">전송이 완료되었습니다.</h4>
            <div className="popup-actions">
              <button className="popup-btn" onClick={handleConfirmPopup}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom1996_Send;
