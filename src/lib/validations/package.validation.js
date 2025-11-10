import { z } from 'zod'

/**
 * Validation schema cho quản lý gói tin (UC48)
 */

// Schema cho PackageSearchRequest
export const packageSearchSchema = z.object({
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

  isActive: z
    .boolean({
      invalid_type_error: 'Trạng thái kích hoạt phải là true hoặc false'
    })
    .optional()
    .nullable()
})

// Schema cho PackageCreateRequest
export const packageCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên gói tin không được để trống')
    .max(50, 'Tên gói tin không được vượt quá 50 ký tự')
    .regex(/^[a-zA-Z0-9\s]+$/, 'Tên gói tin chỉ được chứa chữ cái, số và khoảng trắng'),

  price: z
    .number({
      invalid_type_error: 'Giá phải là số'
    })
    .positive('Giá phải lớn hơn 0')
    .max(1000000000, 'Giá không được vượt quá 1,000,000,000 VNĐ'),

  creditsCount: z
    .number({
      invalid_type_error: 'Số credits phải là số'
    })
    .int('Số credits phải là số nguyên')
    .positive('Số credits phải lớn hơn 0')
    .max(1000, 'Số credits không được vượt quá 1000'),

  priorityLevel: z
    .number({
      invalid_type_error: 'Mức độ ưu tiên phải là số'
    })
    .int('Mức độ ưu tiên phải là số nguyên')
    .min(1, 'Mức độ ưu tiên phải từ 1 đến 10')
    .max(10, 'Mức độ ưu tiên phải từ 1 đến 10'),

  maxImages: z
    .number({
      invalid_type_error: 'Số ảnh tối đa phải là số'
    })
    .int('Số ảnh tối đa phải là số nguyên')
    .positive('Số ảnh tối đa phải lớn hơn 0')
    .max(50, 'Số ảnh tối đa không được vượt quá 50')
    .default(5)
    .optional(),

  isActive: z
    .boolean({
      invalid_type_error: 'Trạng thái kích hoạt phải là true hoặc false'
    })
    .default(true)
    .optional()
})

// Schema cho PackageUpdateRequest (giống CreateRequest)
export const packageUpdateSchema = packageCreateSchema

// Schema cho PackagePurchaseRequest (UC26)
export const packagePurchaseSchema = z.object({
  packageId: z
    .number({
      invalid_type_error: 'ID gói tin phải là số'
    })
    .int('ID gói tin phải là số nguyên')
    .positive('ID gói tin phải lớn hơn 0'),

  paymentGateway: z
    .string()
    .min(1, 'Phương thức thanh toán không được để trống')
    .refine(
      (val) => ['PAYOS'].includes(val.toUpperCase()),
      {
        message: 'Phương thức thanh toán không hợp lệ. Chỉ chấp nhận PAYOS'
      }
    )
})

// Schema cho PackageSearchRequest (dùng cho frontend)
export const packageSearchRequestSchema = z.object({
  pageNumber: z.number().int().positive().default(1).optional(),
  pageSize: z.number().int().positive().max(100).default(10).optional(),
  keyword: z.string().max(200).optional().nullable(),
  isActive: z.boolean().optional().nullable()
})

