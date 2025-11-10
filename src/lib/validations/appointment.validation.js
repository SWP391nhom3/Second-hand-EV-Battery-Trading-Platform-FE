import { z } from 'zod'

/**
 * Validation schemas cho Appointment Management Module (UC41, UC42)
 */

/**
 * Schema cho AppointmentCreateRequest
 * UC41: Tạo Appointment
 */
export const appointmentCreateSchema = z.object({
  leadId: z
    .string({
      required_error: 'Vui lòng chọn Lead',
      invalid_type_error: 'Lead ID không hợp lệ'
    })
    .uuid('Lead ID phải là UUID hợp lệ')
    .min(1, 'Vui lòng chọn Lead'),

  startTime: z
    .string({
      required_error: 'Thời gian bắt đầu không được để trống',
      invalid_type_error: 'Thời gian bắt đầu không hợp lệ'
    })
    .min(1, 'Thời gian bắt đầu không được để trống')
    .refine(
      (date) => {
        try {
          const dateObj = new Date(date)
          return !isNaN(dateObj.getTime()) && dateObj > new Date()
        } catch {
          return false
        }
      },
      {
        message: 'Thời gian bắt đầu phải trong tương lai'
      }
    ),

  endTime: z
    .string()
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true
        try {
          const dateObj = new Date(date)
          return !isNaN(dateObj.getTime())
        } catch {
          return false
        }
      },
      {
        message: 'Thời gian kết thúc không hợp lệ'
      }
    ),

  location: z
    .string({
      required_error: 'Địa điểm không được để trống',
      invalid_type_error: 'Địa điểm phải là chuỗi ký tự'
    })
    .min(1, 'Địa điểm không được để trống')
    .max(500, 'Địa điểm không được vượt quá 500 ký tự'),

  notes: z
    .string({
      invalid_type_error: 'Ghi chú phải là chuỗi ký tự'
    })
    .max(1000, 'Ghi chú không được vượt quá 1000 ký tự')
    .optional()
    .nullable()
}).refine(
  (data) => {
    // Nếu có cả startTime và endTime, endTime phải sau startTime
    if (data.startTime && data.endTime) {
      const start = new Date(data.startTime)
      const end = new Date(data.endTime)
      return end > start
    }
    return true
  },
  {
    message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    path: ['endTime']
  }
)

/**
 * Schema cho AppointmentUpdateRequest
 * UC42: Cập nhật Appointment
 */
export const appointmentUpdateSchema = z.object({
  startTime: z
    .string()
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true
        try {
          const dateObj = new Date(date)
          return !isNaN(dateObj.getTime()) && dateObj > new Date()
        } catch {
          return false
        }
      },
      {
        message: 'Thời gian bắt đầu phải trong tương lai'
      }
    ),

  endTime: z
    .string()
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true
        try {
          const dateObj = new Date(date)
          return !isNaN(dateObj.getTime())
        } catch {
          return false
        }
      },
      {
        message: 'Thời gian kết thúc không hợp lệ'
      }
    ),

  location: z
    .string({
      invalid_type_error: 'Địa điểm phải là chuỗi ký tự'
    })
    .max(500, 'Địa điểm không được vượt quá 500 ký tự')
    .optional()
    .nullable(),

  notes: z
    .string({
      invalid_type_error: 'Ghi chú phải là chuỗi ký tự'
    })
    .max(1000, 'Ghi chú không được vượt quá 1000 ký tự')
    .optional()
    .nullable(),

  status: z
    .enum(['CONFIRMED', 'CANCELED', 'COMPLETED'], {
      invalid_type_error: 'Trạng thái không hợp lệ. Chỉ chấp nhận: CONFIRMED, CANCELED, COMPLETED'
    })
    .optional()
    .nullable()
}).refine(
  (data) => {
    // Nếu có cả startTime và endTime, endTime phải sau startTime
    if (data.startTime && data.endTime) {
      const start = new Date(data.startTime)
      const end = new Date(data.endTime)
      return end > start
    }
    return true
  },
  {
    message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    path: ['endTime']
  }
)

/**
 * Schema cho AppointmentStatusUpdateRequest
 * UC42: Cập nhật trạng thái Appointment
 */
export const appointmentStatusUpdateSchema = z.object({
  status: z
    .enum(['CONFIRMED', 'CANCELED', 'COMPLETED'], {
      required_error: 'Trạng thái không được để trống',
      invalid_type_error: 'Trạng thái không hợp lệ. Chỉ chấp nhận: CONFIRMED, CANCELED, COMPLETED'
    }),

  notes: z
    .string({
      invalid_type_error: 'Ghi chú phải là chuỗi ký tự'
    })
    .max(1000, 'Ghi chú không được vượt quá 1000 ký tự')
    .optional()
    .nullable()
})

/**
 * Schema cho AppointmentSearchRequest
 * Filter và pagination cho danh sách Appointment
 */
export const appointmentSearchSchema = z.object({
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

  status: z
    .enum(['CONFIRMED', 'CANCELED', 'COMPLETED'], {
      invalid_type_error: 'Trạng thái không hợp lệ'
    })
    .optional()
    .nullable(),

  leadId: z
    .string()
    .uuid('Lead ID phải là UUID hợp lệ')
    .optional()
    .nullable(),

  postId: z
    .string()
    .uuid('Post ID phải là UUID hợp lệ')
    .optional()
    .nullable(),

  upcoming: z
    .boolean({
      invalid_type_error: 'upcoming phải là boolean'
    })
    .optional()
    .nullable(),

  past: z
    .boolean({
      invalid_type_error: 'past phải là boolean'
    })
    .optional()
    .nullable(),

  sortBy: z
    .enum(['StartTime', 'CreatedAt'], {
      invalid_type_error: 'Trường sắp xếp không hợp lệ'
    })
    .default('StartTime')
    .optional(),

  sortOrder: z
    .enum(['ASC', 'DESC'], {
      invalid_type_error: 'Thứ tự sắp xếp không hợp lệ'
    })
    .default('ASC')
    .optional()
})

