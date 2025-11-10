import axiosInstance from '../axios.config'

/**
 * Bid Service
 * Xử lý tất cả API calls liên quan đến đấu giá
 */
class BidService {
  /**
   * UC21: Đặt giá đấu
   * @param {Object} data - BidCreateRequest
   * @param {string} data.postId - ID bài đăng
   * @param {number} data.bidAmount - Giá đấu
   * @returns {Promise<Object>} BaseResponse<BidResponse>
   */
  async createBid(data) {
    const response = await axiosInstance.post('/bids', {
      postId: data.postId,
      bidAmount: data.bidAmount
    })
    return response.data
  }

  /**
   * UC21: Lấy danh sách đấu giá của một bài đăng
   * @param {string} postId - ID bài đăng
   * @returns {Promise<Object>} BaseResponse<BidListResponse>
   */
  async getBidsByPostId(postId) {
    const response = await axiosInstance.get(`/bids/post/${postId}`)
    return response.data
  }
}

export default new BidService()


