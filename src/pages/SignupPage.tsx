// src/pages/SignupPage.tsx

import React, { useState } from "react";
import "../style/LoginPage.css"; // 로그인과 같은 스타일 사용
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async () => {
    if (password !== confirm) {
      setErrorMsg("비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      navigate("/login");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMsg("이미 존재하는 이메일입니다");
      } else if (error.code === "auth/invalid-email") {
        setErrorMsg("올바른 이메일 형식이 아닙니다");
      } else if (error.code === "auth/weak-password") {
        setErrorMsg("비밀번호는 최소 6자 이상이어야 합니다");
      } else {
        setErrorMsg("회원가입에 실패했습니다");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>회원가입</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        className="input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        className="input"
      />
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="비밀번호 확인"
        className="input"
      />

      {errorMsg && (
        <p style={{ color: "red", fontSize: "13px", marginTop: "6px" }}>
          {errorMsg}
        </p>
      )}

      <button className="next-button" onClick={handleSignup}>
        회원가입
      </button>

      <p
        onClick={() => navigate("/login")}
        style={{
          marginTop: "20px",
          color: "white",
          textDecoration: "underline",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        로그인으로 돌아가기
      </p>
    </div>
  );
};

export default SignupPage;
