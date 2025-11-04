import api from "../configs/axios";

const batteryModelService = {
  // GET /api/BatteryModel/list - Get all battery models
  getBatteryModels: async (params = {}) => {
    const response = await api.get("/api/BatteryModel/list", { params });
    return response.data;
  },

  // GET /api/BatteryModel/{id} - Get battery model by ID
  getBatteryModelById: async (id) => {
    const response = await api.get(`/api/BatteryModel/${id}`);
    return response.data;
  },

  // POST /api/BatteryModel/custom - Create custom battery model
  createCustomBatteryModel: async (modelData) => {
    const response = await api.post("/api/BatteryModel/custom", modelData);
    return response.data;
  },

  // GET /api/BatteryModel/all-filters - Get all available filters
  getAllFilters: async () => {
    const response = await api.get("/api/BatteryModel/all-filters");
    return response.data;
  },

  // GET /api/BatteryModel/search - Search battery models
  searchBatteryModels: async (params) => {
    const response = await api.get("/api/BatteryModel/search", { params });
    return response.data;
  },
};

export default batteryModelService;
