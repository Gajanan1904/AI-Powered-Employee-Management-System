import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import Loader from '../../components/common/Loader';
import { LineChart, BarChart } from '../../components/shared/Charts';
import './AdvancedAnalytics.css';

const AdvancedAnalytics = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const res = await apiService.getEmployees();
        setEmployees(res.data);
      } catch (err) {
        setErrorMsg('Failed to load deep metrics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (loading) return <Loader text="Assembling advanced data projections..." />;

  // 1. Leaderboard Ranking
  const leaderboard = [...employees].sort((a, b) => b.performanceScore - a.performanceScore);

  // 2. Low Performers (Critical intervention)
  const lowPerformers = employees.filter((e) => e.performanceScore < 86);

  // 3. Department Headcount distributions
  const deptDistribution = {};
  employees.forEach((e) => {
    deptDistribution[e.department] = (deptDistribution[e.department] || 0) + 1;
  });
  const deptLabels = Object.keys(deptDistribution);
  const deptCounts = deptLabels.map((l) => deptDistribution[l]);

  return (
    <div className="advanced-analytics-root animate-fade-in">
      {/* Upper overview summary */}
      <div className="analytics-metrics-overview-row">
        <div className="analytics-widget glass-card">
          <span className="widget-label">Leaderboard Standings</span>
          <h3 className="widget-value">#{leaderboard[0]?.id || 'N/A'}</h3>
          <span className="widget-desc">Top Rank: {leaderboard[0]?.name}</span>
        </div>
        <div className="analytics-widget glass-card">
          <span className="widget-label">Intervention Pool</span>
          <h3 className="widget-value text-red">{lowPerformers.length}</h3>
          <span className="widget-desc">Roster coaching candidates</span>
        </div>
        <div className="analytics-widget glass-card">
          <span className="widget-label">Total Departments</span>
          <h3 className="widget-value text-indigo">{deptLabels.length}</h3>
          <span className="widget-desc">Active organizational pods</span>
        </div>
      </div>

      {/* Roster splits */}
      <div className="analytics-split-grid">
        {/* Left Side: Leaderboard list */}
        <div className="analytics-leaderboard-panel glass-card">
          <h3 className="analytics-block-title">HR Performance Leaderboard</h3>
          
          <div className="table-responsive-container">
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
                {leaderboard.map((emp, idx) => (
                  <tr key={emp.id}>
                    <td>
                      <span className={`rank-tag rank-${idx + 1}`}>#{idx + 1}</span>
                    </td>
                    <td>
                      <div className="profile-cell-mini">
                        <img src={emp.avatar} alt={emp.name} className="avatar-mini" />
                        <div className="profile-cell-texts">
                          <strong>{emp.name}</strong>
                          <span>{emp.designation}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{emp.performanceScore}%</strong>
                    </td>
                    <td>
                      <span className="standings-badges-count">🏆 {emp.badges.length} Unlocked</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Low Performers Coaching Focus */}
        <div className="analytics-intervention-panel glass-card">
          <h3 className="analytics-block-title text-red-block">Critical Coaching Priorities</h3>
          <p className="intervention-meta-desc">Talent flagged by AI with ratings under 85% requiring intervention plans.</p>

          {lowPerformers.length === 0 ? (
            <div className="intervention-empty-state">
              <span>All employees optimal. No critical coaching candidates flagged.</span>
            </div>
          ) : (
            <div className="intervention-list">
              {lowPerformers.map((emp) => (
                <div key={emp.id} className="intervention-item-card glow-danger">
                  <div className="item-profile-row">
                    <img src={emp.avatar} alt={emp.name} className="intervention-avatar" />
                    <div className="item-profile-texts">
                      <h4>{emp.name}</h4>
                      <span>{emp.designation} - {emp.department}</span>
                    </div>
                  </div>
                  <div className="intervention-meta-details">
                    <div className="meta-box">
                      <span>Rating</span>
                      <strong className="critical-red">{emp.performanceScore}%</strong>
                    </div>
                    <div className="meta-box">
                      <span>AI Churn Risk</span>
                      <strong className="warning-orange">{emp.churnRisk}%</strong>
                    </div>
                  </div>
                  <div className="intervention-coaching-box">
                    <span>Direct Action Route</span>
                    <p>Schedule a 1-on-1 performance audit and log specific coaching slides.</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Department comparisons */}
      <div className="analytics-dept-charts-row glass-card">
        <h3 className="analytics-block-title">Department Headcount Distributions</h3>
        <BarChart data={deptCounts} labels={deptLabels} />
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
