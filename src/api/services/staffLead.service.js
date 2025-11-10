import axiosInstance from '../axios.config'

/**
 * Staff Lead Service
 * Xử lý tất cả API calls liên quan đến quản lý Lead cho Staff (UC40, UC44)
 */
class StaffLeadService {
  /**
   * UC40: Lấy danh sách Leads được gán cho Staff hiện tại
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.status - Lọc theo status (NEW, ASSIGNED, CONTACTED, SCHEDULED, SUCCESSFUL, FAILED)
   * @param {string} params.leadType - Lọc theo leadType (SCHEDULE_VIEW, AUCTION_WINNER)
   * @param {string} params.postId - Lọc theo PostId (UUID)
   * @param {string} params.buyerId - Lọc theo BuyerId (UUID)
   * @param {string} params.sortBy - Sắp xếp theo (CreatedAt, AssignedAt, Status)
   * @param {string} params.sortOrder - Thứ tự sắp xếp (ASC, DESC)
   * @returns {Promise<Object>} BaseResponse<PagedResponse<LeadResponse>>
   */
  async getLeads(params = {}) {
    const response = await axiosInstance.get('/leads/staff', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        status: params.status,
        leadType: params.leadType,
        postId: params.postId,
        buyerId: params.buyerId,
        sortBy: params.sortBy || 'CreatedAt',
        sortOrder: params.sortOrder || 'DESC'
      }
    })
    return response.data
  }

  /**
   * Lấy chi tiết Lead
   * @param {string} leadId - UUID của Lead
   * @returns {Promise<Object>} BaseResponse<LeadResponse>
   */
  async getLeadById(leadId) {
    const response = await axiosInstance.get(`/leads/${leadId}`)
    return response.data
  }

  /**
   * UC44: Cập nhật trạng thái Lead
   * @param {string} leadId - UUID của Lead
   * @param {Object} data - LeadStatusUpdateRequest
   * @param {string} data.status - Trạng thái mới (CONTACTED, SCHEDULED, SUCCESSFUL, FAILED)
   * @param {string} data.notes - Ghi chú của Staff (optional, max 2000 characters)
   * @returns {Promise<Object>} BaseResponse<LeadResponse>
   */
  async updateLeadStatus(leadId, data) {
    const response = await axiosInstance.put(`/leads/${leadId}/status`, data)
    return response.data
  }
}

export default new StaffLeadService()

