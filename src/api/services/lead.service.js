import axiosInstance from '../axios.config'

/**
 * Lead Service for Member
 * Xử lý tất cả API calls liên quan đến quản lý Lead cho Member (UC23)
 */
class LeadService {
  /**
   * UC23: Tạo Lead (Đặt lịch xem / Yêu cầu Môi giới)
   * @param {Object} data - LeadCreateRequest
   * @param {string} data.postId - UUID của bài đăng
   * @param {string} data.leadType - Loại Lead (SCHEDULE_VIEW, AUCTION_WINNER)
   * @returns {Promise<Object>} BaseResponse<LeadResponse>
   */
  async createLead(data) {
    const response = await axiosInstance.post('/leads', data)
    return response.data
  }

  /**
   * UC23: Lấy danh sách Leads của Member hiện tại
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.status - Lọc theo status (NEW, ASSIGNED, CONTACTED, SCHEDULED, SUCCESSFUL, FAILED)
   * @param {string} params.leadType - Lọc theo leadType (SCHEDULE_VIEW, AUCTION_WINNER)
   * @param {string} params.postId - Lọc theo PostId (UUID)
   * @param {string} params.sortBy - Sắp xếp theo (CreatedAt, AssignedAt, Status)
   * @param {string} params.sortOrder - Thứ tự sắp xếp (ASC, DESC)
   * @returns {Promise<Object>} BaseResponse<PagedResponse<LeadResponse>>
   */
  async getMyLeads(params = {}) {
    const response = await axiosInstance.get('/leads/my-leads', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        status: params.status,
        leadType: params.leadType,
        postId: params.postId,
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
}

export default new LeadService()


