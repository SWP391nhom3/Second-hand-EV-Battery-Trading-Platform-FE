import { z } from 'zod'

/**
 * PHONE_REGEX - Regex cho số điện thoại Việt Nam
 * Format: 0xxxxxxxxx (10 số, bắt đầu bằng 03, 05, 07, 08, 09)
 */
const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/

/**
 * PASSWORD_REGEX - Kiểm tra password có ít nhất 1 ký tự đặc biệt
 */
const PASSWORD_SPECIAL_CHAR_REGEX = /[^a-zA-Z0-9]/

/**
 * UC01: Register Validation Schema
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(255, 'Email không được vượt quá 255 ký tự'),
  
  phoneNumber: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(PHONE_REGEX, 'Số điện thoại không hợp lệ (định dạng: 0xxxxxxxxx)'),
  
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số')
    .regex(PASSWORD_SPECIAL_CHAR_REGEX, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'),
  
  confirmPassword: z
    .string()
    .min(1, 'Xác nhận mật khẩu không được để trống'),
  
  fullName: z
    .string()
    .max(100, 'Họ tên không được vượt quá 100 ký tự')
    .optional()
    .or(z.literal(''))
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
})

/**
 * UC02: Login Validation Schema
 */
export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'Email hoặc Số điện thoại không được để trống')
    .max(255, 'Email hoặc Số điện thoại không được vượt quá 255 ký tự'),
  
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
})

/**
 * UC03: Social Login Validation Schema
 */
export const socialLoginSchema = z.object({
  provider: z
    .enum(['google', 'facebook'], {
      errorMap: () => ({ message: "Provider phải là 'google' hoặc 'facebook'" })
    }),
  
  token: z
    .string()
    .min(1, 'Token không được để trống')
})

/**
 * Refresh Token Validation Schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token không được để trống')
})

/**
 * Helper function: Validate email or phone
 */
export const isValidEmailOrPhone = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmail = emailRegex.test(value)
  const isPhone = PHONE_REGEX.test(value)
  return isEmail || isPhone
}

/**
 * Password strength checker
 * Returns: { score: number (0-5), feedback: string }
 */
export const checkPasswordStrength = (password) => {
  if (!password) return { score: 0, feedback: '' }
  
  let score = 0
  const feedback = []

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (PASSWORD_SPECIAL_CHAR_REGEX.test(password)) score++

  if (score < 2) {
    feedback.push('Mật khẩu quá yếu')
  } else if (score < 3) {
    feedback.push('Mật khẩu yếu')
  } else if (score < 4) {
    feedback.push('Mật khẩu trung bình')
  } else if (score < 5) {
    feedback.push('Mật khẩu mạnh')
  } else {
    feedback.push('Mật khẩu rất mạnh')
  }

  return { score, feedback: feedback.join(', ') }
}
