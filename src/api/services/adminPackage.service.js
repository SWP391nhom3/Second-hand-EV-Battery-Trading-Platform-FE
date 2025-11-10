import axiosInstance from '../axios.config'

/**
 * Admin Package Service
 * Xử lý tất cả API calls liên quan đến quản lý gói tin dành cho Admin
 * UC48: Quản lý Gói tin
 */
class AdminPackageService {
  /**
   * UC48: Lấy danh sách gói tin với phân trang (Admin)
   * GET /api/packages/admin
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.keyword - Từ khóa tìm kiếm (tên gói tin)
   * @param {boolean} params.isActive - Lọc theo trạng thái kích hoạt (null = tất cả)
   * @returns {Promise<Object>} PagedResponse<PackageDetailResponse>
   */
  async getPackages(params = {}) {
    try {
      const response = await axiosInstance.get('/packages/admin', {
        params: {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          keyword: params.keyword,
          isActive: params.isActive
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching packages:', error)
      throw error
    }
  }

  /**
   * UC48: Lấy chi tiết gói tin theo ID (Admin)
   * GET /api/packages/admin/{id}
   * @param {number} id - ID gói tin
   * @returns {Promise<Object>} BaseResponse<PackageDetailResponse>
   */
  async getPackageById(id) {
    try {
      const response = await axiosInstance.get(`/packages/admin/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching package detail:', error)
      throw error
    }
  }

  /**
   * UC48: Tạo gói tin mới (Admin)
   * POST /api/packages/admin
   * @param {Object} data - PackageCreateRequest
   * @param {string} data.name - Tên gói tin
   * @param {number} data.price - Giá gói tin (VND)
   * @param {number} data.creditsCount - Số lượng credits
   * @param {number} data.priorityLevel - Mức độ ưu tiên (1-10)
   * @param {number} data.maxImages - Số ảnh tối đa
   * @param {boolean} data.isActive - Trạng thái kích hoạt
   * @returns {Promise<Object>} BaseResponse<PackageDetailResponse>
   */
  async createPackage(data) {
    try {
      const response = await axiosInstance.post('/packages/admin', data)
      return response.data
    } catch (error) {
      console.error('Error creating package:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * UC48: Cập nhật gói tin (Admin)
   * PUT /api/packages/admin/{id}
   * @param {number} id - ID gói tin
   * @param {Object} data - PackageUpdateRequest
   * @param {string} data.name - Tên gói tin
   * @param {number} data.price - Giá gói tin (VND)
   * @param {number} data.creditsCount - Số lượng credits
   * @param {number} data.priorityLevel - Mức độ ưu tiên (1-10)
   * @param {number} data.maxImages - Số ảnh tối đa
   * @param {boolean} data.isActive - Trạng thái kích hoạt
   * @returns {Promise<Object>} BaseResponse<PackageDetailResponse>
   */
  async updatePackage(id, data) {
    try {
      const response = await axiosInstance.put(`/packages/admin/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating package:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * UC48: Kích hoạt/vô hiệu hóa gói tin (Admin)
   * PATCH /api/packages/admin/{id}/toggle-status
   * @param {number} id - ID gói tin
   * @returns {Promise<Object>} BaseResponse
   */
  async togglePackageStatus(id) {
    try {
      const response = await axiosInstance.patch(`/packages/admin/${id}/toggle-status`)
      return response.data
    } catch (error) {
      console.error('Error toggling package status:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }
}

export default new AdminPackageService()

