import api from "../configs/axios";
import { API_ENDPOINTS } from "../constants/apiConstants";

/**
 * Member Service
 * Handles all member-related API calls
 * @module memberService
 */
const memberService = {
  // ==========================================================================
  // BASIC CRUD OPERATIONS
  // ==========================================================================

  /**
   * Get all members
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.pageSize] - Items per page
   * @param {string} [params.status] - Filter by status
   * @returns {Promise<Array>} Members list
   */
  getMembers: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.MEMBER.BASE, { params });
    return response.data;
  },

  /**
   * Create new member
   * Note: Usually members are created through registration
   * @param {Object} memberData - Member data
   * @param {number} memberData.accountId - Account ID
   * @param {string} memberData.fullName - Full name
   * @param {string} [memberData.avatarUrl] - Avatar URL
   * @param {string} [memberData.address] - Address
   * @returns {Promise<Object>} Created member
   */
  createMember: async (memberData) => {
    const response = await api.post(API_ENDPOINTS.MEMBER.BASE, memberData);
    return response.data;
  },

  /**
   * Get member by ID
   * @param {number} id - Member ID
   * @returns {Promise<Object>} Member details with related data
   */
  getMemberById: async (id) => {
    const response = await api.get(API_ENDPOINTS.MEMBER.BY_ID(id));
    return response.data;
  },

  /**
   * Update member profile
   * @param {number} id - Member ID
   * @param {Object} memberData - Updated member data
   * @param {string} [memberData.fullName] - Full name
   * @param {string} [memberData.avatarUrl] - Avatar URL
   * @param {string} [memberData.address] - Address
   * @param {string} [memberData.status] - Member status
   * @returns {Promise<Object>} Updated member
   */
  updateMember: async (id, memberData) => {
    const response = await api.put(API_ENDPOINTS.MEMBER.BY_ID(id), memberData);
    return response.data;
  },

  /**
   * Delete member (admin only)
   * @param {number} id - Member ID
   * @returns {Promise<Object>} Delete response
   */
  deleteMember: async (id) => {
    const response = await api.delete(API_ENDPOINTS.MEMBER.BY_ID(id));
    return response.data;
  },

  // ==========================================================================
  // MEMBER QUERIES
  // ==========================================================================

  /**
   * Get top-rated members
   * @param {number} [limit=10] - Number of top members to return
   * @returns {Promise<Array>} Top-rated members
   */
  getTopRatedMembers: async (limit = 10) => {
    const response = await api.get(API_ENDPOINTS.MEMBER.TOP_RATED, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get current member's profile
   * Requires authentication
   * @returns {Promise<Object>} Current member profile
   */
  getCurrentMemberProfile: async () => {
    // This would need the current user's member ID from auth
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.memberId) {
      return memberService.getMemberById(user.memberId);
    }
    throw new Error("No authenticated member found");
  },

  /**
   * Update current member's profile
   * @param {Object} memberData - Updated profile data
   * @returns {Promise<Object>} Updated member
   */
  updateCurrentMemberProfile: async (memberData) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.memberId) {
      return memberService.updateMember(user.memberId, memberData);
    }
    throw new Error("No authenticated member found");
  },
};

export default memberService;
