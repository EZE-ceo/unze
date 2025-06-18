// ✅ src/components/Footer.tsx
import React from 'react';
import '../style/footer.css';

const Footer = () => {
  return (
    <footer className="unze-footer">
      <div className="unze-footer__content">
        <span>© 2025 UN:ZE</span>
        <span className="unze-footer__divider">·</span>
        <a href="/privacy" className="unze-footer__link">개인정보처리방침</a>
        <span className="unze-footer__divider">|</span>
        <a href="/terms" className="unze-footer__link">이용약관</a>
      </div>
    </footer>
  );
};

export default Footer;
