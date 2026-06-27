import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import Avatar from '../../components/common/Avatar';
import { DonutChart } from '../../components/shared/Charts';
import './PerformanceReview.css';

const PerformanceReview = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [scores, setScores] = useState({
    teamwork: 80,
    communication: 80,
    innovation: 80,
    task_completion: 80
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const loadData = async () => {
    try {
      const res = await apiService.getPerformance();
      setEmployees(res.data);
      if (res.data.length > 0 && !selectedEmpId) {
        setSelectedEmpId(res.data[0].id);
        setScores({
          teamwork: res.data[0].teamwork || 0,
          communication: res.data[0].communication || 0,
          innovation: res.data[0].innovation || 0,
          task_completion: res.data[0].task_completion || 0
        });
      }
    } catch (err) {
      setErrorMsg('Failed to synchronize performance rosters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update form inputs when selected employee changes
  const handleEmployeeSelect = (e) => {
    const id = e.target.value;
    setSelectedEmpId(id);
    const emp = employees.find((x) => String(x.id) === String(id));
    if (emp) {
      console.log(JSON.stringify(emp, null, 2));
      setScores({
        teamwork: emp.teamwork,
        communication: emp.communication,
        innovation: emp.innovation,
        task_completion: emp.task_completion
      });
    }
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setScores((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  // Compute live average
  const liveAverage = Math.round(
    (Number(scores.teamwork || 0) + Number(scores.communication || 0) + Number(scores.innovation || 0) + Number(scores.task_completion || 0)) / 4
  );

  const handleEvaluationSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const targetEmp = employees.find((x) => String(x.id) === String(selectedEmpId));

    if (!targetEmp) {
      setErrorMsg('No employee selected.');
      setSubmitLoading(false);
      return;
    }

    try {
      await apiService.updateEmployee(selectedEmpId, scores);
      
      if (liveAverage >= 90) {
        await apiService.addRewardPoints(selectedEmpId, 250, 'Outstanding KPI review (>=90 rating)');
        setSuccessMsg(`Evaluation compiled for ${targetEmp.employee_name || targetEmp.name}! Rating is ${liveAverage}%. Added 250 Reward Points!`);
      } else {
        await apiService.addRewardPoints(selectedEmpId, 50, 'KPI review compiled');
        setSuccessMsg(`Evaluation compiled for ${targetEmp.employee_name || targetEmp.name}! Overall rating: ${liveAverage}%.`);
      }

      loadData();
    } catch (err) {
      setErrorMsg('Submission failed. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <Loader text="Retrieving performance matrices..." />;

  return (
    <div className="performance-review-root animate-fade-in">
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {errorMsg && <Alert type="danger" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* Split pane for evaluation sliders and roster list */}
      <div className="performance-split-grid">
        {/* Left Side Panel: Sliding Evaluation Form */}
        <div className="performance-evaluation-form-panel glass-card glow-primary">
          <h3 className="performance-block-title">Deploy KPI Evaluation</h3>

          <form onSubmit={handleEvaluationSubmit} className="evaluation-kpi-form">
            <div className="form-group select-emp-group">
              <label className="form-label">Target Employee</label>
              <select value={selectedEmpId} onChange={handleEmployeeSelect} className="form-input">
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employee_name || emp.name} ({emp.employee_code || emp.employee_id || (typeof emp.employee === 'string' && emp.employee.startsWith('EMP') ? emp.employee : `EMP00${emp.id}`)})
                  </option>
                ))}
              </select>
            </div>

            {/* Circular score dial live */}
            <div className="live-performance-donut-container">
              <DonutChart
                percentage={liveAverage}
                label="Live Rating"
                color={liveAverage >= 90 ? 'var(--color-success)' : 'var(--color-primary)'}
                size={130}
              />
            </div>

            {/* Visual Sliders list */}
            <div className="evaluation-sliders-list">
              {/* Slider 1: Teamwork */}
              <div className="slider-item-row">
                <div className="slider-meta">
                  <span className="slider-name">Team Collaboration</span>
                  <span className="slider-current-val">{scores.teamwork}%</span>
                </div>
                <input
                  type="range"
                  name="teamwork"
                  min="0"
                  max="100"
                  className="kpi-slider-input range-indigo"
                  value={scores.teamwork}
                  onChange={handleSliderChange}
                />
              </div>

              {/* Slider 2: Communication */}
              <div className="slider-item-row">
                <div className="slider-meta">
                  <span className="slider-name">Communication Competence</span>
                  <span className="slider-current-val">{scores.communication}%</span>
                </div>
                <input
                  type="range"
                  name="communication"
                  min="0"
                  max="100"
                  className="kpi-slider-input range-cyan"
                  value={scores.communication}
                  onChange={handleSliderChange}
                />
              </div>

              {/* Slider 3: Innovation */}
              <div className="slider-item-row">
                <div className="slider-meta">
                  <span className="slider-name">Nodal Innovation</span>
                  <span className="slider-current-val">{scores.innovation}%</span>
                </div>
                <input
                  type="range"
                  name="innovation"
                  min="0"
                  max="100"
                  className="kpi-slider-input range-purple"
                  value={scores.innovation}
                  onChange={handleSliderChange}
                />
              </div>

              {/* Slider 4: Task Completion */}
              <div className="slider-item-row">
                <div className="slider-meta">
                  <span className="slider-name">Task Execution Precision</span>
                  <span className="slider-current-val">{scores.task_completion}%</span>
                </div>
                <input
                  type="range"
                  name="task_completion"
                  min="0"
                  max="100"
                  className="kpi-slider-input range-rose"
                  value={scores.task_completion}
                  onChange={handleSliderChange}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={submitLoading}>
              Compile & Log KPI Ratings
            </Button>
          </form>
        </div>

        {/* Right Side Panel: Roster Performance list */}
        <div className="performance-roster-list-panel glass-card">
          <h3 className="performance-block-title">Performance Evaluation Ratings</h3>

          <div className="table-responsive-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Nodal rating</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const empName = emp.employee_name || emp.name;
                  const empCode = emp.employee_code || emp.employee_id || (typeof emp.employee === 'string' && emp.employee.startsWith('EMP') ? emp.employee : `EMP00${emp.id}`);
                  return (
                    <tr key={emp.id} className={String(selectedEmpId) === String(emp.id) ? 'highlighted-row' : ''}>
                      <td>
                        <div className="profile-cell-mini">
                          <Avatar src={emp.avatar} name={empName} className="avatar-mini" />
                          <div className="profile-cell-texts">
                            <strong
                              className="clickable-name"
                              onClick={() => setSelectedEmpId(emp.id)}
                            >
                              {empName}
                            </strong>
                            <span className="profile-meta-sub">{empCode}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td>{emp.department}</td>
                      <td>{emp.designation}</td>
                      <td>
                        <span className={`badge badge-${emp.final_score >= 90 ? 'success' : emp.final_score >= 80 ? 'warning' : 'danger'}`}>
                          {emp.final_score}% rating
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReview;
