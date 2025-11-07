import api from "../configs/axios";
import { API_ENDPOINTS } from "../constants/apiConstants";

/**
 * Account Service
 * Handles all account-related API calls
 * @module accountService
 */
const accountService = {
  // ==========================================================================
  // BASIC CRUD OPERATIONS
  // ==========================================================================

  /**
   * Get account by ID
   * @param {number} id - Account ID
   * @returns {Promise<Object>} Account details
   */
  getAccountById: async (id) => {
    const response = await api.get(API_ENDPOINTS.ACCOUNT.BY_ID(id));
    return response.data;
  },

  /**
   * Get current account (from token)
   * @returns {Promise<Object>} Current account details
   */
  getCurrentAccount: async () => {
    try {
      // Get account ID from token or user data
      const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const accountId = user.accountId || user.id;
        if (accountId) {
          return await accountService.getAccountById(accountId);
        }
      }
      throw new Error("No account ID found");
    } catch (error) {
      console.error("Error getting current account:", error);
      throw error;
    }
  },

  /**
   * Update account
   * @param {number} id - Account ID
   * @param {Object} accountData - Updated account data
   * @returns {Promise<Object>} Updated account
   */
  updateAccount: async (id, accountData) => {
    const response = await api.put(API_ENDPOINTS.ACCOUNT.BY_ID(id), accountData);
    return response.data;
  },
};

export default accountService;

