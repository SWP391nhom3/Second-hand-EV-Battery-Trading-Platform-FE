import axiosInstance from '../axios.config'

/**
 * Favorite Service
 * Xử lý tất cả API calls liên quan đến Favorites
 */
class FavoriteService {
  /**
   * UC18: Thêm bài đăng vào danh sách yêu thích
   * @param {string} postId - UUID của bài đăng
   * @returns {Promise<Object>} BaseResponse<FavoriteResponse>
   */
  async addToFavorites(postId) {
    const response = await axiosInstance.post(`/favorites/${postId}`)
    return response.data
  }

  /**
   * UC19: Xóa bài đăng khỏi danh sách yêu thích
   * @param {string} postId - UUID của bài đăng
   * @returns {Promise<Object>} BaseResponse
   */
  async removeFromFavorites(postId) {
    const response = await axiosInstance.delete(`/favorites/${postId}`)
    return response.data
  }

  /**
   * UC22: Xem danh sách yêu thích
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.keyword - Từ khóa tìm kiếm
   * @param {number} params.categoryId - ID danh mục
   * @param {string} params.status - Trạng thái bài đăng
   * @param {boolean} params.isActive - Lọc chỉ bài đăng đang hoạt động
   * @param {boolean} params.isSold - Lọc chỉ bài đăng chưa bán
   * @returns {Promise<Object>} PagedResponse<FavoriteResponse>
   */
  async getFavorites(params = {}) {
    const response = await axiosInstance.get('/favorites', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 12,
        keyword: params.keyword,
        categoryId: params.categoryId,
        status: params.status,
        isActive: params.isActive,
        isSold: params.isSold
      }
    })
    return response.data
  }

  /**
   * Kiểm tra xem bài đăng đã được thêm vào yêu thích chưa
   * @param {string} postId - UUID của bài đăng
   * @returns {Promise<Object>} BaseResponse<boolean>
   */
  async isFavorite(postId) {
    const response = await axiosInstance.get(`/favorites/${postId}/check`)
    return response.data
  }
}

export default new FavoriteService()


