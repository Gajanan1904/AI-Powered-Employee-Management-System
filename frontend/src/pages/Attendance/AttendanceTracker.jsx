import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import './AttendanceTracker.css';

const AttendanceTracker = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadAttendance = async () => {
    try {
      const res = await apiService.getEmployees();
      setEmployees(res.data);
    } catch (err) {
      setErrorMsg('Failed to synchronize attendance logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleStatusToggle = async (empId, newStatus) => {
    try {
      await apiService.toggleAttendance(empId, newStatus);
      setSuccessMsg(`Attendance status updated for employee.`);
      loadAttendance();
    } catch (err) {
      setErrorMsg('Failed to toggle status.');
    }
  };

  if (loading) return <Loader text="Retrieving daily attendance log..." />;

  // Metrics
  const total = employees.length;
  const present = employees.filter((e) => e.status === 'Present').length;
  const absent = employees.filter((e) => e.status === 'Absent').length;
  const late = employees.filter((e) => e.status === 'Late').length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  // Render static mock calendar dates
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="attendance-tracker-root animate-fade-in">
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {errorMsg && <Alert type="danger" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* Header and Face Scanner Trigger */}
      <div className="attendance-header-actions-row glass-card">
        <div className="tracker-heading-texts">
          <h2>Daily Operations Log</h2>
          <p>Authorize check-ins manually or deploy simulated face recognition viewports.</p>
        </div>
        <Button onClick={() => navigate('/attendance/face')} variant="secondary" icon="📸">
          Mark Face Attendance
        </Button>
      </div>

      {/* Stats Widgets */}
      <div className="attendance-stats-cards">
        <div className="stat-widget glass-card">
          <span className="widget-label">Daily Ratio</span>
          <h3 className="widget-value">{rate}%</h3>
          <span className="widget-desc">Overall corporate rate</span>
        </div>
        <div className="stat-widget glass-card">
          <span className="widget-label">Present Headcount</span>
          <h3 className="widget-value text-green">{present}</h3>
          <span className="widget-desc">Logged present today</span>
        </div>
        <div className="stat-widget glass-card">
          <span className="widget-label">Absent (Leave)</span>
          <h3 className="widget-value text-red">{absent}</h3>
          <span className="widget-desc">No scanned check-ins</span>
        </div>
        <div className="stat-widget glass-card">
          <span className="widget-label">Late Logs</span>
          <h3 className="widget-value text-orange">{late}</h3>
          <span className="widget-desc">Scans past 09:00 AM</span>
        </div>
      </div>

      {/* Split Directory Layout */}
      <div className="attendance-split-layout">
        {/* Left Side: Daily Table list */}
        <div className="attendance-left-table glass-card">
          <h4 className="tracker-block-title">Daily Logs Directory</h4>

          <div className="table-responsive-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee Profile</th>
                  <th>Attendance Rate</th>
                  <th>Nodal Status</th>
                  <th>Manual Toggle</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="profile-cell-mini">
                        <img src={emp.avatar} alt={emp.name} className="avatar-mini" />
                        <div className="profile-cell-texts">
                          <strong>{emp.name}</strong>
                          <span>{emp.id} - {emp.department}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{emp.attendanceRate}%</strong>
                    </td>
                    <td>
                      <span className={`badge badge-${emp.status === 'Present' ? 'success' : emp.status === 'Absent' ? 'danger' : 'warning'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <div className="manual-toggle-btn-grp">
                        <button
                          className={`manual-tog-btn active-green ${emp.status === 'Present' ? 'active' : ''}`}
                          onClick={() => handleStatusToggle(emp.id, 'Present')}
                          title="Mark Present"
                        >
                          P
                        </button>
                        <button
                          className={`manual-tog-btn active-orange ${emp.status === 'Late' ? 'active' : ''}`}
                          onClick={() => handleStatusToggle(emp.id, 'Late')}
                          title="Mark Late"
                        >
                          L
                        </button>
                        <button
                          className={`manual-tog-btn active-red ${emp.status === 'Absent' ? 'active' : ''}`}
                          onClick={() => handleStatusToggle(emp.id, 'Absent')}
                          title="Mark Absent"
                        >
                          A
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Monthly Calendar streak mock-up */}
        <div className="attendance-right-calendar glass-card">
          <h4 className="tracker-block-title">Team Attendance Streak Calendar</h4>
          <p className="calendar-meta-desc">Continuous team consistency rating over this month.</p>

          <div className="calendar-grid">
            {daysInMonth.map((day) => {
              // Simulate random visual streaks (mostly present, some late/absent)
              let dayState = 'present';
              if (day === 7 || day === 14 || day === 21 || day === 28) dayState = 'weekend';
              else if (day === 4 || day === 18) dayState = 'late';
              else if (day === 11) dayState = 'absent';

              return (
                <div key={day} className={`calendar-day-box day-${dayState}`}>
                  <span className="day-number">{day}</span>
                  <span className="day-dot"></span>
                </div>
              );
            })}
          </div>

          <div className="calendar-legend">
            <div className="legend-item"><span className="bullet present"></span><span>Present</span></div>
            <div className="legend-item"><span className="bullet late"></span><span>Late</span></div>
            <div className="legend-item"><span className="bullet absent"></span><span>Absent</span></div>
            <div className="legend-item"><span className="bullet weekend"></span><span>Weekend</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
