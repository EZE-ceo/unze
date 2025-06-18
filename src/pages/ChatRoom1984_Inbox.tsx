import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { auth } from '../firebase-config';
import '../style/ChatRoom1984_Send.css'; // 스타일 그대로 사용

interface Letter {
  id: string;
  senderNickname: string;
  message: string;
  isAnonymous: boolean;
  senderId: string;
  timestamp: any;
}

const ChatRoom1984_Inbox: React.FC = () => {
  const navigate = useNavigate();
  const [letters, setLetters] = useState<Letter[]>([]);
  const nickname = localStorage.getItem('unzeNickname') || '나';
  const db = getFirestore();

  useEffect(() => {
    const fetchLetters = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'letters'),
        where('receiverId', '==', auth.currentUser.uid), 
        orderBy('timestamp', 'desc')
      );      

      const snapshot = await getDocs(q);
      const result: Letter[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any)
      }));

      setLetters(result);
    };

    fetchLetters();
  }, []);

  const handleRead = (letter: Letter) => {
    localStorage.setItem('receivedLetter1984', JSON.stringify(letter));
    navigate('/chatroom1984_received');
  };

  return (
    <div className="chatroom-1984-wrapper">
      <div className="background-1984" />
      <div className="letter-container" style={{ overflowY: 'auto' }}>
        <div className="top-line">
          <span className="date-text">📬 {nickname}의 받은 편지함</span>
          <button className="exit-button" onClick={() => navigate('/MyPage')}>
            나가기 →
          </button>
        </div>

        {letters.length === 0 ? (
          <div
            style={{
              fontFamily: 'NanumGaram',
              padding: '24px',
              color: '#666',
              fontSize: '18px'
            }}
          >
            아직 도착한 편지가 없습니다.
          </div>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: '0 12px',
              fontFamily: 'NanumGaram'
            }}
          >
            {letters.map((letter, idx) => (
              <li
                key={idx}
                onClick={() => handleRead(letter)}
                style={{
                  padding: '12px',
                  marginBottom: '12px',
                  borderBottom: '1px dashed #aaa',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#1a237e'
                }}
              >
                <strong>[{letter.isAnonymous ? '누군가' : letter.senderNickname}]</strong>의 편지
                <br />
                <span style={{ fontSize: '14px', color: '#666' }}>
                  {new Date(letter.timestamp?.toDate?.() || '').toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatRoom1984_Inbox;
