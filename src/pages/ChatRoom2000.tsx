import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/chatroom-2000s.css';

const Chat2000 = () => {
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [emotionText, setEmotionText] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const inviteLink = 'https://unze.app/room/2000-0622';
  const nickname = localStorage.getItem('unzeNickname') || '나';

  const participants = [
    { name: '별밤지기', time: '2023.01.17 | 01:00' },
    { name: '호떡쥬스', time: '2023.01.17 | 01:00' },
    { name: '오늘내일', time: '2023.01.17 | 01:00' },
  ];

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

  const handleExit = () => {
    if (emotionText.trim()) {
      const newRecord = {
        date: '2002. 06. 22',
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

  const toggleFriend = (name: string) => {
    const current = JSON.parse(localStorage.getItem('unzeFriends') || '[]');
    const isAlready = current.some((f: any) => f.name === name && f.year === '2000');

    if (!isAlready) {
      const newFriend = {
        name,
        year: '2000',
        emotion: '○○'
      };
      const updated = [...current, newFriend];
      localStorage.setItem('unzeFriends', JSON.stringify(updated));
      setFriends(prev => [...prev, name]);
    }
  };

  useEffect(() => {
    fetch('https://your-api/messages')
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('unzeFriends') || '[]');
    const filtered = saved.filter((f: any) => f.year === '2000');
    setFriends(filtered.map((f: any) => f.name));
  }, []);

  return (
    <div className="chatroom2000-wrapper">
      <div className="chatroom-2000s">
        <div className="header-bar">
          <span className="header-text">2002. 06. 22 오후 21:00, 서울</span>
          <button className="exit-button-90s" onClick={() => setShowExitPopup(true)}>X</button>
        </div>

        <div className="chat-tab-bar">
          <div className="chat-tab">
            <img src="/icon/icon-chat_2000.png" alt="대화 아이콘" className="chat-icon" />
            <span className="tab-text">대 화</span>
          </div>
          <button className="invite-button" onClick={() => setShowInvitePopup(true)}>초대</button>
        </div>

        <div className="chat-box">
          <div className="participant-bar" onClick={() => setShowParticipants(true)}>
            <span className="participant-label">대화상대</span>
            <span className="participant-list">: [유저닉네임], [유저닉네임]</span>
          </div>

          <div className="chat-content">
            {messages.map((msg, idx) => (
              <p key={idx} className="chat-message black-message">
                {msg.sender}: {msg.text}
              </p>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="input-area">
            <input
              type="text"
              placeholder="메시지를 입력하세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={handleKeyUp}
            />
            <button onClick={handleSendMessage}>보내기</button>
          </div>
        </div>

        {showInvitePopup && (
          <div className="popup-overlay">
            <div className="popup-box invite-popup">
              <p className="popup-title">링크를 복사해 친구를 초대하세요</p>
              <input type="text" value={inviteLink} readOnly />
              <div className="popup-buttons">
                <button className="popup-btn" onClick={() => navigator.clipboard.writeText(inviteLink)}>복사</button>
                <button className="popup-btn" onClick={() => setShowInvitePopup(false)}>닫기</button>
              </div>
            </div>
          </div>
        )}

        {showParticipants && (
          <div className="popup-overlay">
            <div className="popup-box participant-popup">
              <p className="popup-title">이 시간을 함께하는 사람들</p>
              <ul className="participant-list-box">
                {participants.map((user, index) => (
                  <li key={index} className="participant-row">
                    <span className="participant-info">
                      {user.name} | {user.time}
                    </span>
                    <button
                      className="popup-btn"
                      onClick={() => toggleFriend(user.name)}
                    >
                      {friends.includes(user.name) ? '추가됨' : '추가'}
                    </button>
                  </li>
                ))}
              </ul>
              <button className="popup-btn" onClick={() => setShowParticipants(false)}>확인</button>
            </div>
          </div>
        )}

        {showExitPopup && (
          <div className="popup-overlay">
            <div className="popup-box exit-popup">
              <button className="popup-close-x" onClick={() => setShowExitPopup(false)}>X</button>
              <p className="popup-title">이 시간을 보낸 당신의 감정은?</p>
              <textarea
                placeholder="예: 뭔가 아련하고 따뜻했어요"
                value={emotionText}
                onChange={(e) => setEmotionText(e.target.value)}
              />
              <div className="popup-buttons">
                <button className="popup-btn" onClick={handleExit}>기록하고 나가기</button>
                <button className="popup-btn" onClick={() => navigate('/MyPage')}>그냥 나가기</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat2000;
