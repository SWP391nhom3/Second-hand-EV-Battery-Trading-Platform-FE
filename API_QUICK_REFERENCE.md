# API Integration - Quick Reference

## ✅ Đã hoàn thành

### 1. Cấu hình Axios

- ✅ Base URL: `https://localhost:59212`
- ✅ JWT Token interceptor
- ✅ Error handling interceptor
- ✅ 10s timeout
- 📁 File: `src/configs/axios.js`

### 2. API Services (11 services)

- ✅ `authService.js` - Authentication (login, register, OTP, Google)
- ✅ `postService.js` - Posts CRUD & management
- ✅ `batteryService.js` - Battery operations
- ✅ `vehicleService.js` - Vehicle operations
- ✅ `batteryModelService.js` - Battery models
- ✅ `vehicleModelService.js` - Vehicle models
- ✅ `paymentService.js` - Payment processing
- ✅ `packageService.js` - Post packages
- ✅ `postRequestService.js` - Buyer/Seller requests
- ✅ `memberService.js` - Member management
- ✅ `constructService.js` - Service constructs
- 📁 Folder: `src/services/`

### 3. Constants & Enums

- ✅ All status constants
- ✅ Post types, transaction types
- ✅ Payment methods, statuses
- ✅ Member roles
- ✅ Battery/Vehicle conditions
- 📁 File: `src/constants/apiConstants.js`

### 4. Configuration Files

- ✅ `.env.example` updated
- ✅ `API_INTEGRATION_GUIDE.md` - Full documentation
- ✅ `services/index.js` - Central exports

## 🚀 Sử dụng nhanh

### Import services

```javascript
import { authService, postService, batteryService } from "@/services";
```

### Login

```javascript
const response = await authService.login({ email, password });
// Token tự động lưu vào localStorage
```

### Lấy dữ liệu Posts

```javascript
const posts = await postService.getPosts({ page: 1, pageSize: 10 });
const featuredPosts = await postService.getFeaturedPosts();
```

### Tạo Post mới

```javascript
const newPost = await postService.createPost({
  title: "Pin xe máy điện",
  price: 5000000,
  postType: "Battery",
  transactionType: "DIRECT",
});
```

### Constants

```javascript
import { POST_STATUS, PAYMENT_METHOD } from '@/constants/apiConstants';

if (post.status === POST_STATUS.ACTIVE) { ... }
```

## 📋 Cần làm tiếp

### Tích hợp vào Components

1. **LoginForm** - Dùng `authService.login()`
2. **RegisterForm** - Dùng `authService.register()`
3. **ProductsPage** - Dùng `postService.getPosts()`
4. **CustomerDashboard** - Dùng `postService.getPostsByMember()`
5. **StaffDashboard** - Dùng `postRequestService`, `paymentService`
6. **PackagesPage** - Dùng `packageService.getActivePackages()`
7. **PaymentPage** - Dùng `paymentService.processPayment()`

### Protected Routes

```javascript
// Tạo ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};
```

### Context/State Management (Optional)

```javascript
// Tạo AuthContext để quản lý user state
// Tạo PostContext để cache posts data
```

## 🔧 Setup

1. Copy `.env.example` thành `.env`
2. Đảm bảo backend API chạy ở `https://localhost:59212`
3. Import services và sử dụng trong components
4. Xem chi tiết trong `API_INTEGRATION_GUIDE.md`

## 📚 Files Created

```
src/
├── configs/
│   └── axios.js (updated)
├── services/
│   ├── index.js
│   ├── authService.js
│   ├── postService.js
│   ├── batteryService.js
│   ├── vehicleService.js
│   ├── batteryModelService.js
│   ├── vehicleModelService.js
│   ├── paymentService.js
│   ├── packageService.js
│   ├── postRequestService.js
│   ├── memberService.js
│   └── constructService.js
└── constants/
    └── apiConstants.js

.env.example (updated)
API_INTEGRATION_GUIDE.md (new)
API_QUICK_REFERENCE.md (this file)
```

## 🎯 Next Steps

1. Test API connection với backend
2. Update LoginForm để sử dụng `authService`
3. Update ProductsPage để fetch real data
4. Implement error handling UI
5. Add loading states
6. Create AuthContext (optional)

---

**Swagger**: https://localhost:59212/swagger
**API Base**: https://localhost:59212
**Database**: EVehicleDB (SQL Server)
