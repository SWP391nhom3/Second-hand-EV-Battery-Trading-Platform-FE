import axiosInstance from '../axios.config'

/**
 * Admin Post Service
 * Xử lý tất cả API calls liên quan đến quản lý bài đăng dành cho Admin
 * UC11, UC12: Quản lý Bài đăng
 */
class AdminPostService {
  /**
   * Lấy danh sách bài đăng chờ duyệt (có phân trang)
   * GET /api/admin/posts/pending
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.keyword - Từ khóa tìm kiếm
   * @param {number} params.categoryId - ID danh mục
   * @param {string} params.brand - Thương hiệu
   * @param {string} params.sortBy - Sắp xếp theo (createdAt, price, title)
   * @param {string} params.sortDirection - Chiều sắp xếp (asc, desc)
   * @returns {Promise<Object>} PagedResponse<PendingPostResponse>
   */
  async getPendingPosts(params = {}) {
    try {
      const response = await axiosInstance.get('/admin/posts/pending', {
        params: {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          keyword: params.keyword,
          categoryId: params.categoryId,
          brand: params.brand,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection || 'desc'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching pending posts:', error)
      throw error
    }
  }

  /**
   * Lấy chi tiết bài đăng (bao gồm thông tin Staff và Subscription)
   * GET /api/admin/posts/{id}
   * @param {string} postId - UUID của bài đăng
   * @returns {Promise<Object>} BaseResponse<PostDetailResponse>
   */
  async getPostById(postId) {
    try {
      const response = await axiosInstance.get(`/admin/posts/${postId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching post detail:', error)
      throw error
    }
  }

  /**
   * Duyệt bài đăng
   * UC11: Duyệt Bài đăng
   * POST /api/admin/posts/{id}/approve
   * @param {string} postId - UUID của bài đăng
   * @returns {Promise<Object>} BaseResponse<PostDetailResponse>
   */
  async approvePost(postId) {
    try {
      // PostApproveRequest không cần field nào, chỉ cần empty object
      const response = await axiosInstance.post(`/admin/posts/${postId}/approve`, {})
      return response.data
    } catch (error) {
      console.error('Error approving post:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * Từ chối bài đăng
   * UC12: Từ chối Bài đăng
   * POST /api/admin/posts/{id}/reject
   * @param {string} postId - UUID của bài đăng
   * @param {string} rejectionReason - Lý do từ chối
   * @returns {Promise<Object>} BaseResponse
   */
  async rejectPost(postId, rejectionReason) {
    try {
      const response = await axiosInstance.post(`/admin/posts/${postId}/reject`, {
        rejectionReason
      })
      return response.data
    } catch (error) {
      console.error('Error rejecting post:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * Lấy danh sách bài đăng đã duyệt hoặc từ chối (có phân trang)
   * GET /api/admin/posts/approved-rejected
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.status - Trạng thái (APPROVED, DENIED). Nếu null thì lấy cả hai
   * @param {string} params.keyword - Từ khóa tìm kiếm
   * @param {number} params.categoryId - ID danh mục
   * @param {string} params.brand - Thương hiệu
   * @param {string} params.sortBy - Sắp xếp theo (createdAt, approvedAt, rejectedAt, price, title)
   * @param {string} params.sortDirection - Chiều sắp xếp (asc, desc)
   * @returns {Promise<Object>} PagedResponse<ApprovedRejectedPostResponse>
   */
  async getApprovedRejectedPosts(params = {}) {
    try {
      const response = await axiosInstance.get('/admin/posts/approved-rejected', {
        params: {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          status: params.status,
          keyword: params.keyword,
          categoryId: params.categoryId,
          brand: params.brand,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection || 'desc'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching approved/rejected posts:', error)
      throw error
    }
  }
}

export default new AdminPostService()

