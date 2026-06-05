import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { DonutChart } from '../../components/shared/Charts';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const res = await apiService.getEmployeeById(id);
        setEmployee(res.data);
      } catch (err) {
        setErrorMsg('Employee records not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, [id]);

  if (loading) return <Loader text="Retrieving biometric file..." />;

  if (errorMsg || !employee) {
    return (
      <div className="profile-error-container">
        <Alert type="danger" message={errorMsg || 'Employee profile not found'} />
        <Button onClick={() => navigate('/employees')} variant="primary">
          Back to Directory
        </Button>
      </div>
    );
  }

  // Define KPI List for easier iteration
  const kpis = [
    { label: 'Team Collaboration', value: employee.teamwork, color: 'var(--color-primary)' },
    { label: 'Communication Competence', value: employee.communication, color: 'var(--color-secondary)' },
    { label: 'Nodal Innovation', value: employee.innovation, color: '#a855f7' },
    { label: 'Task Execution Precision', value: employee.taskCompletion, color: '#e11d48' }
  ];

  return (
    <div className="employee-profile-root animate-fade-in">
      {/* Upper Navigation and Name Row */}
      <div className="profile-header-row">
        <button className="profile-back-link" onClick={() => navigate('/employees')}>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Directory
        </button>
        <span className="profile-sync-badge">SYNCHRONIZED BIOPROFILE</span>
      </div>

      {/* Main split dashboard layout */}
      <div className="profile-layout-grid">
        {/* Left Side: Employee General Info & Score Dial */}
        <div className="profile-left-panel">
          <div className="profile-card-general glass-card">
            <div className="profile-avatar-row">
              <img src={employee.avatar} alt={employee.name} className="profile-master-avatar" />
              <div className="profile-general-texts">
                <span className="profile-id-tag">{employee.id}</span>
                <h2>{employee.name}</h2>
                <p className="profile-meta-role">{employee.designation}</p>
                <div className="profile-dept-badge">{employee.department}</div>
              </div>
            </div>

            <div className="profile-stats-table">
              <div className="profile-stat-row">
                <span>Corporate Email</span>
                <strong>{employee.email}</strong>
              </div>
              <div className="profile-stat-row">
                <span>Registered Status</span>
                <strong className={`status-badge-inline ${employee.status === 'Present' ? 'green' : 'red'}`}>
                  {employee.status}
                </strong>
              </div>
              <div className="profile-stat-row">
                <span>Core Service Date</span>
                <strong>{employee.joinDate}</strong>
              </div>
              <div className="profile-stat-row">
                <span>Attendance Rate</span>
                <strong>{employee.attendanceRate}%</strong>
              </div>
              <div className="profile-stat-row">
                <span>Rewards Balance</span>
                <strong>🏆 {employee.rewardPoints} Pts</strong>
              </div>
            </div>
          </div>

          {/* AI Metrics card */}
          <div className="profile-ai-predictions-card glass-card">
            <div className="prediction-card-header">
              <span className="ai-icon">🧠</span>
              <h4>AI Platform Predictions</h4>
            </div>

            <div className="prediction-metrics-grid">
              <div className="metric-box">
                <span className="metric-lbl">Attrition Risk</span>
                <strong className={employee.churnRisk > 20 ? 'critical-red' : employee.churnRisk > 10 ? 'warning-orange' : 'safe-green'}>
                  {employee.churnRisk}%
                </strong>
                <div className="bar-risk-container">
                  <div
                    className={`bar-risk-fill ${employee.churnRisk > 20 ? 'bg-danger' : employee.churnRisk > 10 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${employee.churnRisk}%` }}
                  ></div>
                </div>
              </div>

              <div className="metric-box">
                <span className="metric-lbl">Promotion Probability</span>
                <strong className="prom-prob-text">{employee.promotionProbability}%</strong>
                <div className="bar-risk-container">
                  <div
                    className="bar-risk-fill bg-indigo"
                    style={{ width: `${employee.promotionProbability}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="predicted-trajectory-box">
              <span>Predicted Career Track</span>
              <p>
                {employee.promotionProbability > 85
                  ? 'Highly Accelerated growth path with fast-tracked management eligibility.'
                  : employee.churnRisk > 20
                  ? 'High risk retention priority. Focused intervention and engagement required.'
                  : 'Consistent optimal contributor on standard promotion timeline.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: KPI Performance and Badges */}
        <div className="profile-right-panel">
          {/* Performance Overview (Circular Dial & Progress) */}
          <div className="profile-performance-card glass-card">
            <h4 className="right-panel-title">KPI Evaluation Analysis</h4>

            <div className="performance-kpi-split">
              {/* Circular Overall Dial */}
              <div className="circular-score-dial-box">
                <DonutChart
                  percentage={employee.performanceScore}
                  label="Overall Rating"
                  color={employee.performanceScore > 90 ? 'var(--color-success)' : 'var(--color-primary)'}
                  size={140}
                />
              </div>

              {/* KPI Progress Bars */}
              <div className="progress-kpis-list">
                {kpis.map((kpi, idx) => (
                  <div key={idx} className="kpi-progress-item">
                    <div className="kpi-info-row">
                      <span className="kpi-lbl">{kpi.label}</span>
                      <span className="kpi-val" style={{ color: kpi.color }}>{kpi.value}%</span>
                    </div>
                    <div className="kpi-bar-bg">
                      <div
                        className="kpi-bar-fill"
                        style={{
                          width: `${kpi.value}%`,
                          backgroundColor: kpi.color,
                          boxShadow: `0 0 8px ${kpi.color}40`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Badges Earned Section */}
          <div className="profile-badges-card glass-card">
            <h4 className="right-panel-title">Unlocked Achievement Badges</h4>
            {employee.badges.length === 0 ? (
              <div className="badges-empty-state">
                <span>No achievement badges unlocked in this cycle.</span>
              </div>
            ) : (
              <div className="badges-unlocked-grid">
                {employee.badges.map((badgeName) => {
                  // Resolve icons
                  const icon = badgeName === 'Innovator' ? '💡' 
                            : badgeName === 'Team Pillar' ? '🤝' 
                            : badgeName === 'Speedster' ? '⚡' 
                            : badgeName === 'Client Magnet' ? '🎯'
                            : badgeName === 'Precision Master' ? '📊'
                            : badgeName === 'Culture Champion' ? '🌟'
                            : badgeName === 'Rising Star' ? '🚀'
                            : '✨';
                  return (
                    <div key={badgeName} className="earned-badge-card glow-primary">
                      <span className="earned-badge-emoji">{icon}</span>
                      <strong className="earned-badge-name">{badgeName}</strong>
                      <span className="earned-badge-meta">Verified Active</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
