import axiosInstance from '../axios.config'

/**
 * Admin User Service
 * Xử lý tất cả API calls liên quan đến quản lý người dùng (UC47)
 */
class AdminUserService {
  /**
   * UC47.1: Lấy danh sách người dùng với phân trang và lọc (Chỉ ADMIN)
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.keyword - Từ khóa tìm kiếm (email, phone, fullName)
   * @param {string} params.role - Lọc theo role (MEMBER, STAFF, ADMIN)
   * @param {string} params.status - Lọc theo status (ACTIVE, BANNED, SUSPENDED, PENDING_VERIFICATION)
   * @returns {Promise<Object>} PagedResponse<UserResponse>
   */
  async getUsers(params = {}) {
    const response = await axiosInstance.get('/users', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        keyword: params.keyword,
        role: params.role,
        status: params.status
      }
    })
    return response.data
  }

  /**
   * UC47.4: Lấy chi tiết thông tin người dùng
   * @param {string} userId - UUID của người dùng
   * @returns {Promise<Object>} BaseResponse<UserResponse>
   */
  async getUserById(userId) {
    const response = await axiosInstance.get(`/users/${userId}`)
    return response.data
  }

  /**
   * UC47.2 & UC47.3: Cập nhật thông tin người dùng (vô hiệu hóa/kích hoạt, thay đổi role) - Chỉ ADMIN
   * @param {string} userId - UUID của người dùng
   * @param {Object} data - UserUpdateRequest
   * @param {string} data.role - Role mới (MEMBER, STAFF, ADMIN)
   * @param {string} data.status - Status mới (ACTIVE, BANNED, SUSPENDED, PENDING_VERIFICATION)
   * @returns {Promise<Object>} BaseResponse<UserResponse>
   */
  async updateUser(userId, data) {
    const response = await axiosInstance.put(`/users/${userId}`, data)
    return response.data
  }

  /**
   * UC47.5: Lấy lịch sử hoạt động của người dùng - Chỉ ADMIN
   * @param {string} userId - UUID của người dùng
   * @returns {Promise<Object>} BaseResponse<List<UserActivityResponse>>
   */
  async getUserActivity(userId) {
    const response = await axiosInstance.get(`/users/${userId}/activity`)
    return response.data
  }
}

export default new AdminUserService()

