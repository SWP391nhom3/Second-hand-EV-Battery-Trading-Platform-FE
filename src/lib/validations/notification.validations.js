import { z } from 'zod'

/**
 * Validation schemas cho Notification Module (UC37, UC38)
 */

/**
 * Schema cho NotificationSearchRequest
 * UC37: Xem Danh sách Thông báo
 */
export const notificationSearchSchema = z.object({
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
    .default(10)
    .optional(),

  notificationType: z
    .string()
    .optional()
    .nullable(),

  isRead: z
    .boolean()
    .optional()
    .nullable(),

  sortBy: z
    .string()
    .default('CreatedAt')
    .optional(),

  sortOrder: z
    .enum(['ASC', 'DESC'], {
      invalid_type_error: 'Thứ tự sắp xếp không hợp lệ. Chỉ chấp nhận: ASC, DESC'
    })
    .default('DESC')
    .optional()
})

/**
 * Schema cho NotificationMarkReadRequest
 * UC38: Đánh dấu Thông báo đã đọc
 */
export const notificationMarkReadSchema = z.object({
  notificationId: z
    .string()
    .uuid('Notification ID phải là UUID hợp lệ')
    .optional()
    .nullable()
})

