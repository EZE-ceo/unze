import React, { useEffect, useState } from "react";
import "../style/LoginPage.css";
import { auth } from "../firebase-config";
import logo from "/src/assets/unze_full_logo.png";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("unzeUser");
    const savedNickname = localStorage.getItem("unzeNickname");

    if (savedUser) {
      if (savedNickname) {
        navigate("/select-time");
      } else {
        navigate("/nickname");
      }
    }
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("unzeUser", JSON.stringify(user));
      const savedNickname = localStorage.getItem("unzeNickname");
      if (savedNickname) {
        navigate("/select-time");
      } else {
        sessionStorage.setItem("fromLogin", "true");
        navigate("/nickname");
      }
    } catch (error) {
      console.error("❌ 로그인 실패:", error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      localStorage.setItem("unzeUser", JSON.stringify(user));
      const savedNickname = localStorage.getItem("unzeNickname");
      if (savedNickname) {
        navigate("/select-time");
      } else {
        sessionStorage.setItem("fromLogin", "true");
        navigate("/nickname");
      }
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setErrorMsg("존재하지 않는 이메일입니다");
      } else if (error.code === "auth/wrong-password") {
        setErrorMsg("비밀번호가 올바르지 않습니다");
      } else {
        setErrorMsg("로그인에 실패했습니다");
      }
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="UN:ZE Logo" className="login-logo" />
      <h2>로그인</h2>

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
      {errorMsg && <p style={{ color: "red", fontSize: "13px" }}>{errorMsg}</p>}
      <button className="next-button" onClick={handleEmailLogin}>
        로그인
      </button>

      <div className="divider">또는</div>

      <div className="google-login-btn" onClick={handleGoogleLogin}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="google logo"
          className="google-logo"
        />
        <span>Google로 계속하기</span>
      </div>

      <p
        onClick={() => navigate("/signup")}
        style={{
          marginTop: "20px",
          color: "white",
          textDecoration: "underline",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        회원가입
      </p>
    </div>
  );
};

export default LoginPage;
