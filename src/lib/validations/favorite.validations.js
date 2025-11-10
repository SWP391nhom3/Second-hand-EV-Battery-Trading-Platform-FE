import { z } from 'zod'

/**
 * Validation schemas cho Favorite module
 */

/**
 * Schema để validate postId khi thêm/xóa favorite
 */
export const favoriteRequestSchema = z.object({
  postId: z.string().uuid('ID bài đăng không hợp lệ')
})

/**
 * Schema để validate params khi lấy danh sách favorites
 */
export const favoriteListRequestSchema = z.object({
  pageNumber: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(12),
  keyword: z.string().optional(),
  categoryId: z.number().int().positive().optional(),
  status: z.string().optional(),
  isActive: z.boolean().optional(),
  isSold: z.boolean().optional()
})


