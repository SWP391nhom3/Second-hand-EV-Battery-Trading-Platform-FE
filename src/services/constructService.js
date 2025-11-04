import api from "../configs/axios";

const constructService = {
  // GET /api/Construct - Get all constructs
  getConstructs: async (params = {}) => {
    const response = await api.get("/api/Construct", { params });
    return response.data;
  },

  // POST /api/Construct - Create new construct
  createConstruct: async (constructData) => {
    const response = await api.post("/api/Construct", constructData);
    return response.data;
  },

  // GET /api/Construct/{id} - Get construct by ID
  getConstructById: async (id) => {
    const response = await api.get(`/api/Construct/${id}`);
    return response.data;
  },

  // PUT /api/Construct/{id} - Update construct
  updateConstruct: async (id, constructData) => {
    const response = await api.put(`/api/Construct/${id}`, constructData);
    return response.data;
  },

  // DELETE /api/Construct/{id} - Delete construct
  deleteConstruct: async (id) => {
    const response = await api.delete(`/api/Construct/${id}`);
    return response.data;
  },

  // GET /api/Construct/type/{type} - Get constructs by type
  getConstructsByType: async (type) => {
    const response = await api.get(`/api/Construct/type/${type}`);
    return response.data;
  },

  // GET /api/Construct/status/{status} - Get constructs by status
  getConstructsByStatus: async (status) => {
    const response = await api.get(`/api/Construct/status/${status}`);
    return response.data;
  },

  // PUT /api/Construct/{id}/status - Update construct status
  updateConstructStatus: async (id, statusData) => {
    const response = await api.put(`/api/Construct/${id}/status`, statusData);
    return response.data;
  },

  // GET /api/Construct/{id}/fees - Get construct fees
  getConstructFees: async (id) => {
    const response = await api.get(`/api/Construct/${id}/fees`);
    return response.data;
  },

  // POST /api/Construct/{id}/fees - Add construct fee
  addConstructFee: async (id, feeData) => {
    const response = await api.post(`/api/Construct/${id}/fees`, feeData);
    return response.data;
  },

  // GET /api/Construct/search - Search constructs
  searchConstructs: async (params) => {
    const response = await api.get("/api/Construct/search", { params });
    return response.data;
  },

  // GET /api/Construct/statistics - Get construct statistics
  getConstructStatistics: async () => {
    const response = await api.get("/api/Construct/statistics");
    return response.data;
  },

  // GET /api/Construct/nearby - Get nearby constructs
  getNearbyConstructs: async (params) => {
    const response = await api.get("/api/Construct/nearby", { params });
    return response.data;
  },
};

export default constructService;
