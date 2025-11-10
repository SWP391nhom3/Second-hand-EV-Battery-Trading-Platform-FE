import apiClient from '../axios.config';

/**
 * Admin Service - Quản lý các API dành cho Admin
 */
const adminService = {
  // ==================== POST MANAGEMENT ====================

  /**
   * UC11, UC12: Lấy danh sách tất cả bài đăng (pending lên đầu)
   * GET /api/admin/posts/pending - Pending posts
   * GET /api/admin/posts/approved-rejected - Approved/Rejected posts
   */
  getAllPosts: async (params = {}) => {
    try {
      // Lấy cả pending và approved/rejected posts
      const [pendingRes, approvedRejectedRes] = await Promise.all([
        apiClient.get('/admin/posts/pending', { params: { ...params, pageSize: 100 } }),
        apiClient.get('/admin/posts/approved-rejected', { params: { ...params, pageSize: 100 } })
      ]);

      console.log('Pending Full Response:', JSON.stringify(pendingRes.data, null, 2));
      console.log('Approved/Rejected Full Response:', JSON.stringify(approvedRejectedRes.data, null, 2));

      // Response structure từ BE: { success, data: [...], pageNumber, totalCount, ... }
      // Data nằm trong field "data" (lowercase từ JSON serialization)
      const pendingPosts = pendingRes.data?.data || [];
      const approvedRejectedPosts = approvedRejectedRes.data?.data || [];

      console.log('Pending Posts extracted:', pendingPosts);
      console.log('Approved/Rejected Posts extracted:', approvedRejectedPosts);

      // Map pending posts với status PENDING
      const mappedPending = Array.isArray(pendingPosts) ? pendingPosts.map(post => ({
        ...post,
        status: 'PENDING',
        hasProofImage: post.hasProofImage
      })) : [];

      // Map approved/rejected posts
      const mappedApprovedRejected = Array.isArray(approvedRejectedPosts) ? approvedRejectedPosts : [];

      // Kết hợp: pending trước, sau đó approved/rejected
      const allPosts = [...mappedPending, ...mappedApprovedRejected];

      console.log('All Posts Combined:', allPosts);

      return {
        success: true,
        data: {
          items: allPosts,
          totalItems: (pendingRes.data?.totalCount || 0) + (approvedRejectedRes.data?.totalCount || 0),
          pendingCount: pendingRes.data?.totalCount || 0,
          approvedCount: mappedApprovedRejected.filter(p => p.status === 'APPROVED').length,
          rejectedCount: mappedApprovedRejected.filter(p => p.status === 'DENIED').length
        }
      };
    } catch (error) {
      console.error('Error fetching all posts:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách bài đăng'
      };
    }
  },

  /**
   * Lấy danh sách bài đăng chờ duyệt
   * GET /api/admin/posts/pending
   */
  getPendingPosts: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/posts/pending', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending posts:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách bài đăng đã duyệt/từ chối
   * GET /api/admin/posts/approved-rejected
   */
  getApprovedRejectedPosts: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/posts/approved-rejected', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching approved/rejected posts:', error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết bài đăng
   * GET /api/admin/posts/{id}
   */
  getPostDetail: async (postId) => {
    try {
      const response = await apiClient.get(`/admin/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post detail:', error);
      throw error;
    }
  },

  /**
   * UC11: Duyệt bài đăng và gán Staff
   * POST /api/admin/posts/{id}/approve
   * @param {string} postId - ID bài đăng
   * @param {string} staffId - ID Staff được gán
   */
  approvePost: async (postId, staffId) => {
    try {
      const response = await apiClient.post(`/admin/posts/${postId}/approve`, {
        staffId
      });
      return response.data;
    } catch (error) {
      console.error('Error approving post:', error);
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  /**
   * UC12: Từ chối bài đăng
   * POST /api/admin/posts/{id}/reject
   * @param {string} postId - ID bài đăng
   * @param {string} rejectionReason - Lý do từ chối
   */
  rejectPost: async (postId, rejectionReason) => {
    try {
      const response = await apiClient.post(`/admin/posts/${postId}/reject`, {
        rejectionReason
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting post:', error);
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // ==================== USER MANAGEMENT ====================

  /**
   * Lấy danh sách tất cả người dùng
   * GET /api/users
   */
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách Staff (users có role = STAFF)
   */
  getStaffList: async () => {
    try {
      const response = await apiClient.get('/users');
      const allUsers = response.data?.data || [];
      
      // Filter chỉ lấy STAFF và status ACTIVE
      const staffList = allUsers.filter(user => 
        user.role === 'STAFF' && user.status === 'ACTIVE'
      );

      return {
        success: true,
        data: staffList
      };
    } catch (error) {
      console.error('Error fetching staff list:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách Staff',
        data: []
      };
    }
  },

  /**
   * Lấy thông tin người dùng theo ID
   * GET /api/users/{id}
   */
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // ==================== LEAD MANAGEMENT ====================

  /**
   * UC46: Lấy danh sách tất cả Lead (Admin only)
   * GET /api/leads/all
   * @param {Object} params - Query parameters (pageNumber, pageSize, status, leadType, postId, buyerId, staffId, etc.)
   */
  getLeads: async (params = {}) => {
    try {
      const response = await apiClient.get('/leads/all', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  /**
   * Lấy chi tiết Lead
   * GET /api/leads/{id}
   * ✅ Endpoint này đã có sẵn, ADMIN có thể sử dụng
   */
  getLeadById: async (leadId) => {
    try {
      const response = await apiClient.get(`/leads/${leadId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead detail:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  /**
   * UC46: Gán Staff cho Lead
   * POST /api/leads/{id}/assign-staff
   * @param {string} leadId - ID Lead
   * @param {string} staffId - ID Staff được gán
   */
  assignStaffToLead: async (leadId, staffId) => {
    try {
      const response = await apiClient.post(`/leads/${leadId}/assign-staff`, {
        staffId
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning staff to lead:', error);
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
};

export default adminService;
