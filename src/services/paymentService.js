import api from "../configs/axios";

const paymentService = {
  // GET /api/Payment - Get all payments
  getPayments: async (params = {}) => {
    const response = await api.get("/api/Payment", { params });
    return response.data;
  },

  // POST /api/Payment - Create new payment
  createPayment: async (paymentData) => {
    const response = await api.post("/api/Payment", paymentData);
    return response.data;
  },

  // GET /api/Payment/{id} - Get payment by ID
  getPaymentById: async (id) => {
    const response = await api.get(`/api/Payment/${id}`);
    return response.data;
  },

  // PUT /api/Payment/{id} - Update payment
  updatePayment: async (id, paymentData) => {
    const response = await api.put(`/api/Payment/${id}`, paymentData);
    return response.data;
  },

  // DELETE /api/Payment/{id} - Delete payment
  deletePayment: async (id) => {
    const response = await api.delete(`/api/Payment/${id}`);
    return response.data;
  },

  // GET /api/Payment/buyer/{buyerId} - Get payments by buyer
  getPaymentsByBuyer: async (buyerId) => {
    const response = await api.get(`/api/Payment/buyer/${buyerId}`);
    return response.data;
  },

  // GET /api/Payment/seller/{sellerId} - Get payments by seller
  getPaymentsBySeller: async (sellerId) => {
    const response = await api.get(`/api/Payment/seller/${sellerId}`);
    return response.data;
  },

  // GET /api/Payment/status/{status} - Get payments by status
  getPaymentsByStatus: async (status) => {
    const response = await api.get(`/api/Payment/status/${status}`);
    return response.data;
  },

  // PUT /api/Payment/{id}/status - Update payment status
  updatePaymentStatus: async (id, statusData) => {
    const response = await api.put(`/api/Payment/${id}/status`, statusData);
    return response.data;
  },

  // GET /api/Payment/statistics - Get payment statistics
  getPaymentStatistics: async () => {
    const response = await api.get("/api/Payment/statistics");
    return response.data;
  },

  // POST /api/Payment/process/{id} - Process payment
  processPayment: async (id) => {
    const response = await api.post(`/api/Payment/process/${id}`);
    return response.data;
  },
};

export default paymentService;
