import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import './NotificationPanel.css';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      apiService.getRecentActivities().then((res) => {
        setActivities(res.data.slice(0, 5));
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const iconMap = {
    attendance: (
      <span className="notif-icon-circle icon-green">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
          <polyline points="20 6 9 17 5 13"></polyline>
        </svg>
      </span>
    ),
    reward: (
      <span className="notif-icon-circle icon-yellow">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
          <path d="M12 2a6 6 0 0 1 6 6v6H6V8a6 6 0 0 1 6-6z"></path>
        </svg>
      </span>
    ),
    performance: (
      <span className="notif-icon-circle icon-purple">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </span>
    ),
    ai: (
      <span className="notif-icon-circle icon-cyan">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polygon points="2 17 12 22 22 17 2 17"></polygon>
          <polygon points="2 12 12 17 22 12 2 12"></polygon>
        </svg>
      </span>
    ),
    system: (
      <span className="notif-icon-circle icon-blue">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </span>
    )
  };

  return (
    <div className="notif-panel-dropdown glass-card animate-scale">
      <div className="notif-panel-header">
        <h4>Notifications</h4>
        <button className="notif-clear-btn" onClick={() => setActivities([])}>
          Clear All
        </button>
      </div>

      <div className="notif-panel-list">
        {loading ? (
          <div className="notif-empty-state">
            <div className="btn-spinner" style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: 'var(--color-primary)' }}></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="notif-empty-state">
            <span>No new notifications</span>
          </div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="notif-item-row">
              {iconMap[act.type] || iconMap.system}
              <div className="notif-item-body">
                <p className="notif-item-text">{act.text}</p>
                <span className="notif-item-time">{act.time}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notif-panel-footer">
        <button onClick={onClose}>Close panel</button>
      </div>
    </div>
  );
};

export default NotificationPanel;
