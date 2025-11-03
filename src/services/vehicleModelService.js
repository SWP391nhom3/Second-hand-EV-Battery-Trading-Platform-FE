import api from "../configs/axios";

const vehicleModelService = {
  // GET /api/VehicleModel/list - Get all vehicle models
  getVehicleModels: async (params = {}) => {
    const response = await api.get("/api/VehicleModel/list", { params });
    return response.data;
  },

  // GET /api/VehicleModel/{id} - Get vehicle model by ID
  getVehicleModelById: async (id) => {
    const response = await api.get(`/api/VehicleModel/${id}`);
    return response.data;
  },

  // POST /api/VehicleModel/custom - Create custom vehicle model
  createCustomVehicleModel: async (modelData) => {
    const response = await api.post("/api/VehicleModel/custom", modelData);
    return response.data;
  },

  // GET /api/VehicleModel/all-filters - Get all available filters
  getAllFilters: async () => {
    const response = await api.get("/api/VehicleModel/all-filters");
    return response.data;
  },

  // GET /api/VehicleModel/search - Search vehicle models
  searchVehicleModels: async (params) => {
    const response = await api.get("/api/VehicleModel/search", { params });
    return response.data;
  },
};

export default vehicleModelService;
