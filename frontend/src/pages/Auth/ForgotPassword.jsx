import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | success
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please input your email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Simulate API recovery trigger
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
    } catch (err) {
      setErrorMsg('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-pass-root">
      <div className="forgot-pass-glass-container glass-card animate-fade-in">
        <div className="brand-logo-badge" style={{ margin: '0 auto 20px auto' }}>
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="#ffffff" strokeWidth="2.5" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>

        <h2 className="forgot-pass-title">Reset Portal Access</h2>

        {status === 'idle' ? (
          <>
            <p className="forgot-pass-description">
              Provide your verified corporate email address below. We will simulate sending a recovery key to authorize authentication resets.
            </p>

            {errorMsg && <Alert type="danger" message={errorMsg} onClose={() => setErrorMsg('')} />}

            <form onSubmit={handleSubmit} className="forgot-pass-form">
              <Input
                label="Corporate Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@enterprise.com"
                required
              />

              <Button type="submit" variant="primary" fullWidth loading={loading}>
                Generate recovery key
              </Button>
            </form>
          </>
        ) : (
          <div className="forgot-pass-success-state">
            <div className="success-icon-badge">
              <svg viewBox="0 0 24 24" width="36" height="36" stroke="var(--color-success)" strokeWidth="2.5" fill="none">
                <polyline points="20 6 9 17 5 13"></polyline>
              </svg>
            </div>
            <h3 className="success-heading">Recovery Email Sent</h3>
            <p className="forgot-pass-description">
              An encryption reset ticket has been generated. In development mode, you can immediately log back in with:
              <br />
              <code>admin@enterprise.com</code> / <code>admin123</code>
            </p>
          </div>
        )}

        <div className="forgot-pass-footer">
          <Link to="/login" className="return-login-link">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Return to Portal Gateway</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
