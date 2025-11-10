import axiosInstance from '../axios.config'

/**
 * Payment Service
 * Xử lý tất cả API calls liên quan đến Payments (UC28, UC30)
 */
class PaymentService {
  /**
   * UC28: Tạo thanh toán cho đơn hàng
   * @param {Object} data - PaymentCreateRequest
   * @param {string} data.orderId - UUID của đơn hàng
   * @param {string} data.paymentGateway - Phương thức thanh toán (PAYOS)
   * @returns {Promise<Object>} BaseResponse<PaymentResponse>
   */
  async createPayment(data) {
    const response = await axiosInstance.post('/orders/payment', data)
    return response.data
  }

  /**
   * UC30: Xem lịch sử thanh toán
   * @param {Object} params - PaymentSearchRequest
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 10)
   * @param {string} params.paymentType - Loại thanh toán (PACKAGE, TRANSACTION)
   * @param {string} params.status - Trạng thái (PENDING, SUCCESS, FAILED)
   * @param {string} params.paymentGateway - Cổng thanh toán (PAYOS)
   * @param {string|Date} params.fromDate - Từ ngày
   * @param {string|Date} params.toDate - Đến ngày
   * @returns {Promise<Object>} PagedResponse<PaymentDetailResponse>
   */
  async getPaymentHistory(params = {}) {
    const queryParams = {
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || 10,
      paymentType: params.paymentType || null,
      status: params.status || null,
      paymentGateway: params.paymentGateway || null,
      fromDate: params.fromDate ? (params.fromDate instanceof Date ? params.fromDate.toISOString() : params.fromDate) : null,
      toDate: params.toDate ? (params.toDate instanceof Date ? params.toDate.toISOString() : params.toDate) : null
    }

    // Remove null values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key]
      }
    })

    const response = await axiosInstance.get('/payments', {
      params: queryParams
    })
    return response.data
  }

  /**
   * UC30: Xem chi tiết thanh toán
   * @param {string} paymentId - UUID của thanh toán
   * @returns {Promise<Object>} BaseResponse<PaymentDetailResponse>
   */
  async getPaymentById(paymentId) {
    const response = await axiosInstance.get(`/payments/${paymentId}`)
    return response.data
  }

  /**
   * Get PayOS payment link/QR code
   * @param {string} paymentId - UUID của thanh toán
   * @returns {Promise<Object>} BaseResponse with payment link and QR code
   * @deprecated This endpoint doesn't exist in backend yet. Will be implemented when PayOS integration is ready.
   */
  async getPayOSPaymentLink(paymentId) {
    // TODO: Backend needs to create this endpoint
    // Endpoint: GET /api/payments/{paymentId}/payos-link
    // This will call PayOS API to create payment link and return QR code
    // Expected response: { success: true, data: { qrCodeUrl: string, paymentUrl: string } }
    const response = await axiosInstance.get(`/payments/${paymentId}/payos-link`)
    return response.data
  }
}

export default new PaymentService()

