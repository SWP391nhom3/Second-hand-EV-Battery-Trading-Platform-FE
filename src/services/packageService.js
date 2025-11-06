import api from "../configs/axios";
import { API_ENDPOINTS } from "../constants/apiConstants";

/**
 * Package Service
 * Handles all post package-related API calls
 * @module packageService
 */
const packageService = {
  // ==========================================================================
  // BASIC CRUD OPERATIONS
  // ==========================================================================

  /**
   * Get all packages
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Packages list
   */
  getPackages: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.POST_PACKAGE.BASE, { params });
    return response.data;
  },

  /**
   * Create new package (admin only)
   * @param {Object} packageData - Package data
   * @param {string} packageData.name - Package name
   * @param {number} packageData.durationDay - Duration in days
   * @param {number} packageData.price - Package price
   * @param {number} packageData.priorityLevel - Priority level
   * @param {string} packageData.description - Package description
   * @returns {Promise<Object>} Created package
   */
  createPackage: async (packageData) => {
    const response = await api.post(API_ENDPOINTS.POST_PACKAGE.BASE, packageData);
    return response.data;
  },

  /**
   * Get package by ID
   * @param {number} id - Package ID
   * @returns {Promise<Object>} Package details
   */
  getPackageById: async (id) => {
    const response = await api.get(API_ENDPOINTS.POST_PACKAGE.BY_ID(id));
    return response.data;
  },

  /**
   * Update package (admin only)
   * @param {number} id - Package ID
   * @param {Object} packageData - Updated package data
   * @returns {Promise<Object>} Updated package
   */
  updatePackage: async (id, packageData) => {
    const response = await api.put(API_ENDPOINTS.POST_PACKAGE.BY_ID(id), packageData);
    return response.data;
  },

  /**
   * Delete package (admin only)
   * @param {number} id - Package ID
   * @returns {Promise<Object>} Delete response
   */
  deletePackage: async (id) => {
    const response = await api.delete(API_ENDPOINTS.POST_PACKAGE.BY_ID(id));
    return response.data;
  },

  // ==========================================================================
  // PACKAGE QUERIES
  // ==========================================================================

  /**
   * Get active packages (available for purchase)
   * @returns {Promise<Array>} Active packages
   */
  getActivePackages: async () => {
    const response = await api.get(API_ENDPOINTS.POST_PACKAGE.ACTIVE);
    return response.data;
  },

  /**
   * Get all subscriptions for a package
   * @param {number} id - Package ID
   * @returns {Promise<Array>} Package subscriptions
   */
  getPackageSubscriptions: async (id) => {
    const response = await api.get(API_ENDPOINTS.POST_PACKAGE.SUBSCRIPTIONS(id));
    return response.data;
  },

  /**
   * Get package statistics (admin/staff only)
   * @returns {Promise<Object>} Package statistics
   */
  getPackageStatistics: async () => {
    const response = await api.get(API_ENDPOINTS.POST_PACKAGE.STATISTICS);
    return response.data;
  },

  // ==========================================================================
  // SUBSCRIPTION OPERATIONS
  // ==========================================================================

  /**
   * Subscribe to a package
   * @param {number} packageId - Package ID
   * @param {Object} subscriptionData - Subscription data
   * @param {number} [subscriptionData.postId] - Post ID to link (optional)
   * @param {number} subscriptionData.memberId - Member ID
   * @param {number} subscriptionData.paymentId - Payment ID
   * @returns {Promise<Object>} Subscription response
   */
  subscribeToPackage: async (packageId, subscriptionData) => {
    const response = await api.post(
      API_ENDPOINTS.POST_PACKAGE.SUBSCRIBE(packageId),
      subscriptionData
    );
    return response.data;
  },
};

export default packageService;
