import api from "../configs/axios";
import { API_ENDPOINTS } from "../constants/apiConstants";

/**
 * Battery Service
 * Handles all battery (individual item) related API calls
 * @module batteryService
 */
const batteryService = {
  // ==========================================================================
  // BASIC CRUD OPERATIONS
  // ==========================================================================

  /**
   * Get all batteries
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.pageSize] - Items per page
   * @returns {Promise<Array>} Batteries list
   */
  getBatteries: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.BATTERY.BASE, { params });
    return response.data;
  },

  /**
   * Create new battery
   * @param {Object} batteryData - Battery data
   * @param {number} batteryData.memberId - Owner member ID
   * @param {number} [batteryData.batteryModelId] - Battery model ID (optional)
   * @param {number} batteryData.capacityKWh - Capacity in kWh
   * @param {number} batteryData.cycleCount - Cycle count
   * @param {number} batteryData.manufactureYear - Manufacturing year
   * @param {string} batteryData.condition - Condition (Excellent/Good/Fair/Poor/New/Used)
   * @param {string} batteryData.description - Description
   * @returns {Promise<Object>} Created battery
   */
  createBattery: async (batteryData) => {
    const response = await api.post(API_ENDPOINTS.BATTERY.BASE, batteryData);
    return response.data;
  },

  /**
   * Get battery by ID
   * @param {number} id - Battery ID
   * @returns {Promise<Object>} Battery details
   */
  getBatteryById: async (id) => {
    const response = await api.get(API_ENDPOINTS.BATTERY.BY_ID(id));
    return response.data;
  },

  /**
   * Update battery
   * @param {number} id - Battery ID
   * @param {Object} batteryData - Updated battery data
   * @returns {Promise<Object>} Updated battery
   */
  updateBattery: async (id, batteryData) => {
    const response = await api.put(API_ENDPOINTS.BATTERY.BY_ID(id), batteryData);
    return response.data;
  },

  /**
   * Delete battery
   * @param {number} id - Battery ID
   * @returns {Promise<Object>} Delete response
   */
  deleteBattery: async (id) => {
    const response = await api.delete(API_ENDPOINTS.BATTERY.BY_ID(id));
    return response.data;
  },

  // ==========================================================================
  // BATTERY QUERIES
  // ==========================================================================

  /**
   * Get all batteries owned by a member
   * @param {number} memberId - Member ID
   * @returns {Promise<Array>} Member's batteries
   */
  getBatteriesByMember: async (memberId) => {
    const response = await api.get(API_ENDPOINTS.BATTERY.BY_MEMBER(memberId));
    return response.data;
  },

  /**
   * Search batteries by capacity
   * @param {Object} params - Search parameters
   * @param {number} [params.minCapacity] - Minimum capacity in kWh
   * @param {number} [params.maxCapacity] - Maximum capacity in kWh
   * @returns {Promise<Array>} Matching batteries
   */
  searchBatteries: async (params) => {
    const response = await api.get(API_ENDPOINTS.BATTERY.SEARCH, { params });
    return response.data;
  },
};

export default batteryService;
