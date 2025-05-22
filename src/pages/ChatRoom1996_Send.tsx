import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/ChatRoom1996_Send.css';

interface SendProps {
  onSend: (number: string) => void;
}

const ChatRoom1996_Send: React.FC<SendProps> = ({ onSend }) => {
  const [input, setInput] = useState('');
  const [showFriendList, setShowFriendList] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [showSentPopup, setShowSentPopup] = useState(false);
  const navigate = useNavigate();

  const friends = ['재훈이', '미정이', '경수', '성우', '은지'];

  const handleButtonClick = (value: string) => {
    if (value === 'OK') {
      if (input.trim() !== '' && selectedFriend !== '') {
        setShowSentPopup(true);
      } else {
        alert("보낼 친구와 메시지를 모두 입력해주세요.");
      }
    } else {
      setInput((prev) => prev + value);
    }
  };

  const handleFriendSelect = (friend: string) => {
    setSelectedFriend(friend);
    setShowFriendList(false);
  };

  const handleConfirmPopup = () => {
    setInput('');
    setSelectedFriend('');
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
            {selectedFriend} ▶
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
              {friends.map((friend, idx) => (
                <li key={idx} className="friend-item" onClick={() => handleFriendSelect(friend)}>
                  {friend}
                </li>
              ))}
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
