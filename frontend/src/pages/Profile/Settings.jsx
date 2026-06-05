import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/shared/ThemeToggle';
import './Settings.css';

const Settings = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  // Password fields
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  // Checkbox settings states
  const [notifSettings, setNotifSettings] = useState({
    emailAlerts: true,
    attendanceCheck: true,
    aiPredictions: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    mfa: false,
    sessionTimeout: true
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category, name) => {
    if (category === 'notif') {
      setNotifSettings((prev) => ({ ...prev, [name]: !prev[name] }));
    } else if (category === 'security') {
      setSecuritySettings((prev) => ({ ...prev, [name]: !prev[name] }));
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setPassError('Please complete all password input fields.');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setPassLoading(true);

    // Simulate password updates
    setTimeout(() => {
      setPassSuccess('Security credentials updated successfully!');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPassLoading(false);
    }, 1000);
  };

  return (
    <div className="settings-page-root animate-fade-in">
      <div className="settings-grid">
        {/* Left Side: General preferences & Toggles */}
        <div className="settings-left-panel">
          {/* Theme Settings block */}
          <div className="settings-card glass-card">
            <h4 className="settings-block-title">Visual Layout Preferences</h4>
            <p className="settings-meta-desc">Switch system visual palettes.</p>

            <div className="theme-settings-row">
              <div className="theme-label-box">
                <strong>System Color Theme</strong>
                <span>Current Mode: {theme.toUpperCase()}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Notifications checkboxes */}
          <div className="settings-card glass-card">
            <h4 className="settings-block-title">Notification Configuration</h4>
            <p className="settings-meta-desc">Select alert dispatch mechanisms.</p>

            <div className="checkboxes-list-wrapper">
              <label className="checkbox-item-label">
                <input
                  type="checkbox"
                  checked={notifSettings.emailAlerts}
                  onChange={() => handleCheckboxChange('notif', 'emailAlerts')}
                />
                <div className="checkbox-texts">
                  <strong>Daily Summaries Emails</strong>
                  <span>Receive aggregated employee attendance logs via email.</span>
                </div>
              </label>

              <label className="checkbox-item-label">
                <input
                  type="checkbox"
                  checked={notifSettings.attendanceCheck}
                  onChange={() => handleCheckboxChange('notif', 'attendanceCheck')}
                />
                <div className="checkbox-texts">
                  <strong>Biometric Attendance Alerts</strong>
                  <span>Alert panel when face scan confirmations occur.</span>
                </div>
              </label>

              <label className="checkbox-item-label">
                <input
                  type="checkbox"
                  checked={notifSettings.aiPredictions}
                  onChange={() => handleCheckboxChange('notif', 'aiPredictions')}
                />
                <div className="checkbox-texts">
                  <strong>AI Predictive Warning Alerts</strong>
                  <span>Immediate alerts when talent attrition risks exceed 20%.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Security Rules checkboxes */}
          <div className="settings-card glass-card">
            <h4 className="settings-block-title">Security & MFA Protocols</h4>
            <p className="settings-meta-desc">Manage authentication restrictions.</p>

            <div className="checkboxes-list-wrapper">
              <label className="checkbox-item-label">
                <input
                  type="checkbox"
                  checked={securitySettings.mfa}
                  onChange={() => handleCheckboxChange('security', 'mfa')}
                />
                <div className="checkbox-texts">
                  <strong>Multi-Factor Authorization</strong>
                  <span>Request verification tokens upon portal credential verification.</span>
                </div>
              </label>

              <label className="checkbox-item-label">
                <input
                  type="checkbox"
                  checked={securitySettings.sessionTimeout}
                  onChange={() => handleCheckboxChange('security', 'sessionTimeout')}
                />
                <div className="checkbox-texts">
                  <strong>Automatic Session Timeouts</strong>
                  <span>Terminate session token after 1 hour of dashboard inactivity.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Passwords edit Form */}
        <div className="settings-right-panel">
          <div className="settings-card glass-card">
            <h4 className="settings-block-title">Modify Security Key</h4>
            <p className="settings-meta-desc">Change your portal entry credentials.</p>

            {passSuccess && <Alert type="success" message={passSuccess} onClose={() => setPassSuccess('')} />}
            {passError && <Alert type="danger" message={passError} onClose={() => setPassError('')} />}

            <form onSubmit={handlePasswordSubmit} className="settings-password-form">
              <Input
                label="Current Security Key"
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
              />

              <Input
                label="New Security Key"
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Minimum 8 characters"
                required
              />

              <Input
                label="Confirm New Security Key"
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
              />

              <Button type="submit" variant="primary" loading={passLoading}>
                Compile Security Key
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
