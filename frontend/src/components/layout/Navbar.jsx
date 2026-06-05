import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from '../shared/ThemeToggle';
import NotificationPanel from './NotificationPanel';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css';

const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Compute page headers based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Overview Analytics';
    if (path === '/employees') return 'Employee Directory';
    if (path.startsWith('/employees/')) return 'Employee Profile';
    if (path === '/attendance') return 'Attendance Tracker';
    if (path === '/attendance/face') return 'Facial recognition check-in';
    if (path === '/performance') return 'Performance Review';
    if (path === '/rewards') return 'Rewards Dashboard';
    if (path === '/ai-prediction') return 'AI Prediction Hub';
    if (path === '/analytics') return 'Advanced Statistics';
    if (path === '/settings') return 'System Configuration';
    return 'Dashboard';
  };

  return (
    <header className="navbar-container glass-card">
      <div className="navbar-left">
        {/* Mobile Hamburger menu */}
        <button className="mobile-menu-toggle-btn" onClick={onMenuToggle}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="navbar-page-title">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle Component */}
        <ThemeToggle />

        {/* Notifications Panel Box */}
        <div className="navbar-dropdown-wrapper" ref={notifRef}>
          <button
            className={`nav-action-icon-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Toggle notifications"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="navbar-badge-pulse"></span>
          </button>
          <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>

        {/* Divider */}
        <div className="navbar-divider"></div>

        {/* Profile Dropdown Box */}
        <div className="navbar-dropdown-wrapper" ref={profileRef}>
          <button
            className="navbar-profile-trigger"
            onClick={() => setShowProfile(!showProfile)}
            aria-label="Toggle user menu"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
              alt="Sarah Connor"
              className="navbar-user-avatar"
            />
            <span className="navbar-username">Sarah C.</span>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={`profile-chevron ${showProfile ? 'rotate' : ''}`}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <ProfileDropdown isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
