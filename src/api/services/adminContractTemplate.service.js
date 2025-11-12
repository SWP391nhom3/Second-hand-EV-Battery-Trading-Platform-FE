import axiosInstance from '../axios.config'

/**
 * Admin Contract Template Service
 * Xử lý tất cả API calls liên quan đến quản lý mẫu hợp đồng dành cho Admin
 * UC49: Quản lý Mẫu Hợp đồng
 */
class AdminContractTemplateService {
  /**
   * UC49: Lấy danh sách mẫu hợp đồng với phân trang (Admin)
   * GET /api/admin/contracts/templates hoặc GET /api/contracts/templates
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.keyword - Từ khóa tìm kiếm (tên mẫu hợp đồng)
   * @param {number} params.categoryId - ID danh mục (optional)
   * @param {boolean} params.isActive - Lọc theo trạng thái kích hoạt (null = tất cả)
   * @returns {Promise<Object>} PagedResponse<ContractTemplateResponse> hoặc BaseResponse<List<ContractTemplateResponse>>
   */
  async getContractTemplates(params = {}) {
    try {
      // Thử endpoint admin trước, nếu không có thì dùng endpoint hiện có
      let response
      try {
        response = await axiosInstance.get('/admin/contracts/templates', {
          params: {
            pageNumber: params.pageNumber || 1,
            pageSize: params.pageSize || 10,
            keyword: params.keyword,
            categoryId: params.categoryId,
            isActive: params.isActive
          }
        })
        
        // Response từ BE có cấu trúc: { success, data: { pageNumber, pageSize, totalCount, data: [...] } }
        // Giữ nguyên structure để component xử lý
        return response.data
      } catch (error) {
        // Fallback to existing endpoint if admin endpoint doesn't exist
        if (error.response?.status === 404) {
          response = await axiosInstance.get('/contracts/templates', {
            params: {
              categoryId: params.categoryId
            }
          })
          // Transform response to match expected format
          if (response.data && response.data.success && Array.isArray(response.data.data)) {
            // Apply client-side filtering and pagination if needed
            let templates = response.data.data
            if (params.keyword) {
              templates = templates.filter(t => 
                t.templateName?.toLowerCase().includes(params.keyword.toLowerCase())
              )
            }
            if (params.isActive !== null && params.isActive !== undefined) {
              templates = templates.filter(t => t.isActive === params.isActive)
            }
            // Simple pagination
            const pageNumber = params.pageNumber || 1
            const pageSize = params.pageSize || 10
            const start = (pageNumber - 1) * pageSize
            const end = start + pageSize
            const paginatedTemplates = templates.slice(start, end)
            
            // Transform to match new nested structure
            return {
              success: response.data.success,
              message: response.data.message || 'Lấy danh sách mẫu hợp đồng thành công',
              data: {
                pageNumber,
                pageSize,
                totalCount: templates.length,
                totalPages: Math.ceil(templates.length / pageSize),
                data: paginatedTemplates
              }
            }
          }
          return response.data
        } else {
          throw error
        }
      }
    } catch (error) {
      console.error('Error fetching contract templates:', error)
      throw error
    }
  }

  /**
   * UC49: Lấy chi tiết mẫu hợp đồng theo ID (Admin)
   * GET /api/admin/contracts/templates/{id}
   * @param {number} id - ID mẫu hợp đồng
   * @returns {Promise<Object>} BaseResponse<ContractTemplateResponse>
   */
  async getContractTemplateById(id) {
    try {
      let response
      try {
        response = await axiosInstance.get(`/admin/contracts/templates/${id}`)
      } catch (error) {
        // Fallback: get from list and find by id
        if (error.response?.status === 404) {
          const listResponse = await this.getContractTemplates({ pageSize: 1000 })
          if (listResponse && listResponse.success && Array.isArray(listResponse.data)) {
            const template = listResponse.data.find(t => t.templateId === id)
            if (template) {
              return {
                success: true,
                data: template,
                message: 'Lấy chi tiết mẫu hợp đồng thành công'
              }
            }
          }
          return {
            success: false,
            message: 'Không tìm thấy mẫu hợp đồng'
          }
        }
        throw error
      }
      return response.data
    } catch (error) {
      console.error('Error fetching contract template detail:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * UC49: Tạo mẫu hợp đồng mới (Admin)
   * POST /api/admin/contracts/templates
   * @param {Object} data - ContractTemplateCreateRequest
   * @param {string} data.templateName - Tên mẫu hợp đồng
   * @param {string} data.templateContent - Nội dung mẫu hợp đồng
   * @param {number} data.categoryId - ID danh mục (optional)
   * @param {boolean} data.isActive - Trạng thái kích hoạt
   * @returns {Promise<Object>} BaseResponse<ContractTemplateResponse>
   */
  async createContractTemplate(data) {
    try {
      const response = await axiosInstance.post('/admin/contracts/templates', data)
      return response.data
    } catch (error) {
      console.error('Error creating contract template:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * UC49: Cập nhật mẫu hợp đồng (Admin)
   * PUT /api/admin/contracts/templates/{id}
   * @param {number} id - ID mẫu hợp đồng
   * @param {Object} data - ContractTemplateUpdateRequest
   * @param {string} data.templateName - Tên mẫu hợp đồng
   * @param {string} data.templateContent - Nội dung mẫu hợp đồng
   * @param {number} data.categoryId - ID danh mục (optional)
   * @param {boolean} data.isActive - Trạng thái kích hoạt
   * @returns {Promise<Object>} BaseResponse<ContractTemplateResponse>
   */
  async updateContractTemplate(id, data) {
    try {
      const response = await axiosInstance.put(`/admin/contracts/templates/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating contract template:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * UC49: Xóa mẫu hợp đồng (Admin)
   * DELETE /api/admin/contracts/templates/{id}
   * @param {number} id - ID mẫu hợp đồng
   * @returns {Promise<Object>} BaseResponse
   */
  async deleteContractTemplate(id) {
    try {
      const response = await axiosInstance.delete(`/admin/contracts/templates/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting contract template:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * UC49: Kích hoạt/vô hiệu hóa mẫu hợp đồng (Admin)
   * PATCH /api/admin/contracts/templates/{id}/toggle-status
   * @param {number} id - ID mẫu hợp đồng
   * @returns {Promise<Object>} BaseResponse
   */
  async toggleContractTemplateStatus(id) {
    try {
      const response = await axiosInstance.patch(`/admin/contracts/templates/${id}/toggle-status`)
      return response.data
    } catch (error) {
      console.error('Error toggling contract template status:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }
}

export default new AdminContractTemplateService()

