import axiosInstance from '../axios.config'

/**
 * Staff Dashboard Service
 * Xử lý tất cả API calls liên quan đến Dashboard Staff
 * Module 1: Dashboard Staff (UC39)
 */
class StaffDashboardService {
  /**
   * Lấy thống kê Leads được gán
   * GET /api/leads/staff?status={status}&pageNumber=1&pageSize=1
   * @param {string} status - Trạng thái Lead (ASSIGNED, SUCCESSFUL, FAILED)
   * @returns {Promise<number>} Tổng số Leads
   */
  async getLeadsCount(status) {
    try {
      const response = await axiosInstance.get('/leads/staff', {
        params: {
          status,
          pageNumber: 1,
          pageSize: 1
        }
      })
      if (response.data?.success && response.data?.data) {
        return response.data.data.totalCount || 0
      }
      return 0
    } catch (error) {
      console.error(`Error fetching leads count (status: ${status}):`, error)
      return 0
    }
  }

  /**
   * Lấy danh sách Leads được gán (tối đa limit items)
   * GET /api/leads/staff
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.status - Trạng thái Lead
   * @param {string} params.sortBy - Sắp xếp theo (default: CreatedAt)
   * @param {string} params.sortOrder - Thứ tự sắp xếp (default: DESC)
   * @returns {Promise<Object>} BaseResponse<PagedResponse<LeadResponse>>
   * Response structure: { success, message, data: { data: LeadResponse[], totalCount, pageNumber, pageSize, ... } }
   */
  async getAssignedLeads(params = {}) {
    try {
      const response = await axiosInstance.get('/leads/staff', {
        params: {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          status: params.status,
          sortBy: params.sortBy || 'CreatedAt',
          sortOrder: params.sortOrder || 'DESC'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching assigned leads:', error)
      throw error
    }
  }

  /**
   * Lấy thống kê Appointments sắp tới
   * GET /api/appointments?upcoming=true&pageNumber=1&pageSize=1
   * @returns {Promise<number>} Tổng số Appointments sắp tới
   */
  async getUpcomingAppointmentsCount() {
    try {
      const response = await axiosInstance.get('/appointments', {
        params: {
          upcoming: true,
          pageNumber: 1,
          pageSize: 1
        }
      })
      if (response.data?.success && response.data?.data) {
        return response.data.data.totalCount || 0
      }
      return 0
    } catch (error) {
      console.error('Error fetching upcoming appointments count:', error)
      return 0
    }
  }

  /**
   * Lấy danh sách Appointments sắp tới
   * GET /api/appointments?upcoming=true
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.sortBy - Sắp xếp theo (default: StartTime)
   * @param {string} params.sortOrder - Thứ tự sắp xếp (default: ASC)
   * @returns {Promise<Object>} BaseResponse<PagedResponse<AppointmentResponse>>
   * Response structure: { success, message, data: { data: AppointmentResponse[], totalCount, pageNumber, pageSize, ... } }
   */
  async getUpcomingAppointments(params = {}) {
    try {
      const response = await axiosInstance.get('/appointments', {
        params: {
          upcoming: true,
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          sortBy: params.sortBy || 'StartTime',
          sortOrder: params.sortOrder || 'ASC'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error)
      throw error
    }
  }

  /**
   * Lấy thống kê tổng hợp cho Dashboard
   * @returns {Promise<Object>} Object chứa các thống kê:
   * {
   *   totalLeads: number,
   *   successfulLeads: number,
   *   failedLeads: number,
   *   upcomingAppointments: number
   * }
   */
  async getDashboardStatistics() {
    try {
      // Lấy các thống kê song song
      const [totalLeads, successfulLeads, failedLeads, upcomingAppointments] = await Promise.all([
        this.getLeadsCount(), // Tất cả Leads được gán
        this.getLeadsCount('SUCCESSFUL'),
        this.getLeadsCount('FAILED'),
        this.getUpcomingAppointmentsCount()
      ])

      return {
        totalLeads,
        successfulLeads,
        failedLeads,
        upcomingAppointments
      }
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error)
      throw error
    }
  }
}

export default new StaffDashboardService()

