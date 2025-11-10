import { z } from 'zod'

/**
 * Validation schemas cho Payment module (UC28, UC30)
 */

/**
 * Schema để validate PaymentCreateRequest (UC28)
 */
export const paymentCreateRequestSchema = z.object({
  orderId: z.string().uuid('ID đơn hàng không hợp lệ'),
  paymentGateway: z.enum(['PAYOS'], {
    errorMap: () => ({ message: 'Phương thức thanh toán không hợp lệ. Chỉ chấp nhận: PAYOS' })
  })
})

/**
 * Schema để validate PaymentSearchRequest (UC30)
 */
export const paymentSearchRequestSchema = z.object({
  pageNumber: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(10),
  paymentType: z.enum(['PACKAGE', 'TRANSACTION']).optional(),
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED']).optional(),
  paymentGateway: z.enum(['PAYOS']).optional(),
  fromDate: z.string().datetime().optional().or(z.date().optional()),
  toDate: z.string().datetime().optional().or(z.date().optional())
})

