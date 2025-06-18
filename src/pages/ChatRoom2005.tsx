import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimeLeftToHour } from '../hooks/useTimeLeftToHour';
import {
  collection, query, where, getDocs, doc, setDoc, serverTimestamp, addDoc, onSnapshot, orderBy, writeBatch
} from 'firebase/firestore';
import { db } from '../firebase-config';
import typewriterSound from '../assets/typewriter.mp3';
import '../style/chatroom-2000s.css';

// ✅ 상단에서만 연/월/일 설정
const roomYear = '2005';
const roomMonth = '11';
const roomDay = '25';

// 날짜, 방 제목, 링크 자동 조립
const roomDateText = `${roomYear}. ${roomMonth}. ${roomDay} 오후 21:00, 서울`;
const inviteLink = `https://unze.app/invite?year=${roomYear}`;

const ChatRoom = () => {
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showEmotionPopup, setShowEmotionPopup] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [emotionText, setEmotionText] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState([{ nickname: '' }]);
  const [friends, setFriends] = useState<string[]>([]);
  const chatEndRef = useRef(null);
  const lastSoundTime = useRef(0);
  const navigate = useNavigate();

  const nickname = localStorage.getItem('unzeNickname') || '나';

  // ✅ 마지막 유저 퇴장 시 전체 메시지 삭제 함수
  const clearRoomMessagesIfLastOne = async (targetRoomYear = roomYear) => {
    const usersSnapshot = await getDocs(query(
      collection(db, "users"),
      where("year", "==", targetRoomYear),
      where("isOnline", "==", true)
    ));
    const onlineUserCount = usersSnapshot.size;

    if (onlineUserCount === 0) {
      const messagesRef = collection(db, `chatrooms/${targetRoomYear}/messages`);
      const msgsSnapshot = await getDocs(messagesRef);

      const batch = writeBatch(db);
      msgsSnapshot.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      setMessages([]);
      console.log(`✅ ${targetRoomYear}방 모든 메시지 삭제(마지막 유저 퇴장)`);
    }
  };

  const handleAddFriend = (nickname) => {
    const year = roomYear;
    if (!friends.some(f => f.nickname === nickname && f.year === year)) {
      const updated = [...friends, { nickname, year }];
      setFriends(updated);
      localStorage.setItem('unzeFriends', JSON.stringify(updated));
    }
  };

  // [1] 메시지 실시간 구독
  useEffect(() => {
    const q = query(
      collection(db, `chatrooms/${roomYear}/messages`),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        ...doc.data()
      }));
      setMessages(fetched);
      if (snapshot.empty) setMessages([]);
    });
    return () => unsubscribe();
  }, [roomYear]);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('year', '==', roomYear)
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        nickname: doc.data().nickname,
        email: doc.data().email,
        isOnline: doc.data().isOnline, // 꼭 포함
      }));
      setUserList(users);

      const onlineCount = users.filter(u => u.isOnline).length;
      if (onlineCount === 0) {
        await clearRoomMessagesIfLastOne(roomYear);
      }
    });
    return () => unsubscribe();
  }, [roomYear]);

  // [2] 입장/퇴장 시 시스템 메시지 기록 + 마지막 유저 체크
  useEffect(() => {
    if (!nickname) return;
    const user = JSON.parse(localStorage.getItem('unzeUser') || '{}');
    const email = user.email || '';
    const userRef = doc(db, 'users', email);

    const enterRoom = async () => {
      await setDoc(
        userRef,
        {
          isOnline: true,
          year: roomYear,
          lastActive: serverTimestamp(),
        },
        { merge: true }
      );
      await addDoc(collection(db, `chatrooms/${roomYear}/messages`), {
        type: 'system',
        text: `${nickname}님이 입장하셨습니다.`,
        sender: 'system',
        timestamp: serverTimestamp(),
        roomId: roomYear,
      });
    };

    const exitRoom = async () => {
      await setDoc(
        userRef,
        {
          isOnline: false,
          year: '',
          lastActive: serverTimestamp(),
        },
        { merge: true }
      );
      await addDoc(collection(db, `chatrooms/${roomYear}/messages`), {
        type: 'system',
        text: `${nickname}님이 퇴장하셨습니다.`,
        sender: 'system',
        timestamp: serverTimestamp(),
        roomId: roomYear,
      });
      // setTimeout으로 동기화
      setTimeout(() => {
        clearRoomMessagesIfLastOne(roomYear);
      }, 1500);
    };

    enterRoom();
    return () => exitRoom();
  }, [nickname, roomYear]);

  // 메시지 전송
  const handleSendMessage = async () => {
    const cleaned = message.replace(/\n|\r/g, '').trim();
    if (!cleaned) return;
    try {
      await addDoc(collection(db, `chatrooms/${roomYear}/messages`), {
        text: cleaned,
        sender: nickname,
        timestamp: serverTimestamp()
      });
      setMessage('');
    } catch (error) {
      console.error('메시지 전송 오류:', error);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleKeyDown = () => {
    const now = Date.now();
    const interval = 40;
  
    if (now - lastSoundTime.current > interval) {
      const sound = new Audio(typewriterSound);
      sound.volume = 0.6;
      sound.play()
        .then(() => {
          console.log('🔊 소리 재생됨');
        })
        .catch((err) => {
          console.error('❌ 소리 재생 실패:', err);
        });
  
      lastSoundTime.current = now;
    }
  };  

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 타이머
  const { minutes, seconds } = useTimeLeftToHour({
    onTimeEnd: () => setShowEmotionPopup(true),
  });

  // 나가기/감정기록
  const handleExit = async () => {
    if (emotionText.trim()) {
      const newRecord = {
        date: `${roomYear}. ${roomMonth}. ${roomDay}`,
        time: '21:00',
        location: '서울',
        emotion: emotionText,
      };
      const existing = JSON.parse(localStorage.getItem('records') || '[]');
      localStorage.setItem('records', JSON.stringify([...existing, newRecord]));
    }
    navigate('/MyPage');
  };

  // 구조
  return (
    <div className="chatroom2000-wrapper">
      <div style={{ width: '100%', maxWidth: 420, height: '100%', maxHeight: 750, display: 'flex', flexDirection: 'column', background: '#BFBFBF', border: '1px solid #888', boxShadow: '0 0 6px rgba(0,0,0,0.3)' }}>
        {/* 타이머 박스 */}
        <div style={{
          background: '#000', color: '#00FFD1', fontWeight: 'bold',
          textAlign: 'center', fontSize: 12, padding: '10px 0', fontFamily: 'Galmuri9, sans-serif'
        }}>
          ⏳ 웜홀이 닫히기까지 {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* 상단바 */}
        <div className="header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="header-text">{roomDateText}</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => navigate(`/report/${roomYear}`)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                color: '#666',
                cursor: 'pointer',
              }}
            >
              ⋯
            </button>
            <button className="exit-button-90s" onClick={() => setShowExitPopup(true)}> X </button>
          </div>
        </div>

        {/* 탭 영역 */}
        <div className="chat-tab-bar">
          <div className="chat-tab">
            <img src={`/icon/icon-chat_2000.png`} alt="대화 아이콘" className="chat-icon" />
            <span className="tab-text">대 화</span>
          </div>
          <button className="invite-button" onClick={() => setShowInvitePopup(true)}>초대</button>
        </div>

        {/* 채팅 영역 */}
        <div className="chat-box">
          <div className="participant-bar" onClick={() => setShowParticipants(true)}>
            <span className="participant-label">대화상대</span>
            <span className="participant-list">{userList.map(u => u.nickname).join(', ')}</span>
          </div>
          <div className="chat-content">
            {messages.map((msg, idx) =>
              msg.type === 'system' ? (
                <p key={idx} className="system-message">{msg.text}</p>
              ) : (
                <p key={idx} className="chat-message">{msg.sender}: {msg.text}</p>
              )
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* 입력창 */}
        <div className="input-area">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSendMessage}>보내기</button>
        </div>
      </div>

      {/* 초대 팝업 */}
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

      {/* 참여중 유저 목록 팝업 */}
      {showParticipants && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p className="popup-title">이 시간을 함께하는 사람들</p>
            <ul className="participant-list-box">
              {userList.map((user, idx) => (
                <li key={idx} className="participant-row">
                  <span className="participant-info">{user.nickname}</span>
                  {user.nickname !== nickname ? (
                    <button
                      className="popup-btn"
                      onClick={() => handleAddFriend(user.nickname)}
                      disabled={friends.includes(user.nickname)}
                    >
                      {friends.includes(user.nickname) ? '추가됨' : '추가'}
                    </button>
                  ) : (
                    <button className="popup-btn" disabled style={{ opacity: 0.3 }}>나</button>
                  )}
                </li>
              ))}
            </ul>
            <button className="popup-btn" onClick={() => setShowParticipants(false)}>
              확인
            </button>
          </div>
        </div>
      )}

      {/* 나가기/감정 팝업 */}
      {showExitPopup && (
        <div className="popup-overlay">
          <div className="popup-box exit-popup">
            <button
              className="popup-close-x"
              onClick={() => setShowExitPopup(false)}
              aria-label="팝업 닫기"
            >
              ×
            </button>
            <p className="popup-title">감정을 남겨야 기록됩니다. 
              <br />
              남기고 나갈까요?
              </p>
            <textarea
              placeholder="예: 설레임"
              value={emotionText}
              onChange={e => setEmotionText(e.target.value)}
            />
            <div className="popup-buttons">
              <button className="popup-btn" onClick={handleExit}>기록하고 나가기</button>
              <button className="popup-btn" onClick={() => navigate('/MyPage')}>그냥 나가기</button>
            </div>
          </div>
        </div>
      )}

      {/* 강제 퇴장(정각) 감정 팝업 */}
      {showEmotionPopup && (
        <div className="popup-overlay">
          <div className="popup-box exit-popup">
          <p className="popup-title">감정을 남겨야 기록됩니다. 
              <br />
              남기고 나갈까요?
              </p>
            <textarea
              placeholder="예: 아련함"
              value={emotionText}
              onChange={e => setEmotionText(e.target.value)}
            />
            <div className="popup-buttons">
              <button
                className="popup-btn"
                onClick={() => {
                  const newRecord = {
                    date: `${roomYear}. ${roomMonth}. ${roomDay}`,
                    time: '21:00',
                    location: '서울',
                    emotion: emotionText,
                  };
                  const existing = JSON.parse(localStorage.getItem('records') || '[]');
                  localStorage.setItem('records', JSON.stringify([...existing, newRecord]));
                  navigate('/MyPage');
                }}
              >기록하고 나가기</button>
              <button className="popup-btn" onClick={() => navigate('/MyPage')}>그냥 나가기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
