import axiosInstance from './axiosConfig';
import { mockEmployees, mockRecentActivities, mockAIHistory, mockBadgesList } from './mockData';

// Toggle this flag when connecting to the actual Django/Node backend
const USE_MOCK = false;

// Helper to simulate API response latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Keep local in-memory copies of mock data to support CRUD changes in the session
let employeesDB = [...mockEmployees];
let activitiesDB = [...mockRecentActivities];
let aiHistoryDB = [...mockAIHistory];

export const apiService = {
  // --- Employee Directory ---
  getEmployees: async () => {
    if (USE_MOCK) {
      await delay(500);
      return { data: employeesDB };
    }
    return axiosInstance.get('/employees/');
  },

  getEmployeeById: async (id) => {
    if (USE_MOCK) {
      await delay(300);
      const emp = employeesDB.find(e => e.id === id);
      if (!emp) throw new Error('Employee not found');
      return { data: emp };
    }
    return axiosInstance.get(`/employees/${id}/`);
  },

  createEmployee: async (employeeData) => {
    if (USE_MOCK) {
      await delay(600);
      const newEmp = {
        id: `EMP0${employeesDB.length + 1}`,
        ...employeeData,
        status: 'Present',
        badges: employeeData.badges || ['Rising Star'],
        attendanceRate: 100,
        teamwork: parseInt(employeeData.teamwork || 80),
        communication: parseInt(employeeData.communication || 80),
        innovation: parseInt(employeeData.innovation || 80),
        taskCompletion: parseInt(employeeData.taskCompletion || 80),
        rewardPoints: parseInt(employeeData.rewardPoints || 100),
        performanceScore: Math.round(
          (parseInt(employeeData.teamwork || 80) +
            parseInt(employeeData.communication || 80) +
            parseInt(employeeData.innovation || 80) +
            parseInt(employeeData.taskCompletion || 80)) / 4
        ),
        churnRisk: Math.round(Math.random() * 15),
        promotionProbability: Math.round(50 + Math.random() * 40)
      };
      employeesDB.unshift(newEmp); // Add to the top of list
      
      // Add activity log
      activitiesDB.unshift({
        id: `ACT0${activitiesDB.length + 1}`,
        type: 'system',
        text: `New employee ${newEmp.name} added to ${newEmp.department}.`,
        time: 'Just now'
      });

      return { data: newEmp };
    }
    return axiosInstance.post('/employees/', employeeData);
  },

  updateEmployee: async (id, updatedData) => {
    if (USE_MOCK) {
      await delay(500);
      const index = employeesDB.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Employee not found');
      
      const prev = employeesDB[index];
      // Recalculate average performance if scores changed
      const teamwork = parseInt(updatedData.teamwork ?? prev.teamwork);
      const communication = parseInt(updatedData.communication ?? prev.communication);
      const innovation = parseInt(updatedData.innovation ?? prev.innovation);
      const taskCompletion = parseInt(updatedData.taskCompletion ?? prev.taskCompletion);
      const performanceScore = Math.round((teamwork + communication + innovation + taskCompletion) / 4);

      const merged = {
        ...prev,
        ...updatedData,
        teamwork,
        communication,
        innovation,
        taskCompletion,
        performanceScore
      };
      
      employeesDB[index] = merged;
      return { data: merged };
    }
    return axiosInstance.put(`/employees/${id}/`, updatedData);
  },

  deleteEmployee: async (id) => {
    if (USE_MOCK) {
      await delay(400);
      const index = employeesDB.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Employee not found');
      const deletedEmp = employeesDB[index];
      employeesDB.splice(index, 1);
      
      activitiesDB.unshift({
        id: `ACT0${activitiesDB.length + 1}`,
        type: 'system',
        text: `Employee profile of ${deletedEmp.name} was removed.`,
        time: 'Just now'
      });
      return { data: { success: true } };
    }
    return axiosInstance.delete(`/employees/${id}/`);
  },

  // --- Attendance ---
  getAttendanceList: async () => {
    if (USE_MOCK) {
      await delay(400);
      return { data: employeesDB.map(e => ({
        id: e.id,
        name: e.name,
        department: e.department,
        status: e.status,
        attendanceRate: e.attendanceRate
      }))};
    }
    return axiosInstance.get('/attendance/');
  },

  toggleAttendance: async (id, newStatus) => {
    if (USE_MOCK) {
      await delay(300);
      const emp = employeesDB.find(e => e.id === id);
      if (!emp) throw new Error('Employee not found');
      emp.status = newStatus;
      
      // Update attendance rate slightly based on status
      if (newStatus === 'Present') {
        emp.attendanceRate = Math.min(100, parseFloat((emp.attendanceRate + 0.2).toFixed(1)));
      } else if (newStatus === 'Absent') {
        emp.attendanceRate = Math.max(0, parseFloat((emp.attendanceRate - 0.5).toFixed(1)));
      }

      activitiesDB.unshift({
        id: `ACT0${activitiesDB.length + 1}`,
        type: 'attendance',
        text: `${emp.name} attendance status changed to ${newStatus}.`,
        time: 'Just now'
      });

      return { data: emp };
    }
    return axiosInstance.post('/attendance/toggle/', { id, status: newStatus });
  },

  // --- AI Predictions ---
  getAIHistoryList: async () => {
    if (USE_MOCK) {
      await delay(300);
      return { data: aiHistoryDB };
    }
    return axiosInstance.get('/ai/history/');
  },

  predictAI: async (formData) => {
    if (USE_MOCK) {
      await delay(1500); // Higher delay to show cool scanning spinner

      const attendance = parseFloat(formData.attendance);
      const teamwork = parseInt(formData.teamwork);
      const communication = parseInt(formData.communication);
      const innovation = parseInt(formData.innovation);
      const taskCompletion = parseInt(formData.taskCompletion);
      const rewardPoints = parseInt(formData.rewardPoints);

      // Simple AI dynamic formula calculation
      const avgPerformance = (teamwork + communication + innovation + taskCompletion) / 4;
      const attrRisk = Math.max(1.2, parseFloat((100 - (attendance * 0.4 + avgPerformance * 0.5 + (rewardPoints / 100) * 0.1)).toFixed(1)));
      const promProb = Math.min(99.5, parseFloat((avgPerformance * 0.6 + attendance * 0.3 + (rewardPoints / 50)).toFixed(1)));
      
      let badgeRecommend = 'Culture Champion';
      if (innovation > 90) badgeRecommend = 'Innovator';
      else if (taskCompletion > 90) badgeRecommend = 'Speedster';
      else if (teamwork > 90) badgeRecommend = 'Team Pillar';

      const predictionResult = {
        id: `PRED0${aiHistoryDB.length + 1}`,
        employeeName: formData.employeeName || 'Simulated Candidate',
        department: formData.department,
        designation: formData.designation || 'Specialist',
        score: Math.round(avgPerformance),
        promotionProbability: promProb,
        churnRisk: attrRisk,
        badgeRecommendation: badgeRecommend,
        trajectory: promProb > 80 ? 'Highly Accelerated path' : attrRisk > 25 ? 'Critical retention focus' : 'Steady performance path',
        timestamp: new Date().toLocaleString()
      };

      // Save to prediction history
      aiHistoryDB.unshift(predictionResult);
      
      // Save to activity log
      activitiesDB.unshift({
        id: `ACT0${activitiesDB.length + 1}`,
        type: 'ai',
        text: `AI Prediction run for ${predictionResult.employeeName}: Churn Risk ${attrRisk}%.`,
        time: 'Just now'
      });

      return { data: predictionResult };
    }
    return axiosInstance.post('/ai/predict/', formData);
  },

  // --- Rewards & Leaderboard ---
  getBadges: async () => {
    if (USE_MOCK) {
      await delay(200);
      return { data: mockBadgesList };
    }
    return axiosInstance.get('/rewards/badges/');
  },

  addRewardPoints: async (id, points, reason) => {
    if (USE_MOCK) {
      await delay(400);
      const emp = employeesDB.find(e => e.id === id);
      if (!emp) throw new Error('Employee not found');
      emp.rewardPoints += points;

      activitiesDB.unshift({
        id: `ACT0${activitiesDB.length + 1}`,
        type: 'reward',
        text: `Awarded ${points} points to ${emp.name} (${reason}).`,
        time: 'Just now'
      });

      return { data: emp };
    }
    return axiosInstance.post('/rewards/points/', { id, points, reason });
  },

  // --- Dashboard Feeds ---
  getRecentActivities: async () => {
    if (USE_MOCK) {
      await delay(300);
      return { data: activitiesDB };
    }
    return axiosInstance.get('/activities/');
  }
};
