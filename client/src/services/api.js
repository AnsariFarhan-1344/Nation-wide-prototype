/**
 * Frontend API Service Layer for CampusLink Portal
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    let data;
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch (parseError) {
        data = {
          success: false,
          message: `Invalid JSON response from server (status ${res.status})`,
        };
      }
    } else {
      const text = await res.text();
      data = {
        success: false,
        message: text || `Request failed with status ${res.status} (${res.statusText || 'Error'})`,
      };
    }

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth & Personas
  getPersonas: () => request('/auth/personas'),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  verifyOtp: (userId, otp) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ userId, otp }) }),
  getUserProfile: (userId) => request(`/auth/user/${userId}`),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  syncSupabaseUser: (userData) => request('/auth/sync-supabase', { method: 'POST', body: JSON.stringify(userData) }),

  // Projects & Matching
  getProjects: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/projects${q ? `?${q}` : ''}`);
  },
  getProjectById: (id, userId) => request(`/projects/${id}${userId ? `?userId=${userId}` : ''}`),
  createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  applyToProject: (projectId, appData) => request(`/projects/${projectId}/apply`, { method: 'POST', body: JSON.stringify(appData) }),
  getProjectApplications: (projectId) => request(`/projects/${projectId}/applications`),
  getUserApplications: (userId) => request(`/projects/user/${userId}/applications`),
  updateApplicationStatus: (appId, status, reviewerId) =>
    request(`/projects/applications/${appId}/status`, { method: 'PATCH', body: JSON.stringify({ status, reviewerId }) }),

  // Team Workspace & Kanban & Chat
  getUserTeams: (userId) => request(`/teams/user/${userId}`),
  getTeamWorkspace: (projectId) => request(`/teams/${projectId}/workspace`),
  addTask: (projectId, taskData) => request(`/teams/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(taskData) }),
  updateTaskColumn: (projectId, taskId, column) =>
    request(`/teams/${projectId}/tasks/${taskId}/column`, { method: 'PATCH', body: JSON.stringify({ column }) }),
  sendChatMessage: (projectId, chatData) => request(`/teams/${projectId}/chat`, { method: 'POST', body: JSON.stringify(chatData) }),

  // Q&A System
  getQuestions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/qa${q ? `?${q}` : ''}`);
  },
  getQuestionById: (id) => request(`/qa/${id}`),
  askQuestion: (data) => request('/qa', { method: 'POST', body: JSON.stringify(data) }),
  addAnswer: (questionId, data) => request(`/qa/${questionId}/answers`, { method: 'POST', body: JSON.stringify(data) }),
  upvoteQuestion: (questionId) => request(`/qa/${questionId}/upvote`, { method: 'POST' }),
  upvoteAnswer: (questionId, answerId) => request(`/qa/${questionId}/answers/${answerId}/upvote`, { method: 'POST' }),
  acceptAnswer: (questionId, answerId) => request(`/qa/${questionId}/answers/${answerId}/accept`, { method: 'POST' }),

  // Mentors & Research & Opportunities
  getMentors: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/mentors${q ? `?${q}` : ''}`);
  },
  requestMentorship: (mentorId, data) => request(`/mentors/${mentorId}/request`, { method: 'POST', body: JSON.stringify(data) }),
  getResearchOpportunities: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/mentors/research/all${q ? `?${q}` : ''}`);
  },
  applyToResearch: (resId, data) => request(`/mentors/research/${resId}/apply`, { method: 'POST', body: JSON.stringify(data) }),
  getOpportunities: (type) => request(`/mentors/opportunities/all${type ? `?type=${type}` : ''}`),

  // Reputation & Leaderboard
  getLeaderboard: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/reputation/leaderboard${q ? `?${q}` : ''}`);
  },
  getReputationHistory: (userId) => request(`/reputation/history/${userId}`),

  // AI Assistants
  checkSimilarQuestions: (title) => request('/ai/similar-questions', { method: 'POST', body: JSON.stringify({ title }) }),
  generateProjectDescription: (prompt) => request('/ai/generate-project', { method: 'POST', body: JSON.stringify({ prompt }) }),
  getAIMatchExplanation: (userId, projectId) =>
    request('/ai/match-explanation', { method: 'POST', body: JSON.stringify({ userId, projectId }) }),

  // Admin & Moderation
  getAdminStats: () => request('/admin/stats'),
  getModerationQueue: () => request('/admin/moderation'),
  resolveModeration: (reportId, action) =>
    request(`/admin/moderation/${reportId}/resolve`, { method: 'POST', body: JSON.stringify({ action }) }),

  // Notifications
  getNotifications: (userId) => request(`/notifications/user/${userId}`),
  markNotificationRead: (notifId) => request(`/notifications/${notifId}/read`, { method: 'PATCH' }),
};
