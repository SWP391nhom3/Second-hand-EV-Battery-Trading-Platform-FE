// API Constants and Enums based on database schema

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
};
