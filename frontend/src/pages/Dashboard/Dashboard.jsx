import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { LineChart, BarChart } from '../../components/shared/Charts';
import Loader from '../../components/common/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const empRes = await apiService.getEmployees();
        const actRes = await apiService.getRecentActivities();
        setEmployees(empRes.data);
        setActivities(actRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader text="Assembling analytical dashboard feeds..." />;
  }

  // Calculate Metrics
  const totalEmployees = employees.length;
  const presentCount = employees.filter((e) => e.status === 'Present').length;
  const absentCount = employees.filter((e) => e.status === 'Absent').length;
  
  const avgPerformance = totalEmployees > 0
    ? Math.round(employees.reduce((acc, e) => acc + e.performanceScore, 0) / totalEmployees)
    : 0;

  const topPerformersCount = employees.filter((e) => e.performanceScore >= 90).length;
  const highRiskCount = employees.filter((e) => e.churnRisk >= 20).length;

  // Chart Data
  const weeklyAttendanceData = [92, 95, 96, 94, 98, 97];
  const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const departmentAverages = {};
  employees.forEach((e) => {
    if (!departmentAverages[e.department]) {
      departmentAverages[e.department] = { sum: 0, count: 0 };
    }
    departmentAverages[e.department].sum += e.performanceScore;
    departmentAverages[e.department].count += 1;
  });

  const deptLabels = Object.keys(departmentAverages);
  const deptData = deptLabels.map((dept) =>
    Math.round(departmentAverages[dept].sum / departmentAverages[dept].count)
  );

  return (
    <div className="dashboard-root-view">
      {/* 1. Header welcome banner */}
      <div className="dashboard-welcome-banner glass-card animate-fade-in">
        <div className="banner-texts">
          <h2>Welcome back, Chief HR Officer!</h2>
          <p>The enterprise core predictive analysis is synchronized. <strong>{highRiskCount} critical retention warnings</strong> require attention.</p>
        </div>
        <div className="banner-visual-pulse glow-primary">
          <div className="pulse-dot"></div>
          <span>AI SYNC ACTIVE</span>
        </div>
      </div>

      {/* 2. Summary stats cards */}
      <div className="dashboard-summary-cards animate-fade-in">
        {/* Total Employees */}
        <div className="summary-card glass-card">
          <div className="card-top-row">
            <span className="card-lbl">Total Headcount</span>
            <span className="card-icon-box bg-indigo">👥</span>
          </div>
          <h3 className="card-stat-number">{totalEmployees}</h3>
          <span className="card-micro-status green-text">
            <span>↑ 12%</span> since last quarter
          </span>
        </div>

        {/* Present Today */}
        <div className="summary-card glass-card">
          <div className="card-top-row">
            <span className="card-lbl">Present Today</span>
            <span className="card-icon-box bg-emerald">🟢</span>
          </div>
          <h3 className="card-stat-number">{presentCount}</h3>
          <span className="card-micro-status">
            Ratio: <strong>{Math.round((presentCount / totalEmployees) * 100)}%</strong> active
          </span>
        </div>

        {/* Absent Today */}
        <div className="summary-card glass-card">
          <div className="card-top-row">
            <span className="card-lbl">Absent (Leave)</span>
            <span className="card-icon-box bg-rose">🔴</span>
          </div>
          <h3 className="card-stat-number">{absentCount}</h3>
          <span className="card-micro-status red-text">
            <strong>{absentCount} pending</strong> face scan approvals
          </span>
        </div>

        {/* Average Performance */}
        <div className="summary-card glass-card">
          <div className="card-top-row">
            <span className="card-lbl">Avg Performance</span>
            <span className="card-icon-box bg-yellow">📈</span>
          </div>
          <h3 className="card-stat-number">{avgPerformance}%</h3>
          <span className="card-micro-status text-bold">
            Target rating: <strong>Optimal</strong>
          </span>
        </div>

        {/* AI Attrition Risk Alert */}
        <div className="summary-card glass-card card-glow-warning">
          <div className="card-top-row">
            <span className="card-lbl">AI Retention Risk</span>
            <span className="card-icon-box bg-cyan">🧠</span>
          </div>
          <h3 className="card-stat-number">{highRiskCount}</h3>
          <span className="card-micro-status orange-text">
            🚨 Critical churn risk warning flags
          </span>
        </div>
      </div>

      {/* 3. Main content grid: charts and feeds */}
      <div className="dashboard-layout-grid animate-fade-in">
        {/* Charts section (8 cols width equivalent in responsive layout) */}
        <div className="grid-left-side">
          {/* Chart 1: Weekly Attendance */}
          <div className="chart-wrapper-card glass-card">
            <h4 className="chart-card-title">Weekly Core Attendance Streak (%)</h4>
            <LineChart data={weeklyAttendanceData} labels={weeklyLabels} />
          </div>

          {/* Chart 2: Department Performance */}
          <div className="chart-wrapper-card glass-card">
            <h4 className="chart-card-title">Average Performance Score by Department (%)</h4>
            <BarChart data={deptData} labels={deptLabels} />
          </div>
        </div>

        {/* Recent Activities side section (4 cols) */}
        <div className="grid-right-side">
          <div className="activities-ticker-card glass-card">
            <div className="ticker-header-row">
              <h4>Recent Activities</h4>
              <span className="ticker-badge">LIVE FEED</span>
            </div>
            
            <div className="ticker-list">
              {activities.map((act) => (
                <div key={act.id} className="ticker-item">
                  <div className={`ticker-icon-bullet bullet-${act.type}`}></div>
                  <div className="ticker-body">
                    <p className="ticker-text">{act.text}</p>
                    <span className="ticker-time">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
