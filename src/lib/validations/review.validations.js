import { z } from 'zod'

/**
 * Validation schemas cho Review/Rating module
 */

/**
 * Schema để validate RatingCreateRequest
 * UC31, UC32: Tạo đánh giá người bán/người mua
 */
export const ratingCreateRequestSchema = z.object({
  orderId: z.string().uuid('ID đơn hàng không hợp lệ'),
  score: z.number().int('Điểm số phải là số nguyên').min(1, 'Điểm số tối thiểu là 1').max(5, 'Điểm số tối đa là 5'),
  comment: z.string().max(1000, 'Nhận xét không được vượt quá 1000 ký tự').optional()
})

/**
 * Schema để validate RatingUpdateRequest
 * UC33: Chỉnh sửa đánh giá (trong vòng 7 ngày)
 */
export const ratingUpdateRequestSchema = z.object({
  score: z.number().int('Điểm số phải là số nguyên').min(1, 'Điểm số tối thiểu là 1').max(5, 'Điểm số tối đa là 5'),
  comment: z.string().max(1000, 'Nhận xét không được vượt quá 1000 ký tự').optional()
})

/**
 * Schema để validate RatingReplyRequest
 * UC34: Phản hồi đánh giá
 */
export const ratingReplyRequestSchema = z.object({
  replyContent: z.string().min(1, 'Nội dung phản hồi không được để trống').max(1000, 'Nội dung phản hồi không được vượt quá 1000 ký tự')
})

/**
 * Schema để validate RatingSearchRequest
 * Tìm kiếm và lọc đánh giá
 */
export const ratingSearchRequestSchema = z.object({
  pageNumber: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(10),
  rateeId: z.string().uuid('ID người được đánh giá không hợp lệ').optional(),
  orderId: z.string().uuid('ID đơn hàng không hợp lệ').optional(),
  rateeRole: z.enum(['SELLER', 'BUYER']).optional(),
  minScore: z.number().int().min(1).max(5).optional(),
  maxScore: z.number().int().min(1).max(5).optional()
}).refine(
  (data) => {
    // Validate minScore <= maxScore nếu cả hai đều có
    if (data.minScore !== undefined && data.maxScore !== undefined) {
      return data.minScore <= data.maxScore
    }
    return true
  },
  {
    message: 'Điểm số tối thiểu phải <= điểm số tối đa',
    path: ['minScore']
  }
)

