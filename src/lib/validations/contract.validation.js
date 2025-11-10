import { z } from 'zod'

/**
 * Validation schema cho quản lý mẫu hợp đồng (UC49)
 */

// Schema cho ContractTemplateSearchRequest
export const contractTemplateSearchSchema = z.object({
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

  categoryId: z
    .number({
      invalid_type_error: 'ID danh mục phải là số'
    })
    .int('ID danh mục phải là số nguyên')
    .positive('ID danh mục phải lớn hơn 0')
    .optional()
    .nullable(),

  isActive: z
    .boolean({
      invalid_type_error: 'Trạng thái kích hoạt phải là true hoặc false'
    })
    .optional()
    .nullable()
})

// Schema cho ContractTemplateCreateRequest
export const contractTemplateCreateSchema = z.object({
  templateName: z
    .string()
    .min(1, 'Tên mẫu hợp đồng không được để trống')
    .max(100, 'Tên mẫu hợp đồng không được vượt quá 100 ký tự'),

  templateContent: z
    .string()
    .min(1, 'Nội dung mẫu hợp đồng không được để trống')
    .max(50000, 'Nội dung mẫu hợp đồng không được vượt quá 50000 ký tự'),

  categoryId: z
    .number({
      invalid_type_error: 'ID danh mục phải là số'
    })
    .int('ID danh mục phải là số nguyên')
    .positive('ID danh mục phải lớn hơn 0')
    .optional()
    .nullable(),

  isActive: z
    .boolean({
      invalid_type_error: 'Trạng thái kích hoạt phải là true hoặc false'
    })
    .default(true)
    .optional()
})

// Schema cho ContractTemplateUpdateRequest (giống CreateRequest)
export const contractTemplateUpdateSchema = contractTemplateCreateSchema

// ========================================
// Validation schema cho Contract Management (UC43) - Staff
// ========================================

// Schema cho ContractCreateRequest
export const contractCreateSchema = z.object({
  orderId: z
    .string()
    .uuid('ID Order phải là UUID hợp lệ')
    .optional()
    .nullable(),

  leadId: z
    .string()
    .uuid('ID Lead phải là UUID hợp lệ')
    .optional()
    .nullable(),

  contractTemplateId: z
    .number({
      invalid_type_error: 'ID mẫu hợp đồng phải là số'
    })
    .int('ID mẫu hợp đồng phải là số nguyên')
    .positive('ID mẫu hợp đồng phải lớn hơn 0'),

  contractContent: z
    .string()
    .max(50000, 'Nội dung hợp đồng không được vượt quá 50000 ký tự')
    .optional()
    .nullable()
}).refine(
  (data) => data.orderId || data.leadId,
  {
    message: 'Phải có OrderId hoặc LeadId',
    path: ['leadId'] // Hiển thị lỗi ở field leadId
  }
)

// Schema cho Contract Search Request (nếu có endpoint lấy danh sách)
export const contractSearchSchema = z.object({
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

  status: z
    .enum(['DRAFT', 'PENDING_SIGNATURE', 'SIGNED'], {
      errorMap: () => ({ message: 'Trạng thái hợp đồng không hợp lệ' })
    })
    .optional()
    .nullable(),

  leadId: z
    .string()
    .uuid('ID Lead phải là UUID hợp lệ')
    .optional()
    .nullable()
})

// ========================================
// Validation schema cho Contract Sign (UC29) - Member
// ========================================

/**
 * Schema để validate ContractSignRequest (UC29)
 */
export const contractSignRequestSchema = z.object({
  signature: z
    .string()
    .min(1, 'Chữ ký không được để trống'),
  signType: z
    .enum(['SIGNATURE', 'OTP'], {
      errorMap: () => ({ message: 'Loại ký không hợp lệ. Chỉ chấp nhận: SIGNATURE, OTP' })
    })
    .default('SIGNATURE')
})

