import { z } from 'zod'

/**
 * Validation schemas cho Module 5: Tìm kiếm và Xem Bài đăng
 */

/**
 * Schema cho PostSearchRequest
 * Validate các filter params khi tìm kiếm bài đăng
 */
export const postSearchSchema = z.object({
  // Pagination
  pageNumber: z.number().int().min(1).default(1).optional(),
  pageSize: z.number().int().min(1).max(100).default(12).optional(),
  sortBy: z.enum(['price', 'approvedAt', 'popularity', 'priorityLevel', 'createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).default('asc').optional(),

  // Search filters
  keyword: z.string().max(200).optional(),
  categoryId: z.number().int().positive().optional(),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  location: z.string().max(200).optional(),

  // Price range
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),

  // Production year range
  minProductionYear: z.number().int().min(1900).max(2100).optional(),
  maxProductionYear: z.number().int().min(1900).max(2100).optional(),

  // Battery capacity range (SOH)
  minBatteryCapacity: z.number().nonnegative().optional(),
  maxBatteryCapacity: z.number().nonnegative().optional(),

  // Mileage range (chỉ cho Xe điện)
  minMileage: z.number().int().nonnegative().optional(),
  maxMileage: z.number().int().nonnegative().optional(),

  // Condition
  condition: z.enum(['Mới', 'Cũ', 'Đã qua sử dụng']).optional(),

  // Auction only
  auctionOnly: z.boolean().optional()
}).refine(
  (data) => {
    // Validate price range
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.minPrice <= data.maxPrice
    }
    return true
  },
  {
    message: 'Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa',
    path: ['maxPrice']
  }
).refine(
  (data) => {
    // Validate production year range
    if (data.minProductionYear !== undefined && data.maxProductionYear !== undefined) {
      return data.minProductionYear <= data.maxProductionYear
    }
    return true
  },
  {
    message: 'Năm sản xuất từ phải nhỏ hơn hoặc bằng năm sản xuất đến',
    path: ['maxProductionYear']
  }
).refine(
  (data) => {
    // Validate battery capacity range
    if (data.minBatteryCapacity !== undefined && data.maxBatteryCapacity !== undefined) {
      return data.minBatteryCapacity <= data.maxBatteryCapacity
    }
    return true
  },
  {
    message: 'Dung lượng pin tối thiểu phải nhỏ hơn hoặc bằng dung lượng pin tối đa',
    path: ['maxBatteryCapacity']
  }
).refine(
  (data) => {
    // Validate mileage range
    if (data.minMileage !== undefined && data.maxMileage !== undefined) {
      return data.minMileage <= data.maxMileage
    }
    return true
  },
  {
    message: 'Số km tối thiểu phải nhỏ hơn hoặc bằng số km tối đa',
    path: ['maxMileage']
  }
)

/**
 * Schema cho PostCompareRequest
 * Validate request so sánh sản phẩm
 */
export const postCompareSchema = z.object({
  postIds: z.array(z.string().uuid())
    .min(2, 'Phải chọn ít nhất 2 sản phẩm để so sánh')
    .max(5, 'Chỉ có thể so sánh tối đa 5 sản phẩm')
})

/**
 * Helper function để validate search params từ URL query
 */
export function validateSearchParams(params) {
  try {
    // Convert string values to appropriate types
    const convertedParams = {
      ...params,
      pageNumber: params.pageNumber ? parseInt(params.pageNumber, 10) : 1,
      pageSize: params.pageSize ? parseInt(params.pageSize, 10) : 12,
      minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
      minProductionYear: params.minProductionYear ? parseInt(params.minProductionYear, 10) : undefined,
      maxProductionYear: params.maxProductionYear ? parseInt(params.maxProductionYear, 10) : undefined,
      minBatteryCapacity: params.minBatteryCapacity ? parseFloat(params.minBatteryCapacity) : undefined,
      maxBatteryCapacity: params.maxBatteryCapacity ? parseFloat(params.maxBatteryCapacity) : undefined,
      minMileage: params.minMileage ? parseInt(params.minMileage, 10) : undefined,
      maxMileage: params.maxMileage ? parseInt(params.maxMileage, 10) : undefined,
      categoryId: params.categoryId ? parseInt(params.categoryId, 10) : undefined,
      auctionOnly: params.auctionOnly === 'true' || params.auctionOnly === true
    }

    // Remove undefined values
    Object.keys(convertedParams).forEach(key => {
      if (convertedParams[key] === undefined || convertedParams[key] === '') {
        delete convertedParams[key]
      }
    })

    return postSearchSchema.parse(convertedParams)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

/**
 * Helper function để validate compare request
 */
export function validateCompareRequest(postIds) {
  try {
    return postCompareSchema.parse({ postIds })
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}


