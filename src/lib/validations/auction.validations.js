import { z } from 'zod'

/**
 * Validation schema cho BidCreateRequest
 */
export const bidCreateSchema = z.object({
  postId: z.string().uuid('ID bài đăng không hợp lệ'),
  bidAmount: z
    .number({
      required_error: 'Giá đấu là bắt buộc',
      invalid_type_error: 'Giá đấu phải là số'
    })
    .positive('Giá đấu phải lớn hơn 0')
    .refine(
      (val) => {
        // Kiểm tra số chữ số thập phân (tối đa 2)
        const decimalPlaces = (val.toString().split('.')[1] || '').length
        return decimalPlaces <= 2
      },
      {
        message: 'Giá đấu không hợp lệ (tối đa 2 chữ số thập phân)'
      }
    )
    .refine(
      (val) => {
        // Kiểm tra tổng số chữ số (tối đa 15)
        const totalDigits = val.toString().replace('.', '').length
        return totalDigits <= 15
      },
      {
        message: 'Giá đấu không hợp lệ (tối đa 15 chữ số)'
      }
    )
})

/**
 * Schema validation cho BidCreateRequest
 * Sử dụng bidCreateSchema.parse(data) để validate dữ liệu
 */

