import axiosInstance from '../axios.config'

/**
 * Staff Notification Service
 * Xử lý tất cả API calls liên quan đến quản lý Thông báo cho Staff (UC37, UC38)
 */
class StaffNotificationService {
  /**
   * UC37: Lấy danh sách thông báo (Xem Danh sách Thông báo)
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.notificationType - Lọc theo loại thông báo (NEW_MESSAGE, NEW_BID, ORDER_UPDATE, PRICE_CHANGE, NEW_LEAD, APPOINTMENT, etc.)
   * @param {boolean} params.isRead - Lọc theo trạng thái đã đọc (true = chỉ lấy đã đọc, false = chỉ lấy chưa đọc, null = lấy tất cả)
   * @param {string} params.sortBy - Sắp xếp theo (CreatedAt)
   * @param {string} params.sortOrder - Thứ tự sắp xếp (ASC, DESC)
   * @returns {Promise<Object>} PagedResponse<NotificationResponse>
   */
  async getNotifications(params = {}) {
    const response = await axiosInstance.get('/notifications', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        notificationType: params.notificationType,
        isRead: params.isRead,
        sortBy: params.sortBy || 'CreatedAt',
        sortOrder: params.sortOrder || 'DESC'
      }
    })
    return response.data
  }

  /**
   * UC38: Đánh dấu thông báo đã đọc (Đánh dấu Thông báo đã đọc)
   * @param {string|null} notificationId - UUID của thông báo (null để đánh dấu tất cả là đã đọc)
   * @returns {Promise<Object>} BaseResponse
   */
  async markAsRead(notificationId = null) {
    const response = await axiosInstance.put('/notifications/mark-read', {
      notificationId: notificationId
    })
    return response.data
  }

  /**
   * UC38: Đánh dấu tất cả thông báo đã đọc
   * @returns {Promise<Object>} BaseResponse
   */
  async markAllAsRead() {
    return this.markAsRead(null)
  }

  /**
   * Lấy số lượng thông báo chưa đọc
   * @returns {Promise<Object>} BaseResponse<int>
   */
  async getUnreadCount() {
    const response = await axiosInstance.get('/notifications/unread-count')
    return response.data
  }
}

export default new StaffNotificationService()


