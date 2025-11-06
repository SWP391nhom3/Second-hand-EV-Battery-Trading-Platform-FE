import api from "../configs/axios";
import { API_ENDPOINTS } from "../constants/apiConstants";

/**
 * Vehicle Model Service
 * Handles all vehicle model-related API calls
 * @module vehicleModelService
 */
const vehicleModelService = {
  // ==========================================================================
  // VEHICLE MODEL QUERIES
  // ==========================================================================

  /**
   * Get vehicle models with filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} [params.brand] - Filter by brand
   * @param {number} [params.year] - Filter by year
   * @param {string} [params.type] - Filter by vehicle type
   * @param {number} [params.minMotorPower] - Minimum motor power
   * @param {number} [params.maxMotorPower] - Maximum motor power
   * @param {number} [params.minRange] - Minimum range in km
   * @param {number} [params.maxRange] - Maximum range in km
   * @param {number} [params.minSeats] - Minimum seats
   * @param {number} [params.maxSeats] - Maximum seats
   * @param {boolean} [params.isCustom] - Filter custom models
   * @param {boolean} [params.isApproved] - Filter approved models
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.pageSize=20] - Items per page
   * @returns {Promise<Object>} Vehicle models with pagination
   */
  getVehicleModels: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.VEHICLE_MODEL.LIST, { params });
    return response.data;
  },

  /**
   * Get vehicle model by ID
   * @param {number} id - Vehicle model ID
   * @returns {Promise<Object>} Vehicle model details
   */
  getVehicleModelById: async (id) => {
    const response = await api.get(API_ENDPOINTS.VEHICLE_MODEL.BY_ID(id));
    return response.data;
  },

  /**
   * Search vehicle models by query string
   * @param {Object} params - Search parameters
   * @param {string} params.q - Search query
   * @param {number} [params.limit=10] - Result limit
   * @returns {Promise<Array>} Matching vehicle models
   */
  searchVehicleModels: async (params) => {
    const response = await api.get(API_ENDPOINTS.VEHICLE_MODEL.SEARCH, { params });
    return response.data;
  },

  /**
   * Get all available filter options
   * @returns {Promise<Object>} Available filters (brands, types, years, etc.)
   */
  getAllFilters: async () => {
    const response = await api.get(API_ENDPOINTS.VEHICLE_MODEL.ALL_FILTERS);
    return response.data;
  },

  // ==========================================================================
  // CUSTOM VEHICLE MODEL OPERATIONS
  // ==========================================================================

  /**
   * Create custom vehicle model (requires approval)
   * @param {Object} modelData - Vehicle model data
   * @param {string} modelData.name - Model name
   * @param {string} modelData.brand - Brand name
   * @param {number} [modelData.year] - Manufacturing year
   * @param {string} [modelData.type] - Vehicle type
   * @param {number} [modelData.motorPower] - Motor power in kW
   * @param {string} [modelData.batteryType] - Battery type
   * @param {number} [modelData.voltage] - Voltage
   * @param {number} [modelData.maxSpeed] - Maximum speed in km/h
   * @param {number} [modelData.range] - Range in km
   * @param {number} [modelData.weight] - Weight in kg
   * @param {number} [modelData.seats] - Number of seats
   * @param {string} [modelData.description] - Description
   * @param {string} [modelData.customSpec] - Custom specifications
   * @param {string} [modelData.imageUrl] - Image URL
   * @returns {Promise<Object>} Created vehicle model
   */
  createCustomVehicleModel: async (modelData) => {
    const response = await api.post(API_ENDPOINTS.VEHICLE_MODEL.CUSTOM, modelData);
    return response.data;
  },

  /**
   * Upload image for vehicle model
   * @param {number} id - Vehicle model ID
   * @param {File} file - Image file
   * @returns {Promise<Object>} Upload response with image URL
   */
  uploadVehicleModelImage: async (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post(API_ENDPOINTS.VEHICLE_MODEL.IMAGE(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default vehicleModelService;
