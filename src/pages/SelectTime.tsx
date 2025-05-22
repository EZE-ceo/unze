import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/SelectTime.css';
import unzeLogo from '../assets/unze_full_logo.png';
import myIcon from '../assets/my.png';

const yearDescriptions: { [key: string]: string } = {
  "1984": "1984년, 손글씨 편지가 마음을 전하던 시절.",
  "1990": "1990년, 텔레비전은 세상을 연결하던 유일한 창이었어요.",
  "1991": "1991년의 거리엔 투명한 워크맨 소리가 흘렀죠.",
  "1992": "1992년의 우체통은 기다림의 아이콘이었어요.",
  "1993": "1993년, 초코송이 도시락과 함께한 운동장 소풍.",
  "1994": "1994년의 영화관엔 느린 자막과 빨간 의자가 있었어요.",
  "1995": "1995년, 윈도우95가 세상을 바꿨죠.",
  "1996": "1996년의 교실엔 체리 사이다 냄새가 맴돌았어요.",
  "1997": "1997년, IMF와 함께 우린 조금 더 어른이 되었죠.",
  "1998": "1998년, 버디버디에서 처음 받은 메시지처럼.",
  "1999": "1999년, 밀레니엄을 기다리던 초조한 설렘.",
  "2000": "2000년, 종이 일기장이 디지털로 바뀌던 시작.",
  "2001": "2001년, 싸이월드 미니홈피가 열린 해.",
  "2002": "2002년, 월드컵 함성과 함께한 여름의 기억.",
  "2003": "2003년, 문자 1건에 20원이던 시절.",
  "2004": "2004년, 다마고치가 가방 속을 점령했죠.",
  "2005": "2005년, MSN 메신저에서 친구 상태를 훔쳐봤던 날들.",
  "2006": "2006년, 디카로 찍은 첫 친구 셀카.",
  "2007": "2007년, QOQ 채팅방의 새벽 감성.",
  "2008": "2008년, 일본 드라마 DVD를 돌려보던 우리.",
  "2009": "2009년, 싸이월드의 미니홈피가 마지막 불을 밝히던 해."
};

const SelectTime = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("1990");
  const [loading, setLoading] = useState(false);

  const handleEnter = () => {
    setLoading(true);
    setTimeout(() => {
      const year = parseInt(selectedYear);
      if (selectedYear === "1984") {
        navigate('/chatroom/1984');
      } else if (selectedYear === "1996") {
        navigate('/chatroom/1996');
      } else if (year >= 1990 && year <= 1999) {
        navigate('/chatroom/1990s');
      } else if (year >= 2000 && year <= 2009) {
        navigate('/chatroom/2000s');
      } else {
        alert("아직 준비 중인 방입니다.");
      }
    }, 1500);
  };

  const years = ["1984", ...Array.from({ length: 20 }, (_, i) => (1990 + i).toString())];

  const getMockUsers = (year: string) => {
    const base = parseInt(year.slice(-1));
    return Math.floor(3 + (base * 1.7)) + "명";
  };

  return (
    <div className="select-time-container">
      {/* ✅ 상단 로고 / 마이페이지 */}
      <div className="top-bar">
        <img
          src={unzeLogo}
          className="logo-unze"
          alt="UNZE"
          onClick={() => navigate('/')}
        />
        <img
          src={myIcon}
          className="icon-my"
          alt="MY"
          onClick={() => navigate('/mypage')}
        />
      </div>

      {/* ✅ 중앙 콘텐츠 묶기 */}
      <div className="select-content-wrapper">
        <h2 className="select-time-title">어느 시간으로 이동할까요?</h2>

        <select
          className="year-select-wheel"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>

        <div className="year-description">
          {yearDescriptions[selectedYear] || "그 해의 기억 속으로 여행을 떠나봅니다."}
        </div>

        <div className="year-users">
          현재 {getMockUsers(selectedYear)}이 이 시간을 여행 중
        </div>

        {!loading ? (
          <button className="enter-button" onClick={handleEnter}>
            웜홀 열기
          </button>
        ) : (
          <p className="loading-text">웜홀이 열리는 중입니다...</p>
        )}
      </div>
    </div>
  );
};

export default SelectTime;
