import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { auth } from '../firebase-config';
import '../style/ChatRoom1984_Send.css';

interface Friend {
  nickname: string;
  email: string;
  year: string;
}

const db = getFirestore();

const ChatRoom1984_Send: React.FC = () => {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showFriendPopup, setShowFriendPopup] = useState<boolean>(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [myNickname, setMyNickname] = useState('');
  const [myEmail, setMyEmail] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('unzeFriends') || '[]');
    setFriends(Array.isArray(saved) ? saved : []);
    setMyNickname(localStorage.getItem('unzeNickname') || '');
    setMyEmail(auth.currentUser?.email || '');
  }, []);

  // 친구 선택
  const handleRecipientSelect = (nickname: string) => {
    const friend = friends.find(f => f.nickname === nickname);
    if (!friend) {
      alert('수신자 정보를 찾을 수 없습니다.');
      return;
    }
    setRecipient(friend.nickname);
    setRecipientEmail(friend.email); // 핵심: 이메일 저장
    setIsAnonymous(false);
    setShowFriendPopup(false);
  };

  // 랜덤 수신자
  const handleRandomRecipient = () => {
    const friendList = friends.filter(f => f.email !== myEmail);
    if (friendList.length === 0) {
      alert('랜덤 수신자를 찾을 수 없습니다.');
      return;
    }
    const random = friendList[Math.floor(Math.random() * friendList.length)];
    setRecipient(random.nickname);
    setRecipientEmail(random.email);
    setIsAnonymous(true);
    setShowFriendPopup(false);
  };

  // 편지 보내기
  const sendLetter = async () => {
    if (!message.trim()) { alert('내용을 입력해주세요.'); return; }
    if (!recipientEmail || recipientEmail === myEmail) {
      alert('수신자가 선택되지 않았거나, 자기 자신입니다.');
      return;
    }
    await addDoc(collection(db, 'letters'), {
      receiverEmail: recipientEmail,
      receiverNickname: recipient,
      senderEmail: myEmail,
      senderNickname: myNickname,
      message: message,
      timestamp: new Date(),
      isAnonymous: isAnonymous,
    });
    alert(`${recipient}에게 편지를 보냈습니다.`);
    setMessage('');
    setRecipient('');
    setRecipientEmail('');
    setIsAnonymous(false);
  };

  return (
    <div className="chatroom-1984-wrapper chat1984">
      <div className="background-1984" />
      <div className="letter-container">
        <div className="top-line">
          <span className="date-text">1984년 어느 날</span>
          <button className="exit-button" onClick={() => navigate('/select-time')}>
            나가기
          </button>
        </div>
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
            <div className="sender-name">{myNickname}</div>
            <button className="send-button" onClick={sendLetter}>
              보내기
            </button>
          </div>
        </div>
        {showFriendPopup && (
          <div className="friend-popup">
            <div className="popup-box">
              <div className="popup-title">누구에게 편지를 보낼까요?</div>
              <div className="friend-name"
                onClick={handleRandomRecipient}
                style={{ fontWeight: 'bold', color: '#00aaff' }}>
                누군가에게 (랜덤)
              </div>
              {friends.length > 0 ? friends.map(friend => (
                <div
                  key={friend.email}
                  className="friend-name"
                  onClick={() => handleRecipientSelect(friend.nickname)}
                >
                  {friend.nickname}
                </div>
              )) : (
                <div className="friend-name">추가된 친구가 없습니다</div>
              )}
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
