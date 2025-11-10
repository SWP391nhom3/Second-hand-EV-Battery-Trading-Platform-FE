import axiosInstance from '../axios.config'

/**
 * User Service
 * Xử lý tất cả API calls liên quan đến User Management (UC04, UC47)
 */
class UserService {
  /**
   * UC04: Lấy thông tin user hiện tại
   * @returns {Promise<BaseResponse<UserResponse>>}
   */
  async getCurrentUser() {
    const response = await axiosInstance.get('/users/me')
    return response.data
  }

  /**
   * UC04: Cập nhật thông tin profile của user hiện tại
   * @param {Object} data - UpdateProfileRequest { fullName?, address?, avatarUrl?, idNumber? }
   * @returns {Promise<BaseResponse<UserResponse>>}
   */
  async updateProfile(data) {
    const response = await axiosInstance.put('/users/me', data)
    return response.data
  }

  /**
   * UC04: Upload avatar
   * @param {File} file - File ảnh đại diện
   * @returns {Promise<BaseResponse<{ avatarUrl: string }>>}
   */
  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosInstance.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  /**
   * UC47: Lấy thông tin user theo ID (Admin/Staff only)
   * @param {string} userId - User ID
   * @returns {Promise<BaseResponse<UserResponse>>}
   */
  async getUserById(userId) {
    const response = await axiosInstance.get(`/users/${userId}`)
    return response.data
  }
}

export default new UserService()


