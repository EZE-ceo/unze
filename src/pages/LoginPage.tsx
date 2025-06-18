// ✅ src/pages/LoginPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { auth } from "../firebase-config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import "../style/LoginPage.css";
import logo from "../assets/unze_full_logo.png";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("unzeUser");
    const savedNickname = localStorage.getItem("unzeNickname");
    const fromLogin = sessionStorage.getItem("fromLogin");

    if (savedUser && !fromLogin) {
      navigate(savedNickname ? "/select-time" : "/nickname");
    }
    sessionStorage.removeItem("fromLogin");
  }, []);

  const navigateAfterLogin = () => {
    const savedNickname = localStorage.getItem("unzeNickname");
    navigate(savedNickname ? "/select-time" : "/nickname");
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("unzeUser", JSON.stringify(result.user));

      const q = query(collection(db, "users"), where("email", "==", user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        if (userData.nickname) {
          localStorage.setItem("unzeNickname", userData.nickname);
        }
      }

      const redirectYear = localStorage.getItem("redirectYear");
      if (redirectYear) {
        localStorage.removeItem("redirectYear");
        navigate(`/chatroom/${redirectYear}`);
      } else {
        navigateAfterLogin();
      }

    } catch (error) {
      console.error("❌ Google 로그인 실패:", error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      localStorage.setItem("unzeUser", JSON.stringify(user));

      const q = query(collection(db, "users"), where("email", "==", user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        if (userData.nickname) {
          localStorage.setItem("unzeNickname", userData.nickname);
        }
      }

      const redirectYear = localStorage.getItem("redirectYear");
      if (redirectYear) {
        localStorage.removeItem("redirectYear");
        navigate(`/chatroom/${redirectYear}`);
      } else {
        navigateAfterLogin();
      }

    } catch (error: any) {
      const code = error.code;
      setErrorMsg(
        code === "auth/user-not-found"
          ? "존재하지 않는 이메일입니다"
          : code === "auth/wrong-password"
            ? "비밀번호가 올바르지 않습니다"
            : "로그인에 실패했습니다"
      );
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-page-content">
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

        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="google logo"
            className="google-logo"
          />
          <span>Google로 계속하기</span>
        </button>

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

      {/* ✅ Footer는 항상 하단 */}
      <Footer />
    </div>
  );
};

export default LoginPage;
