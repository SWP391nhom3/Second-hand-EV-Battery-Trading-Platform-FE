import api from "../configs/axios";
import { API_ENDPOINTS } from "../constants/apiConstants";

/**
 * Post Request Service
 * Handles all post request (buyer inquiries) related API calls
 * @module postRequestService
 */
const postRequestService = {
  // ==========================================================================
  // BASIC CRUD OPERATIONS
  // ==========================================================================

  /**
   * Get all post requests
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Post requests list
   */
  getPostRequests: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.POST_REQUEST.BASE, { params });
    return response.data;
  },

  /**
   * Create new post request (buyer inquiry)
   * @param {Object} requestData - Request data
   * @param {number} requestData.postId - Post ID
   * @param {number} requestData.buyerId - Buyer member ID
   * @param {number} [requestData.constructId] - Construct/facility ID (optional)
   * @param {string} requestData.message - Inquiry message
   * @param {number} requestData.offerPrice - Offer price
   * @returns {Promise<Object>} Created request
   */
  createPostRequest: async (requestData) => {
    const response = await api.post(API_ENDPOINTS.POST_REQUEST.BASE, requestData);
    return response.data;
  },

  /**
   * Get post request by ID
   * @param {number} id - Request ID
   * @returns {Promise<Object>} Request details
   */
  getPostRequestById: async (id) => {
    const response = await api.get(API_ENDPOINTS.POST_REQUEST.BY_ID(id));
    return response.data;
  },

  /**
   * Update post request
   * @param {number} id - Request ID
   * @param {Object} requestData - Updated request data
   * @returns {Promise<Object>} Updated request
   */
  updatePostRequest: async (id, requestData) => {
    const response = await api.put(API_ENDPOINTS.POST_REQUEST.BY_ID(id), requestData);
    return response.data;
  },

  /**
   * Delete post request
   * @param {number} id - Request ID
   * @returns {Promise<Object>} Delete response
   */
  deletePostRequest: async (id) => {
    const response = await api.delete(API_ENDPOINTS.POST_REQUEST.BY_ID(id));
    return response.data;
  },

  // ==========================================================================
  // POST REQUEST QUERIES
  // ==========================================================================

  /**
   * Get all requests for a specific post
   * @param {number} postId - Post ID
   * @returns {Promise<Array>} Post requests
   */
  getRequestsByPost: async (postId) => {
    const response = await api.get(API_ENDPOINTS.POST_REQUEST.BY_POST(postId));
    return response.data;
  },

  /**
   * Get all requests made by a buyer
   * @param {number} buyerId - Buyer member ID
   * @returns {Promise<Array>} Buyer's requests
   */
  getRequestsByBuyer: async (buyerId) => {
    const response = await api.get(API_ENDPOINTS.POST_REQUEST.BY_BUYER(buyerId));
    return response.data;
  },

  /**
   * Get requests by status
   * @param {string} status - Request status (Pending/Accepted/Rejected/Cancelled/Completed)
   * @returns {Promise<Array>} Filtered requests
   */
  getRequestsByStatus: async (status) => {
    const response = await api.get(API_ENDPOINTS.POST_REQUEST.BY_STATUS(status));
    return response.data;
  },

  /**
   * Get negotiation history for a post
   * @param {number} postId - Post ID
   * @returns {Promise<Array>} Negotiation history
   */
  getNegotiationsByPost: async (postId) => {
    const response = await api.get(API_ENDPOINTS.POST_REQUEST.NEGOTIATIONS(postId));
    return response.data;
  },

  /**
   * Get request statistics (admin/staff only)
   * @returns {Promise<Object>} Request statistics
   */
  getRequestStatistics: async () => {
    const response = await api.get(API_ENDPOINTS.POST_REQUEST.STATISTICS);
    return response.data;
  },

  // ==========================================================================
  // REQUEST STATUS OPERATIONS
  // ==========================================================================

  /**
   * Update request status
   * @param {number} id - Request ID
   * @param {Object} statusData - Status data
   * @param {string} statusData.status - New status
   * @returns {Promise<Object>} Updated request
   */
  updateRequestStatus: async (id, statusData) => {
    const response = await api.put(API_ENDPOINTS.POST_REQUEST.UPDATE_STATUS(id), statusData);
    return response.data;
  },

  /**
   * Accept a post request (seller action)
   * @param {number} id - Request ID
   * @returns {Promise<Object>} Updated request
   */
  acceptRequest: async (id) => {
    const response = await api.put(API_ENDPOINTS.POST_REQUEST.ACCEPT(id));
    return response.data;
  },

  /**
   * Reject a post request (seller action)
   * @param {number} id - Request ID
   * @returns {Promise<Object>} Updated request
   */
  rejectRequest: async (id) => {
    const response = await api.put(API_ENDPOINTS.POST_REQUEST.REJECT(id));
    return response.data;
  },
};

export default postRequestService;
