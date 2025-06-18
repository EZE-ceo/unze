import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimeLeftToHour } from '../hooks/useTimeLeftToHour';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
  onSnapshot,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase-config';
import typewriterSound from '../assets/typewriter.mp3';
import '../style/chatroom1990.css';

const ChatRoom1990 = () => {
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showEmotionPopup, setShowEmotionPopup] = useState(false);
  const [isForcedExit, setIsForcedExit] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [emotionText, setEmotionText] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);
  const [userList, setUserList] = useState<{ nickname: string; email: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const lastSoundTime = useRef(0);
  const navigate = useNavigate();

  const inviteLink = `https://unze.app/invite?year=${roomYear}`;
  const nickname = localStorage.getItem('unzeNickname') || '나';
  const roomYear = '1990';

  useEffect(() => {
    document.addEventListener('click', () => setShowReportMenu(false));
    return () => document.removeEventListener('click', () => setShowReportMenu(false));
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, `chatrooms/${roomYear}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as { text: string; sender: string }[];

      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('year', '==', roomYear));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: { nickname: string; email: string }[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.nickname && data.email && data.nickname !== nickname) {
          users.push({ nickname: data.nickname, email: data.email });
        }
      });
      setUserList(users);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (!nickname) return;

    // ✅ 이메일 기반으로 doc ID 구성
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
          // ...필요하다면 nickname, email 등 추가
        },
        { merge: true }
      );
      await addDoc(collection(db, `chatrooms/${roomYear}/messages`), {
        type: 'system',
        text: `${nickname}님이 입장하셨습니다.`,
        timestamp: serverTimestamp(),
        roomId: roomYear,
      });
    };

    // 퇴장
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
      // 1. 퇴장 메시지
      await addDoc(collection(db, `chatrooms/${roomYear}/messages`), {
        type: 'system',
        text: `${nickname}님이 퇴장하셨습니다.`,
        timestamp: serverTimestamp(),
        roomId: roomYear,
      });
      // 2. 마지막 유저면 메시지 전체 삭제
      await clearRoomMessagesIfLastOne(roomYear);
    };

    // 마지막 유저면 메시지 전체 삭제
    async function clearRoomMessagesIfLastOne(roomYear = '1990') {
      const usersSnapshot = await getDocs(query(
        collection(db, "users"),
        where("year", "==", roomYear),
        where("isOnline", "==", true)
      ));
      const onlineUserCount = usersSnapshot.size;

      if (onlineUserCount === 0) {
        const messagesRef = collection(db, `chatrooms/${roomYear}/messages`);
        const msgsSnapshot = await getDocs(messagesRef);

        const batch = writeBatch(db);
        msgsSnapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log(`✅ ${roomYear}방 모든 메시지 삭제(마지막 유저 퇴장)`);
      }
    }

    enterRoom();
    return () => exitRoom();
  }, []);


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

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('unzeFriends') || '[]');
    const names = stored.filter((f: any) => f.year === roomYear).map((f: any) => f.nickname);
    setAddedFriends(names);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'users'), where('year', '==', roomYear));
      const querySnapshot = await getDocs(q);
      const users: { nickname: string; email: string }[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.nickname && data.nickname !== nickname && data.email) {
          users.push({ nickname: data.nickname, email: data.email });
        }
      });
      setUserList(users);
    };
    fetchUsers();
  }, []);

  const handleExit = async () => {
    if (emotionText.trim()) {
      const newRecord = {
        date: '1990. 04. 25',
        time: '21:00',
        location: '서울',
        emotion: emotionText
      };
      const existing = JSON.parse(localStorage.getItem('records') || '[]');
      localStorage.setItem('records', JSON.stringify([...existing, newRecord]));
    }

    try {
      await setDoc(
        doc(db, 'users', nickname),
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
        timestamp: serverTimestamp(),
        roomId: '1990',
      });

      // ✅ 충분히 반영되도록 대기
      await new Promise(resolve => setTimeout(resolve, 1000));

      navigate('/MyPage');
    } catch (error) {
      console.error('퇴장 처리 실패:', error);
    }
  };

  const handleAddFriend = (friend: { nickname: string; email: string }) => {
    const newFriend = {
      nickname: friend.nickname,
      email: friend.email,
      year: roomYear
    };

    const existing = JSON.parse(localStorage.getItem('unzeFriends') || '[]');
    const alreadyAdded = existing.find((f: any) => f.email === newFriend.email);

    if (!alreadyAdded) {
      localStorage.setItem('unzeFriends', JSON.stringify([...existing, newFriend]));
      setAddedFriends((prev) => [...prev, newFriend.nickname]);
    }
  };

  const { minutes, seconds } = useTimeLeftToHour({
    onTimeEnd: () => {
      setShowEmotionPopup(true);
    }
  });

  useEffect(() => {
    const roomYear = '1990'; // ✅ 방 연도 명시

    const clearMessagesOnHour = () => {
      const now = new Date();
      const millisUntilNextHour =
        (60 - now.getMinutes()) * 60 * 1000 -
        now.getSeconds() * 1000 -
        now.getMilliseconds();

      const timer = setTimeout(async () => {
        try {
          const messagesRef = collection(db, 'chatrooms', roomYear, 'messages');
          const snapshot = await getDocs(messagesRef);

          const batch = writeBatch(db);
          snapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          await batch.commit();
          console.log(`✅ ${roomYear}년 메시지 초기화 완료`);
        } catch (error) {
          console.error('❌ 메시지 삭제 실패:', error);
        }

        clearMessagesOnHour(); // 다음 정각 예약
      }, millisUntilNextHour);

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
    };

    clearMessagesOnHour();
  }, []);


  return (
    <div className="chatroom-container">
      <div className="chatroom-wrapper">

        {/* ✅ 타이머 박스 추가 */}
        <div
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '12px',
            padding: '5px',
            color: '#00FFD1',
            backgroundColor: 'black',
          }}
        >
          ⏳ 웜홀이 닫히기까지 {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="chatroom-header" style={{ position: 'relative' }}>
          <span>1990. 04. 25</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="chatroom-report"
              onClick={(e) => {
                e.stopPropagation();
                setShowReportMenu(prev => !prev);
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '22px',
                color: '#666',
                cursor: 'pointer',
              }}
            >
              ⋯
            </button>
            <button className="chatroom-close" onClick={() => setShowExitPopup(true)}>X</button>
          </div>
          {showReportMenu && (
            <div style={{ position: 'absolute', top: '40px', right: '36px', background: '#fff', border: '1px solid #ccc', padding: '4px 8px', zIndex: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
              <button style={{ fontSize: '14px', cursor: 'pointer' }} onClick={() => navigate('/report/1990')}>신고하기</button>
            </div>
          )}
        </div>

        <div className="chatroom-invite">
          <span>{nickname}, {userList.map((u) => u.nickname).join(', ')}</span>
          <div className="button-group">
            <button className="invite-button" onClick={() => setShowUserPopup(true)}>유저보기</button>
            <button className="invite-button" onClick={() => setShowInvitePopup(true)}>초대하기</button>
          </div>
        </div>

        <div className="chat-content">
          {messages.map((msg, idx) => (
            <p
              key={idx}
              className={
                msg.type === 'system'
                  ? 'system-message'
                  : msg.sender === nickname
                    ? 'my-message'
                    : 'other-message'
              }
              style={
                msg.type === 'system'
                  ? {
                    textAlign: 'center',
                    opacity: 0.7,
                    fontStyle: 'italic',
                    fontSize: '14px',
                    margin: '6px 0',
                  }
                  : undefined // 일반 메시지는 스타일 없음(좌측정렬)
              }
            >
              {msg.type === 'system'
                ? msg.text
                : `${msg.sender}: ${msg.text}`}
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
            onKeyDown={handleKeyDown}
          />
          <button className="chatroom-send" onClick={handleSendMessage}>보내기</button>
        </div>

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

        {showUserPopup && (
          <div className="user-list-popup">
            <h3 className="popup-title">이 시간을 함께하는 사람들</h3>
            <ul className="user-list">
              {userList.map((user, idx) => (
                <li key={idx}>
                  <div className="user-row">
                    <div className="user-info">
                      <span className="name">{user.nickname}</span>
                      <span className="date">1995.04.25</span>
                    </div>
                    <button
                      className={`friend-button ${addedFriends.includes(user.nickname) ? 'confirmed' : ''}`}
                      onClick={() => handleAddFriend(user)}
                      disabled={addedFriends.includes(user.nickname)}
                    >
                      {addedFriends.includes(user.nickname) ? '추가됨' : '추가'}
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

        {showExitPopup && (
          <div className="user-list-popup exit-popup">
            <button className="exit-close-button" onClick={() => setShowExitPopup(false)}>X</button>
            <h3 className="popup-title">
              감정을 남겨야 기록됩니다.
              <br />
              남기고 나갈까요?
            </h3>
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

        {/* ✅ 정각 도달 시 감정 팝업 */}
        {showEmotionPopup && (
          <div className="user-list-popup exit-popup">
            <h3 className="popup-title">
              감정을 남겨야 기록됩니다.
              <br />
              남기고 나갈까요?
            </h3>
            <textarea
              className="exit-textarea"
              placeholder="예: 아련함"
              value={emotionText}
              onChange={(e) => setEmotionText(e.target.value)}
            />
            <div className="popup-button-group">
              <button
                className="popup-button"
                onClick={() => {
                  const newRecord = {
                    date: '1990. 04. 25',
                    time: '21:00',
                    location: '서울',
                    emotion: emotionText,
                  };
                  const existing = JSON.parse(localStorage.getItem('records') || '[]');
                  localStorage.setItem('records', JSON.stringify([...existing, newRecord]));
                  setShowEmotionPopup(false);
                  navigate('/MyPage');
                }}
              >
                기록하고 나가기
              </button>
              <button
                className="popup-button"
                onClick={() => {
                  setShowEmotionPopup(false);
                  navigate('/MyPage');
                }}
              >
                그냥 나가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom1990;
