import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Captcha from '../../components/shared/Captcha';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please input all login credentials.');
      return;
    }
    if (!isCaptchaVerified) {
      setErrorMsg('Please verify you are human via reCAPTCHA.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await login(email, password, rememberMe);
      if (res.success) {
        navigate('/');
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-root">
      {/* Split Pane - Left Panel: Branding & Art */}
      <div className="login-branding-panel">
        <div className="branding-glass-card glass-card">
          <div className="brand-logo-badge">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="#ffffff" strokeWidth="2.5" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h2 className="branding-title">Employee_Hub</h2>
          <p className="branding-text">
            Unlock the power of predictive machine learning analytics. Manage daily attendance streams, predict performance trajectories, and automate corporate rewards seamlessly.
          </p>
          <div className="branding-feature-bullets">
            <div className="bullet-item">
              <span className="bullet-icon">⚡</span>
              <span>AI-Powered Talent Churn & Review Core</span>
            </div>
            <div className="bullet-item">
              <span className="bullet-icon">📸</span>
              <span>Simulated Biometric Check-in Viewports</span>
            </div>
            <div className="bullet-item">
              <span className="bullet-icon">🏆</span>
              <span>Automated Dynamic Achievements Grid</span>
            </div>
          </div>
          <div className="branding-footer">
            <span>Enterprise Edition v4.2</span>
          </div>
        </div>
      </div>

      {/* Split Pane - Right Panel: Input form */}
      <div className="login-form-panel">
        <div className="login-form-box">
          <div className="form-head-texts">
            <h3 className="form-welcome-title">Portal Gateway</h3>
            <p className="form-welcome-sub">Sign in with administrator credentials</p>
          </div>

          {errorMsg && <Alert type="danger" message={errorMsg} onClose={() => setErrorMsg('')} />}

          <form onSubmit={handleSubmit} className="login-form-element">
            <Input
              label="username"
              type="text"
              name="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin"
              required
            />

            <Input
              label="Secret Key (Password)"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. admin123"
              required
            />

            <div className="form-extra-row">
              <label className="remember-me-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep session persistent</span>
              </label>
              <Link to="/forgot-password" className="forgot-pass-link">
                Forgot Key?
              </Link>
            </div>

            {/* Custom Google reCAPTCHA component */}
            <Captcha onVerify={setIsCaptchaVerified} />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={!isCaptchaVerified}
            >
              Sign In to core
            </Button>
          </form>

          <div className="form-demo-info glass-card">
            <strong>Development Credentials:</strong>
            <p>Email: <code>admin@enterprise.com</code></p>
            <p>Password: <code>admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
