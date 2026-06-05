import React from 'react';
import { useNavigate } from 'react-router-dom';
import FaceScanner from '../../components/shared/FaceScanner';
import './FaceAttendance.css';

const FaceAttendance = () => {
  const navigate = useNavigate();

  const handleScanComplete = (matchedEmployee) => {
    console.log('Biometric registration complete:', matchedEmployee);
    // You could redirect or show toast. The FaceScanner already handles its own success viewport.
  };

  return (
    <div className="face-attendance-page-root animate-fade-in">
      {/* Back button */}
      <div className="face-att-header">
        <button className="face-att-back-btn" onClick={() => navigate('/attendance')}>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to logs
        </button>
        <span className="face-att-sub-badge">WEB-CAM VERIFICATION HUB</span>
      </div>

      {/* Center biometric scan layout */}
      <div className="face-scanner-core-viewport">
        <FaceScanner onScanComplete={handleScanComplete} />
      </div>

      <div className="face-scanner-footer-meta glass-card">
        <strong>Biometric Operations Compliance Notice:</strong>
        <p>
          Facial templates are parsed locally in-browser using mock nodal neural weights.
          No video feeds or templates are dispatched to external cloud servers.
        </p>
      </div>
    </div>
  );
};

export default FaceAttendance;
