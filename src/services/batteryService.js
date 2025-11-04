import api from "../configs/axios";

const batteryService = {
  // GET /api/Battery - Get all batteries
  getBatteries: async (params = {}) => {
    const response = await api.get("/api/Battery", { params });
    return response.data;
  },

  // POST /api/Battery - Create new battery
  createBattery: async (batteryData) => {
    const response = await api.post("/api/Battery", batteryData);
    return response.data;
  },

  // GET /api/Battery/{id} - Get battery by ID
  getBatteryById: async (id) => {
    const response = await api.get(`/api/Battery/${id}`);
    return response.data;
  },

  // PUT /api/Battery/{id} - Update battery
  updateBattery: async (id, batteryData) => {
    const response = await api.put(`/api/Battery/${id}`, batteryData);
    return response.data;
  },

  // DELETE /api/Battery/{id} - Delete battery
  deleteBattery: async (id) => {
    const response = await api.delete(`/api/Battery/${id}`);
    return response.data;
  },

  // GET /api/Battery/member/{memberId} - Get batteries by member
  getBatteriesByMember: async (memberId) => {
    const response = await api.get(`/api/Battery/member/${memberId}`);
    return response.data;
  },

  // GET /api/Battery/search - Search batteries
  searchBatteries: async (params) => {
    const response = await api.get("/api/Battery/search", { params });
    return response.data;
  },
};

export default batteryService;
