import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const projectAPI = {
  // Project CRUD
  getProjects: (params = {}) => api.get('/api/v1/projects', { params }),
  getProject: (id) => api.get(`/api/v1/projects/${id}`),
  createProject: (data) => api.post('/api/v1/projects', data),
  updateProject: (id, data) => api.put(`/api/v1/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/api/v1/projects/${id}`),

  // Estimation
  estimateProject: (data) => api.post('/api/v1/estimate', data),
  estimateWithSimilar: (data) => api.post('/api/v1/estimate/with-similar', data),

  // Similar Projects
  searchSimilarProjects: (data) => api.post('/api/v1/similarity/search', data),
  getHistoricalProjects: () => api.get('/api/v1/historical-projects'),
};

export const timesheetAPI = {
  // Timesheet CRUD
  getTimesheets: (params = {}) => api.get('/api/v1/timesheets', { params }),
  createTimesheet: (data) => api.post('/api/v1/timesheets', data),
  updateTimesheet: (id, data) => api.put(`/api/v1/timesheets/${id}`, data),
  deleteTimesheet: (id) => api.delete(`/api/v1/timesheets/${id}`),
  approveTimesheet: (id) => api.post(`/api/v1/timesheets/${id}/approve`),
  rejectTimesheet: (id, reason) => api.post(`/api/v1/timesheets/${id}/reject`, { reason }),
};

export const analyticsAPI = {
  // Analytics
  getDashboardData: () => api.get('/api/v1/analytics/dashboard'),
  getCostAnalysis: (params = {}) => api.get('/api/v1/analytics/cost', { params }),
  getResourceAnalysis: (params = {}) => api.get('/api/v1/analytics/resources', { params }),
  getProjectReport: (id) => api.get(`/api/v1/projects/${id}/report`),
};

export const authAPI = {
  // Authentication
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  logout: () => api.post('/api/v1/auth/logout'),
  refreshToken: () => api.post('/api/v1/auth/refresh'),
  getProfile: () => api.get('/api/v1/auth/profile'),
  updateProfile: (data) => api.put('/api/v1/auth/profile', data),
};

export const systemAPI = {
  // System
  getHealth: () => api.get('/health'),
  getModels: () => api.get('/api/v1/models'),
  getSettings: () => api.get('/api/v1/settings'),
  updateSettings: (data) => api.put('/api/v1/settings', data),
};

export default api;