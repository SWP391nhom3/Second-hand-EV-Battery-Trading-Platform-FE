import api from "../configs/axios";
import postRequestService from "./postRequestService";

/**
 * Service để quản lý yêu cầu đơn hàng từ khách hàng
 * Tích hợp với postRequestService và chuẩn bị cho BE
 */

const orderRequestService = {
  /**
   * Lấy tất cả yêu cầu đơn hàng
   * TODO: Có thể thay bằng API riêng: GET /api/OrderRequest
   */
  getAllOrderRequests: async (params = {}) => {
    try {
      // Hiện tại sử dụng postRequestService
      // TODO: Khi có BE riêng cho OrderRequest, uncomment:
      // const response = await api.get("/api/OrderRequest", { params });
      // return response.data;

      const data = await postRequestService.getPostRequests(params);
      return data;
    } catch (error) {
      console.error("Error fetching order requests:", error);
      throw error;
    }
  },

  /**
   * Lấy yêu cầu đơn hàng theo ID
   */
  getOrderRequestById: async (id) => {
    try {
      return await postRequestService.getPostRequestById(id);
    } catch (error) {
      console.error("Error fetching order request:", error);
      throw error;
    }
  },

  /**
   * Lấy yêu cầu đơn hàng theo trạng thái
   */
  getOrderRequestsByStatus: async (status) => {
    try {
      return await postRequestService.getRequestsByStatus(status);
    } catch (error) {
      console.error("Error fetching order requests by status:", error);
      throw error;
    }
  },

  /**
   * Cập nhật trạng thái yêu cầu
   */
  updateOrderRequestStatus: async (id, status, notes = "") => {
    try {
      return await postRequestService.updateRequestStatus(id, { status, notes });
    } catch (error) {
      console.error("Error updating order request status:", error);
      throw error;
    }
  },

  /**
   * Chấp nhận yêu cầu
   */
  acceptOrderRequest: async (id) => {
    try {
      return await postRequestService.acceptRequest(id);
    } catch (error) {
      console.error("Error accepting order request:", error);
      throw error;
    }
  },

  /**
   * Từ chối yêu cầu
   */
  rejectOrderRequest: async (id, reason = "") => {
    try {
      return await postRequestService.rejectRequest(id, reason);
    } catch (error) {
      console.error("Error rejecting order request:", error);
      throw error;
    }
  },

  /**
   * Xóa yêu cầu
   */
  deleteOrderRequest: async (id) => {
    try {
      return await postRequestService.deletePostRequest(id);
    } catch (error) {
      console.error("Error deleting order request:", error);
      throw error;
    }
  },
};

export default orderRequestService;

