import axiosInstance from '../axios.config'

/**
 * Staff Post Service
 * Xử lý tất cả API calls liên quan đến quản lý Bài đăng cho Staff (UC45)
 * 
 * ⚠️ LƯU Ý: Các endpoint này CHƯA CÓ trong backend hiện tại.
 * Cần tạo các endpoint này trong backend trước khi sử dụng.
 * 
 * Đề xuất endpoints:
 * - GET /api/staff/posts - Lấy danh sách bài đăng được gán
 * - GET /api/staff/posts/{id} - Lấy chi tiết bài đăng
 * - GET /api/staff/posts/{id}/leads - Lấy danh sách Leads của bài đăng
 */
class StaffPostService {
  /**
   * UC45: Lấy danh sách bài đăng được gán cho Staff hiện tại
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.keyword - Tìm kiếm theo title, description
   * @param {string} params.status - Lọc theo status (APPROVED, SOLD)
   * @param {number} params.categoryId - Lọc theo categoryId (1: Xe điện, 2: Pin)
   * @param {string} params.sortBy - Sắp xếp theo (createdAt, price, title)
   * @param {string} params.sortDirection - Chiều sắp xếp (asc, desc)
   * @param {string} params.startDate - Lọc theo ngày tạo (từ) - DateTime ISO string
   * @param {string} params.endDate - Lọc theo ngày tạo (đến) - DateTime ISO string
   * @returns {Promise<Object>} PagedResponse<PostResponse>
   */
  async getAssignedPosts(params = {}) {
    const response = await axiosInstance.get('/staff/posts', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        keyword: params.keyword,
        status: params.status,
        categoryId: params.categoryId,
        sortBy: params.sortBy || 'createdAt',
        sortDirection: params.sortDirection || 'desc',
        startDate: params.startDate,
        endDate: params.endDate
      }
    })
    return response.data
  }

  /**
   * Lấy chi tiết bài đăng được gán cho Staff hiện tại
   * @param {string} postId - UUID của bài đăng
   * @returns {Promise<Object>} BaseResponse<PostDetailResponse>
   */
  async getPostById(postId) {
    const response = await axiosInstance.get(`/staff/posts/${postId}`)
    return response.data
  }

  /**
   * Lấy danh sách Leads đang quan tâm bài đăng
   * @param {string} postId - UUID của bài đăng
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.status - Lọc theo status (NEW, ASSIGNED, CONTACTED, SCHEDULED, SUCCESSFUL, FAILED)
   * @param {string} params.leadType - Lọc theo leadType (SCHEDULE_VIEW, AUCTION_WINNER)
   * @returns {Promise<Object>} BaseResponse<PagedResponse<LeadResponse>>
   */
  async getPostLeads(postId, params = {}) {
    const response = await axiosInstance.get(`/staff/posts/${postId}/leads`, {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        status: params.status,
        leadType: params.leadType
      }
    })
    return response.data
  }
}

export default new StaffPostService()


