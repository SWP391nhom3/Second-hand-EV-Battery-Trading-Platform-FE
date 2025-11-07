// =============================================================================
// API CONSTANTS AND ENUMS
// Based on OpenAPI spec v1 and database schema
// Last updated: November 7, 2025
// =============================================================================

// Post Status
export const POST_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SOLD: "Sold",
  EXPIRED: "Expired",
};

// Post Type
export const POST_TYPE = {
  BATTERY: "Battery",
  VEHICLE: "Vehicle",
  BOTH: "Both",
};

// Transaction Type
export const TRANSACTION_TYPE = {
  DIRECT: "DIRECT",
  STAFF_ASSISTED: "STAFF_ASSISTED",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

// Payment Method
export const PAYMENT_METHOD = {
  BANK_TRANSFER: "BankTransfer",
  MOMO: "MoMo",
  VNPAY: "VNPay",
  CASH: "Cash",
};

// Post Request Status
export const POST_REQUEST_STATUS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

// Member Status
export const MEMBER_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
  BANNED: "Banned",
};

// Role Names
export const ROLE = {
  ADMIN: "Admin",
  STAFF: "Staff",
  CUSTOMER: "Customer",
  MEMBER: "Member",
};

// Construct Type
export const CONSTRUCT_TYPE = {
  INSPECTION: "Inspection",
  REPAIR: "Repair",
  MAINTENANCE: "Maintenance",
  INSTALLATION: "Installation",
};

// Construct Status
export const CONSTRUCT_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "InProgress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// Battery Condition
export const BATTERY_CONDITION = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
  NEW: "New",
  USED: "Used",
};

// Vehicle Condition
export const VEHICLE_CONDITION = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
  NEW: "New",
  LIKE_NEW: "LikeNew",
  USED: "Used",
};

// Battery Chemistry Types
export const BATTERY_CHEMISTRY = {
  LITHIUM_ION: "Lithium-Ion",
  LITHIUM_POLYMER: "Lithium-Polymer",
  NICKEL_METAL_HYDRIDE: "Nickel-Metal-Hydride",
  LEAD_ACID: "Lead-Acid",
  SOLID_STATE: "Solid-State",
};

// Vehicle Types
export const VEHICLE_TYPE = {
  MOTORCYCLE: "Motorcycle",
  SCOOTER: "Scooter",
  BICYCLE: "Bicycle",
  CAR: "Car",
  TRUCK: "Truck",
  BUS: "Bus",
};

// OTP Purpose
export const OTP_PURPOSE = {
  EMAIL_VERIFICATION: "EmailVerification",
  PASSWORD_RESET: "PasswordReset",
  TWO_FACTOR_AUTH: "TwoFactorAuth",
  GOOGLE_LOGIN: "GoogleLogin",
};

// Package Subscription Status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "Active",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

// Service Fee Status
export const SERVICE_FEE_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

// Form Factor for Battery
export const BATTERY_FORM_FACTOR = {
  CYLINDRICAL: "Cylindrical",
  PRISMATIC: "Prismatic",
  POUCH: "Pouch",
};

// API Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized. Please login again.",
  FORBIDDEN: "You don't have permission to access this resource.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Validation error. Please check your input.",
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// =============================================================================
// API ENDPOINTS
// =============================================================================

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/api/Auth/register",
    LOGIN: "/api/Auth/login",
    STAFF_LOGIN: "/api/Auth/staff-login",
    CHANGE_PASSWORD: "/api/Auth/change-password",
    FORGOT_PASSWORD: "/api/Auth/forgot-password",
    CREATE_ADMIN: "/api/Auth/create-admin",
    CREATE_STAFF: "/api/Auth/create-staff",
    GOOGLE_START: "/api/Auth/google/start",
    GOOGLE_CALLBACK: "/api/Auth/google/callback",
    GOOGLE_REGISTER_COMPLETE: "/api/Auth/google/register-complete",
    GOOGLE_LOGIN_OTP: "/api/Auth/google/login-otp",
    OTP_VERIFY: "/api/Auth/otp/verify",
  },

  // Account endpoints
  ACCOUNT: {
    BASE: "/api/Account",
    BY_ID: (id) => `/api/Account/${id}`,
  },

  // Member endpoints
  MEMBER: {
    BASE: "/api/Member",
    BY_ID: (id) => `/api/Member/${id}`,
    TOP_RATED: "/api/Member/top-rated",
  },

  // Post endpoints
  POST: {
    BASE: "/api/Post",
    BY_ID: (id) => `/api/Post/${id}`,
    BY_MEMBER: (memberId) => `/api/Post/member/${memberId}`,
    CHECKOUT_URL: (postId) => `/api/Post/${postId}/checkout-url`,
    ASSIGN_STAFF: (postId, staffId) => `/api/Post/${postId}/assign-staff/${staffId}`,
    FEATURED: "/api/Post/featured",
    DIRECT: "/api/Post/direct",
    STAFF_ASSISTED: "/api/Post/staff-assisted",
    // Admin endpoints
    ADMIN_ALL: "/api/Post/admin/all",
    ADMIN_PENDING: "/api/Post/admin/pending",
    ADMIN_APPROVE: (id) => `/api/Post/admin/${id}/approve`,
    ADMIN_REJECT: (id) => `/api/Post/admin/${id}/reject`,
  },

  // Post Request endpoints
  POST_REQUEST: {
    BASE: "/api/PostRequest",
    BY_ID: (id) => `/api/PostRequest/${id}`,
    BY_POST: (postId) => `/api/PostRequest/post/${postId}`,
    BY_BUYER: (buyerId) => `/api/PostRequest/buyer/${buyerId}`,
    BY_STATUS: (status) => `/api/PostRequest/status/${status}`,
    UPDATE_STATUS: (id) => `/api/PostRequest/${id}/status`,
    ACCEPT: (id) => `/api/PostRequest/${id}/accept`,
    REJECT: (id) => `/api/PostRequest/${id}/reject`,
    STATISTICS: "/api/PostRequest/statistics",
    NEGOTIATIONS: (postId) => `/api/PostRequest/negotiations/${postId}`,
  },

  // Post Package endpoints
  POST_PACKAGE: {
    BASE: "/api/PostPackage",
    BY_ID: (id) => `/api/PostPackage/${id}`,
    ACTIVE: "/api/PostPackage/active",
    SUBSCRIPTIONS: (id) => `/api/PostPackage/${id}/subscriptions`,
    SUBSCRIBE: (packageId) => `/api/PostPackage/${packageId}/subscribe`,
    STATISTICS: "/api/PostPackage/statistics",
  },

  // Payment endpoints
  PAYMENT: {
    BASE: "/api/Payment",
    BY_ID: (id) => `/api/Payment/${id}`,
    BY_BUYER: (buyerId) => `/api/Payment/buyer/${buyerId}`,
    BY_SELLER: (sellerId) => `/api/Payment/seller/${sellerId}`,
    BY_STATUS: (status) => `/api/Payment/status/${status}`,
    UPDATE_STATUS: (id) => `/api/Payment/${id}/status`,
    STATISTICS: "/api/Payment/statistics",
    PROCESS: (id) => `/api/Payment/process/${id}`,
    // Stripe/Payment gateway endpoints
    CHECKOUT: "/api/Payments/checkout",
    WEBHOOK: "/api/Payments/webhook",
    WEBHOOK_TEST: "/api/Payments/webhook/test",
  },

  // Battery endpoints
  BATTERY: {
    BASE: "/api/Battery",
    BY_ID: (id) => `/api/Battery/${id}`,
    BY_MEMBER: (memberId) => `/api/Battery/member/${memberId}`,
    SEARCH: "/api/Battery/search",
  },

  // Battery Model endpoints
  BATTERY_MODEL: {
    LIST: "/api/BatteryModel/list",
    BY_ID: (id) => `/api/BatteryModel/${id}`,
    IMAGE: (id) => `/api/BatteryModel/${id}/image`,
    CUSTOM: "/api/BatteryModel/custom",
    ALL_FILTERS: "/api/BatteryModel/all-filters",
    SEARCH: "/api/BatteryModel/search",
  },

  // Vehicle endpoints
  VEHICLE: {
    BASE: "/api/Vehicle",
    BY_ID: (id) => `/api/Vehicle/${id}`,
    BY_MEMBER: (memberId) => `/api/Vehicle/member/${memberId}`,
    SEARCH: "/api/Vehicle/search",
  },

  // Vehicle Model endpoints
  VEHICLE_MODEL: {
    LIST: "/api/VehicleModel/list",
    BY_ID: (id) => `/api/VehicleModel/${id}`,
    IMAGE: (id) => `/api/VehicleModel/${id}/image`,
    CUSTOM: "/api/VehicleModel/custom",
    ALL_FILTERS: "/api/VehicleModel/all-filters",
    SEARCH: "/api/VehicleModel/search",
  },

  // Construct endpoints
  CONSTRUCT: {
    BASE: "/api/Construct",
    BY_ID: (id) => `/api/Construct/${id}`,
    BY_TYPE: (type) => `/api/Construct/type/${type}`,
    BY_STATUS: (status) => `/api/Construct/status/${status}`,
    UPDATE_STATUS: (id) => `/api/Construct/${id}/status`,
    FEES: (id) => `/api/Construct/${id}/fees`,
    ADD_FEE: (id) => `/api/Construct/${id}/fees`,
    SEARCH: "/api/Construct/search",
    STATISTICS: "/api/Construct/statistics",
    NEARBY: "/api/Construct/nearby",
  },

  // Role endpoints
  ROLE: {
    BASE: "/api/Role",
    BY_ID: (id) => `/api/Role/${id}`,
    BY_NAME: (name) => `/api/Role/name/${name}`,
    BY_STATUS: (status) => `/api/Role/status/${status}`,
    UPDATE_STATUS: (id) => `/api/Role/${id}/status`,
    ACCOUNTS: (id) => `/api/Role/${id}/accounts`,
    STATISTICS: "/api/Role/statistics",
    INITIALIZE_DEFAULT: "/api/Role/initialize-default",
    PERMISSIONS: (roleId) => `/api/Role/permissions/${roleId}`,
  },
};

export default {
  POST_STATUS,
  POST_TYPE,
  TRANSACTION_TYPE,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  POST_REQUEST_STATUS,
  MEMBER_STATUS,
  ROLE,
  CONSTRUCT_TYPE,
  CONSTRUCT_STATUS,
  BATTERY_CONDITION,
  VEHICLE_CONDITION,
  BATTERY_CHEMISTRY,
  VEHICLE_TYPE,
  OTP_PURPOSE,
  SUBSCRIPTION_STATUS,
  SERVICE_FEE_STATUS,
  BATTERY_FORM_FACTOR,
  API_ERROR_MESSAGES,
  PAGINATION,
  API_ENDPOINTS,
};
