import axiosInstance from './axiosConfig';

// In-memory cache store for instant SPA navigation between modules
const cacheStore = {};

/**
 * Clean caching wrapper that caches live backend responses.
 * Never injects fake or random mock data.
 */
const fastFetch = async (cacheKey, apiCallFn) => {
  if (cacheStore[cacheKey]) {
    apiCallFn().then(res => {
      if (res && res.data) cacheStore[cacheKey] = res;
    }).catch(() => {});
    return cacheStore[cacheKey];
  }

  const res = await apiCallFn();
  if (res && res.data) cacheStore[cacheKey] = res;
  return res;
};

export const apiService = {
  clearCache: (key) => {
    if (key) delete cacheStore[key];
    else Object.keys(cacheStore).forEach(k => delete cacheStore[k]);
  },

  // --- Employee Directory ---
  getEmployees: async () => {
    return fastFetch('employees', () => axiosInstance.get('/employees/'));
  },

  getEmployeeById: async (id) => {
    try {
      const res = await axiosInstance.get(`/employees/${id}/`);
      if (res && res.data) return res;
    } catch (err) {
      console.warn(`Direct endpoint call for employee ${id} failed, resolving from employee list.`);
    }
    const allEmpRes = await apiService.getEmployees();
    const empList = allEmpRes.data || [];
    const found = empList.find(e => String(e.id) === String(id) || String(e.emp_code) === String(id));
    if (found) return { data: found };
    throw new Error('Employee profile not found');
  },

  createEmployee: async (employeeData) => {
    delete cacheStore['employees'];
    const res = await axiosInstance.post('/employees/create/', employeeData);
    delete cacheStore['employees'];
    return res;
  },

  updateEmployee: async (id, updatedData) => {
    delete cacheStore['employees'];
    delete cacheStore[`employee_${id}`];
    const res = await axiosInstance.put(`/employees/update/${id}/`, updatedData);
    delete cacheStore['employees'];
    delete cacheStore[`employee_${id}`];
    return res;
  },

  deleteEmployee: async (id) => {
    delete cacheStore['employees'];
    delete cacheStore[`employee_${id}`];
    const res = await axiosInstance.delete(`/employees/delete/${id}/`);
    delete cacheStore['employees'];
    return res;
  },

  // --- Attendance ---
  getAttendance: async () => {
    return fastFetch('attendance', () => axiosInstance.get('/attendance/'));
  },

  getAttendanceList: async () => {
    return fastFetch('attendanceList', () => axiosInstance.get('/attendance/'));
  },

  toggleAttendance: async (id, newStatus) => {
    delete cacheStore['attendance'];
    delete cacheStore['attendanceList'];
    delete cacheStore['employees'];
    const res = await axiosInstance.post('/attendance/toggle/', { id, status: newStatus });
    delete cacheStore['attendance'];
    delete cacheStore['attendanceList'];
    delete cacheStore['employees'];
    return res;
  },

  // --- AI Predictions ---
  getAIHistoryList: async () => {
    return fastFetch('aiHistory', () => axiosInstance.get('/ai/history/'));
  },

  predictAI: async (formData) => {
    const res = await axiosInstance.post('/ai/predict/', formData);
    delete cacheStore['aiHistory'];
    return res;
  },

  // --- Rewards & Leaderboard ---
  getBadges: async () => {
    return fastFetch('badges', () => axiosInstance.get('/rewards/badges/'));
  },

  getLeaderboard: async () => {
    return fastFetch('leaderboard', () => axiosInstance.get('/rewards/leaderboard/'));
  },

  addRewardPoints: async (id, points, reason) => {
    delete cacheStore['leaderboard'];
    delete cacheStore['employees'];
    const res = await axiosInstance.post('/rewards/add/', {
      employee: id,
      reward_points: points,
      bonus: 0,
      badge: 'Bronze',
      remarks: reason
    });
    delete cacheStore['leaderboard'];
    delete cacheStore['employees'];
    return res;
  },

  // --- Analytics Feeds ---
  getRecentActivities: async () => {
    return fastFetch('recentActivities', () => axiosInstance.get('/analytics/activities/'));
  },

  getPerformance: async () => {
    return fastFetch('performance', () => axiosInstance.get('/performance/'));
  },

  addPerformance: async (data) => {
    delete cacheStore['performance'];
    return axiosInstance.post('/performance/add/', data);
  },

  getLeaderboardAnalytics: async () => {
    return fastFetch('leaderboardAnalytics', () => axiosInstance.get('/analytics/leaderboard/'));
  },

  getLowPerformers: async () => {
    return fastFetch('lowPerformers', () => axiosInstance.get('/analytics/low-performance/'));
  },

  getDepartmentSummary: async () => {
    return fastFetch('deptSummary', () => axiosInstance.get('/analytics/department-summary/'));
  }
};
