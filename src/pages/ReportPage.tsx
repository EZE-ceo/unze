import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const db = getFirestore();

const ReportPage = () => {
  const { year } = useParams();
  const navigate = useNavigate();
  const [targetNickname, setTargetNickname] = useState('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentUser = localStorage.getItem('unzeNickname') || '익명';

  const handleSubmit = async () => {
    if (!targetNickname || !reason) {
      alert('닉네임과 신고 사유를 입력해주세요.');
      return;
    }

    try {
      await addDoc(collection(db, 'reports'), {
        from: currentUser,
        target: targetNickname,
        reason,
        details,
        room: year || '',
        timestamp: serverTimestamp()
      });
      setIsSubmitted(true);
      setTimeout(() => navigate('/MyPage'), 2000);
    } catch (error) {
      alert('신고 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate('/MyPage');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
        {year}년 방 신고하기
      </h2>

      {isSubmitted ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>신고가 제출되었습니다. 마이페이지로 이동 중...</p>
      ) : (
        <>
          <label>신고 대상 닉네임</label>
          <input
            type="text"
            value={targetNickname}
            onChange={(e) => setTargetNickname(e.target.value)}
            placeholder="예: 불량이"
            style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
          />

          <label>신고 사유</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
          >
            <option value="">-- 선택하세요 --</option>
            <option value="욕설">욕설</option>
            <option value="불쾌한 언행">불쾌한 언행</option>
            <option value="스팸/광고">스팸/광고</option>
            <option value="기타">기타</option>
          </select>

          <label>상세 내용 (선택)</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={5}
            placeholder="구체적인 내용을 적어주세요."
            style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: '#ccc',
                color: '#000',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              취소
            </button>

            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: '#222',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              신고 제출
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportPage;
