# Hướng dẫn Xây dựng UI cho Authentication Module (UC01, UC02, UC03)

> **Tài liệu này hướng dẫn chi tiết quy trình xây dựng UI cho module Authentication theo chuẩn 6 bước**

---

## 📋 Mục lục

1. [Bước 1: Phân tích DTOs và Validators](#bước-1-phân-tích-dtos-và-validators)
2. [Bước 2: Xây dựng Validation cho Frontend](#bước-2-xây-dựng-validation-cho-frontend)
3. [Bước 3: Phân tích Controller và Endpoints](#bước-3-phân-tích-controller-và-endpoints)
4. [Bước 4: Xây dựng API Services](#bước-4-xây-dựng-api-services)
5. [Bước 5: Xây dựng Components](#bước-5-xây-dựng-components)
6. [Bước 6: Xây dựng Pages](#bước-6-xây-dựng-pages)

---

## Bước 1: Phân tích DTOs và Validators

### 1.1. DTOs Analysis (Input/Output)

#### 📥 **Input DTOs**

##### **UC01: RegisterRequest**
```typescript
interface RegisterRequest {
  email: string           // Required, email format
  phoneNumber: string     // Required, format: 0xxxxxxxxx (10 digits)
  password: string        // Required, min 8 chars, uppercase, lowercase, number, special char
  confirmPassword: string // Required, must match password
  fullName?: string       // Optional, max 100 chars
}
```

**Validation Rules (từ Backend):**
- Email: Not empty, valid email format, max 255 chars
- PhoneNumber: Not empty, regex: `^(0[3|5|7|8|9])+([0-9]{8})$`
- Password: Not empty, min 8 chars, phải có:
  - Ít nhất 1 chữ hoa (A-Z)
  - Ít nhất 1 chữ thường (a-z)
  - Ít nhất 1 chữ số (0-9)
  - Ít nhất 1 ký tự đặc biệt
- ConfirmPassword: Not empty, must equal password
- FullName: Optional, max 100 chars if provided

---

##### **UC02: LoginRequest**
```typescript
interface LoginRequest {
  emailOrPhone: string  // Required, can be email OR phone
  password: string      // Required
}
```

**Validation Rules:**
- EmailOrPhone: Not empty, max 255 chars
- Password: Not empty

---

##### **UC03: SocialLoginRequest**
```typescript
interface SocialLoginRequest {
  provider: 'google' | 'facebook'  // Required, must be 'google' or 'facebook'
  token: string                     // Required, ID token or Access token
}
```

**Validation Rules:**
- Provider: Not empty, must be 'google' or 'facebook'
- Token: Not empty

---

##### **RefreshTokenRequest**
```typescript
interface RefreshTokenRequest {
  refreshToken: string  // Required
}
```

---

#### 📤 **Output DTOs**

##### **AuthResponse** (sau khi đăng ký/đăng nhập thành công)
```typescript
interface AuthResponse {
  userId: string              // UUID
  email: string
  phoneNumber: string
  fullName: string | null
  role: string                // 'MEMBER', 'STAFF', 'ADMIN'
  accessToken: string         // JWT token (short-lived, ~60 minutes)
  refreshToken: string        // JWT token (long-lived, ~30 days)
  accessTokenExpiry: string   // ISO datetime
  refreshTokenExpiry: string  // ISO datetime
}
```

---

##### **UserDto** (thông tin user hiện tại)
```typescript
interface UserDto {
  userId: string              // UUID
  email: string
  phoneNumber: string
  fullName: string | null
  address: string | null
  avatarUrl: string | null
  role: string                // 'MEMBER', 'STAFF', 'ADMIN'
  status: string              // 'ACTIVE', 'BANNED', 'SUSPENDED'
  createdAt: string           // ISO datetime
}
```

---

### 1.2. Use Cases Mapping

| Use Case | Input DTO | Output DTO | HTTP Method | Endpoint |
|----------|-----------|------------|-------------|----------|
| UC01: Register | RegisterRequest | AuthResponse | POST | /api/auth/register |
| UC02: Login | LoginRequest | AuthResponse | POST | /api/auth/login |
| UC03: Social Login | SocialLoginRequest | AuthResponse | POST | /api/auth/social-login |
| Refresh Token | RefreshTokenRequest | AuthResponse | POST | /api/auth/refresh-token |
| Get Current User | - | UserDto | GET | /api/auth/me |

---

## Bước 2: Xây dựng Validation cho Frontend

### 2.1. Cài đặt Dependencies

```bash
# Zod cho validation
npm install zod @hookform/resolvers
```

### 2.2. Tạo Validation Schemas

**File: `src/lib/validations/auth.validations.js`**

```javascript
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
 * Returns: { score: number (0-4), feedback: string }
 */
export const checkPasswordStrength = (password) => {
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
```

---

## Bước 3: Phân tích Controller và Endpoints

### 3.1. API Endpoints Summary

**Base URL:** `http://localhost:5000/api/auth` (hoặc từ env: `VITE_API_BASE_URL`)

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/register` | POST | ❌ | UC01: Đăng ký tài khoản mới |
| `/login` | POST | ❌ | UC02: Đăng nhập Email/Phone |
| `/social-login` | POST | ❌ | UC03: Đăng nhập Social |
| `/refresh-token` | POST | ❌ | Refresh access token |
| `/me` | GET | ✅ | Lấy thông tin user hiện tại |
| `/health` | GET | ❌ | Health check |

---

### 3.2. Response Codes

#### **Success Responses**

| Endpoint | Success Code | Response Body |
|----------|--------------|---------------|
| `/register` | 201 Created | AuthResponse |
| `/login` | 200 OK | AuthResponse |
| `/social-login` | 200 OK | AuthResponse |
| `/refresh-token` | 200 OK | AuthResponse |
| `/me` | 200 OK | UserDto |

---

#### **Error Responses**

| Error Code | Meaning | Example Response |
|------------|---------|------------------|
| 400 Bad Request | Validation errors hoặc business logic errors | `{ message: "...", errors: [...] }` |
| 401 Unauthorized | Token invalid, expired, hoặc credentials sai | `{ message: "..." }` |
| 500 Internal Server Error | Lỗi server | `{ message: "Đã xảy ra lỗi..." }` |

**Error Response Format:**

```typescript
// Validation errors (400)
{
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}

// Other errors (401, 500)
{
  message: string
}
```

---

### 3.3. Request/Response Examples

#### **POST /api/auth/register**

**Request Body:**
```json
{
  "email": "user@example.com",
  "phoneNumber": "0987654321",
  "password": "StrongPass123!",
  "confirmPassword": "StrongPass123!",
  "fullName": "Nguyễn Văn A"
}
```

**Response (201 Created):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "phoneNumber": "0987654321",
  "fullName": "Nguyễn Văn A",
  "role": "MEMBER",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "accessTokenExpiry": "2025-11-09T12:00:00Z",
  "refreshTokenExpiry": "2025-12-09T11:00:00Z"
}
```

---

#### **POST /api/auth/login**

**Request Body (Email):**
```json
{
  "emailOrPhone": "user@example.com",
  "password": "StrongPass123!"
}
```

**Request Body (Phone):**
```json
{
  "emailOrPhone": "0987654321",
  "password": "StrongPass123!"
}
```

**Response (200 OK):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "phoneNumber": "0987654321",
  "fullName": "Nguyễn Văn A",
  "role": "MEMBER",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "accessTokenExpiry": "2025-11-09T12:00:00Z",
  "refreshTokenExpiry": "2025-12-09T11:00:00Z"
}
```

---

#### **POST /api/auth/social-login**

**Request Body (Google):**
```json
{
  "provider": "google",
  "token": "google-id-token-here"
}
```

**Request Body (Facebook):**
```json
{
  "provider": "facebook",
  "token": "facebook-access-token-here"
}
```

**Response (200 OK):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "phoneNumber": "",
  "fullName": "Nguyễn Văn A",
  "role": "MEMBER",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "accessTokenExpiry": "2025-11-09T12:00:00Z",
  "refreshTokenExpiry": "2025-12-09T11:00:00Z"
}
```

---

#### **GET /api/auth/me**

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "phoneNumber": "0987654321",
  "fullName": "Nguyễn Văn A",
  "address": null,
  "avatarUrl": null,
  "role": "MEMBER",
  "status": "ACTIVE",
  "createdAt": "2025-11-09T10:00:00Z"
}
```

---

## Bước 4: Xây dựng API Services

### 4.1. Cấu hình Axios

**File: `src/api/axios.config.js`**

```javascript
import axios from 'axios'

/**
 * Base Axios instance cho tất cả API calls
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Request Interceptor
 * Tự động thêm Access Token vào header nếu có
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Xử lý tự động refresh token khi access token hết hạn
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Nếu response là 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        
        if (!refreshToken) {
          // Không có refresh token, redirect to login
          window.location.href = '/auth/login'
          return Promise.reject(error)
        }

        // Gọi API refresh token
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        )

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

        // Lưu tokens mới
        localStorage.setItem('accessToken', newAccessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Retry request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Refresh token cũng fail, redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
```

---

### 4.2. Auth Service

**File: `src/api/services/auth.service.js`**

```javascript
import axiosInstance from '../axios.config'

/**
 * Authentication Service
 * Xử lý tất cả API calls liên quan đến Authentication
 */
class AuthService {
  /**
   * UC01: Đăng ký tài khoản mới
   * @param {Object} data - RegisterRequest
   * @returns {Promise<AuthResponse>}
   */
  async register(data) {
    const response = await axiosInstance.post('/auth/register', data)
    return response.data
  }

  /**
   * UC02: Đăng nhập bằng Email/Phone và Password
   * @param {Object} data - LoginRequest
   * @returns {Promise<AuthResponse>}
   */
  async login(data) {
    const response = await axiosInstance.post('/auth/login', data)
    return response.data
  }

  /**
   * UC03: Đăng nhập bằng mạng xã hội
   * @param {Object} data - SocialLoginRequest
   * @returns {Promise<AuthResponse>}
   */
  async socialLogin(data) {
    const response = await axiosInstance.post('/auth/social-login', data)
    return response.data
  }

  /**
   * Refresh Access Token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<AuthResponse>}
   */
  async refreshToken(refreshToken) {
    const response = await axiosInstance.post('/auth/refresh-token', {
      refreshToken
    })
    return response.data
  }

  /**
   * Lấy thông tin user hiện tại
   * @returns {Promise<UserDto>}
   */
  async getCurrentUser() {
    const response = await axiosInstance.get('/auth/me')
    return response.data
  }

  /**
   * Đăng xuất (client-side only)
   * Clear tokens và user info khỏi localStorage
   */
  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  /**
   * Kiểm tra user đã đăng nhập chưa
   * @returns {boolean}
   */
  isAuthenticated() {
    const accessToken = localStorage.getItem('accessToken')
    return !!accessToken
  }

  /**
   * Lưu auth data vào localStorage
   * @param {AuthResponse} authResponse
   */
  saveAuthData(authResponse) {
    localStorage.setItem('accessToken', authResponse.accessToken)
    localStorage.setItem('refreshToken', authResponse.refreshToken)
    localStorage.setItem('user', JSON.stringify({
      userId: authResponse.userId,
      email: authResponse.email,
      phoneNumber: authResponse.phoneNumber,
      fullName: authResponse.fullName,
      role: authResponse.role
    }))
  }

  /**
   * Lấy user info từ localStorage
   * @returns {Object|null}
   */
  getUserFromStorage() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}

export default new AuthService()
```

---

### 4.3. API Endpoints Constants

**File: `src/api/endpoints.js`**

```javascript
/**
 * API Endpoints Constants
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    SOCIAL_LOGIN: '/auth/social-login',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    HEALTH: '/auth/health'
  }
  // Thêm các endpoints khác ở đây khi cần
}
```

---

## Bước 5: Xây dựng Components

### 5.1. Component Structure

```
src/components/auth/
├── RegisterForm.jsx          # UC01: Form đăng ký
├── LoginForm.jsx             # UC02: Form đăng nhập
├── SocialLogin.jsx           # UC03: Social login buttons
├── PasswordStrengthIndicator.jsx
└── PrivateRoute.jsx          # Route guard
```

---

### 5.2. UC01: RegisterForm Component

**File: `src/components/auth/RegisterForm.jsx`**

```jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { registerSchema } from '@/lib/validations/auth.validations'
import authService from '@/api/services/auth.service'
import PasswordStrengthIndicator from './PasswordStrengthIndicator'

export default function RegisterForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const response = await authService.register(data)
      
      // Lưu auth data
      authService.saveAuthData(response)

      toast.success('Đăng ký tài khoản thành công!')
      
      // Redirect to home page hoặc dashboard
      navigate('/')
    } catch (error) {
      console.error('Register error:', error)

      // Xử lý error response từ API
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.data?.errors) {
        // Display validation errors
        error.response.data.errors.forEach((err) => {
          form.setError(err.field, {
            type: 'manual',
            message: err.message
          })
        })
      } else {
        toast.error('Đã xảy ra lỗi khi đăng ký tài khoản')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Đăng ký tài khoản</h1>
        <p className="text-muted-foreground">
          Nhập thông tin của bạn để tạo tài khoản
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại *</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="0987654321"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Full Name Field */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <PasswordStrengthIndicator password={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng ký
          </Button>
        </form>
      </Form>

      {/* Link to Login */}
      <div className="text-center text-sm">
        Đã có tài khoản?{' '}
        <Link to="/auth/login" className="underline underline-offset-4">
          Đăng nhập
        </Link>
      </div>
    </div>
  )
}
```

---

### 5.3. UC02: LoginForm Component

**File: `src/components/auth/LoginForm.jsx`**

```jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginSchema } from '@/lib/validations/auth.validations'
import authService from '@/api/services/auth.service'

export default function LoginForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const response = await authService.login(data)
      
      // Lưu auth data
      authService.saveAuthData(response)

      toast.success('Đăng nhập thành công!')
      
      // Redirect based on role
      if (response.role === 'ADMIN') {
        navigate('/admin')
      } else if (response.role === 'STAFF') {
        navigate('/staff')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Login error:', error)

      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Đã xảy ra lỗi khi đăng nhập')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Đăng nhập</h1>
        <p className="text-muted-foreground">
          Nhập email hoặc số điện thoại để đăng nhập
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email or Phone Field */}
          <FormField
            control={form.control}
            name="emailOrPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email hoặc Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="example@email.com hoặc 0987654321"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/auth/forgot-password"
              className="text-sm underline underline-offset-4"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng nhập
          </Button>
        </form>
      </Form>

      {/* Link to Register */}
      <div className="text-center text-sm">
        Chưa có tài khoản?{' '}
        <Link to="/auth/register" className="underline underline-offset-4">
          Đăng ký
        </Link>
      </div>
    </div>
  )
}
```

---

### 5.4. UC03: SocialLogin Component

**File: `src/components/auth/SocialLogin.jsx`**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import authService from '@/api/services/auth.service'

/**
 * Google và Facebook Login sẽ cần setup:
 * - Google: Google OAuth 2.0 Client ID
 * - Facebook: Facebook App ID
 * 
 * Sử dụng thư viện:
 * - @react-oauth/google (for Google)
 * - react-facebook-login (for Facebook)
 */

export default function SocialLogin() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState({
    google: false,
    facebook: false
  })

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setIsLoading({ ...isLoading, google: true })

      const response = await authService.socialLogin({
        provider: 'google',
        token: credentialResponse.credential // Google ID Token
      })

      authService.saveAuthData(response)
      toast.success('Đăng nhập Google thành công!')

      // Redirect based on role
      if (response.role === 'ADMIN') {
        navigate('/admin')
      } else if (response.role === 'STAFF') {
        navigate('/staff')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Google login error:', error)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Đã xảy ra lỗi khi đăng nhập bằng Google')
      }
    } finally {
      setIsLoading({ ...isLoading, google: false })
    }
  }

  const handleFacebookLogin = async (response) => {
    try {
      setIsLoading({ ...isLoading, facebook: true })

      const authResponse = await authService.socialLogin({
        provider: 'facebook',
        token: response.accessToken // Facebook Access Token
      })

      authService.saveAuthData(authResponse)
      toast.success('Đăng nhập Facebook thành công!')

      // Redirect based on role
      if (authResponse.role === 'ADMIN') {
        navigate('/admin')
      } else if (authResponse.role === 'STAFF') {
        navigate('/staff')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Facebook login error:', error)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Đã xảy ra lỗi khi đăng nhập bằng Facebook')
      }
    } finally {
      setIsLoading({ ...isLoading, facebook: false })
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>

      <div className="grid gap-2">
        {/* Google Login Button */}
        <Button
          variant="outline"
          type="button"
          disabled={isLoading.google || isLoading.facebook}
          onClick={() => {
            // Trigger Google OAuth flow
            // Implementation depends on @react-oauth/google library
            console.log('Google login clicked')
          }}
        >
          {isLoading.google ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Google
        </Button>

        {/* Facebook Login Button */}
        <Button
          variant="outline"
          type="button"
          disabled={isLoading.google || isLoading.facebook}
          onClick={() => {
            // Trigger Facebook OAuth flow
            // Implementation depends on react-facebook-login library
            console.log('Facebook login clicked')
          }}
        >
          {isLoading.facebook ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          )}
          Facebook
        </Button>
      </div>
    </div>
  )
}
```

---

### 5.5. PasswordStrengthIndicator Component

**File: `src/components/auth/PasswordStrengthIndicator.jsx`**

```jsx
import { checkPasswordStrength } from '@/lib/validations/auth.validations'
import { cn } from '@/lib/utils'

export default function PasswordStrengthIndicator({ password }) {
  if (!password) return null

  const { score, feedback } = checkPasswordStrength(password)

  const getColor = () => {
    if (score < 2) return 'bg-red-500'
    if (score < 3) return 'bg-orange-500'
    if (score < 4) return 'bg-yellow-500'
    if (score < 5) return 'bg-green-500'
    return 'bg-green-600'
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              index < score ? getColor() : 'bg-muted'
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{feedback}</p>
    </div>
  )
}
```

---

### 5.6. PrivateRoute Component

**File: `src/components/auth/PrivateRoute.jsx`**

```jsx
import { Navigate, Outlet } from 'react-router-dom'
import authService from '@/api/services/auth.service'

/**
 * PrivateRoute Component
 * Bảo vệ routes yêu cầu authentication
 * 
 * Usage:
 * <Route element={<PrivateRoute />}>
 *   <Route path="/profile" element={<ProfilePage />} />
 * </Route>
 */
export default function PrivateRoute({ allowedRoles = [] }) {
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUserFromStorage()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  // Nếu có quy định roles và user không có role phù hợp
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
```

---

## Bước 6: Xây dựng Pages

### 6.1. Page Structure

```
src/pages/auth/
├── Login.jsx           # UC02: Login Page
├── Register.jsx        # UC01: Register Page
├── ForgotPassword.jsx  # Forgot Password Page
└── ResetPassword.jsx   # Reset Password Page
```

---

### 6.2. UC01: Register Page

**File: `src/pages/auth/Register.jsx`**

```jsx
import RegisterForm from '@/components/auth/RegisterForm'
import SocialLogin from '@/components/auth/SocialLogin'
import { Link } from 'react-router-dom'

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="EVehicle Logo"
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold">EVehicle</span>
          </Link>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Social Login */}
        <SocialLogin />

        {/* Terms */}
        <p className="px-8 text-center text-sm text-muted-foreground">
          Bằng cách nhấp vào tiếp tục, bạn đồng ý với{' '}
          <Link
            to="/legal/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Điều khoản Dịch vụ
          </Link>{' '}
          và{' '}
          <Link
            to="/legal/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Chính sách Bảo mật
          </Link>{' '}
          của chúng tôi.
        </p>
      </div>
    </div>
  )
}
```

---

### 6.3. UC02: Login Page

**File: `src/pages/auth/Login.jsx`**

```jsx
import LoginForm from '@/components/auth/LoginForm'
import SocialLogin from '@/components/auth/SocialLogin'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="EVehicle Logo"
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold">EVehicle</span>
          </Link>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Social Login */}
        <SocialLogin />
      </div>
    </div>
  )
}
```

---

### 6.4. Router Configuration

**File: `src/routes/index.jsx`**

```jsx
import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '@/pages/auth/Login'
import RegisterPage from '@/pages/auth/Register'
import PrivateRoute from '@/components/auth/PrivateRoute'
// Import other pages...

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/auth/login',
    element: <LoginPage />
  },
  {
    path: '/auth/register',
    element: <RegisterPage />
  },

  // Protected routes
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <div>Home Page</div> // Replace with actual HomePage
      },
      {
        path: '/profile',
        element: <div>Profile Page</div> // Replace with actual ProfilePage
      }
    ]
  },

  // Admin routes
  {
    element: <PrivateRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        path: '/admin',
        element: <div>Admin Dashboard</div> // Replace with actual AdminDashboard
      }
    ]
  },

  // Staff routes
  {
    element: <PrivateRoute allowedRoles={['STAFF']} />,
    children: [
      {
        path: '/staff',
        element: <div>Staff Dashboard</div> // Replace with actual StaffDashboard
      }
    ]
  }
])
```

---

## 📝 Testing Checklist

### UC01: Register (Đăng ký)
- [ ] Form validation hoạt động đúng
- [ ] Password strength indicator hiển thị
- [ ] Email/Phone đã tồn tại → hiển thị error
- [ ] Đăng ký thành công → redirect to home
- [ ] Token được lưu vào localStorage
- [ ] Social login buttons hiển thị

### UC02: Login (Đăng nhập)
- [ ] Có thể đăng nhập bằng email
- [ ] Có thể đăng nhập bằng phone
- [ ] Sai password → hiển thị error
- [ ] Đăng nhập thành công → redirect based on role
- [ ] Token được lưu vào localStorage
- [ ] Remember me (nếu có)

### UC03: Social Login
- [ ] Google login button hoạt động
- [ ] Facebook login button hoạt động
- [ ] Token được validate ở backend
- [ ] Account được tạo/liên kết
- [ ] Redirect sau khi login thành công

### General
- [ ] Refresh token hoạt động khi access token hết hạn
- [ ] Logout xóa tokens khỏi localStorage
- [ ] Private routes chặn user chưa đăng nhập
- [ ] Role-based routes hoạt động đúng
- [ ] Loading states hiển thị
- [ ] Error messages rõ ràng

---

## 🚀 Next Steps

1. **Setup Google OAuth 2.0**:
   - Tạo project trên Google Cloud Console
   - Cấu hình OAuth consent screen
   - Lấy Client ID
   - Setup `@react-oauth/google` package

2. **Setup Facebook Login**:
   - Tạo app trên Facebook Developers
   - Cấu hình Facebook Login
   - Lấy App ID
   - Setup `react-facebook-login` package

3. **Implement Forgot Password & Reset Password**:
   - Backend API cần hỗ trợ
   - Email service để gửi reset link
   - Form nhập email
   - Form reset password với token

4. **Add Remember Me Feature**:
   - Checkbox "Ghi nhớ đăng nhập"
   - Lưu token vào localStorage hoặc sessionStorage

5. **Add Email Verification**:
   - Gửi email xác thực sau đăng ký
   - Verify email endpoint
   - Resend verification email

6. **Enhance Security**:
   - Rate limiting
   - CAPTCHA (reCAPTCHA)
   - Two-factor authentication (2FA)

---

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [Axios Documentation](https://axios-http.com)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login)

---

**Tác giả**: EVehicle Development Team  
**Ngày cập nhật**: November 9, 2025  
**Version**: 1.0.0
