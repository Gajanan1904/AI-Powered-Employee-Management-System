import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import './RewardsDashboard.css';

const RewardsDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Award Points Form
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [awardPoints, setAwardPoints] = useState(100);
  const [awardReason, setAwardReason] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Selected Badge details modal
  const [selectedBadge, setSelectedBadge] = useState(null);

  const loadRewardsData = async () => {
    try {
      const empRes = await apiService.getLeaderboard();
      const sortedEmps = [...empRes.data].sort(
        (a, b) => b.rewardPoints - a.rewardPoints
      );

      setEmployees(sortedEmps);

      setBadges([
        {
          name: "Gold",
          icon: "🥇",
          description: "Top level achievement"
        },
        {
          name: "Silver",
          icon: "🥈",
          description: "Excellent performer"
        },
        {
          name: "Bronze",
          icon: "🥉",
          description: "Consistent contributor"
        }
      ]);

      if (sortedEmps.length > 0 && !selectedEmpId) {
        setSelectedEmpId(sortedEmps[0].id);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to synchronize rewards leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewardsData();
  }, []);

  const handleAwardPointsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmpId || !awardPoints || !awardReason) {
      setErrorMsg('Please complete all form inputs.');
      return;
    }

    setFormLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const targetEmp = employees.find((emp) => String(emp.id) === String(selectedEmpId));

    try {
      await apiService.addRewardPoints(selectedEmpId, parseInt(awardPoints), awardReason);
      setSuccessMsg(`Awarded +${awardPoints} points to ${targetEmp?.name || 'employee'} successfully!`);
      setAwardReason('');
      setAwardPoints(100);
      loadRewardsData();
    } catch (err) {
      setErrorMsg('Failed to award points.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <Loader text="Synchronizing achievements hub..." />;

  // Podium standings (Top 3)
  const podium = employees.slice(0, 3);

  return (
    <div className="rewards-dashboard-root animate-fade-in">
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {errorMsg && <Alert type="danger" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* 1. Leaderboard Podium Highlight */}
      <div className="rewards-podium-section glass-card">
        <h3 className="rewards-block-title">Top Achievers Standings</h3>
        <div className="podium-container">
          {/* 2nd Place */}
          {podium[1] && (
            <div className="podium-spot spot-silver animate-fade-in">
              <div className="podium-avatar-wrapper">
                <Avatar src={podium[1].avatar} name={podium[1].name} className="podium-avatar-img" />
                <span className="medal-tag">2</span>
              </div>
              <h4 className="podium-name">{podium[1].name}</h4>
              <span className="podium-pts">{podium[1].rewardPoints} Pts</span>
              <div className="podium-pedestal pedestal-2">SILVER</div>
            </div>
          )}

          {/* 1st Place */}
          {podium[0] && (
            <div className="podium-spot spot-gold animate-fade-in">
              <div className="podium-avatar-wrapper">
                <Avatar src={podium[0].avatar} name={podium[0].name} className="podium-avatar-img gold-avatar-img" />
                <span className="medal-tag">1</span>
              </div>
              <h4 className="podium-name">{podium[0].name}</h4>
              <span className="podium-pts">{podium[0].rewardPoints} Pts</span>
              <div className="podium-pedestal pedestal-1">GOLD</div>
            </div>
          )}

          {/* 3rd Place */}
          {podium[2] && (
            <div className="podium-spot spot-bronze animate-fade-in">
              <div className="podium-avatar-wrapper">
                <Avatar src={podium[2].avatar} name={podium[2].name} className="podium-avatar-img" />
                <span className="medal-tag">3</span>
              </div>
              <h4 className="podium-name">{podium[2].name}</h4>
              <span className="podium-pts">{podium[2].rewardPoints} Pts</span>
              <div className="podium-pedestal pedestal-3">BRONZE</div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Badges Catalog Grid */}
      <div className="rewards-badges-catalog-section glass-card">
        <h3 className="rewards-block-title">Corporate Achievements Directory</h3>
        <p className="badges-intro-meta">Click on any achievement badge to analyze its evaluation criteria.</p>

        <div className="achieve-badges-grid">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className="badge-catalog-card glow-primary"
              onClick={() => setSelectedBadge(badge)}
            >
              <span className="badge-catalog-emoji">{badge.icon}</span>
              <strong className="badge-catalog-name">{badge.name}</strong>
              <span className="badge-details-link">Analyze Criteria →</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Split Standings and Points form */}
      <div className="rewards-split-grid">
        {/* Left Side: General Standings list */}
        <div className="rewards-standings-panel glass-card">
          <h3 className="rewards-block-title">Rewards Leaderboard Standings</h3>

          <div className="table-responsive-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Employee</th>
                  <th>Points Balance</th>
                  <th>Earned Badges</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => {
                  const empCode = emp.employee_code || emp.employee_id || (typeof emp.employee === 'string' && emp.employee.startsWith('EMP') ? emp.employee : `EMP00${emp.id}`);
                  return (
                    <tr key={emp.id}>
                      <td>
                        <span className={`rank-badge rank-${index + 1}`}>#{index + 1}</span>
                      </td>
                      <td>
                        <div className="profile-cell-mini">
                          <Avatar src={emp.avatar} name={emp.name} className="avatar-mini" />
                          <div className="profile-cell-texts">
                            <strong className="profile-name-bold">{emp.name}</strong>
                            <span className="profile-meta-sub">{empCode}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong className="standings-pts-text">🏆 {emp.rewardPoints}</strong>
                      </td>
                      <td>
                        <span className="badge-tag-inline">
                          {emp.badge === 'Gold'
                            ? '🥇'
                            : emp.badge === 'Silver'
                            ? '🥈'
                            : '🥉'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Award Points form */}
        <div className="rewards-award-panel glass-card glow-primary">
          <h3 className="rewards-block-title">Award Achievements Points</h3>

          <form onSubmit={handleAwardPointsSubmit} className="award-points-form">
            <div className="form-group">
              <label className="form-label">Target Employee</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="form-input"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employee_code || emp.employee_id || `EMP00${emp.id}`}) - {emp.rewardPoints} Pts
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Points Quantity"
              type="number"
              min="10"
              max="5000"
              name="points"
              value={awardPoints}
              onChange={(e) => setAwardPoints(e.target.value)}
              required
            />

            <Input
              label="Authorization Reason"
              name="reason"
              value={awardReason}
              onChange={(e) => setAwardReason(e.target.value)}
              placeholder="e.g. Excellent delivery on Q2 deliverables"
              required
            />

            <Button type="submit" variant="primary" fullWidth loading={formLoading}>
              Authorize Reward points
            </Button>
          </form>
        </div>
      </div>

      {/* Badge details modal */}
      {selectedBadge && (
        <Modal
          isOpen={!!selectedBadge}
          onClose={() => setSelectedBadge(null)}
          title={`Achievement: ${selectedBadge.name}`}
          footer={
            <Button onClick={() => setSelectedBadge(null)} variant="outline">
              Close criteria
            </Button>
          }
        >
          <div className="badge-criteria-modal-body">
            <span className="criteria-emoji">{selectedBadge.icon}</span>
            <p className="criteria-desc">{selectedBadge.description}</p>
            <div className="criteria-metric-block">
              <strong>Evaluation Path:</strong>
              <ul>
                <li>Requires a minimum KPI evaluation rating of 90%.</li>
                <li>Requires supervisor nodal approval via points compilation.</li>
                <li>Automatically synced to bioprofile indexing.</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RewardsDashboard;
