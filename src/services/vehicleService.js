import api from "../configs/axios";
import { API_ENDPOINTS } from "../constants/apiConstants";

/**
 * Vehicle Service
 * Handles all vehicle (individual item) related API calls
 * @module vehicleService
 */
const vehicleService = {
  // ==========================================================================
  // BASIC CRUD OPERATIONS
  // ==========================================================================

  /**
   * Get all vehicles
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.pageSize] - Items per page
   * @returns {Promise<Array>} Vehicles list
   */
  getVehicles: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.VEHICLE.BASE, { params });
    return response.data;
  },

  /**
   * Create new vehicle
   * @param {Object} vehicleData - Vehicle data
   * @param {number} vehicleData.memberId - Owner member ID
   * @param {number} [vehicleData.vehicleModelId] - Vehicle model ID (optional)
   * @param {string} [vehicleData.vin] - Vehicle Identification Number
   * @param {number} vehicleData.manufactureYear - Manufacturing year
   * @param {number} vehicleData.mileageKm - Mileage in kilometers
   * @param {number} vehicleData.batteryCapacity - Battery capacity in kWh
   * @param {string} vehicleData.condition - Condition (Excellent/Good/Fair/Poor/New/LikeNew/Used)
   * @param {string} vehicleData.description - Description
   * @returns {Promise<Object>} Created vehicle
   */
  createVehicle: async (vehicleData) => {
    const response = await api.post(API_ENDPOINTS.VEHICLE.BASE, vehicleData);
    return response.data;
  },

  /**
   * Get vehicle by ID
   * @param {number} id - Vehicle ID
   * @returns {Promise<Object>} Vehicle details
   */
  getVehicleById: async (id) => {
    const response = await api.get(API_ENDPOINTS.VEHICLE.BY_ID(id));
    return response.data;
  },

  /**
   * Update vehicle
   * @param {number} id - Vehicle ID
   * @param {Object} vehicleData - Updated vehicle data
   * @returns {Promise<Object>} Updated vehicle
   */
  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(API_ENDPOINTS.VEHICLE.BY_ID(id), vehicleData);
    return response.data;
  },

  /**
   * Delete vehicle
   * @param {number} id - Vehicle ID
   * @returns {Promise<Object>} Delete response
   */
  deleteVehicle: async (id) => {
    const response = await api.delete(API_ENDPOINTS.VEHICLE.BY_ID(id));
    return response.data;
  },

  // ==========================================================================
  // VEHICLE QUERIES
  // ==========================================================================

  /**
   * Get all vehicles owned by a member
   * @param {number} memberId - Member ID
   * @returns {Promise<Array>} Member's vehicles
   */
  getVehiclesByMember: async (memberId) => {
    const response = await api.get(API_ENDPOINTS.VEHICLE.BY_MEMBER(memberId));
    return response.data;
  },

  /**
   * Search vehicles
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} Matching vehicles
   */
  searchVehicles: async (params) => {
    const response = await api.get(API_ENDPOINTS.VEHICLE.SEARCH, { params });
    return response.data;
  },
};

export default vehicleService;
