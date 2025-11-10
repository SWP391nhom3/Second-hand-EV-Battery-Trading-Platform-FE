import axiosInstance from '../axios.config'

/**
 * Contract Service (Member)
 * Xử lý tất cả API calls liên quan đến Contracts cho Member (UC29)
 */
class ContractService {
  /**
   * Lấy chi tiết hợp đồng
   * GET /api/contracts/{id}
   * @param {string} contractId - UUID của hợp đồng
   * @returns {Promise<Object>} BaseResponse<ContractResponse>
   */
  async getContractById(contractId) {
    const response = await axiosInstance.get(`/contracts/${contractId}`)
    return response.data
  }

  /**
   * UC29: Người mua/người bán ký hợp đồng
   * POST /api/contracts/{id}/sign
   * @param {string} contractId - UUID của hợp đồng
   * @param {Object} data - ContractSignRequest
   * @param {string} data.signature - Chữ ký điện tử (base64 encoded signature image hoặc OTP)
   * @param {string} data.signType - Loại ký (SIGNATURE, OTP)
   * @returns {Promise<Object>} BaseResponse<ContractResponse>
   */
  async signContract(contractId, data) {
    const response = await axiosInstance.post(`/contracts/${contractId}/sign`, data)
    return response.data
  }

  /**
   * Tải xuống file PDF hợp đồng
   * GET /api/contracts/{id}/pdf
   * @param {string} contractId - UUID của hợp đồng
   * @returns {Promise<Object>} BaseResponse<string> (URL của file PDF)
   */
  async getContractPdfUrl(contractId) {
    const response = await axiosInstance.get(`/contracts/${contractId}/pdf`)
    return response.data
  }

  /**
   * Lấy danh sách hợp đồng của Member
   * GET /api/contracts/my-contracts
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang
   * @param {number} params.pageSize - Số lượng mỗi trang
   * @param {string} params.status - Lọc theo trạng thái (DRAFT, PENDING_SIGNATURE, SIGNED)
   * @returns {Promise<Object>} BaseResponse<PagedResponse<ContractResponse>>
   */
  async getMyContracts(params = {}) {
    const response = await axiosInstance.get('/contracts/my-contracts', { params })
    return response.data
  }
}

export default new ContractService()

