import axiosInstance from '../axios.config'

/**
 * Staff Contract Service
 * Xử lý tất cả API calls liên quan đến quản lý Hợp đồng cho Staff (UC43)
 */
class StaffContractService {
  /**
   * UC43: Lấy danh sách mẫu hợp đồng
   * GET /api/contracts/templates
   * @param {Object} params - Query parameters
   * @param {number} params.categoryId - ID danh mục (optional)
   * @returns {Promise<Object>} BaseResponse<List<ContractTemplateResponse>>
   */
  async getContractTemplates(params = {}) {
    try {
      const response = await axiosInstance.get('/contracts/templates', {
        params: {
          categoryId: params.categoryId
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching contract templates:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * UC43: Lấy chi tiết mẫu hợp đồng
   * GET /api/contracts/templates/{id} (nếu có) hoặc từ danh sách
   * @param {number} templateId - ID mẫu hợp đồng
   * @returns {Promise<Object>} BaseResponse<ContractTemplateResponse>
   */
  async getContractTemplateById(templateId) {
    try {
      // Lấy từ danh sách vì không có endpoint chi tiết
      const listResponse = await this.getContractTemplates()
      if (listResponse && listResponse.success && Array.isArray(listResponse.data)) {
        const template = listResponse.data.find(t => t.templateId === templateId)
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
    } catch (error) {
      console.error('Error fetching contract template detail:', error)
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * UC43: Staff tạo hợp đồng từ mẫu
   * POST /api/contracts
   * @param {Object} data - ContractCreateRequest
   * @param {string} data.leadId - ID Lead (UUID, optional)
   * @param {string} data.orderId - ID Order (UUID, optional)
   * @param {number} data.contractTemplateId - ID mẫu hợp đồng (required)
   * @param {string} data.contractContent - Nội dung hợp đồng đã chỉnh sửa (optional)
   * @returns {Promise<Object>} BaseResponse<ContractResponse>
   */
  async createContract(data) {
    try {
      const response = await axiosInstance.post('/contracts', data)
      return response.data
    } catch (error) {
      console.error('Error creating contract:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * Lấy chi tiết hợp đồng
   * GET /api/contracts/{id}
   * @param {string} contractId - UUID của hợp đồng
   * @returns {Promise<Object>} BaseResponse<ContractResponse>
   */
  async getContractById(contractId) {
    try {
      const response = await axiosInstance.get(`/contracts/${contractId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching contract detail:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * Tải xuống file PDF hợp đồng
   * GET /api/contracts/{id}/pdf
   * @param {string} contractId - UUID của hợp đồng
   * @returns {Promise<Object>} BaseResponse<string> (URL của file PDF)
   */
  async getContractPdfUrl(contractId) {
    try {
      const response = await axiosInstance.get(`/contracts/${contractId}/pdf`)
      return response.data
    } catch (error) {
      console.error('Error fetching contract PDF URL:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * Lấy danh sách hợp đồng (Staff)
   * GET /api/contracts/staff
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.status - Lọc theo status (DRAFT, PENDING_SIGNATURE, SIGNED)
   * @param {string} params.leadId - Lọc theo LeadId (UUID)
   * @param {string} params.orderId - Lọc theo OrderId (UUID)
   * @param {string} params.sortBy - Sắp xếp theo (CreatedAt, Status, SignedAt)
   * @param {string} params.sortOrder - Thứ tự sắp xếp (ASC, DESC)
   * @returns {Promise<Object>} BaseResponse<PagedResponse<ContractResponse>>
   */
  async getContracts(params = {}) {
    try {
      const response = await axiosInstance.get('/contracts/staff', {
        params: {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          status: params.status,
          leadId: params.leadId,
          orderId: params.orderId,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching contracts:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }

  /**
   * UC43: Gửi hợp đồng để ký
   * POST /api/contracts/{id}/send-for-signature
   * @param {string} contractId - UUID của hợp đồng
   * @returns {Promise<Object>} BaseResponse<ContractResponse>
   */
  async sendForSignature(contractId) {
    try {
      const response = await axiosInstance.post(`/contracts/${contractId}/send-for-signature`)
      return response.data
    } catch (error) {
      console.error('Error sending contract for signature:', error)
      // Trả về error response từ BE thay vì throw
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  }
}

export default new StaffContractService()

