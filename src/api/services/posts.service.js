import axiosInstance from '../axios.config'

/**
 * Posts Service
 * Xử lý tất cả API calls liên quan đến Posts
 */
class PostsService {
  /**
   * Tìm kiếm danh sách bài đăng đã được duyệt
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.keyword - Từ khóa tìm kiếm
   * @param {number} params.categoryId - ID danh mục (1: Xe điện, 2: Pin)
   * @param {string} params.packageType - Loại gói (BASIC, PREMIUM, LUXURY)
   * @param {number} params.minPrice - Giá tối thiểu
   * @param {number} params.maxPrice - Giá tối đa
   * @param {string} params.location - Địa điểm
   * @param {string} params.brand - Thương hiệu
   * @param {number} params.minSoh - SOH tối thiểu
   * @param {number} params.maxSoh - SOH tối đa
   * @param {string} params.sortBy - Sắp xếp theo (Price, CreatedAt, SOH)
   * @param {string} params.sortDirection - Chiều sắp xếp (ASC, DESC)
   * @returns {Promise<Object>} PagedResponse<PostResponse>
   */
  async searchPosts(params = {}) {
    const response = await axiosInstance.get('/posts/search', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 12,
        keyword: params.keyword,
        categoryId: params.categoryId,
        packageType: params.packageType,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        location: params.location,
        brand: params.brand,
        minSoh: params.minSoh,
        maxSoh: params.maxSoh,
        auctionOnly: params.auctionOnly,
        sortBy: params.sortBy || 'CreatedAt',
        sortDirection: params.sortDirection || 'DESC'
      }
    })
    return response.data
  }

  /**
   * Lấy danh sách bài đăng theo package type
   * @param {string} packageType - LUXURY, PREMIUM, BASIC
   * @param {number} limit - Số lượng bài đăng (default: 2)
   * @returns {Promise<Object>}
   */
  async getPostsByPackage(packageType, limit = 2) {
    const response = await axiosInstance.get('/posts/search', {
      params: {
        pageNumber: 1,
        pageSize: limit,
        packageType: packageType,
        sortBy: 'CreatedAt',
        sortDirection: 'DESC'
      }
    })
    return response.data
  }

  /**
   * Lấy chi tiết bài đăng theo ID (public view)
   * @param {string} postId - UUID của bài đăng
   * @returns {Promise<Object>} BaseResponse<PostPublicDetailResponse>
   */
  async getPostById(postId) {
    const response = await axiosInstance.get(`/posts/${postId}`)
    return response.data
  }

  /**
   * Tạo bài đăng mới (yêu cầu đăng nhập)
   * @param {FormData} formData - Form data chứa thông tin bài đăng và ảnh
   * @returns {Promise<Object>} BaseResponse<PostResponse>
   */
  async createPost(formData) {
    // Không set Content-Type manually, để axios tự động set với boundary
    const response = await axiosInstance.post('/posts', formData)
    return response.data
  }

  /**
   * Cập nhật bài đăng (yêu cầu đăng nhập và là chủ sở hữu)
   * @param {string} postId - UUID của bài đăng
   * @param {Object} requestBody - JSON body chứa thông tin cập nhật
   * @returns {Promise<Object>} BaseResponse<PostResponse>
   */
  async updatePost(postId, requestBody) {
    const response = await axiosInstance.put(`/posts/${postId}`, requestBody)
    return response.data
  }

  /**
   * Xóa bài đăng (yêu cầu đăng nhập và là chủ sở hữu)
   * @param {string} postId - UUID của bài đăng
   * @returns {Promise<Object>} BaseResponse
   */
  async deletePost(postId) {
    const response = await axiosInstance.delete(`/posts/${postId}`)
    return response.data
  }

  /**
   * Lấy danh sách bài đăng của user hiện tại
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} PagedResponse<PostResponse>
   */
  async getMyPosts(params = {}) {
    const response = await axiosInstance.get('/posts/my-posts', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        status: params.status,
        sortBy: params.sortBy || 'CreatedAt',
        sortDirection: params.sortDirection || 'DESC'
      }
    })
    return response.data
  }

  /**
   * Tạm ẩn/hiện bài đăng
   * @param {string} postId - UUID của bài đăng
   * @param {boolean} isActive - true: hiện, false: ẩn
   * @returns {Promise<Object>} BaseResponse
   */
  async togglePostActive(postId, isActive) {
    const response = await axiosInstance.patch(`/posts/${postId}/toggle-active`, {
      isActive
    })
    return response.data
  }

  /**
   * Đẩy tin (bump post)
   * @param {string} postId - UUID của bài đăng
   * @returns {Promise<Object>} BaseResponse
   */
  async bumpPost(postId) {
    const response = await axiosInstance.post(`/posts/${postId}/bump`)
    return response.data
  }

  /**
   * UC20: So sánh Sản phẩm
   * So sánh nhiều sản phẩm với nhau (tối đa 3-5 sản phẩm)
   * @param {Array<string>} postIds - Danh sách ID bài đăng cần so sánh (2-5 sản phẩm)
   * @returns {Promise<Object>} BaseResponse<PostCompareResponse>
   */
  async comparePosts(postIds) {
    if (!Array.isArray(postIds) || postIds.length < 2 || postIds.length > 5) {
      throw new Error('Phải chọn từ 2 đến 5 sản phẩm để so sánh')
    }
    const response = await axiosInstance.post('/posts/compare', {
      postIds
    })
    return response.data
  }
}

export default new PostsService()
