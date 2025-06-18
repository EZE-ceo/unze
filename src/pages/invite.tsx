// ✅ src/pages/Invite.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Invite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const year = searchParams.get('year');

  useEffect(() => {
    if (!year) {
      navigate('/');
      return;
    }

    const user = JSON.parse(localStorage.getItem('unzeUser') || '{}');
    if (user?.email && localStorage.getItem("unzeNickname")) {
      // ✅ 로그인된 경우 바로 입장
      navigate(`/chatroom/${year}`);
    } else {
      // ✅ 로그인 안된 경우, redirectYear 저장 후 로그인으로
      localStorage.setItem('redirectYear', year);
      navigate('/login');
    }
  }, []);

  return null;
};

export default Invite;
