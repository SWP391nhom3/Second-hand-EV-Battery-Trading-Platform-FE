import { z } from 'zod'

/**
 * Validation schemas cho Chat Module (UC35, UC36)
 */

/**
 * Schema cho MessageCreateRequest
 * UC35: Gửi Tin nhắn
 */
export const messageCreateSchema = z.object({
  roomId: z
    .string()
    .uuid('Room ID phải là UUID hợp lệ')
    .optional()
    .nullable(),

  postId: z
    .string()
    .uuid('Post ID phải là UUID hợp lệ')
    .optional()
    .nullable(),

  content: z
    .string({
      invalid_type_error: 'Nội dung tin nhắn phải là chuỗi ký tự'
    })
    .min(1, 'Nội dung tin nhắn không được để trống')
    .max(5000, 'Nội dung tin nhắn không được vượt quá 5000 ký tự')
    .optional()
    .nullable(),

  messageType: z
    .enum(['TEXT', 'IMAGE', 'FILE'], {
      invalid_type_error: 'Loại tin nhắn không hợp lệ. Chỉ chấp nhận: TEXT, IMAGE, FILE'
    })
    .default('TEXT'),

  file: z
    .any()
    .optional()
    .nullable()
}).refine(
  (data) => {
    // Nếu là TEXT, content là bắt buộc
    if (data.messageType === 'TEXT') {
      return data.content && data.content.trim().length > 0
    }
    // Nếu là IMAGE hoặc FILE, file là bắt buộc
    if (data.messageType === 'IMAGE' || data.messageType === 'FILE') {
      return data.file !== null && data.file !== undefined
    }
    return true
  },
  {
    message: 'Nội dung tin nhắn hoặc file là bắt buộc tùy theo loại tin nhắn'
  }
).refine(
  (data) => {
    // Phải có roomId hoặc postId
    return data.roomId !== null || data.postId !== null
  },
  {
    message: 'Phải có Room ID hoặc Post ID'
  }
)

/**
 * Schema cho ChatHistoryRequest
 * UC36: Xem Lịch sử Chat
 */
export const chatHistorySchema = z.object({
  roomId: z
    .string({
      required_error: 'Room ID không được để trống',
      invalid_type_error: 'Room ID không hợp lệ'
    })
    .uuid('Room ID phải là UUID hợp lệ'),

  pageNumber: z
    .number({
      invalid_type_error: 'Số trang phải là số'
    })
    .int('Số trang phải là số nguyên')
    .min(1, 'Số trang phải lớn hơn 0')
    .default(1)
    .optional(),

  pageSize: z
    .number({
      invalid_type_error: 'Số items mỗi trang phải là số'
    })
    .int('Số items mỗi trang phải là số nguyên')
    .min(1, 'Số items mỗi trang phải lớn hơn 0')
    .max(100, 'Số items mỗi trang không được vượt quá 100')
    .default(20)
    .optional()
})

/**
 * Schema cho ChatRoomsListRequest
 * Lấy danh sách phòng chat
 */
export const chatRoomsListSchema = z.object({
  pageNumber: z
    .number({
      invalid_type_error: 'Số trang phải là số'
    })
    .int('Số trang phải là số nguyên')
    .min(1, 'Số trang phải lớn hơn 0')
    .default(1)
    .optional(),

  pageSize: z
    .number({
      invalid_type_error: 'Số items mỗi trang phải là số'
    })
    .int('Số items mỗi trang phải là số nguyên')
    .min(1, 'Số items mỗi trang phải lớn hơn 0')
    .max(100, 'Số items mỗi trang không được vượt quá 100')
    .default(20)
    .optional()
})


