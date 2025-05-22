import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/ChatRoom1984_Send.css';

const ChatRoom1984_Send: React.FC = () => {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showFriendPopup, setShowFriendPopup] = useState<boolean>(false);

  const friends = ['은희', '정우', '수미', '동철', '나래'];

  const handleSend = () => {
    if (!recipient || !message.trim()) {
      alert('받는 사람과 내용을 모두 입력해주세요.');
      return;
    }
    alert('편지를 보냈습니다.');
    setMessage('');
  };

  useEffect(() => {
    console.log('✅ ChatRoom1984_Send 진입됨');
  }, []);

  return (
    <div className="chatroom-1984-wrapper">
      {/* ✅ 반드시 배경이 letter-container 바깥에 있어야 함 */}
      <div className="background-1984" />

      <div className="letter-container">
        {/* 상단 날짜 + 나가기 */}
        <div className="top-line">
          <span className="date-text">1984. 09. 13</span>
          <button className="exit-button" onClick={() => navigate('/select-time')}>
            나가기
          </button>
        </div>

        {/* 편지 영역 */}
        <div className="letter-paper">
          <div className="recipient-line" onClick={() => setShowFriendPopup(true)}>
            [ {recipient || '누구'} ] 에게
          </div>
          <textarea
            className="letter-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="편지를 써보세요..."
          />
          <div className="letter-footer">
            <div className="sender-name">내 닉네임</div>
            <button className="send-button" onClick={handleSend}>
              보내기
            </button>
          </div>
        </div>

        {/* 친구 선택 팝업 */}
        {showFriendPopup && (
          <div className="friend-popup">
            <div className="popup-box">
              <div className="popup-title">누구에게 편지를 보낼까요?</div>
              {friends.map((name) => (
                <div
                  key={name}
                  className="friend-name"
                  onClick={() => {
                    setRecipient(name);
                    setShowFriendPopup(false);
                  }}
                >
                  {name}
                </div>
              ))}
              <button className="popup-close" onClick={() => setShowFriendPopup(false)}>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom1984_Send;
