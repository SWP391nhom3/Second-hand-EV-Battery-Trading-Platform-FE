import api from "../configs/axios";

const packageService = {
  // GET /api/PostPackage - Get all packages
  getPackages: async (params = {}) => {
    const response = await api.get("/api/PostPackage", { params });
    return response.data;
  },

  // POST /api/PostPackage - Create new package
  createPackage: async (packageData) => {
    const response = await api.post("/api/PostPackage", packageData);
    return response.data;
  },

  // GET /api/PostPackage/{id} - Get package by ID
  getPackageById: async (id) => {
    const response = await api.get(`/api/PostPackage/${id}`);
    return response.data;
  },

  // PUT /api/PostPackage/{id} - Update package
  updatePackage: async (id, packageData) => {
    const response = await api.put(`/api/PostPackage/${id}`, packageData);
    return response.data;
  },

  // DELETE /api/PostPackage/{id} - Delete package
  deletePackage: async (id) => {
    const response = await api.delete(`/api/PostPackage/${id}`);
    return response.data;
  },

  // GET /api/PostPackage/active - Get active packages
  getActivePackages: async () => {
    const response = await api.get("/api/PostPackage/active");
    return response.data;
  },

  // GET /api/PostPackage/{id}/subscriptions - Get package subscriptions
  getPackageSubscriptions: async (id) => {
    const response = await api.get(`/api/PostPackage/${id}/subscriptions`);
    return response.data;
  },

  // POST /api/PostPackage/{packageId}/subscribe - Subscribe to package
  subscribeToPackage: async (packageId, subscriptionData) => {
    const response = await api.post(`/api/PostPackage/${packageId}/subscribe`, subscriptionData);
    return response.data;
  },

  // GET /api/PostPackage/statistics - Get package statistics
  getPackageStatistics: async () => {
    const response = await api.get("/api/PostPackage/statistics");
    return response.data;
  },
};

export default packageService;
