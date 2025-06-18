import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import editIcon from "../assets/edit_Icon.png";
import logoImg from '../assets/unze_full_logo.png';
import logoutImg from '../assets/logout.png';

import '../style/MyPage.css';

interface Record {
  id: string;
  date: string;
  time: string;
  nickname: string;
  emotion?: string;
  type: string;
}

interface Friend {
  nickname: string;
  email: string;
  year: string;
}

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [records, setRecords] = useState<Record[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [onlineStatuses, setOnlineStatuses] = useState<{ [name: string]: string }>({});
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [checkedRows, setCheckedRows] = useState<{ [id: string]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    const fetchData = async () => {
      const storedUser = JSON.parse(localStorage.getItem('unzeUser') || '{}');
      const localFriends = JSON.parse(localStorage.getItem('unzeFriends') || '[]');
      setFriends(Array.isArray(localFriends) ? localFriends : []);
    };
    fetchData();
  }, [user, loading]);


  // 친구 불러오기 (이메일 기준)
  useEffect(() => {
    const fetchFriends = async () => {
      const storedUser = JSON.parse(localStorage.getItem('unzeUser') || '{}');
      const localFriends = JSON.parse(localStorage.getItem('unzeFriends') || '[]');
      setFriends(Array.isArray(localFriends) ? localFriends : []);
      // 서버에서 동기화 필요시 아래 추가
      // if (storedUser.email) { ... }
    };
    fetchFriends();
  }, []);

  // 여행 기록(받은 삐삐, 받은 편지) — 모두 "내 이메일" 기준!
  useEffect(() => {
    const fetchTravelRecords = async () => {
      const user = auth.currentUser;
      if (!user || !user.email) return;
      const userEmail = user.email;

      // 1. 받은 삐삐(90년대) — toEmail === 내 이메일
      const beepQ = query(
        collection(db, 'beepMessages'),
        where("toEmail", "==", userEmail),
        where("type", "==", "beep")
      );
      const beepSnap = await getDocs(beepQ);
      const beepRecords = beepSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          date: '1996년 어느 날',
          time: '',
          nickname: data.fromNickname || '',
          emotion: data.content || '',
          type: "beep"
        };
      });

      // 2. 받은 편지(1984년) — receiverEmail === 내 이메일
      const letterQ = query(
        collection(db, 'letters'),
        where('receiverEmail', '==', userEmail)
      );
      const letterSnap = await getDocs(letterQ);
      const letterRecords = letterSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          date: '1984년 어느 날',
          time: '',
          nickname: data.senderNickname || '',
          emotion: data.message || '',
          type: "letter"
        };
      });

      // 3. 로컬 기록도 추가
      const localRecords = JSON.parse(localStorage.getItem('records') || '[]');

      const allRecords: Record[] = [...localRecords, ...beepRecords, ...letterRecords];
      setRecords(allRecords);
    };
    fetchTravelRecords();
  }, []);

  // 친구들의 접속상태
  useEffect(() => {
    const fetchOnlineStatuses = async () => {
      if (friends.length === 0) return;
      const nicknames = friends.filter(friend => !!friend.nickname).map(friend => friend.nickname);
      if (nicknames.length === 0) return;
      const q = query(collection(db, 'users'), where('nickname', 'in', nicknames));
      const snapshot = await getDocs(q);
      const statuses: { [name: string]: string } = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.nickname && data.year) {
          statuses[data.nickname] = data.year;
        }
      });
      setOnlineStatuses(statuses);
    };
    fetchOnlineStatuses();
  }, [friends]);

  useEffect(() => {
    const checked = JSON.parse(localStorage.getItem('checkedBeepRows') || '{}');
    setCheckedRows(checked);
  }, []);

  useEffect(() => {
    const storedNickname = localStorage.getItem('unzeNickname');
    if (storedNickname) {
      setNickname(storedNickname);
      setNicknameInput(storedNickname);
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('unzeUser');
    localStorage.removeItem('unzeNickname');
    sessionStorage.removeItem('fromLogin');
    navigate("/login");
  };

  const handleSaveNickname = () => {
    if (nicknameInput.trim()) {
      localStorage.setItem("unzeNickname", nicknameInput);
      setNickname(nicknameInput);
      setIsEditing(false);
    }
  };

  const groupedFriends = friends.reduce((acc: { [year: string]: Friend[] }, friend) => {
    if (!acc[friend.year]) acc[friend.year] = [];
    acc[friend.year].push(friend);
    return acc;
  }, {});

  const toggleYear = (year: string) => {
    const newSet = new Set(expandedYears);
    newSet.has(year) ? newSet.delete(year) : newSet.add(year);
    setExpandedYears(newSet);
  };

  // 확인하기
  const handleCheck = (idx: number, messageId: string, type: string) => {
    setCheckedRows(prev => {
      const updated = { ...prev, [messageId]: true };
      localStorage.setItem('checkedBeepRows', JSON.stringify(updated));
      return updated;
    });

    if (type === "beep") {
      navigate('/received-beep-1996', { state: { messageId } });
    } else if (type === "letter") {
      navigate('/received-letter-1984', { state: { messageId } });
    }
  };

  if (loading) {
    return (
      <div className="mypage-container default-page">
        <div style={{ color: "#00ffd1", textAlign: "center", marginTop: "40vh" }}>
          불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-container default-page" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      <div className="mypage-header">
        <img
          src={logoImg}
          className="mypage-logo"
          alt="UNZE"
          onClick={() => navigate('/select-time')}
        />
        <img
          src={logoutImg}
          className="mypage-logout"
          alt="LOGOUT"
          onClick={handleLogout}
        />
      </div>

      <div className="mypage-nickname-wrapper">
        {isEditing ? (
          <>
            <input
              className="nickname-input"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
            />
            <button className="save-button" onClick={handleSaveNickname}>저장</button>
          </>
        ) : (
          <h2 className="mypage-nickname" style={{ color: 'white' }}>
            {nickname}
            <img
              src={editIcon}
              alt="edit"
              className="edit-icon"
              onClick={() => setIsEditing(true)}
            />
          </h2>
        )}
      </div>

      <hr className="mypage-divider" />

      <div className="mypage-section">
        <div className="section-title">📟 친구</div>
        {Object.keys(groupedFriends).length === 0 ? (
          <div className="no-records"><p>등록된 친구가 없습니다.</p></div>
        ) : (
          Object.keys(groupedFriends).sort().map((year, idx, arr) => {
            // undefined, null, 빈문자 등 이상 year 값은 "연도 정보 없음"으로 대체
            const labelYear = (year && year !== 'undefined' && year !== 'null' && year !== '') ? year : '연도 정보 없음';
            return (
              <div
                key={year}
                style={{
                  marginBottom: '16px',
                  borderBottom: idx !== arr.length - 1 ? '1px solid #333' : 'none',
                  paddingBottom: '12px'
                }}
              >
                <p
                  className="year-toggle"
                  onClick={() => toggleYear(year)}
                  style={{
                    cursor: 'pointer',
                    color: '#00ffd1',
                    margin: '8px 0',
                    paddingBottom: '4px'
                  }}
                >
                  {labelYear}년 {expandedYears.has(year) ? '▲' : '▼'}
                </p>
                {expandedYears.has(year) && (
                  <ul style={{ paddingLeft: '16px', marginTop: '8px' }}>
                    {groupedFriends[year].map((friend, idx) => (
                      <li key={idx} className="friend-entry">
                        {friend.nickname}
                        {onlineStatuses[friend.nickname] && (
                          <span style={{ marginLeft: '8px', color: '#a0ffe8', fontSize: '14px' }}>
                            (현재 {onlineStatuses[friend.nickname]}년을 여행 중)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </div>


      <hr className="mypage-divider" />

      <div className="mypage-section">
        <div className="section-title">🕰️ 여행 기록</div>

        {records.length === 0 ? (
          <div className="no-records"><p>기록된 여행이 없습니다.</p></div>
        ) : (
          <table className="record-table">
            <tbody>
              {records.map((record, idx) => (
                <tr key={record.id || idx}>
                  {/* 날짜 */}
                  <td>
                    {record.type === "letter" ? "1984년 어느 날" :
                      record.type === "beep" ? "1996년 어느 날" : record.date}
                  </td>
                  {/* 닉네임 or 보낸사람 */}
                  <td>
                    {record.nickname}
                  </td>
                  {/* 확인하기 버튼 */}
                  <td>
                    <button
                      className={`check-button${checkedRows[record.id] ? ' checked' : ''}`}
                      onClick={() => handleCheck(idx, record.id, record.type)}
                    >
                      확인하기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyPage;
