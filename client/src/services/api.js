const BASE_URL= process.env.NODE_ENV  === "development" ? "http://localhost:5000/api":"/api";

const API_BASE_URL = BASE_URL;
 

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors
          .map((err) => err.msg || err.message)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => apiRequest("/auth/me"),
};

// Blogs API
export const blogsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/blogs${queryString ? `?${queryString}` : ""}`);
  },

  getAllAdmin: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/blogs/admin${queryString ? `?${queryString}` : ""}`);
  },

  getById: (id) => apiRequest(`/blogs/${id}`),

  create: (blogData) =>
    apiRequest("/blogs", {
      method: "POST",
      body: JSON.stringify(blogData),
    }),

  update: (id, blogData) =>
    apiRequest(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(blogData),
    }),

  delete: (id) =>
    apiRequest(`/blogs/${id}`, {
      method: "DELETE",
    }),

  like: (id) =>
    apiRequest(`/blogs/${id}/like`, {
      method: "POST",
    }),
};

// Quizzes API
export const quizzesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/quizzes${queryString ? `?${queryString}` : ""}`);
  },

  getById: (id) => apiRequest(`/quizzes/${id}`),

  create: (quizData) =>
    apiRequest("/quizzes", {
      method: "POST",
      body: JSON.stringify(quizData),
    }),

  update: (id, quizData) =>
    apiRequest(`/quizzes/${id}`, {
      method: "PUT",
      body: JSON.stringify(quizData),
    }),

  delete: (id) =>
    apiRequest(`/quizzes/${id}`, {
      method: "DELETE",
    }),

  submit: (id, answers) =>
    apiRequest(`/quizzes/${id}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
};

// Contact API
export const contactAPI = {
  submit: (contactData) =>
    apiRequest("/contact", {
      method: "POST",
      body: JSON.stringify(contactData),
    }),

  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/contact/admin${queryString ? `?${queryString}` : ""}`);
  },

  getById: (id) => apiRequest(`/contact/admin/${id}`),

  updateStatus: (id, statusData) =>
    apiRequest(`/contact/admin/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(statusData),
    }),

  delete: (id) =>
    apiRequest(`/contact/admin/${id}`, {
      method: "DELETE",
    }),
};

// Scores API
export const scoresAPI = {
  getUserScores: () => apiRequest("/scores/user"),

  getQuizScores: (quizId) => apiRequest(`/scores/quiz/${quizId}`),

  getLeaderboard: (quizId, limit = 10) =>
    apiRequest(`/scores/leaderboard/${quizId}?limit=${limit}`),

  getAllScores: (params = {}) => {
    // Remove quizId if it is 'all' before sending to backend
    const filtered = { ...params };
    if (filtered.quizId === "all") {
      delete filtered.quizId;
    }
    const queryString = new URLSearchParams(filtered).toString();
    return apiRequest(
      `/scores/admin/all${queryString ? `?${queryString}` : ""}`
    );
  },

  getStatistics: () => apiRequest("/scores/admin/statistics"),
};

const api = {
  auth: authAPI,
  blogs: blogsAPI,
  quizzes: quizzesAPI,
  contact: contactAPI,
  scores: scoresAPI,
};

export default api;
