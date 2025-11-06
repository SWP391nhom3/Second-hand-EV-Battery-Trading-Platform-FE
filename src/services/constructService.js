import api from "../configs/axios";
import { API_ENDPOINTS } from "../constants/apiConstants";

/**
 * Construct Service
 * Handles all construct/facility management related API calls
 * @module constructService
 */
const constructService = {
  // ==========================================================================
  // BASIC CRUD OPERATIONS
  // ==========================================================================

  /**
   * Get all constructs/facilities
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.pageSize] - Items per page
   * @returns {Promise<Array>} Constructs list
   */
  getConstructs: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.CONSTRUCT.BASE, { params });
    return response.data;
  },

  /**
   * Create new construct
   * @param {Object} constructData - Construct data
   * @param {string} constructData.name - Facility name
   * @param {string} constructData.address - Facility address
   * @param {string} constructData.contact - Contact information
   * @param {string} constructData.type - Type (Inspection/Repair/Maintenance/Installation)
   * @param {number} constructData.paymentId - Payment ID
   * @returns {Promise<Object>} Created construct
   */
  createConstruct: async (constructData) => {
    const response = await api.post(API_ENDPOINTS.CONSTRUCT.BASE, constructData);
    return response.data;
  },

  /**
   * Get construct by ID
   * @param {number} id - Construct ID
   * @returns {Promise<Object>} Construct details
   */
  getConstructById: async (id) => {
    const response = await api.get(API_ENDPOINTS.CONSTRUCT.BY_ID(id));
    return response.data;
  },

  /**
   * Update construct
   * @param {number} id - Construct ID
   * @param {Object} constructData - Updated construct data
   * @returns {Promise<Object>} Updated construct
   */
  updateConstruct: async (id, constructData) => {
    const response = await api.put(API_ENDPOINTS.CONSTRUCT.BY_ID(id), constructData);
    return response.data;
  },

  /**
   * Delete construct
   * @param {number} id - Construct ID
   * @returns {Promise<Object>} Delete response
   */
  deleteConstruct: async (id) => {
    const response = await api.delete(API_ENDPOINTS.CONSTRUCT.BY_ID(id));
    return response.data;
  },

  // ==========================================================================
  // CONSTRUCT QUERIES
  // ==========================================================================

  /**
   * Get constructs by type
   * @param {string} type - Construct type (Inspection/Repair/Maintenance/Installation)
   * @returns {Promise<Array>} Filtered constructs
   */
  getConstructsByType: async (type) => {
    const response = await api.get(API_ENDPOINTS.CONSTRUCT.BY_TYPE(type));
    return response.data;
  },

  /**
   * Get constructs by status
   * @param {string} status - Construct status (Pending/InProgress/Completed/Cancelled)
   * @returns {Promise<Array>} Filtered constructs
   */
  getConstructsByStatus: async (status) => {
    const response = await api.get(API_ENDPOINTS.CONSTRUCT.BY_STATUS(status));
    return response.data;
  },

  /**
   * Search constructs
   * @param {Object} params - Search parameters
   * @param {string} [params.name] - Search by name
   * @param {string} [params.type] - Filter by type
   * @param {string} [params.address] - Search by address
   * @returns {Promise<Array>} Matching constructs
   */
  searchConstructs: async (params) => {
    const response = await api.get(API_ENDPOINTS.CONSTRUCT.SEARCH, { params });
    return response.data;
  },

  /**
   * Get nearby constructs/facilities
   * @param {Object} params - Location parameters
   * @param {string} params.address - Address to search from
   * @returns {Promise<Array>} Nearby constructs
   */
  getNearbyConstructs: async (params) => {
    const response = await api.get(API_ENDPOINTS.CONSTRUCT.NEARBY, { params });
    return response.data;
  },

  /**
   * Get construct statistics (admin/staff)
   * @returns {Promise<Object>} Statistics
   */
  getConstructStatistics: async () => {
    const response = await api.get(API_ENDPOINTS.CONSTRUCT.STATISTICS);
    return response.data;
  },

  // ==========================================================================
  // CONSTRUCT STATUS OPERATIONS
  // ==========================================================================

  /**
   * Update construct status
   * @param {number} id - Construct ID
   * @param {Object} statusData - Status data
   * @param {string} statusData.status - New status
   * @returns {Promise<Object>} Updated construct
   */
  updateConstructStatus: async (id, statusData) => {
    const response = await api.put(API_ENDPOINTS.CONSTRUCT.UPDATE_STATUS(id), statusData);
    return response.data;
  },

  // ==========================================================================
  // CONSTRUCT FEE OPERATIONS
  // ==========================================================================

  /**
   * Get construct fees
   * @param {number} id - Construct ID
   * @returns {Promise<Array>} Construct fees
   */
  getConstructFees: async (id) => {
    const response = await api.get(API_ENDPOINTS.CONSTRUCT.FEES(id));
    return response.data;
  },

  /**
   * Add construct fee
   * @param {number} id - Construct ID
   * @param {Object} feeData - Fee data
   * @param {number} feeData.memberId - Member ID
   * @param {string} feeData.serviceName - Service name
   * @param {number} feeData.fee - Fee amount
   * @returns {Promise<Object>} Created fee
   */
  addConstructFee: async (id, feeData) => {
    const response = await api.post(API_ENDPOINTS.CONSTRUCT.ADD_FEE(id), feeData);
    return response.data;
  },
};

export default constructService;
