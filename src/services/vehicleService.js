import api from "../configs/axios";

const vehicleService = {
  // GET /api/Vehicle - Get all vehicles
  getVehicles: async (params = {}) => {
    const response = await api.get("/api/Vehicle", { params });
    return response.data;
  },

  // POST /api/Vehicle - Create new vehicle
  createVehicle: async (vehicleData) => {
    const response = await api.post("/api/Vehicle", vehicleData);
    return response.data;
  },

  // GET /api/Vehicle/{id} - Get vehicle by ID
  getVehicleById: async (id) => {
    const response = await api.get(`/api/Vehicle/${id}`);
    return response.data;
  },

  // PUT /api/Vehicle/{id} - Update vehicle
  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/api/Vehicle/${id}`, vehicleData);
    return response.data;
  },

  // DELETE /api/Vehicle/{id} - Delete vehicle
  deleteVehicle: async (id) => {
    const response = await api.delete(`/api/Vehicle/${id}`);
    return response.data;
  },
};

export default vehicleService;
