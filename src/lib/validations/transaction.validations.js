import { z } from 'zod';

/**
 * Validation schema cho OrderSearchRequest
 */
export const orderSearchSchema = z.object({
  pageNumber: z.number().int().positive().default(1).optional(),
  pageSize: z.number().int().positive().max(100).default(10).optional(),
  sortBy: z.enum(['createdat', 'finalprice', 'status']).optional(),
  sortDirection: z.enum(['asc', 'desc']).default('desc').optional(),
  transactionType: z.enum(['BUY', 'SELL']).optional().nullable(),
  status: z.enum([
    'PENDING_PAYMENT',
    'PAID',
    'CONFIRMED',
    'SHIPPING',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED'
  ]).optional().nullable(),
  fromDate: z.string().optional().nullable(), // ISO date string (YYYY-MM-DD)
  toDate: z.string().optional().nullable(), // ISO date string (YYYY-MM-DD)
  keyword: z.string().max(255).optional().nullable(),
});

/**
 * Validate order search request
 * @param {object} data - Order search request data
 * @returns {object} - Validation result
 */
export const validateOrderSearch = (data) => {
  try {
    const validated = orderSearchSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return { success: false, errors: [{ message: 'Validation error' }] };
  }
};

/**
 * Format order search request for API
 * @param {object} data - Order search request data
 * @returns {object} - Formatted request
 */
export const formatOrderSearchRequest = (data) => {
  const formatted = {
    pageNumber: data.pageNumber || 1,
    pageSize: data.pageSize || 10,
    sortBy: data.sortBy || 'createdat',
    sortDirection: data.sortDirection || 'desc',
  };

  if (data.transactionType) {
    formatted.transactionType = data.transactionType;
  }

  if (data.status) {
    formatted.status = data.status;
  }

  if (data.fromDate) {
    formatted.fromDate = data.fromDate;
  }

  if (data.toDate) {
    formatted.toDate = data.toDate;
  }

  if (data.keyword) {
    formatted.keyword = data.keyword.trim();
  }

  return formatted;
};

