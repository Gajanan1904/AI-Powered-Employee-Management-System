import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import { DonutChart } from '../../components/shared/Charts';
import './AIPredictor.css';

const AIPredictor = () => {
  const [history, setHistory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form inputs
  const [selectedEmpId, setSelectedEmpId] = useState('Manual');
  const [formData, setFormData] = useState({
    employeeName: '',
    department: 'Engineering',
    designation: 'Specialist',
    attendance: 95,
    teamwork: 80,
    communication: 80,
    innovation: 80,
    taskCompletion: 80,
    rewardPoints: 500
  });

  // State controls
  const [isScanning, setIsScanning] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    try {
      const histRes = await apiService.getAIHistoryList();
      const empRes = await apiService.getEmployees();
      setHistory(histRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      setErrorMsg('Failed to synchronize AI predictions logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEmployeeSelect = (e) => {
    const id = e.target.value;
    setSelectedEmpId(id);

    if (id === 'Manual') {
      setFormData({
        employeeName: '',
        department: 'Engineering',
        designation: 'Specialist',
        attendance: 95,
        teamwork: 80,
        communication: 80,
        innovation: 80,
        taskCompletion: 80,
        rewardPoints: 500
      });
    } else {
      const emp = employees.find((x) => x.id === parseInt(id));
      if (emp) {
        setFormData({
          employeeName: emp.name,
          department: emp.department,
          designation: emp.designation,
          attendance: emp.attendanceRate,
          teamwork: emp.teamwork,
          communication: emp.communication,
          innovation: emp.innovation,
          taskCompletion: emp.taskCompletion,
          rewardPoints: emp.rewardPoints
        });
      }
    }
  };

  const validateForm = () => {

  if (formData.attendance < 0 || formData.attendance > 100)
    return "Attendance must be between 0 and 100";

  if (formData.communication < 0 || formData.communication > 100)
    return "Communication must be between 0 and 100";

  if (formData.teamwork < 0 || formData.teamwork > 100)
    return "Teamwork must be between 0 and 100";

  if (formData.innovation < 0 || formData.innovation > 100)
    return "Innovation must be between 0 and 100";

  if (formData.taskCompletion < 0 || formData.taskCompletion > 100)
    return "Task Completion must be between 0 and 100";

  if (formData.rewardPoints < 0 || formData.rewardPoints > 1000)
    return "Reward Points must be between 0 and 1000";

  return null;
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

if (validationError) {
  setErrorMsg(validationError);
  return;
}
    if (!formData.employeeName) {
      setErrorMsg('Please input a candidate name for AI profiling.');
      return;
    }

    setIsScanning(true);
    setErrorMsg('');
    setPredictionResult(null);

    try {
      // Calls predictAI with simulated 1.5s loading scan
      const res = await apiService.predictAI(formData);
      setPredictionResult(res.data);
      setSuccessMsg(`AI prediction analysis compiled for ${formData.employeeName}.`);
      loadData(); // Reload history logs
    } catch (err) {
      setErrorMsg('AI calculation compiled an error.');
    } finally {
      setIsScanning(false);
    }
  };

  const deptOptions = ['Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance'];

  // Prediction Analytics

const totalPredictions = history.length;

const averageScore =
  totalPredictions > 0
    ? (
        history.reduce((sum, item) => sum + Number(item.score), 0) /
        totalPredictions
      ).toFixed(1)
    : 0;

const topPredictedEmployee =
  history.length > 0
    ? history.reduce((max, item) =>
        item.score > max.score ? item : max
      )
    : null;

const highRiskCount = history.filter(
  (item) => item.churnRisk >= 20
).length;

// Top Department

const departmentCounts = {};

history.forEach((item) => {
  departmentCounts[item.department] =
    (departmentCounts[item.department] || 0) + 1;
});

const topDepartment =
  Object.keys(departmentCounts).length > 0
    ? Object.keys(departmentCounts).reduce((a, b) =>
        departmentCounts[a] > departmentCounts[b] ? a : b
      )
    : "N/A";

  if (loading) return <Loader text="Re-synchronizing local machine learning parameters..." />;

  return (
    <div className="ai-predictor-root animate-fade-in">
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {errorMsg && <Alert type="danger" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* Main split dashboard pane */}
      <div className="ai-split-grid">
        
        {/* Left Side: Input Param Form */}
        <div className="ai-form-panel glass-card">
          <h3 className="ai-block-title">AI Predictive Evaluation</h3>
          <p className="ai-meta-intro">Adjust parameters to simulate future talent trajectories.</p>

          <form onSubmit={handlePredict} className="ai-evaluation-inputs-form">
            <div className="form-group">
              <label className="form-label">Active Directory Sync (Optional)</label>
              <select value={selectedEmpId} onChange={handleEmployeeSelect} className="form-input">
                <option value="Manual">[Manual Simulation Candidate]</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.id})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Candidate Name"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleInputChange}
              placeholder="e.g. John Miller"
              required
            />

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select name="department" value={formData.department} onChange={handleInputChange} className="form-input">
                  {deptOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Designation / Role"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row-2">
              <Input
                label="Attendance Rate (%)"
                type="number"
                min="0"
                max="100"
                step="any"
                placeholder="0-100"
                name="attendance"
                value={formData.attendance}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Reward Points Balance"
                type="number"
                min="0"
                max="1000"
                placeholder="0-1000"
                name="rewardPoints"
                value={formData.rewardPoints}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row-2">
              <Input
                label="Teamwork KPI (%)"
                type="number"
                min="0"
                max="100"
                step="any"
                placeholder="0-100"
                name="teamwork"
                value={formData.teamwork}
                onChange={handleInputChange}
              />
              <Input
                label="Innovation KPI (%)"
                type="number"
                min="0"
                max="100"
                step="any"
                placeholder="0-100"
                name="innovation"
                value={formData.innovation}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row-2">
              <Input
                label="Communication KPI (%)"
                type="number"
                min="0"
                max="100"
                step="any"
                placeholder="0-100"
                name="communication"
                value={formData.communication}
                onChange={handleInputChange}
              />
              <Input
                label="Task Completion KPI (%)"
                type="number"
                min="0"
                max="100"
                step="any"
                placeholder="0-100"
                name="taskCompletion"
                value={formData.taskCompletion}
                onChange={handleInputChange}
              />
            </div>

            <Button type="submit" variant="primary" fullWidth loading={isScanning}>
              Run AI Predictive Analysis
            </Button>
          </form>
        </div>

        {/* Right Side: Calculations Scanner & Glowing Result Cards */}
        <div className="ai-results-viewport">
          
          {/* Default Idle state */}
          {!isScanning && !predictionResult && (
            <div className="ai-idle-results-card glass-card">
              <div className="ai-brain-pulse animate-pulse-glow">🧠</div>
              <h4>AI Prediction Engine Ready</h4>
              <p>
                Configure nodal performance parameters on the left and dispatch the prediction model to analyze talents churn probabilities and career trajectories.
              </p>
            </div>
          )}

          {/* AI Scanning progress overlay */}
          {isScanning && (
            <div className="ai-scanning-progress-card glass-card glow-primary">
              <div className="cyber-gear-spinner"></div>
              <h4 className="scanning-title">MODEL RUNNING</h4>
              <p className="scanning-subtitle">FEED-FORWARD MATRIX CALCULATIONS IN PROGRESS...</p>
              
              <div className="scanning-sub-details">
                <span>Layers: Deep MLP Neural Net</span>
                <span>Epochs: 150 (Synced)</span>
                <span>Optimizers: Adamw (Learning Rate 3e-4)</span>
              </div>
            </div>
          )}

          {/* Glowing Prediction Results Card */}
          {!isScanning && predictionResult && (
            <div className="ai-results-details-card glass-card animate-fade-in glow-secondary">
              <div className="ai-results-header">
                <span className="results-badge">ANALYSIS VERIFIED</span>
                <h4>AI Prediction Roster File</h4>
              </div>

              <h2 className="ai-target-name">{predictionResult.employeeName}</h2>
              <span className="ai-target-meta">{predictionResult.designation} - {predictionResult.department}</span>

              {/* Glowing circular metrics split */}
              <div className="ai-donut-gauges-row">
                <div className="donut-gauge-item">
                  <DonutChart
                    percentage={predictionResult.promotionProbability}
                    label="Promotion Speed"
                    color="var(--color-primary)"
                    size={110}
                  />
                </div>
                <div className="donut-gauge-item">
                  <DonutChart
                    percentage={predictionResult.churnRisk}
                    label="Attrition Risk"
                    color={predictionResult.churnRisk > 20 ? 'var(--color-danger)' : predictionResult.churnRisk > 10 ? 'var(--color-warning)' : 'var(--color-success)'}
                    size={110}
                  />
                </div>
              </div>

              {/* Description table */}
              <div className="ai-predictions-text-details">
                <div className="pred-txt-row">
                  <span>Predicted performance Score</span>
                  <strong>{predictionResult.score}% Optimal rating</strong>
                </div>
                <div className="pred-txt-row">
                  <span>Recommended Next Badge</span>
                  <strong>🏆 {predictionResult.badgeRecommendation}</strong>
                </div>
                <div className="pred-txt-row">
                  <span>Growth Trajectory Track</span>
                  <strong>{predictionResult.trajectory}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="ai-insights-grid">
  
  <div className="insight-card glass-card">
    <h4>Top Predicted Employee</h4>
    <strong>
      {topPredictedEmployee
        ? `${topPredictedEmployee.employeeName} - ${topPredictedEmployee.score}%`
        : "N/A"}
    </strong>
  </div>

  <div className="insight-card glass-card">
    <h4>Average Prediction Score</h4>
    <strong>{averageScore}%</strong>
  </div>

  <div className="insight-card glass-card">
    <h4>High Risk Count</h4>
    <strong>{highRiskCount} Employees</strong>
  </div>

  <div className="insight-card glass-card">
    <h4>Top Department</h4>
    <strong>{topDepartment}</strong>
  </div>

</div>

      {/* 4. Prediction History Auditing Logs list */}
      <div className="ai-predictions-history-logs glass-card animate-fade-in">
        <h3 className="ai-block-title">AI Predictive Audit history</h3>
        
        <div className="table-responsive-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Calculation Timestamp</th>
                <th>Employee / Candidate</th>
                <th>Department</th>
                <th>Evaluation Rating</th>
                <th>AI Attrition Risk</th>
                <th>AI Promotion Prob.</th>
              </tr>
            </thead>
            <tbody>
              {history.map((hist) => (
                <tr key={hist.id}>
                  <td>{hist.timestamp}</td>
                  <td><strong>{hist.employeeName}</strong></td>
                  <td>{hist.department}</td>
                  <td><strong>{hist.score}%</strong></td>
                  <td>
                    <span className={`badge badge-${hist.churnRisk > 20 ? 'danger' : hist.churnRisk > 10 ? 'warning' : 'success'}`}>
                      {hist.churnRisk}% risk
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success" style={{ backgroundColor: 'var(--color-primary-glow)', color: 'var(--color-primary)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                      {hist.promotionProbability}% speed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AIPredictor;
