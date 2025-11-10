import axiosInstance from '../axios.config'

/**
 * Package Service
 * Xử lý tất cả API calls liên quan đến Packages và Credits
 */
class PackageService {
  /**
   * Lấy danh sách tất cả các gói tin
   * @returns {Promise<Object>} BaseResponse<List<PackageResponse>>
   */
  async getAllPackages() {
    const response = await axiosInstance.get('/packages')
    return response.data
  }

  /**
   * Lấy danh sách gói tin mà user đã mua cùng với số credits còn lại
   * UC27: Get My Packages With Credits
   * @returns {Promise<Object>} BaseResponse<List<UserPackageCreditsResponse>>
   */
  async getMyPackages() {
    const response = await axiosInstance.get('/packages/my-packages')
    return response.data
  }

  /**
   * Kiểm tra xem user có đủ credits cho gói tin không
   * @param {string} packageType - BASIC, PREMIUM, LUXURY
   * @returns {Promise<Object>} BaseResponse<{hasCredits: boolean, remainingCredits: number}>
   */
  async checkCredits(packageType) {
    const response = await axiosInstance.get(`/packages/check-credits/${packageType}`)
    return response.data
  }

  /**
   * Mua gói tin
   * UC26: Purchase Package
   * @param {Object} data
   * @param {number} data.packageId - ID của package
   * @param {string} data.paymentGateway - Phương thức thanh toán (PAYOS)
   * @returns {Promise<Object>} BaseResponse<PackagePurchaseResponse>
   */
  async purchasePackage(data) {
    const response = await axiosInstance.post('/packages/purchase', {
      packageId: data.packageId,
      paymentGateway: data.paymentGateway.toUpperCase()
    })
    return response.data
  }

  /**
   * Lấy lịch sử mua gói tin
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} PagedResponse<PackagePurchaseHistoryResponse>
   */
  async getPurchaseHistory(params = {}) {
    const response = await axiosInstance.get('/packages/purchase-history', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10
      }
    })
    return response.data
  }

  /**
   * UC27: Lấy số credits còn lại của user
   * Alias for getMyPackages - returns packages with credits
   * @returns {Promise<Object>} BaseResponse<List<UserPackageCreditsResponse>>
   */
  async getMyCredits() {
    return this.getMyPackages()
  }
}

export default new PackageService()
