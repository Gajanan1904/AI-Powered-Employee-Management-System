import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import Loader from '../../components/common/Loader';
import Avatar from '../../components/common/Avatar';
import { LineChart, BarChart } from '../../components/shared/Charts';
import './AdvancedAnalytics.css';

const AdvancedAnalytics = () => {
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [lowPerformers, setLowPerformers] = useState([]); 
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Slicing toggle states
  const [showAllLeaderboard, setShowAllLeaderboard] = useState(false);
  const [showAllLowPerformers, setShowAllLowPerformers] = useState(false);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [leaderRes, lowRes, deptRes, empRes] = await Promise.all([
          apiService.getLeaderboardAnalytics().catch(() => ({ data: [] })),
          apiService.getLowPerformers().catch(() => ({ data: [] })),
          apiService.getDepartmentSummary().catch(() => ({ data: [] })),
          apiService.getEmployees().catch(() => ({ data: [] }))
        ]);

        let fullLeaderboard = leaderRes.data || [];
        if (empRes.data && empRes.data.length > fullLeaderboard.length) {
          const mappedEmps = empRes.data.map((e) => ({
            id: e.id,
            name: e.name,
            department: e.department,
            final_score: e.performanceScore || e.final_score || 90,
            badge: e.badges?.[0] || 'Top Performer'
          })).sort((a, b) => b.final_score - a.final_score);
          
          fullLeaderboard = mappedEmps;
        }

        setLeaderboard(fullLeaderboard);
        setLowPerformers(lowRes.data || []);
        setDepartments(deptRes.data || []);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <Loader text="Assembling advanced data projections..." />;

  const deptLabels = departments.map((d) => d.department);
  const deptCounts = departments.map((d) => d.avg_score);

  const visibleLeaderboard = showAllLeaderboard ? leaderboard : leaderboard.slice(0, 5);
  const visibleLowPerformers = showAllLowPerformers ? lowPerformers : lowPerformers.slice(0, 3);

  return (
    <div className="advanced-analytics-root animate-fade-in">
      {/* Upper overview summary cards */}
      <div className="analytics-metrics-overview-row">
        <div className="analytics-widget glass-card glow-gold-card">
          <div className="widget-header-icon-row">
            <span className="widget-icon-emoji">🏆</span>
            <span className="widget-label">Leaderboard Standings</span>
          </div>
          <h3 className="widget-value text-gold">{leaderboard.length ? '#1' : 'N/A'}</h3>
          <span className="widget-desc">⭐ Top Rank: <strong>{leaderboard[0]?.name || 'Tanvi Khanna'}</strong></span>
        </div>

        <div className="analytics-widget glass-card glow-red-card">
          <div className="widget-header-icon-row">
            <span className="widget-icon-emoji">⚠️</span>
            <span className="widget-label">Intervention Pool</span>
          </div>
          <h3 className="widget-value text-red">{lowPerformers.length}</h3>
          <span className="widget-desc">🎯 Roster coaching candidates</span>
        </div>

        <div className="analytics-widget glass-card glow-cyan-card">
          <div className="widget-header-icon-row">
            <span className="widget-icon-emoji">🏢</span>
            <span className="widget-label">Total Departments</span>
          </div>
          <h3 className="widget-value text-indigo">{deptLabels.length}</h3>
          <span className="widget-desc">⚡ Active organizational pods</span>
        </div>
      </div>

      {/* Roster splits */}
      <div className="analytics-split-grid">
        {/* Left Side: Leaderboard list (Top 5) */}
        <div className="analytics-leaderboard-panel glass-card">
          <h3 className="analytics-block-title">HR Performance Leaderboard</h3>
          
          <div 
            className="table-responsive-container" 
            style={{ maxHeight: showAllLeaderboard ? '480px' : 'fit-content' }}
          >
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Employee Profile</th>
                  <th>KPI Rating</th>
                  <th>Nodal Badges</th>
                </tr>
              </thead>
              <tbody>
                {visibleLeaderboard.map((emp, idx) => (
                  <tr key={`${emp.id}-${idx}`}>
                    <td>
                      <span className={`rank-tag rank-${idx + 1}`}>#{idx + 1}</span>
                    </td>
                    <td>
                      <div className="profile-cell-mini">
                        <Avatar src={emp.avatar} name={emp.name} className="avatar-mini" />
                        <div className="profile-cell-texts">
                          <strong 
                            className="profile-name-bold clickable-name"
                            onClick={() => navigate(`/employees/${emp.id}`)}
                          >
                            {emp.name}
                          </strong>
                          <span className="profile-meta-sub">{emp.department}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{Number(emp.final_score).toFixed(2)}%</strong>
                    </td>
                    <td>
                      <span className="standings-badges-count">⭐ Top Performer</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="analytics-card-footer">
            <button
              className="analytics-action-link-btn"
              onClick={() => setShowAllLeaderboard(!showAllLeaderboard)}
            >
              {showAllLeaderboard ? '← Show Top 5 Only' : `View Full Leaderboard (${leaderboard.length}) →`}
            </button>
          </div>
        </div>

        {/* Right Side: Low Performers Coaching Focus (Top 3) */}
        <div className="analytics-intervention-panel glass-card">
          <h3 className="analytics-block-title text-red-block">Critical Coaching Priorities</h3>
          <p className="intervention-meta-desc">Talent flagged by AI with ratings under 85% requiring intervention plans.</p>

          {lowPerformers.length === 0 ? (
            <div className="intervention-empty-state">
              <span>All employees optimal. No critical coaching candidates flagged.</span>
            </div>
          ) : (
            <>
              <div 
                className="intervention-list"
                style={{ maxHeight: showAllLowPerformers ? '480px' : 'fit-content' }}
              >
                {visibleLowPerformers.map((emp) => (
                  <div key={emp.id} className="intervention-item-card glow-danger">
                    <div className="item-profile-row">
                      <Avatar src={emp.avatar} name={emp.name} className="intervention-avatar" />
                      <div className="item-profile-texts">
                        <h4 
                          className="clickable-name"
                          onClick={() => navigate(`/employees/${emp.id}`)}
                        >
                          {emp.name}
                        </h4>
                        <span>{emp.designation} - {emp.department}</span>
                      </div>
                    </div>
                    <div className="intervention-meta-details">
                      <div className="meta-box">
                        <span>Rating</span>
                        <strong className="critical-red">{emp.final_score}%</strong>
                      </div>
                      <div className="meta-box">
                        <span>AI Churn Risk</span>
                        <strong className="warning-orange">High</strong>
                      </div>
                    </div>
                    <div className="intervention-coaching-box">
                      <span>Direct Action Route</span>
                      <p>Schedule a 1-on-1 performance audit and log specific coaching slides.</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="analytics-card-footer">
                <button
                  className="analytics-action-link-btn text-red-link"
                  onClick={() => setShowAllLowPerformers(!showAllLowPerformers)}
                >
                  {showAllLowPerformers ? '← Show Top 3 Only' : `View All High-Risk Employees (${lowPerformers.length}) →`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Department comparisons */}
      <div className="analytics-dept-charts-row glass-card">
        <h3 className="analytics-block-title">Department Performance Index (%)</h3>
        <div className="chart-view-viewport">
          <BarChart data={deptCounts} labels={deptLabels} height={180} />
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
