import axiosInstance from '../axios.config'

/**
 * Admin Dashboard Service
 * Xử lý tất cả API calls liên quan đến Dashboard Admin
 * Module 7: Dashboard Admin
 */
class AdminDashboardService {
  /**
   * Lấy dữ liệu Dashboard tổng quan
   * GET /api/admin/dashboard
   * @returns {Promise<Object>} BaseResponse<AdminDashboardResponse>
   * 
   * Expected Response Structure:
   * {
   *   totalUsers: number,
   *   totalPosts: number,
   *   pendingPosts: number,
   *   totalLeads: number,
   *   newLeads: number,
   *   revenue: {
   *     total: number,
   *     monthly: number,
   *     weekly: number,
   *     chartData: Array<{date: string, value: number}>
   *   },
   *   recentLeads: Array<LeadResponse>,
   *   pendingPostsList: Array<PendingPostResponse>,
   *   recentActivities: Array<ActivityResponse>
   * }
   */
  async getDashboardData() {
    try {
      const response = await axiosInstance.get('/admin/dashboard')
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Nếu endpoint chưa có, trả về error để component xử lý
      if (error.response?.status === 404) {
        // Endpoint chưa có sẵn ở backend
        throw new Error('Dashboard endpoint chưa được implement ở backend')
      }
      throw error
    }
  }
}

export default new AdminDashboardService()

