import axiosInstance from '../axios.config';

/**
 * Order Service
 * Xử lý tất cả API calls liên quan đến Orders (UC05, UC28)
 */
class OrderService {
  /**
   * UC05: Lấy danh sách đơn hàng của Member (Lịch sử Giao dịch)
   * @param {Object} params - OrderSearchRequest
   * @returns {Promise<BaseResponse<PagedResponse<OrderResponse>>>}
   */
  async getMyOrders(params = {}) {
    const response = await axiosInstance.get('/orders/my-orders', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        sortBy: params.sortBy || 'createdat',
        sortDirection: params.sortDirection || 'desc',
        transactionType: params.transactionType || null,
        status: params.status || null,
        fromDate: params.fromDate || null,
        toDate: params.toDate || null,
        keyword: params.keyword || null,
      },
    });
    return response.data;
  }

  /**
   * Lấy chi tiết đơn hàng
   * @param {string} orderId - Order ID (GUID)
   * @returns {Promise<BaseResponse<OrderResponse>>}
   */
  async getOrderById(orderId) {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  }

  /**
   * UC28: Tạo thanh toán cho đơn hàng
   * @param {Object} data - PaymentCreateRequest
   * @returns {Promise<BaseResponse<PaymentResponse>>}
   */
  async createPayment(data) {
    const response = await axiosInstance.post('/orders/payment', data);
    return response.data;
  }
}

export default new OrderService();


