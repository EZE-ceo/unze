import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import editIcon from "../assets/edit_Icon.png";
import logoImg from '../assets/unze_full_logo.png';
import logoutImg from '../assets/logout.png';

import '../style/MyPage.css';

interface Record {
  date: string;
  time: string;
  location: string;
  emotion: string;
}

interface Friend {
  year: string;
  name: string;
  emotion: string;
}

const MyPage = () => {
  const [nickname, setNickname] = useState('닉네임');
  const [records, setRecords] = useState<Record[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('unzeNickname');
    if (storedName) {
      setNickname(storedName);
      setNicknameInput(storedName);
    }

    const storedRecords = JSON.parse(localStorage.getItem('records') || '[]');
    setRecords(storedRecords);

    const storedFriends = JSON.parse(localStorage.getItem('unzeFriends') || '[]');
    setFriends(storedFriends);
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
    if (newSet.has(year)) {
      newSet.delete(year);
    } else {
      newSet.add(year);
    }
    setExpandedYears(newSet);
  };

  return (
    <div className="mypage-container">
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
          Object.keys(groupedFriends).sort().map((year, idx, arr) => (
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
                {year}년 {expandedYears.has(year) ? '▲' : '▼'}
              </p>
              {expandedYears.has(year) && (
                <ul style={{ paddingLeft: '16px', marginTop: '8px' }}>
                  {groupedFriends[year].map((friend, idx) => (
                    <li key={idx} className="friend-entry">
                      {friend.name} | {friend.emotion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
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
              {records.map((record, idx) => {
                const isBeep = record.location === '삐삐';
                const isLetter = record.location === '편지';

                return (
                  <tr key={idx}>
                    <td>{record.date}</td>
                    <td>{record.time}</td>
                    <td>{record.location}</td>
                    <td>
                      {(isBeep || isLetter) ? (
                        <button
                          className="check-button"
                          onClick={() =>
                            navigate(isBeep ? '/received-beep-1996' : '/received-letter-1984')
                          }
                        >
                          확인하기
                        </button>
                      ) : (
                        record.emotion.length > 5 ? (
                          <button className="check-button" onClick={() => alert(record.emotion)}>
                            확인하기
                          </button>
                        ) : (
                          record.emotion
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyPage;
