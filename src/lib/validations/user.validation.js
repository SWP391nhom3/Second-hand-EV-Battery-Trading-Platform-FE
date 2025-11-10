import { z } from 'zod'

/**
 * Validation schema cho quản lý người dùng (UC47)
 */

// Schema cho UserSearchRequest
export const userSearchSchema = z.object({
  pageNumber: z
    .number({
      invalid_type_error: 'Số trang phải là số'
    })
    .int('Số trang phải là số nguyên')
    .positive('Số trang phải lớn hơn 0')
    .default(1)
    .optional(),

  pageSize: z
    .number({
      invalid_type_error: 'Số lượng mỗi trang phải là số'
    })
    .int('Số lượng mỗi trang phải là số nguyên')
    .positive('Số lượng mỗi trang phải lớn hơn 0')
    .max(100, 'Số lượng mỗi trang không được vượt quá 100')
    .default(10)
    .optional(),

  keyword: z
    .string()
    .max(200, 'Từ khóa tìm kiếm không được vượt quá 200 ký tự')
    .optional()
    .nullable(),

  role: z
    .enum(['MEMBER', 'STAFF', 'ADMIN'], {
      errorMap: () => ({ message: 'Role phải là MEMBER, STAFF hoặc ADMIN' })
    })
    .optional()
    .nullable(),

  status: z
    .enum(['ACTIVE', 'BANNED', 'SUSPENDED', 'PENDING_VERIFICATION'], {
      errorMap: () => ({ 
        message: 'Status phải là ACTIVE, BANNED, SUSPENDED hoặc PENDING_VERIFICATION' 
      })
    })
    .optional()
    .nullable()
})

// Schema cho UserUpdateRequest (Admin only - role/status)
// Note: Backend requires at least one field to be provided when updating
// But we handle this in the component by checking if there are changes
export const userUpdateSchema = z.object({
  role: z
    .enum(['MEMBER', 'STAFF', 'ADMIN'], {
      errorMap: () => ({ message: 'Role phải là MEMBER, STAFF hoặc ADMIN' })
    })
    .optional()
    .nullable(),

  status: z
    .enum(['ACTIVE', 'BANNED', 'SUSPENDED', 'PENDING_VERIFICATION'], {
      errorMap: () => ({ 
        message: 'Status phải là ACTIVE, BANNED, SUSPENDED hoặc PENDING_VERIFICATION' 
      })
    })
    .optional()
    .nullable()
})

/**
 * UC04: UpdateProfileRequest Schema
 * Schema cho Member tự cập nhật thông tin cá nhân
 */
export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .max(100, 'Họ tên không được vượt quá 100 ký tự')
    .optional()
    .nullable(),

  address: z
    .string()
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự')
    .optional()
    .nullable(),

  avatarUrl: z
    .string()
    .url('URL ảnh đại diện không hợp lệ')
    .optional()
    .nullable()
    .or(z.literal('')),

  idNumber: z
    .string()
    .regex(/^[0-9]{9,12}$/, 'Số CMND/CCCD phải có 9-12 chữ số')
    .optional()
    .nullable()
    .or(z.literal(''))
}).refine(
  (data) => {
    // Ít nhất một field phải được cung cấp
    return data.fullName !== undefined || 
           data.address !== undefined || 
           data.avatarUrl !== undefined || 
           data.idNumber !== undefined
  },
  {
    message: 'Vui lòng cập nhật ít nhất một trường thông tin',
    path: ['root']
  }
)

