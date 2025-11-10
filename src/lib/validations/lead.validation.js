import { z } from 'zod'

/**
 * Validation schemas cho Lead Management Module (UC23, UC40, UC44, UC46)
 */

/**
 * Schema cho LeadCreateRequest
 * UC23: Tạo Lead (Đặt lịch xem / Yêu cầu Môi giới)
 */
export const leadCreateSchema = z.object({
  postId: z
    .string({
      required_error: 'Vui lòng chọn bài đăng',
      invalid_type_error: 'Post ID không hợp lệ'
    })
    .uuid('Post ID phải là UUID hợp lệ')
    .min(1, 'Vui lòng chọn bài đăng'),

  leadType: z
    .enum(['SCHEDULE_VIEW', 'AUCTION_WINNER'], {
      required_error: 'Vui lòng chọn loại Lead',
      invalid_type_error: 'Loại Lead không hợp lệ. Chỉ chấp nhận: SCHEDULE_VIEW, AUCTION_WINNER'
    })
    .default('SCHEDULE_VIEW')
    .optional()
})

/**
 * Schema cho LeadAssignStaffRequest
 * UC46: Gán Staff cho Lead
 */
export const leadAssignStaffSchema = z.object({
  staffId: z
    .string({
      required_error: 'Vui lòng chọn Staff',
      invalid_type_error: 'Staff ID không hợp lệ'
    })
    .uuid('Staff ID phải là UUID hợp lệ')
    .min(1, 'Vui lòng chọn Staff')
})

/**
 * Schema cho LeadSearchRequest
 * Filter và pagination cho danh sách Lead
 */
export const leadSearchSchema = z.object({
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

  staffId: z
    .string()
    .uuid('Staff ID phải là UUID hợp lệ')
    .optional()
    .nullable(),

  status: z
    .enum(['NEW', 'ASSIGNED', 'CONTACTED', 'SCHEDULED', 'SUCCESSFUL', 'FAILED'], {
      invalid_type_error: 'Trạng thái không hợp lệ'
    })
    .optional()
    .nullable(),

  leadType: z
    .enum(['SCHEDULE_VIEW', 'AUCTION_WINNER'], {
      invalid_type_error: 'Loại Lead không hợp lệ'
    })
    .optional()
    .nullable(),

  postId: z
    .string()
    .uuid('Post ID phải là UUID hợp lệ')
    .optional()
    .nullable(),

  buyerId: z
    .string()
    .uuid('Buyer ID phải là UUID hợp lệ')
    .optional()
    .nullable(),

  sortBy: z
    .enum(['CreatedAt', 'AssignedAt', 'Status'], {
      invalid_type_error: 'Trường sắp xếp không hợp lệ'
    })
    .default('CreatedAt')
    .optional(),

  sortOrder: z
    .enum(['ASC', 'DESC'], {
      invalid_type_error: 'Thứ tự sắp xếp không hợp lệ'
    })
    .default('DESC')
    .optional()
})

/**
 * Schema cho LeadStatusUpdateRequest
 * UC44: Cập nhật trạng thái Lead
 */
export const leadStatusUpdateSchema = z.object({
  status: z
    .enum(['CONTACTED', 'SCHEDULED', 'SUCCESSFUL', 'FAILED'], {
      required_error: 'Trạng thái không được để trống',
      invalid_type_error: 'Trạng thái không hợp lệ. Chỉ chấp nhận: CONTACTED, SCHEDULED, SUCCESSFUL, FAILED'
    }),

  notes: z
    .string({
      invalid_type_error: 'Ghi chú phải là chuỗi ký tự'
    })
    .max(2000, 'Ghi chú không được vượt quá 2000 ký tự')
    .optional()
    .nullable()
})

