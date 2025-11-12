# Setup Guide - Authentication Module

## ✅ Đã hoàn thành

### 1. Configuration Files
- ✅ `vite.config.js` - Vite config với path aliases
- ✅ `tailwind.config.js` - Tailwind + shadcn/ui theme
- ✅ `jsconfig.json` - Path aliases cho IDE
- ✅ `components.json` - shadcn/ui CLI config
- ✅ `package.json` - Dependencies

### 2. Validation Layer
- ✅ `src/lib/validations/auth.validations.js` - Zod schemas (register, login, socialLogin)

### 3. API Layer
- ✅ `src/api/axios.config.js` - Axios instance với auto refresh token
- ✅ `src/api/services/auth.service.js` - Authentication service methods

### 4. Components
- ✅ `src/components/auth/PasswordStrengthIndicator.jsx` - Password strength meter
- ✅ `src/components/auth/RegisterForm.jsx` - UC01 Register form
- ✅ `src/components/auth/LoginForm.jsx` - UC02 Login form
- ✅ `src/components/auth/SocialLogin.jsx` - UC03 Social login buttons
- ✅ `src/components/auth/PrivateRoute.jsx` - Route guard

### 5. Pages
- ✅ `src/pages/auth/Register.jsx` - Register page
- ✅ `src/pages/auth/Login.jsx` - Login page
- ✅ `src/pages/Forbidden.jsx` - 403 error page

### 6. Router
- ✅ `src/router/index.jsx` - Router configuration with public/private routes

### 7. App Entry
- ✅ `src/App.jsx` - Main app component
- ✅ `src/main.jsx` - Entry point
- ✅ `index.html` - HTML template
- ✅ `.env` - Environment variables

---

## 📦 Cài đặt Dependencies

### Bước 1: Cài đặt tất cả packages
```bash
cd c:\EVehical\FE
npm install
```

### Bước 2: Cài đặt shadcn/ui components cần thiết
```bash
# Button
npx shadcn@latest add button

# Form components
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add label

# Optional: Thêm components khác nếu cần
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

---

## 🚀 Chạy Development Server

```bash
npm run dev
```

App sẽ chạy tại: `http://localhost:5173`

---

## 🧪 Test Authentication Flow

### 1. Test Register (UC01)
- Mở: `http://localhost:5173/auth/register`
- Nhập thông tin:
  - Email: `test@example.com`
  - Phone: `0987654321`
  - Full Name: `Nguyễn Văn A`
  - Password: `Password123!` (phải có chữ hoa, chữ thường, số, ký tự đặc biệt, min 8 chars)
  - Confirm Password: `Password123!`
- Kiểm tra:
  - ✅ Password strength indicator hiển thị
  - ✅ Validation errors hiển thị đúng
  - ✅ Show/hide password hoạt động
  - ✅ Submit gọi API `/auth/register`
  - ✅ Toast notification hiển thị
  - ✅ Redirect về home page sau khi thành công

### 2. Test Login (UC02)
- Mở: `http://localhost:5173/auth/login`
- Nhập thông tin:
  - Email or Phone: `test@example.com` hoặc `0987654321`
  - Password: `Password123!`
- Kiểm tra:
  - ✅ Validation errors hiển thị đúng
  - ✅ Show/hide password hoạt động
  - ✅ Submit gọi API `/auth/login`
  - ✅ Token được lưu vào localStorage
  - ✅ Redirect dựa theo role:
    - ADMIN → `/admin`
    - STAFF → `/staff`
    - MEMBER → `/`

### 3. Test Social Login (UC03)
- Mở: `http://localhost:5173/auth/login` hoặc `/auth/register`
- Click Google/Facebook button
- Kiểm tra:
  - ⚠️ Hiện tại chỉ có UI, chưa có OAuth integration
  - ⚠️ Toast hiển thị "đang được phát triển"

### 4. Test Private Routes
- **Trường hợp 1**: Chưa đăng nhập
  - Truy cập: `http://localhost:5173/profile`
  - Kiểm tra: ✅ Redirect về `/auth/login`

- **Trường hợp 2**: Đã đăng nhập nhưng không đủ quyền
  - Đăng nhập với role MEMBER
  - Truy cập: `http://localhost:5173/admin`
  - Kiểm tra: ✅ Redirect về `/403`

- **Trường hợp 3**: Đã đăng nhập và đủ quyền
  - Đăng nhập với role ADMIN
  - Truy cập: `http://localhost:5173/admin`
  - Kiểm tra: ✅ Hiển thị trang admin

### 5. Test Token Refresh
- Đăng nhập thành công
- Mở DevTools → Application → localStorage
- Xóa `accessToken` (giữ lại `refreshToken`)
- Reload page
- Kiểm tra:
  - ✅ Axios interceptor tự động gọi `/auth/refresh-token`
  - ✅ Lấy accessToken mới
  - ✅ Retry request ban đầu

---

## 🔧 API Backend Requirements

Đảm bảo backend đã implement đầy đủ các endpoints:

### 1. POST `/auth/register`
Request body:
```json
{
  "email": "string",
  "phoneNumber": "string",
  "fullName": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

Response:
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "phoneNumber": "string",
    "fullName": "string",
    "role": "MEMBER",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "createdAt": "datetime"
  }
}
```

### 2. POST `/auth/login`
Request body:
```json
{
  "emailOrPhone": "string",
  "password": "string"
}
```

Response: Giống `/auth/register`

### 3. POST `/auth/social-login`
Request body:
```json
{
  "provider": "GOOGLE" | "FACEBOOK",
  "token": "string"
}
```

Response: Giống `/auth/register`

### 4. POST `/auth/refresh-token`
Request body:
```json
{
  "refreshToken": "string"
}
```

Response:
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

### 5. GET `/auth/me`
Headers:
```
Authorization: Bearer {accessToken}
```

Response:
```json
{
  "id": "string",
  "email": "string",
  "phoneNumber": "string",
  "fullName": "string",
  "role": "MEMBER" | "STAFF" | "ADMIN",
  "isEmailVerified": boolean,
  "isPhoneVerified": boolean,
  "createdAt": "datetime"
}
```

---

## 🔐 CORS Configuration (Backend)

Đảm bảo backend cho phép CORS từ frontend:

```csharp
// Program.cs hoặc Startup.cs
app.UseCors(policy => policy
    .WithOrigins("http://localhost:5173") // Vite dev server
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());
```

---

## 📁 File Structure Summary

```
c:\EVehical\FE\
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── jsconfig.json
├── components.json
├── .env
├── .env.example
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── assets/
│   │   └── styles/
│   │       └── globals.css
│   ├── lib/
│   │   ├── utils.js
│   │   └── validations/
│   │       └── auth.validations.js
│   ├── api/
│   │   ├── axios.config.js
│   │   └── services/
│   │       └── auth.service.js
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components (sau khi chạy npx shadcn add)
│   │   │   ├── button.jsx
│   │   │   ├── form.jsx
│   │   │   ├── input.jsx
│   │   │   └── label.jsx
│   │   └── auth/
│   │       ├── PasswordStrengthIndicator.jsx
│   │       ├── RegisterForm.jsx
│   │       ├── LoginForm.jsx
│   │       ├── SocialLogin.jsx
│   │       └── PrivateRoute.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Register.jsx
│   │   │   └── Login.jsx
│   │   └── Forbidden.jsx
│   └── router/
│       └── index.jsx
```

---

## ⚠️ Lưu ý quan trọng

### 1. Environment Variables
- File `.env` chứa API base URL
- Đổi `VITE_API_BASE_URL` nếu backend chạy ở port khác
- Không commit `.env` vào git (đã có trong `.gitignore`)

### 2. Token Management
- `accessToken` và `refreshToken` được lưu trong localStorage
- Auto refresh khi accessToken hết hạn
- Logout sẽ xóa cả 2 tokens

### 3. Validation Rules
- Frontend validation PHẢI match với backend validation
- Đã implement tất cả rules từ `FluentValidation`
- Password phải có: uppercase, lowercase, number, special char, min 8 chars

### 4. Social Login
- Hiện tại chỉ có UI, chưa có OAuth integration
- Cần setup Google OAuth và Facebook App
- Xem hướng dẫn trong `src/components/auth/SocialLogin.jsx`

### 5. Role-Based Access
- 3 roles: MEMBER, STAFF, ADMIN
- PrivateRoute component kiểm tra authentication và role
- 403 page hiển thị khi không có quyền

---

## 🐛 Troubleshooting

### Lỗi: "Cannot find module '@/...'"
- Đảm bảo đã cấu hình `vite.config.js` và `jsconfig.json`
- Restart VS Code để IDE nhận path aliases

### Lỗi: "Module not found: Can't resolve '@/components/ui/...'"
- Chạy `npx shadcn@latest add button` (và các components khác)
- Components sẽ được tạo tự động trong `src/components/ui/`

### Lỗi: CORS khi gọi API
- Kiểm tra backend đã enable CORS chưa
- Đảm bảo `VITE_API_BASE_URL` đúng trong `.env`

### Lỗi: 401 Unauthorized liên tục
- Kiểm tra token có trong localStorage không
- Kiểm tra backend có validate token đúng không
- Xem console log trong axios.config.js

---

## 📚 Documentation Links

- [Vite Documentation](https://vitejs.dev/)
- [React Router v6](https://reactrouter.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/)

---

## ✨ Next Steps

1. **Cài đặt dependencies**: `npm install`
2. **Cài đặt shadcn/ui components**: `npx shadcn@latest add button form input label`
3. **Chạy dev server**: `npm run dev`
4. **Test authentication flow**: Đăng ký → Đăng nhập → Test private routes
5. **Setup OAuth** (optional): Configure Google/Facebook OAuth
6. **Implement remaining modules**: Theo hướng dẫn trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

---

## 🎉 Kết luận

Authentication module (UC01, UC02, UC03) đã được implement đầy đủ:
- ✅ Register form với validation và password strength
- ✅ Login form với email/phone detection
- ✅ Social login UI (cần integrate OAuth)
- ✅ Private route protection với role-based access
- ✅ Auto refresh token mechanism
- ✅ Beautiful UI với shadcn/ui + Tailwind CSS

**Chúc bạn code vui vẻ! 🚀**
