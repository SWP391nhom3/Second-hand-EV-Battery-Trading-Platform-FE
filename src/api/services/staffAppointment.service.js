import axiosInstance from '../axios.config'

/**
 * Staff Appointment Service
 * Xử lý tất cả API calls liên quan đến quản lý Appointment cho Staff (UC41, UC42)
 */
class StaffAppointmentService {
  /**
   * UC41: Tạo Appointment (Tạo Lịch hẹn)
   * @param {Object} data - AppointmentCreateRequest
   * @param {string} data.leadId - UUID của Lead
   * @param {string} data.startTime - Thời gian bắt đầu (ISO 8601)
   * @param {string} data.endTime - Thời gian kết thúc (ISO 8601, optional)
   * @param {string} data.location - Địa điểm
   * @param {string} data.notes - Ghi chú (optional)
   * @returns {Promise<Object>} BaseResponse<AppointmentResponse>
   */
  async createAppointment(data) {
    const response = await axiosInstance.post('/appointments', data)
    return response.data
  }

  /**
   * UC42: Lấy danh sách Appointments (Quản lý Lịch hẹn)
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.status - Lọc theo status (CONFIRMED, CANCELED, COMPLETED)
   * @param {string} params.leadId - Lọc theo LeadId (UUID)
   * @param {string} params.postId - Lọc theo PostId (UUID)
   * @param {boolean} params.upcoming - Lọc lịch hẹn sắp tới (StartTime >= now)
   * @param {boolean} params.past - Lọc lịch hẹn đã qua (StartTime < now)
   * @param {string} params.sortBy - Sắp xếp theo (StartTime, CreatedAt)
   * @param {string} params.sortOrder - Thứ tự sắp xếp (ASC, DESC)
   * @returns {Promise<Object>} BaseResponse<PagedResponse<AppointmentResponse>>
   */
  async getAppointments(params = {}) {
    const response = await axiosInstance.get('/appointments', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        status: params.status,
        leadId: params.leadId,
        postId: params.postId,
        upcoming: params.upcoming,
        past: params.past,
        sortBy: params.sortBy || 'StartTime',
        sortOrder: params.sortOrder || 'ASC'
      }
    })
    return response.data
  }

  /**
   * UC42: Lấy chi tiết Appointment
   * @param {string} appointmentId - UUID của Appointment
   * @returns {Promise<Object>} BaseResponse<AppointmentResponse>
   */
  async getAppointmentById(appointmentId) {
    const response = await axiosInstance.get(`/appointments/${appointmentId}`)
    return response.data
  }

  /**
   * UC42: Cập nhật Appointment
   * @param {string} appointmentId - UUID của Appointment
   * @param {Object} data - AppointmentUpdateRequest
   * @param {string} data.startTime - Thời gian bắt đầu (ISO 8601, optional)
   * @param {string} data.endTime - Thời gian kết thúc (ISO 8601, optional)
   * @param {string} data.location - Địa điểm (optional)
   * @param {string} data.notes - Ghi chú (optional)
   * @param {string} data.status - Trạng thái (CONFIRMED, CANCELED, COMPLETED, optional)
   * @returns {Promise<Object>} BaseResponse<AppointmentResponse>
   */
  async updateAppointment(appointmentId, data) {
    const response = await axiosInstance.put(`/appointments/${appointmentId}`, data)
    return response.data
  }

  /**
   * UC42: Hủy Appointment
   * @param {string} appointmentId - UUID của Appointment
   * @returns {Promise<Object>} BaseResponse<AppointmentResponse>
   */
  async cancelAppointment(appointmentId) {
    const response = await axiosInstance.delete(`/appointments/${appointmentId}`)
    return response.data
  }

  /**
   * UC42: Cập nhật trạng thái Appointment
   * @param {string} appointmentId - UUID của Appointment
   * @param {Object} data - AppointmentStatusUpdateRequest
   * @param {string} data.status - Trạng thái mới (CONFIRMED, CANCELED, COMPLETED)
   * @param {string} data.notes - Ghi chú (optional)
   * @returns {Promise<Object>} BaseResponse<AppointmentResponse>
   */
  async updateAppointmentStatus(appointmentId, data) {
    const response = await axiosInstance.put(`/appointments/${appointmentId}/status`, data)
    return response.data
  }
}

export default new StaffAppointmentService()


