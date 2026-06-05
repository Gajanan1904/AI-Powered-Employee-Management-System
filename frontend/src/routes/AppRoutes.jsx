import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages imports
import Login from '../pages/Auth/Login';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import Dashboard from '../pages/Dashboard/Dashboard';
import EmployeeList from '../pages/Employees/EmployeeList';
import EmployeeProfile from '../pages/Employees/EmployeeProfile';
import AttendanceTracker from '../pages/Attendance/AttendanceTracker';
import FaceAttendance from '../pages/Attendance/FaceAttendance';
import PerformanceReview from '../pages/Performance/PerformanceReview';
import RewardsDashboard from '../pages/Rewards/RewardsDashboard';
import AIPredictor from '../pages/AIPrediction/AIPredictor';
import AdvancedAnalytics from '../pages/Analytics/AdvancedAnalytics';
import UserProfile from '../pages/Profile/UserProfile';
import Settings from '../pages/Profile/Settings';

// Layout import
import DashboardLayout from '../layouts/DashboardLayout';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)'
      }}>
        <div className="loader-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Dashboard Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/:id" element={<EmployeeProfile />} />
        <Route path="attendance" element={<AttendanceTracker />} />
        <Route path="attendance/face" element={<FaceAttendance />} />
        <Route path="performance" element={<PerformanceReview />} />
        <Route path="rewards" element={<RewardsDashboard />} />
        <Route path="ai-prediction" element={<AIPredictor />} />
        <Route path="analytics" element={<AdvancedAnalytics />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
