import axiosInstance from '../axios.config'

/**
 * Authentication Service
 * Xử lý tất cả API calls liên quan đến Authentication (UC01, UC02, UC03)
 */
class AuthService {
  /**
   * UC01: Đăng ký tài khoản mới
   * @param {Object} data - RegisterRequest
   * @returns {Promise<AuthResponse>}
   */
  async register(data) {
    const response = await axiosInstance.post('/auth/register', data)
    return response.data
  }

  /**
   * UC02: Đăng nhập bằng Email/Phone và Password
   * @param {Object} data - LoginRequest
   * @returns {Promise<AuthResponse>}
   */
  async login(data) {
    const response = await axiosInstance.post('/auth/login', data)
    return response.data
  }

  /**
   * UC03: Đăng nhập bằng mạng xã hội
   * @param {Object} data - SocialLoginRequest
   * @returns {Promise<AuthResponse>}
   */
  async socialLogin(data) {
    const response = await axiosInstance.post('/auth/social-login', data)
    return response.data
  }

  /**
   * Refresh Access Token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<AuthResponse>}
   */
  async refreshToken(refreshToken) {
    const response = await axiosInstance.post('/auth/refresh-token', {
      refreshToken
    })
    return response.data
  }

  /**
   * Lấy thông tin user hiện tại
   * @returns {Promise<UserDto>}
   */
  async getCurrentUser() {
    const response = await axiosInstance.get('/auth/me')
    return response.data
  }

  /**
   * Đăng xuất (client-side only)
   * Clear tokens và user info khỏi localStorage
   */
  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  /**
   * Kiểm tra user đã đăng nhập chưa
   * @returns {boolean}
   */
  isAuthenticated() {
    const accessToken = localStorage.getItem('accessToken')
    return !!accessToken
  }

  /**
   * Lưu auth data vào localStorage
   * @param {AuthResponse} authResponse
   */
  saveAuthData(authResponse) {
    localStorage.setItem('accessToken', authResponse.accessToken)
    localStorage.setItem('refreshToken', authResponse.refreshToken)
    localStorage.setItem('user', JSON.stringify({
      userId: authResponse.userId,
      email: authResponse.email,
      phoneNumber: authResponse.phoneNumber,
      fullName: authResponse.fullName,
      role: authResponse.role
    }))
  }

  /**
   * Lấy user info từ localStorage
   * @returns {Object|null}
   */
  getUserFromStorage() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  /**
   * Lấy thông tin user hiện tại (alias for getUserFromStorage)
   * @returns {Object|null}
   */
  getUserData() {
    return this.getUserFromStorage()
  }
}

export default new AuthService()
