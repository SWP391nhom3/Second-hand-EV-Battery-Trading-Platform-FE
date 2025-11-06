import api from "../configs/axios";
import { API_ENDPOINTS } from "../constants/apiConstants";

/**
 * Battery Model Service
 * Handles all battery model-related API calls
 * @module batteryModelService
 */
const batteryModelService = {
  // ==========================================================================
  // BATTERY MODEL QUERIES
  // ==========================================================================

  /**
   * Get battery models with filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} [params.brand] - Filter by brand
   * @param {string} [params.chemistry] - Filter by chemistry type
   * @param {number} [params.minVoltage] - Minimum voltage
   * @param {number} [params.maxVoltage] - Maximum voltage
   * @param {number} [params.minCapacityKWh] - Minimum capacity in kWh
   * @param {number} [params.maxCapacityKWh] - Maximum capacity in kWh
   * @param {number} [params.minAmperage] - Minimum amperage
   * @param {number} [params.maxAmperage] - Maximum amperage
   * @param {string} [params.formFactor] - Form factor filter
   * @param {number} [params.minCycles] - Minimum cycle count
   * @param {number} [params.maxCycles] - Maximum cycle count
   * @param {boolean} [params.isCustom] - Filter custom models
   * @param {boolean} [params.isApproved] - Filter approved models
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.pageSize=20] - Items per page
   * @returns {Promise<Object>} Battery models with pagination
   */
  getBatteryModels: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.BATTERY_MODEL.LIST, { params });
    return response.data;
  },

  /**
   * Get battery model by ID
   * @param {number} id - Battery model ID
   * @returns {Promise<Object>} Battery model details
   */
  getBatteryModelById: async (id) => {
    const response = await api.get(API_ENDPOINTS.BATTERY_MODEL.BY_ID(id));
    return response.data;
  },

  /**
   * Search battery models by query string
   * @param {Object} params - Search parameters
   * @param {string} params.q - Search query
   * @param {number} [params.limit=10] - Result limit
   * @returns {Promise<Array>} Matching battery models
   */
  searchBatteryModels: async (params) => {
    const response = await api.get(API_ENDPOINTS.BATTERY_MODEL.SEARCH, { params });
    return response.data;
  },

  /**
   * Get all available filter options
   * @returns {Promise<Object>} Available filters (brands, chemistries, form factors, etc.)
   */
  getAllFilters: async () => {
    const response = await api.get(API_ENDPOINTS.BATTERY_MODEL.ALL_FILTERS);
    return response.data;
  },

  // ==========================================================================
  // CUSTOM BATTERY MODEL OPERATIONS
  // ==========================================================================

  /**
   * Create custom battery model (requires approval)
   * @param {Object} modelData - Battery model data
   * @param {string} modelData.name - Model name
   * @param {string} modelData.brand - Brand name
   * @param {string} [modelData.chemistry] - Battery chemistry
   * @param {number} [modelData.voltage] - Voltage
   * @param {number} [modelData.capacityKWh] - Capacity in kWh
   * @param {number} [modelData.amperage] - Amperage
   * @param {number} [modelData.weight] - Weight
   * @param {string} [modelData.formFactor] - Form factor
   * @param {number} [modelData.cycles] - Expected cycle count
   * @param {string} [modelData.description] - Description
   * @param {string} [modelData.customSpec] - Custom specifications
   * @param {string} [modelData.imageUrl] - Image URL
   * @returns {Promise<Object>} Created battery model
   */
  createCustomBatteryModel: async (modelData) => {
    const response = await api.post(API_ENDPOINTS.BATTERY_MODEL.CUSTOM, modelData);
    return response.data;
  },

  /**
   * Upload image for battery model
   * @param {number} id - Battery model ID
   * @param {File} file - Image file
   * @returns {Promise<Object>} Upload response with image URL
   */
  uploadBatteryModelImage: async (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post(API_ENDPOINTS.BATTERY_MODEL.IMAGE(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default batteryModelService;
