import api from "../configs/axios";
import { API_ENDPOINTS } from "../constants/apiConstants";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 * @module authService
 */
const authService = {
  // ==========================================================================
  // BASIC AUTHENTICATION
  // ==========================================================================

  /**
   * Register a new customer account
   * @param {Object} data - Registration data
   * @param {string} data.email - User email
   * @param {string} data.password - User password
   * @param {string} data.fullName - User full name
   * @returns {Promise<Object>} Registration response
   */
  register: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  /**
   * Login for customer accounts
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response with token and user info
   */
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Login for staff/admin accounts
   * @param {Object} credentials - Staff login credentials
   * @param {string} credentials.email - Staff email
   * @param {string} credentials.password - Staff password
   * @returns {Promise<Object>} Login response with token and user info
   */
  staffLogin: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.STAFF_LOGIN, credentials);
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Change user password
   * @param {Object} data - Password change data
   * @param {number} data.accountId - Account ID
   * @param {string} data.oldPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise<Object>} Response
   */
  changePassword: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return response.data;
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Response
   */
  forgotPassword: async (email) => {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  // ==========================================================================
  // ADMIN/STAFF CREATION
  // ==========================================================================

  /**
   * Create admin account (admin only)
   * @param {Object} data - Admin data
   * @param {string} data.email - Admin email
   * @param {string} data.password - Admin password
   * @param {string} data.phone - Admin phone
   * @returns {Promise<Object>} Response
   */
  createAdmin: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.CREATE_ADMIN, data);
    return response.data;
  },

  /**
   * Create staff account (admin only)
   * @param {Object} data - Staff data
   * @param {string} data.email - Staff email
   * @param {string} data.password - Staff password
   * @param {string} data.phone - Staff phone
   * @returns {Promise<Object>} Response
   */
  createStaff: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.CREATE_STAFF, data);
    return response.data;
  },

  // ==========================================================================
  // GOOGLE OAUTH AUTHENTICATION
  // ==========================================================================

  /**
   * Start Google OAuth flow
   * Redirects to Google login page
   * @param {string} [state] - Optional state parameter
   */
  googleAuthStart: (state = null) => {
    const url = state 
      ? `${api.defaults.baseURL}${API_ENDPOINTS.AUTH.GOOGLE_START}?state=${state}`
      : `${api.defaults.baseURL}${API_ENDPOINTS.AUTH.GOOGLE_START}`;
    window.location.href = url;
  },

  /**
   * Complete Google registration (when new user)
   * @param {Object} data - Registration completion data
   * @param {string} data.pendingToken - Temporary token from Google callback
   * @param {string} data.fullName - User full name
   * @param {string} data.password - User password
   * @returns {Promise<Object>} Response with token and user info
   */
  googleRegisterComplete: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE_REGISTER_COMPLETE, data);
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Send OTP for Google login (existing user)
   * @param {Object} data - OTP request data
   * @param {string} data.email - User email
   * @returns {Promise<Object>} Response
   */
  googleLoginOTP: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN_OTP, data);
    return response.data;
  },

  // ==========================================================================
  // OTP VERIFICATION
  // ==========================================================================

  /**
   * Verify OTP code
   * @param {Object} data - Verification data
   * @param {string} data.email - User email
   * @param {string} data.code - OTP code
   * @param {string} data.purpose - Purpose: 'EmailVerification', 'PasswordReset', 'TwoFactorAuth', 'GoogleLogin'
   * @returns {Promise<Object>} Verification response
   */
  verifyOTP: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.OTP_VERIFY, data);
    // If verification includes login, store token
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // ==========================================================================
  // LOCAL STORAGE MANAGEMENT
  // ==========================================================================

  /**
   * Logout user - clear local storage
   */
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error("Error parsing user data:", e);
        return null;
      }
    }
    return null;
  },

  /**
   * Get access token from localStorage
   * @returns {string|null} Access token or null
   */
  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },

  /**
   * Check if current user has specific role
   * @param {string} roleName - Role name to check
   * @returns {boolean} True if user has the role
   */
  hasRole: (roleName) => {
    const user = authService.getCurrentUser();
    return user && user.role && user.role.name === roleName;
  },

  /**
   * Check if current user is admin
   * @returns {boolean} True if admin
   */
  isAdmin: () => {
    return authService.hasRole("Admin");
  },

  /**
   * Check if current user is staff
   * @returns {boolean} True if staff
   */
  isStaff: () => {
    return authService.hasRole("Staff");
  },

  /**
   * Check if current user is customer
   * @returns {boolean} True if customer
   */
  isCustomer: () => {
    return authService.hasRole("Customer") || authService.hasRole("Member");
  },
};

export default authService;
