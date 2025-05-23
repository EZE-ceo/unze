// ✅ src/pages/Privacy.tsx
import React from 'react';

const Privacy = () => {
  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#ccc',
        padding: '40px 24px',
        maxWidth: '360px',
        margin: '0 auto',
        fontSize: '13px',
        lineHeight: '1.6',
        textAlign: 'left', // 👈 전체 좌측 정렬
      }}
    >
      <h1
        style={{
          fontSize: '20px',
          color: '#fff',
          marginBottom: '24px',
          textAlign: 'left', // 👈 제목도 좌측 정렬
        }}
      >
        개인정보처리방침
      </h1>
      <p>
        UN:ZE는 이용자의 개인정보를 소중히 여기며 관련 법령을 준수합니다. 본 방침은 이용자가 어떤 정보를 수집하고 어떻게 사용하는지에 대해 설명합니다.
      </p>
      <p style={{ marginTop: '24px' }}>
        <strong>수집 항목:</strong> 이메일, 로그인 이력<br />
        <strong>이용 목적:</strong> 서비스 제공, 보안 관리<br />
        <strong>보관 기간:</strong> 회원 탈퇴 시까지 보관 후 즉시 파기<br />
        <strong>문의:</strong> help@un-ze.com
      </p>
    </div>
  );
};

export default Privacy;
