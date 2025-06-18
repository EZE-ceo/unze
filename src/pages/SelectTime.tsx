import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import unzeLogo from "/src/assets/unze_full_logo.png";
import myIcon from "/src/assets/my.png";
import "../style/SelectTime.css";

const emotionCards = [
  {
    year: "2000",
    emoji: "💬",
    text: "밤새 타자 치며 웃던 밤",
    path: "/chatroom/2000",
  },
  {
    year: "1984",
    emoji: "📨",
    text: "편지로 나의 마음을 전하던 때",
    path: "/chatroom/1984_send",
  },
  {
    year: "2002",
    emoji: "📺",
    text: "대!한!민!국! 그해 여름 광화문",
    path: "/chatroom/2002",
  },
  {
    year: "2001",
    emoji: "💔",
    text: "그때는 말 못했던 상처",
    path: "/chatroom/2001",
  },
  {
    year: "1999",
    emoji: "📮",
    text: "지구 종말, 진짜인가요?",
    path: "/chatroom/1999",
  },
  {
    year: "1996",
    emoji: "📟",
    text: "삐삐 칠게!",
    path: "/chatroom/1996_send",
  },
  {
    year: "1998",
    emoji: "🎤",
    text: "H.O.T vs 젝스키스, 넌?",
    path: "/chatroom/1998",
  },
  {
    year: "2004",
    emoji: "💡",
    text: "다시 보고싶은 얼굴이 있어",
    path: "/chatroom/2004",
  },
];

const SelectTime = () => {
  const navigate = useNavigate();
  const [userCounts, setUserCounts] = useState<{ [year: string]: number }>({});
  const [entering, setEntering] = useState(false);
  const [nextPath, setNextPath] = useState("");

  useEffect(() => {
    const unsubscribes = emotionCards.map((card) => {
      const q = query(
        collection(db, "users"),
        where("year", "==", card.year),
        where("isOnline", "==", true)
      );

      return onSnapshot(q, (snapshot) => {
        setUserCounts((prev) => ({
          ...prev,
          [card.year]: snapshot.size,
        }));
      });
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, []);

  const handleEnter = (path: string) => {
    setNextPath(path);
    setEntering(true);
    setTimeout(() => {
      navigate(path);
    }, 1500);
  };

  return (
    <div className="select-time-wrapper">
      {/* ✅ 웜홀 애니메이션 오버레이 */}
      {entering && (
        <div className="wormhole-overlay">
          <div className="wormhole-circle" />
          <div className="wormhole-text">웜홀 진입 중...</div>
        </div>
      )}

      {/* ✅ 상단 로고 & 마이페이지 */}
      <div className="top-bar">
        <img src={unzeLogo} className="logo-unze" onClick={() => navigate("/")} />
        <img src={myIcon} className="icon-my" onClick={() => navigate("/mypage")} />
      </div>

      {/* ✅ 타이틀 */}
      <h2 className="select-title">과거의 입구</h2>
      <p className="select-sub">어느 시간으로 진입할까요?</p>

      {/* ✅ 감정 기반 리스트 */}
      <div className="emotion-list">
        {emotionCards.map((card, idx) => (
          <div className="emotion-line" key={idx} onClick={() => handleEnter(card.path)}>

            {/* 상단 좌/우 콘텐츠 */}
            <div className="top-row">
              <div className="left-content">
                <span className="year-tag">{card.year}년</span>
                <span className="emoji">{card.emoji}</span>
                <span className="emotion-text">{card.text}</span>
              </div>
              <div className="right-content">
                <span className="open-link">웜홀 열기</span>
              </div>
            </div>

            {/* 접속자 수 하단 표시 */}
            {userCounts[card.year] > 0 && (
              <div className="connected-count-below">
                현재 {userCounts[card.year]}명 접속 중
              </div>
            )}
          </div>
        ))}
      </div>


      {/* ✅ 아주 작은 안내 문구 */}
      <div className="bottom-caption">
        시간은 감정 기록이 없으면 저장되지 않습니다. 이 대화는 오직 그 순간, 그 시점에서만 존재합니다. 이 시간들은 우주의 주기에 따라 리셋 됩니다.
      </div>
    </div>
  );
};

export default SelectTime;
