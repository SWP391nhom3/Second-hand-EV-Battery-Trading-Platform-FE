import api from "../configs/axios";
import { API_ENDPOINTS } from "../constants/apiConstants";

/**
 * Post Service
 * Handles all post-related API calls
 * @module postService
 */
const postService = {
  // ==========================================================================
  // BASIC CRUD OPERATIONS
  // ==========================================================================

  /**
   * Get all posts with optional filters
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.pageSize] - Items per page
   * @param {string} [params.status] - Post status filter
   * @param {string} [params.postType] - Post type filter (Battery/Vehicle/Both)
   * @param {string} [params.transactionType] - Transaction type (DIRECT/STAFF_ASSISTED)
   * @returns {Promise<Object>} Posts list
   */
  getPosts: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.POST.BASE, { params });
    return response.data;
  },

  /**
   * Create new post
   * @param {Object} postData - Post data
   * @param {number} postData.memberId - Member ID who creates the post
   * @param {string} postData.title - Post title
   * @param {string} postData.description - Post description
   * @param {number} postData.price - Post price
   * @param {string} postData.postType - Post type (Battery/Vehicle/Both)
   * @param {number} [postData.vehicleId] - Vehicle ID (if selling vehicle)
   * @param {number} [postData.batteryId] - Battery ID (if selling battery)
   * @param {Object} [postData.vehicle] - Vehicle data (if creating new vehicle)
   * @param {Object} [postData.battery] - Battery data (if creating new battery)
   * @returns {Promise<Object>} Created post
   */
  createPost: async (postData) => {
    const response = await api.post(API_ENDPOINTS.POST.BASE, postData);
    return response.data;
  },

  /**
   * Get post by ID
   * @param {number} id - Post ID
   * @returns {Promise<Object>} Post details
   */
  getPostById: async (id) => {
    const response = await api.get(API_ENDPOINTS.POST.BY_ID(id));
    return response.data;
  },

  /**
   * Update post
   * @param {number} id - Post ID
   * @param {Object} postData - Updated post data
   * @returns {Promise<Object>} Updated post
   */
  updatePost: async (id, postData) => {
    const response = await api.put(API_ENDPOINTS.POST.BY_ID(id), postData);
    return response.data;
  },

  /**
   * Delete post
   * @param {number} id - Post ID
   * @returns {Promise<Object>} Delete response
   */
  deletePost: async (id) => {
    const response = await api.delete(API_ENDPOINTS.POST.BY_ID(id));
    return response.data;
  },

  // ==========================================================================
  // POST QUERIES
  // ==========================================================================

  /**
   * Get all posts by a specific member
   * @param {number} memberId - Member ID
   * @returns {Promise<Array>} Member's posts
   */
  getPostsByMember: async (memberId) => {
    const response = await api.get(API_ENDPOINTS.POST.BY_MEMBER(memberId));
    return response.data;
  },

  /**
   * Get featured posts (premium/highlighted posts)
   * @returns {Promise<Array>} Featured posts
   */
  getFeaturedPosts: async () => {
    const response = await api.get(API_ENDPOINTS.POST.FEATURED);
    return response.data;
  },

  /**
   * Get direct transaction posts (seller handles transaction directly)
   * @returns {Promise<Array>} Direct posts
   */
  getDirectPosts: async () => {
    const response = await api.get(API_ENDPOINTS.POST.DIRECT);
    return response.data;
  },

  /**
   * Get staff-assisted transaction posts (staff helps with transaction)
   * @returns {Promise<Array>} Staff-assisted posts
   */
  getStaffAssistedPosts: async () => {
    const response = await api.get(API_ENDPOINTS.POST.STAFF_ASSISTED);
    return response.data;
  },

  /**
   * Get checkout URL for a post (for package purchase)
   * @param {number} postId - Post ID
   * @returns {Promise<Object>} Checkout URL response
   */
  getCheckoutUrl: async (postId) => {
    const response = await api.get(API_ENDPOINTS.POST.CHECKOUT_URL(postId));
    return response.data;
  },

  // ==========================================================================
  // STAFF OPERATIONS
  // ==========================================================================

  /**
   * Assign staff to a post (for staff-assisted transactions)
   * @param {number} postId - Post ID
   * @param {number} staffId - Staff member ID
   * @returns {Promise<Object>} Updated post
   */
  assignStaff: async (postId, staffId) => {
    const response = await api.put(API_ENDPOINTS.POST.ASSIGN_STAFF(postId, staffId));
    return response.data;
  },

  // ==========================================================================
  // ADMIN OPERATIONS
  // ==========================================================================

  /**
   * Get all posts for admin with optional status filter
   * @param {Object} params - Query parameters
   * @param {string} [params.status] - Filter by status (PENDING/APPROVED/REJECTED/etc)
   * @returns {Promise<Array>} All posts
   */
  getAdminAllPosts: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.POST.ADMIN_ALL, { params });
    return response.data;
  },

  /**
   * Get pending posts awaiting admin approval
   * @returns {Promise<Array>} Pending posts
   */
  getAdminPendingPosts: async () => {
    const response = await api.get(API_ENDPOINTS.POST.ADMIN_PENDING);
    return response.data;
  },

  /**
   * Approve a post (admin only)
   * @param {number} id - Post ID
   * @param {number} [packageId] - Optional package ID to assign
   * @returns {Promise<Object>} Approved post
   */
  approvePost: async (id, packageId = null) => {
    const body = packageId ? { packageId } : {};
    const response = await api.patch(API_ENDPOINTS.POST.ADMIN_APPROVE(id), body);
    return response.data;
  },

  /**
   * Reject a post (admin only)
   * @param {number} id - Post ID
   * @param {string} [reason] - Rejection reason
   * @returns {Promise<Object>} Rejected post
   */
  rejectPost: async (id, reason = null) => {
    const body = reason ? { reason } : {};
    const response = await api.patch(API_ENDPOINTS.POST.ADMIN_REJECT(id), body);
    return response.data;
  },
};

export default postService;
