import React from 'react';
import '../style/footer.css'; 

const Footer = () => {
  console.log("푸터 렌더링됨");
  return (
    <footer
      style={{
        color: "#888",
        fontSize: "12px",
        textAlign: "center",
        marginTop: "30px",
        padding: "10px",
        position: "relative",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        zIndex: 1000,
      }}
    >
      © 2025 UN:ZE · <a href="/privacy" style={{ color: "#888", textDecoration: "underline" }}>개인정보처리방침</a>
    </footer>
  );
};

export default Footer;
