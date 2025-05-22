import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/chatroom1990.css';

const ChatRoom1990 = () => {
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [emotionText, setEmotionText] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const inviteLink = 'https://unze.app/room/1990-0425';
  const nickname = localStorage.getItem('nickname') || '나';
  const roomYear = '1995';

  const handleSendMessage = () => {
    const cleaned = message.replace(/\n|\r/g, '').trim();
    if (!cleaned) return;
    setMessage('');
    const newMessage = { text: cleaned, sender: nickname };
    setMessages(prev => [...prev, newMessage]);

    fetch('https://your-api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage),
    });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  useEffect(() => {
    fetch('https://your-api/messages')
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ 친구 추가 상태 초기화
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('friends') || '[]');
    const names = stored.filter((f: any) => f.year === roomYear).map((f: any) => f.name);
    setAddedFriends(names);
  }, []);

  const handleExit = () => {
    if (emotionText.trim()) {
      const newRecord = {
        date: '1995. 04. 25',
        time: '21:00',
        location: '서울',
        emotion: emotionText,
      };
      const existing = JSON.parse(localStorage.getItem('records') || '[]');
      localStorage.setItem('records', JSON.stringify([...existing, newRecord]));

      fetch('https://your-api/emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, emotion: emotionText }),
      });
    }
    navigate('/MyPage');
  };

  const handleAddFriend = (name: string) => {
    const newFriend = { name, year: roomYear };
    const existing = JSON.parse(localStorage.getItem('friends') || '[]');
    const alreadyAdded = existing.find((f: any) => f.name === name && f.year === roomYear);
    if (!alreadyAdded) {
      const updated = [...existing, newFriend];
      localStorage.setItem('unzeFriends', JSON.stringify(updated));
      setAddedFriends(prev => [...prev, name]);
    }
  };

  return (
    <div className="chatroom-container">
      <div className="chatroom-wrapper">
        <div className="chatroom-header">
          <span>1995. 04. 25</span>
          <button className="chatroom-close" onClick={() => setShowExitPopup(true)}>X</button>
        </div>

        <div className="chatroom-invite">
          <span>별빛소년, [유저1], [유저2]...</span>
          <div className="button-group">
            <button className="invite-button" onClick={() => setShowUserPopup(true)}>유저보기</button>
            <button className="invite-button" onClick={() => setShowInvitePopup(true)}>초대하기</button>
          </div>
        </div>

        <hr className="chatroom-divider" />

        <div className="chatroom-join-message">{nickname}님께서 들어오셨습니다.</div>

        <div className="chat-content">
          {messages.map((msg, idx) => (
            <p key={idx} className={`chat-message ${msg.sender === nickname ? 'my-message' : 'other-message'}`}>
              {msg.sender}: {msg.text}
            </p>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chatroom-input-area">
          <input
            className="chatroom-input"
            type="text"
            placeholder=">>"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={handleKeyUp}
          />
          <button className="chatroom-send" onClick={handleSendMessage}>보내기</button>
        </div>

        {/* ✅ 초대 링크 팝업 */}
        {showInvitePopup && (
          <div className="invite-link-popup">
            <h3 className="popup-title">링크를 복사해 친구를 초대하세요</h3>
            <input className="invite-link-input" type="text" value={inviteLink} readOnly />
            <div className="invite-button-group">
              <button onClick={() => navigator.clipboard.writeText(inviteLink)}>복사</button>
              <button onClick={() => setShowInvitePopup(false)}>닫기</button>
            </div>
          </div>
        )}

        {/* ✅ 유저 보기 팝업 */}
        {showUserPopup && (
          <div className="user-list-popup">
            <h3 className="popup-title">이 시간을 함께하는 사람들</h3>
            <ul className="user-list">
              {['별밤지기', '호떡쥬스', '오늘내일'].map((name, idx) => (
                <li key={idx}>
                  <div className="user-row">
                    <div className="user-info">
                      <span className="name">{name}</span>
                      <span className="date">2023.01.17</span>
                    </div>
                    <button
                      className={`friend-button ${addedFriends.includes(name) ? 'confirmed' : ''}`}
                      onClick={() => handleAddFriend(name)}
                      disabled={addedFriends.includes(name)}
                    >
                      {addedFriends.includes(name) ? '추가됨' : '추가'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="user-popup-button-wrap">
              <button className="popup-close-button" onClick={() => setShowUserPopup(false)}>확인</button>
            </div>
          </div>
        )}

        {/* ✅ 감정 기록 팝업 */}
        {showExitPopup && (
          <div className="user-list-popup exit-popup">
            <button className="exit-close-button" onClick={() => setShowExitPopup(false)}>X</button>
            <h3 className="popup-title">이 시간을 보낸 당신의 감정은?</h3>
            <textarea
              className="exit-textarea"
              placeholder="예: 설레임"
              value={emotionText}
              onChange={(e) => setEmotionText(e.target.value)}
            />
            <div className="popup-button-group">
              <button className="popup-button" onClick={handleExit}>기록하고 나가기</button>
              <button className="popup-button" onClick={() => navigate('/MyPage')}>그냥 나가기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom1990;
