import React, { useState } from 'react';
import './Captcha.css';

const Captcha = ({ onVerify }) => {
  const [status, setStatus] = useState('idle'); // idle | loading | verified

  const handleCheckboxClick = () => {
    if (status !== 'idle') return;

    setStatus('loading');
    
    // Simulate verification delay
    setTimeout(() => {
      setStatus('verified');
      if (onVerify) {
        onVerify(true);
      }
    }, 1200);
  };

  return (
    <div className="recaptcha-box glass-card">
      <div className="recaptcha-left">
        <button
          type="button"
          className={`recaptcha-checkbox ${status}`}
          onClick={handleCheckboxClick}
          disabled={status !== 'idle'}
          aria-label="Verify you are human"
        >
          {status === 'loading' && <div className="recaptcha-spinner"></div>}
          {status === 'verified' && (
            <svg className="recaptcha-checkmark animate-scale" viewBox="0 0 24 24">
              <path fill="none" stroke="#10b981" strokeWidth="3" d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <span className="recaptcha-label">I'm not a robot</span>
      </div>
      <div className="recaptcha-right">
        <div className="recaptcha-logo-wrapper">
          <svg className="recaptcha-logo" viewBox="0 0 24 24" width="30" height="30">
            <path fill="#4c8bf5" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.25z" />
          </svg>
          <span className="recaptcha-brand-text">reCAPTCHA</span>
        </div>
        <div className="recaptcha-privacy-links">
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy</a>
          <span> - </span>
          <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms</a>
        </div>
      </div>
    </div>
  );
};

export default Captcha;
