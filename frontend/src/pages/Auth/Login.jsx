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
      {/* Left Panel: Branding, SaaS Dashboard Illustration, Feature Cards */}
      <div className="login-branding-panel">
        <div className="branding-container">
          {/* Header / Brand Logo */}
          <div className="brand-header">
            <div className="brand-icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <div className="brand-title-group">
              <h2 className="brand-name">EMPLOYEE <span className="brand-accent">HUB</span></h2>
              <p className="brand-tagline">Smart Work. Better Together.</p>
            </div>
          </div>

          {/* Hero Heading & Description */}
          <div className="hero-text-block">
            <div className="decorative-dots"></div>
            <h1 className="hero-title">
              Welcome to<br />
              <span className="hero-highlight">Employee Hub</span>
            </h1>
            <p className="hero-description">
              Your all-in-one platform to manage, track and grow together. Empowering employees, driving success.
            </p>
          </div>

          {/* Modern Dashboard Preview Art */}
          <div className="dashboard-preview-art">
            <div className="art-window">
              <div className="art-window-header">
                <div className="art-window-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div className="art-window-body">
                <div className="art-sidebar">
                  <div className="art-nav-item active"></div>
                  <div className="art-nav-item"></div>
                  <div className="art-nav-item"></div>
                  <div className="art-nav-item"></div>
                </div>
                <div className="art-content">
                  <div className="art-content-title">Dashboard</div>
                  <div className="art-stats-row">
                    <div className="art-stat-card">
                      <span className="art-stat-label">Total Employees</span>
                      <span className="art-stat-val">1,248</span>
                    </div>
                    <div className="art-stat-card">
                      <span className="art-stat-label">Attendance Rate</span>
                      <span className="art-stat-val success">96%</span>
                    </div>
                    <div className="art-stat-card">
                      <span className="art-stat-label">Performance Score</span>
                      <span className="art-stat-val purple">85%</span>
                    </div>
                  </div>
                  <div className="art-charts-row">
                    <div className="art-chart-box">
                      <div className="art-skeleton-line"></div>
                      <div className="art-skeleton-line short"></div>
                    </div>
                    <div className="art-chart-box">
                      <div className="art-user-avatar">EH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3 Feature Cards */}
          <div className="branding-feature-cards">
            <div className="feature-card">
              <div className="feature-icon-circle">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span className="feature-title">Empowering<br />Employees</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M5 19h14v2H5s0-2 0-2zm10-6h4v4h-4v-4zm-6-6h4v10H9V7zM3 13h4v4H3v-4z"/>
                </svg>
              </div>
              <span className="feature-title">Insights for<br />Better Decisions</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
              </div>
              <span className="feature-title">Growth<br />Together</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="login-form-panel">
        <div className="login-form-container">
          {/* Top User Badge Icon */}
          <div className="form-user-badge">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>

          <div className="form-head-texts">
            <h2 className="form-welcome-title">Hello Again!</h2>
            <p className="form-welcome-sub">Sign in to your account</p>
          </div>

          {errorMsg && <Alert type="danger" message={errorMsg} onClose={() => setErrorMsg('')} />}

          <form onSubmit={handleSubmit} className="login-form-element">
            <div className="form-field-group">
              <Input
                label="Username"
                type="text"
                name="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-field-group">
              <Input
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-extra-row">
              <label className="remember-me-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-pass-link">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={!isCaptchaVerified}
            >
              <span className="btn-flex-content">
                <span>Sign In</span>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </Button>

            {/* Google reCAPTCHA component */}
            <div className="recaptcha-container">
              <Captcha onVerify={setIsCaptchaVerified} />
            </div>
          </form>

          {/* Project Login Credentials Card */}
          <div className="project-credentials-card">
            <div className="credentials-divider">
              <span>Project Login Credentials</span>
            </div>
            <div className="credentials-card-content">
              <div className="credentials-shield-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm-1 16l-4-4 1.41-1.41L11 14.17l5.59-5.59L18 10l-7 7z"/>
                </svg>
              </div>
              <div className="credentials-details">
                <p className="credentials-prompt">Use the following credentials to login:</p>
                <p className="credentials-row">
                  <span className="cred-label">Username:</span> <strong className="cred-value">admin</strong>
                </p>
                <p className="credentials-row">
                  <span className="cred-label">Password:</span> <strong className="cred-value">admin123</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Security Badge */}
          <div className="form-security-footer">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Secure. Simple. Powerful.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
