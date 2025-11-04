import api from "../configs/axios";

const authService = {
  // POST /api/Auth/register
  register: async (data) => {
    const response = await api.post("/api/Auth/register", data);
    return response.data;
  },

  // POST /api/Auth/login
  login: async (credentials) => {
    const response = await api.post("/api/Auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // POST /api/Auth/staff-login
  staffLogin: async (credentials) => {
    const response = await api.post("/api/Auth/staff-login", credentials);
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // POST /api/Auth/change-password
  changePassword: async (data) => {
    const response = await api.post("/api/Auth/change-password", data);
    return response.data;
  },

  // POST /api/Auth/forgot-password
  forgotPassword: async (email) => {
    const response = await api.post("/api/Auth/forgot-password", { email });
    return response.data;
  },

  // POST /api/Auth/otp/verify
  verifyOTP: async (data) => {
    const response = await api.post("/api/Auth/otp/verify", data);
    return response.data;
  },

  // POST /api/Auth/create-admin
  createAdmin: async (data) => {
    const response = await api.post("/api/Auth/create-admin", data);
    return response.data;
  },

  // POST /api/Auth/create-staff
  createStaff: async (data) => {
    const response = await api.post("/api/Auth/create-staff", data);
    return response.data;
  },

  // Google Authentication
  // GET /api/Auth/google/start
  googleAuthStart: () => {
    window.location.href = `${api.defaults.baseURL}/api/Auth/google/start`;
  },

  // POST /api/Auth/google/register-complete
  googleRegisterComplete: async (data) => {
    const response = await api.post("/api/Auth/google/register-complete", data);
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // POST /api/Auth/google/login-otp
  googleLoginOTP: async (data) => {
    const response = await api.post("/api/Auth/google/login-otp", data);
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },
};

export default authService;
