import axiosInstance from '../axios.config'

/**
 * Rating Service
 * Xử lý tất cả API calls liên quan đến Ratings/Reviews
 */
class RatingService {
  /**
   * UC31: Người mua đánh giá người bán
   * @param {Object} data - RatingCreateRequest
   * @param {string} data.orderId - UUID của đơn hàng
   * @param {number} data.score - Điểm số (1-5)
   * @param {string} [data.comment] - Nhận xét (optional)
   * @returns {Promise<Object>} BaseResponse<RatingResponse>
   */
  async rateSeller(data) {
    const response = await axiosInstance.post('/ratings/rate-seller', data)
    return response.data
  }

  /**
   * UC32: Người bán đánh giá người mua
   * @param {Object} data - RatingCreateRequest
   * @param {string} data.orderId - UUID của đơn hàng
   * @param {number} data.score - Điểm số (1-5)
   * @param {string} [data.comment] - Nhận xét (optional)
   * @returns {Promise<Object>} BaseResponse<RatingResponse>
   */
  async rateBuyer(data) {
    const response = await axiosInstance.post('/ratings/rate-buyer', data)
    return response.data
  }

  /**
   * UC33: Chỉnh sửa đánh giá (trong vòng 7 ngày)
   * @param {string} ratingId - UUID của đánh giá
   * @param {Object} data - RatingUpdateRequest
   * @param {number} data.score - Điểm số mới (1-5)
   * @param {string} [data.comment] - Nhận xét mới (optional)
   * @returns {Promise<Object>} BaseResponse<RatingResponse>
   */
  async updateRating(ratingId, data) {
    const response = await axiosInstance.put(`/ratings/${ratingId}`, data)
    return response.data
  }

  /**
   * UC34: Phản hồi đánh giá
   * @param {string} ratingId - UUID của đánh giá
   * @param {Object} data - RatingReplyRequest
   * @param {string} data.replyContent - Nội dung phản hồi
   * @returns {Promise<Object>} BaseResponse<RatingReplyResponse>
   */
  async replyToRating(ratingId, data) {
    const response = await axiosInstance.post(`/ratings/${ratingId}/reply`, data)
    return response.data
  }

  /**
   * Lấy chi tiết đánh giá
   * @param {string} ratingId - UUID của đánh giá
   * @returns {Promise<Object>} BaseResponse<RatingResponse>
   */
  async getRatingById(ratingId) {
    const response = await axiosInstance.get(`/ratings/${ratingId}`)
    return response.data
  }

  /**
   * Lấy danh sách đánh giá (có phân trang)
   * @param {Object} params - Query parameters
   * @param {number} [params.pageNumber] - Số trang (default: 1)
   * @param {number} [params.pageSize] - Số item mỗi trang (default: 10, max: 100)
   * @param {string} [params.rateeId] - UUID người được đánh giá
   * @param {string} [params.orderId] - UUID đơn hàng
   * @param {string} [params.rateeRole] - "SELLER" | "BUYER"
   * @param {number} [params.minScore] - Điểm số tối thiểu (1-5)
   * @param {number} [params.maxScore] - Điểm số tối đa (1-5)
   * @returns {Promise<Object>} PagedResponse<RatingResponse>
   */
  async getRatings(params = {}) {
    const response = await axiosInstance.get('/ratings', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        rateeId: params.rateeId,
        orderId: params.orderId,
        rateeRole: params.rateeRole,
        minScore: params.minScore,
        maxScore: params.maxScore
      }
    })
    return response.data
  }

  /**
   * Lấy danh sách đánh giá của một user (người được đánh giá)
   * @param {string} userId - UUID của user
   * @param {Object} [params] - Query parameters
   * @param {string} [params.rateeRole] - "SELLER" | "BUYER"
   * @param {number} [params.minScore] - Điểm số tối thiểu (1-5)
   * @param {number} [params.maxScore] - Điểm số tối đa (1-5)
   * @param {number} [params.pageNumber] - Số trang (default: 1)
   * @param {number} [params.pageSize] - Số item mỗi trang (default: 10)
   * @returns {Promise<Object>} PagedResponse<RatingResponse>
   */
  async getUserRatings(userId, params = {}) {
    return this.getRatings({
      rateeId: userId,
      ...params
    })
  }

  /**
   * Lấy danh sách đánh giá của một đơn hàng
   * @param {string} orderId - UUID của đơn hàng
   * @param {Object} [params] - Query parameters
   * @param {number} [params.pageNumber] - Số trang (default: 1)
   * @param {number} [params.pageSize] - Số item mỗi trang (default: 10)
   * @returns {Promise<Object>} PagedResponse<RatingResponse>
   */
  async getOrderRatings(orderId, params = {}) {
    return this.getRatings({
      orderId: orderId,
      ...params
    })
  }
}

export default new RatingService()

