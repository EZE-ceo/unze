import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/select-era.css';

const SelectEra: React.FC = () => {
    const navigate = useNavigate();

    const handlePastClick = () => {
        navigate('/select-time'); // 감정 카드 선택 페이지로 이동 예정
    };

    return (
        <div
            className="select-era-wrapper"
            style={{ fontFamily: "'Pretendard Variable', sans-serif" }}
        >

            <h2 className="select-era-title">우리 언제 만날까?</h2>
            <p className="select-era-sub">시간에서 만나는 대화 메신저, 웜홀 진입 중...</p>

            <div className="era-card-container">
                <div className="era-card past" onClick={handlePastClick}>
                    <span className="era-icon">🕰️</span>
                    <h3>과거</h3>
                    <p>그땐 어떤 세상이었지?</p>
                </div>

                <div className="era-card future disabled">
                    <span className="era-icon">🛸</span>
                    <h3>미래</h3>
                    <p>곧 새로운 시간이 열립니다</p>
                </div>
            </div>
        </div>
    );
};

export default SelectEra;
