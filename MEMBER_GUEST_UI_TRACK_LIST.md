# Track List: Xây dựng UI cho Member và Guest Module

> **Tài liệu này liệt kê các task cần thực hiện để implement UI cho Member và Guest Module theo chuẩn 6 bước**

---

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Module 1: Authentication (UC01, UC02, UC03)](#module-1-authentication-uc01-uc02-uc03)
3. [Module 2: Quản lý Hồ sơ (UC04)](#module-2-quản-lý-hồ-sơ-uc04)
4. [Module 3: Lịch sử Giao dịch (UC05)](#module-3-lịch-sử-giao-dịch-uc05)
5. [Module 4: Quản lý Bài đăng (UC06, UC07, UC08, UC09, UC10, UC13)](#module-4-quản-lý-bài-đăng-uc06-uc07-uc08-uc09-uc10-uc13)
6. [Module 5: Tìm kiếm và Xem Bài đăng (UC14, UC15, UC16, UC17, UC20)](#module-5-tìm-kiếm-và-xem-bài-đăng-uc14-uc15-uc16-uc17-uc20)
7. [Module 6: Yêu thích (UC18, UC19, UC22)](#module-6-yêu-thích-uc18-uc19-uc22)
8. [Module 7: Đấu giá (UC21)](#module-7-đấu-giá-uc21)
9. [Module 8: Đặt lịch xem / Môi giới (UC23)](#module-8-đặt-lịch-xem--môi-giới-uc23)
10. [Module 9: Gói tin và Credits (UC25, UC26, UC27)](#module-9-gói-tin-và-credits-uc25-uc26-uc27)
11. [Module 10: Thanh toán và Hợp đồng (UC28, UC29, UC30)](#module-10-thanh-toán-và-hợp-đồng-uc28-uc29-uc30)
12. [Module 11: Đánh giá và Phản hồi (UC31, UC32, UC33, UC34)](#module-11-đánh-giá-và-phản-hồi-uc31-uc32-uc33-uc34)
13. [Module 12: Chat và Thông báo (UC35, UC36, UC37, UC38)](#module-12-chat-và-thông-báo-uc35-uc36-uc37-uc38)
14. [Module 13: Home Page và Dashboard](#module-13-home-page-và-dashboard)

---

## Tổng quan

### Danh sách Use Case của Member và Guest

| UC | Tên Use Case | Actor | Trạng thái Backend | Ưu tiên |
|---|---|---|---|---|
| UC01 | Đăng ký Tài khoản | Guest | ✅ OK | 🔴 High |
| UC02 | Đăng nhập | Member | ✅ OK | 🔴 High |
| UC03 | Đăng nhập bằng Mạng xã hội | Guest | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC04 | Quản lý Hồ sơ cá nhân | Member | ⚠️ Cần kiểm tra | 🔴 High |
| UC05 | Xem Lịch sử Giao dịch | Member | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC06 | Tạo Bài đăng mới | Member | ✅ OK | 🔴 High |
| UC07 | Chỉnh sửa Bài đăng | Member | ✅ Check | 🔴 High |
| UC08 | Xóa Bài đăng | Member | ✅ Check | 🟡 Medium |
| UC09 | Tạm ẩn/Hiện Bài đăng | Member | ✅ Check | 🟡 Medium |
| UC10 | Đẩy tin (Bump Post) | Member | ⚠️ Cần kiểm tra | 🟢 Low |
| UC13 | Xem Danh sách Bài đăng của mình | Member | ✅ Check | 🔴 High |
| UC14 | Xem Chi tiết Bài đăng | Member, Guest | ✅ Oke | 🔴 High |
| UC15 | Tìm kiếm Sản phẩm | Member, Guest | ✅ Check | 🔴 High |
| UC16 | Lọc Sản phẩm | Member, Guest | ✅ Check | 🔴 High |
| UC17 | Sắp xếp Kết quả Tìm kiếm | Member, Guest | ✅ Check | 🔴 High |
| UC18 | Thêm vào Yêu thích | Member | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC19 | Xóa khỏi Yêu thích | Member | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC20 | So sánh Sản phẩm | Member, Guest | ⚠️ Cần kiểm tra | 🟢 Low |
| UC21 | Đấu giá | Member | ✅ OK | 🟡 Medium |
| UC22 | Xem Danh sách Yêu thích | Member | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC23 | Đặt lịch xem / Yêu cầu Môi giới | Member | ✅ OK | 🔴 High |
| UC25 | Xem Danh sách Gói tin | Member | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC26 | Mua Gói tin | Member | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC27 | Xem Số Credits còn lại | Member | ✅ OK | 🟡 Medium |
| UC28 | Thanh toán Giao dịch Mua bán | Member | ⚠️ Cần kiểm tra | 🔴 High |
| UC29 | Ký Hợp đồng Số hóa | Member | ✅ Check | 🟡 Medium |
| UC30 | Xem Lịch sử Thanh toán | Member | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC31 | Đánh giá Người bán | Member | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC32 | Đánh giá Người mua | Member | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC33 | Chỉnh sửa Đánh giá | Member | ⚠️ Cần kiểm tra | 🟢 Low |
| UC34 | Phản hồi Đánh giá | Member | ⚠️ Cần kiểm tra | 🟢 Low |
| UC35 | Gửi Tin nhắn | Member | ❌ Chưa có | 🟡 Medium |
| UC36 | Xem Lịch sử Chat | Member | ❌ Chưa có | 🟡 Medium |
| UC37 | Xem Danh sách Thông báo | Member | ❌ Chưa có | 🟢 Low |
| UC38 | Đánh dấu Thông báo đã đọc | Member | ❌ Chưa có | 🟢 Low |

### Quy trình 6 bước cho mỗi Module

1. **Bước 1**: Phân tích DTOs và Validators
2. **Bước 2**: Xây dựng Validation cho Frontend
3. **Bước 3**: Phân tích Controller và Endpoints
4. **Bước 4**: Xây dựng API Services
5. **Bước 5**: Xây dựng Components
6. **Bước 6**: Xây dựng Pages

---

## Module 1: Authentication (UC01, UC02, UC03)

### 📌 Use Cases
- **UC01**: Đăng ký Tài khoản (Guest)
- **UC02**: Đăng nhập (Member)
- **UC03**: Đăng nhập bằng Mạng xã hội (Guest)

### 🎯 Mục tiêu
Tạo UI để Guest đăng ký và đăng nhập, Member đăng nhập vào hệ thống.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [x] **1.1** Đọc và phân tích `RegisterRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Auth/RegisterRequest.cs`
  - Xác định các field: email, phoneNumber, password, confirmPassword, fullName
  - Ghi chú validation rules

- [x] **1.2** Đọc và phân tích `LoginRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Auth/LoginRequest.cs`
  - Xác định các field: emailOrPhone, password
  - Ghi chú validation rules

- [x] **1.3** Đọc và phân tích `SocialLoginRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Auth/SocialLoginRequest.cs`
  - Xác định các field: provider, token
  - Ghi chú validation rules

- [x] **1.4** Đọc và phân tích `AuthResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Auth/AuthResponse.cs`
  - Xác định các field trả về sau khi đăng nhập/đăng ký

- [x] **1.5** Đọc và phân tích `UserDto` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Users/UserDto.cs`
  - Xác định thông tin user hiện tại

- [x] **1.6** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_Authentication.md`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [x] **2.1** Tạo validation schema cho `RegisterRequest`
  - File: `FE/src/lib/validations/auth.validations.js`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

- [x] **2.2** Tạo validation schema cho `LoginRequest`
  - File: `FE/src/lib/validations/auth.validations.js`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

- [x] **2.3** Tạo validation schema cho `SocialLoginRequest`
  - File: `FE/src/lib/validations/auth.validations.js`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

- [x] **2.4** Test validation schemas
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [x] **3.1** Đọc và phân tích Auth Controller
  - File: `BE/src/EVehicle.API/Controllers/AuthController.cs`
  - Xác định các endpoints: `/register`, `/login`, `/social-login`, `/refresh-token`, `/me`

- [x] **3.2** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_Authentication.md`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

#### ✅ Bước 4: Xây dựng API Services

- [x] **4.1** Tạo Auth Service
  - File: `FE/src/api/services/auth.service.js`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

- [x] **4.2** Cấu hình Axios Interceptors
  - File: `FE/src/api/axios.config.js`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

#### ✅ Bước 5: Xây dựng Components

- [x] **5.1** Tạo RegisterForm Component
  - File: `FE/src/components/auth/RegisterForm.jsx`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

- [x] **5.2** Tạo LoginForm Component
  - File: `FE/src/components/auth/LoginForm.jsx`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

- [x] **5.3** Tạo SocialLogin Component
  - File: `FE/src/components/auth/SocialLogin.jsx`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

- [x] **5.4** Tạo PasswordStrengthIndicator Component
  - File: `FE/src/components/auth/PasswordStrengthIndicator.jsx`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

- [x] **5.5** Tạo PrivateRoute Component
  - File: `FE/src/components/auth/PrivateRoute.jsx`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

#### ✅ Bước 6: Xây dựng Pages

- [x] **6.1** Tạo Register Page
  - File: `FE/src/pages/auth/Register.jsx`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

- [x] **6.2** Tạo Login Page
  - File: `FE/src/pages/auth/Login.jsx`
  - ✅ Đã có trong `UI_DEVELOPMENT_GUIDE_AUTH.md`

- [ ] **6.3** Cấu hình Router cho Auth routes
  - File: `FE/src/router/index.jsx`
  - Thêm routes: `/auth/login`, `/auth/register`

- [ ] **6.4** Setup Google OAuth 2.0
  - Cài đặt `@react-oauth/google`
  - Cấu hình Google Client ID

- [ ] **6.5** Setup Facebook Login
  - Cài đặt `react-facebook-login`
  - Cấu hình Facebook App ID

---

## Module 2: Quản lý Hồ sơ (UC04)

### 📌 Use Case
- **UC04**: Quản lý Hồ sơ cá nhân

### 🎯 Mục tiêu
Tạo UI để Member xem và cập nhật thông tin cá nhân (tên, địa chỉ, ảnh đại diện, CMND/CCCD).

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `UpdateProfileRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Users/UpdateProfileRequest.cs`
  - Xác định các field: fullName, address, avatarUrl, idCard

- [ ] **1.2** Đọc và phân tích `UserDto` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Users/UserDto.cs`
  - Xác định các field hiển thị

- [ ] **1.3** Kiểm tra validation rules
  - FullName: max 100 chars
  - Address: max length?
  - AvatarUrl: URL format?
  - IdCard: format?

- [ ] **1.4** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_ProfileManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `UpdateProfileRequest`
  - File: `FE/src/lib/validations/profile.validations.js`
  - Sử dụng Zod

- [ ] **2.2** Test validation schemas

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích User Controller
  - File: `BE/src/EVehicle.API/Controllers/UsersController.cs`
  - Xác định endpoints: `GET /api/users/me`, `PUT /api/users/me`

- [ ] **3.2** Kiểm tra upload avatar endpoint
  - Endpoint: `POST /api/users/me/avatar` (nếu có)

- [ ] **3.3** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_ProfileManagement.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo User Service
  - File: `FE/src/api/services/user.service.js`
  - Methods: `getCurrentUser()`, `updateProfile()`, `uploadAvatar()`

- [ ] **4.2** Test API Services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo ProfileForm Component
  - File: `FE/src/components/member/ProfileForm.jsx`
  - Form để cập nhật thông tin cá nhân

- [ ] **5.2** Tạo AvatarUpload Component
  - File: `FE/src/components/member/AvatarUpload.jsx`
  - Component upload ảnh đại diện

- [ ] **5.3** Tạo ProfileView Component
  - File: `FE/src/components/member/ProfileView.jsx`
  - Component xem thông tin cá nhân

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo Profile Page
  - File: `FE/src/pages/member/Profile.jsx`
  - Tabs: Thông tin cá nhân, Bảo mật, Địa chỉ

- [ ] **6.2** Cấu hình Router
  - Route: `/member/profile`

---

## Module 3: Lịch sử Giao dịch (UC05)

### 📌 Use Case
- **UC05**: Xem Lịch sử Giao dịch

### 🎯 Mục tiêu
Tạo UI để Member xem lịch sử các giao dịch đã thực hiện (mua/bán), lọc theo ngày, loại, trạng thái, và xuất báo cáo.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `TransactionResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Transactions/TransactionResponse.cs`
  - Xác định các field: id, type, status, amount, date, etc.

- [ ] **1.2** Đọc và phân tích `TransactionSearchRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Transactions/TransactionSearchRequest.cs`
  - Xác định các filter: dateFrom, dateTo, type, status, pagination

- [ ] **1.3** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_TransactionHistory.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `TransactionSearchRequest`
  - File: `FE/src/lib/validations/transaction.validations.js`

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích Transaction Controller
  - File: `BE/src/EVehicle.API/Controllers/TransactionsController.cs`
  - Endpoints: `GET /api/transactions`, `GET /api/transactions/:id`

- [ ] **3.2** Kiểm tra export endpoint
  - Endpoint: `GET /api/transactions/export` (PDF/Excel)

- [ ] **3.3** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_TransactionHistory.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo Transaction Service
  - File: `FE/src/api/services/transaction.service.js`
  - Methods: `getTransactions()`, `getTransactionById()`, `exportTransactions()`

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo TransactionList Component
  - File: `FE/src/components/member/TransactionList.jsx`
  - Hiển thị danh sách giao dịch

- [ ] **5.2** Tạo TransactionFilters Component
  - File: `FE/src/components/member/TransactionFilters.jsx`
  - Filters: date, type, status

- [ ] **5.3** Tạo TransactionDetail Component
  - File: `FE/src/components/member/TransactionDetail.jsx`
  - Chi tiết giao dịch

- [ ] **5.4** Tạo ExportButton Component
  - File: `FE/src/components/member/ExportButton.jsx`
  - Export PDF/Excel

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo Transaction History Page
  - File: `FE/src/pages/member/TransactionHistory.jsx`

- [ ] **6.2** Cấu hình Router
  - Route: `/member/transactions`

---

## Module 4: Quản lý Bài đăng (UC06, UC07, UC08, UC09, UC10, UC13)

### 📌 Use Cases
- **UC06**: Tạo Bài đăng mới
- **UC07**: Chỉnh sửa Bài đăng
- **UC08**: Xóa Bài đăng
- **UC09**: Tạm ẩn/Hiện Bài đăng
- **UC10**: Đẩy tin (Bump Post)
- **UC13**: Xem Danh sách Bài đăng của mình

### 🎯 Mục tiêu
Tạo UI để Member (người bán) quản lý bài đăng: tạo, sửa, xóa, ẩn/hiện, đẩy tin, và xem danh sách bài đăng.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `CreatePostRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/CreatePostRequest.cs`
  - Xác định các field: title, description, price, location, specifications, images, packageId

- [ ] **1.2** Đọc và phân tích `UpdatePostRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/UpdatePostRequest.cs`

- [ ] **1.3** Đọc và phân tích `PostResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/PostResponse.cs`

- [ ] **1.4** Đọc và phân tích `MyPostSearchRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/MyPostSearchRequest.cs`
  - Filters: status, pagination

- [ ] **1.5** Kiểm tra AI Price Suggestion endpoint
  - Endpoint: `POST /api/posts/suggest-price`

- [ ] **1.6** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_PostManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `CreatePostRequest`
  - File: `FE/src/lib/validations/post.validations.js`
  - Validate: title, description, price, images, specifications

- [ ] **2.2** Tạo validation schema cho `UpdatePostRequest`
  - File: `FE/src/lib/validations/post.validations.js`

- [ ] **2.3** Test validation schemas

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích Post Controller
  - File: `BE/src/EVehicle.API/Controllers/PostsController.cs`
  - Endpoints:
    - `POST /api/posts` - Tạo bài đăng
    - `PUT /api/posts/:id` - Cập nhật bài đăng
    - `DELETE /api/posts/:id` - Xóa bài đăng
    - `PATCH /api/posts/:id/toggle-active` - Ẩn/hiện bài đăng
    - `POST /api/posts/:id/bump` - Đẩy tin
    - `GET /api/posts/my-posts` - Danh sách bài đăng của mình
    - `GET /api/posts/:id` - Chi tiết bài đăng

- [ ] **3.2** Kiểm tra upload images endpoint
  - Endpoint: `POST /api/posts/upload-images`

- [ ] **3.3** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_PostManagement.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo Post Service
  - File: `FE/src/api/services/post.service.js`
  - Methods: `createPost()`, `updatePost()`, `deletePost()`, `toggleActive()`, `bumpPost()`, `getMyPosts()`, `getPostById()`, `uploadImages()`, `suggestPrice()`

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo PostForm Component
  - File: `FE/src/components/member/post/PostForm.jsx`
  - Form tạo/cập nhật bài đăng
  - Steps: Loại sản phẩm → Thông tin cơ bản → Thông số kỹ thuật → Hình ảnh → Gói tin

- [ ] **5.2** Tạo ImageUpload Component
  - File: `FE/src/components/member/post/ImageUpload.jsx`
  - Upload nhiều ảnh, preview, drag & drop

- [ ] **5.3** Tạo PriceSuggestion Component
  - File: `FE/src/components/member/post/PriceSuggestion.jsx`
  - Hiển thị giá gợi ý từ AI

- [ ] **5.4** Tạo PackageSelector Component
  - File: `FE/src/components/member/post/PackageSelector.jsx`
  - Chọn gói tin (Basic, Premium, Luxury)

- [ ] **5.5** Tạo MyPostList Component
  - File: `FE/src/components/member/post/MyPostList.jsx`
  - Danh sách bài đăng với filters (status)

- [ ] **5.6** Tạo PostCard Component
  - File: `FE/src/components/member/post/PostCard.jsx`
  - Card hiển thị bài đăng với actions (edit, delete, toggle active, bump)

- [ ] **5.7** Tạo PostActions Component
  - File: `FE/src/components/member/post/PostActions.jsx`
  - Actions: Edit, Delete, Toggle Active, Bump

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo Create Post Page
  - File: `FE/src/pages/member/posts/CreatePost.jsx`

- [ ] **6.2** Tạo Edit Post Page
  - File: `FE/src/pages/member/posts/EditPost.jsx`

- [ ] **6.3** Tạo My Posts Page
  - File: `FE/src/pages/member/posts/MyPosts.jsx`

- [ ] **6.4** Cấu hình Router
  - Routes: `/member/posts/create`, `/member/posts/:id/edit`, `/member/posts`

---

## Module 5: Tìm kiếm và Xem Bài đăng (UC14, UC15, UC16, UC17, UC20)

### 📌 Use Cases
- **UC14**: Xem Chi tiết Bài đăng (Member, Guest)
- **UC15**: Tìm kiếm Sản phẩm (Member, Guest)
- **UC16**: Lọc Sản phẩm (Member, Guest)
- **UC17**: Sắp xếp Kết quả Tìm kiếm (Member, Guest)
- **UC20**: So sánh Sản phẩm (Member, Guest)

### 🎯 Mục tiêu
Tạo UI để Member và Guest tìm kiếm, lọc, sắp xếp, xem chi tiết và so sánh sản phẩm.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `PostSearchRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/PostSearchRequest.cs`
  - Filters: keyword, category, brand, model, priceRange, soh, km, year, location, sortBy

- [ ] **1.2** Đọc và phân tích `PostDetailResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/PostDetailResponse.cs`

- [ ] **1.3** Đọc và phân tích `PostListResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/PostListResponse.cs`

- [ ] **1.4** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_SearchAndBrowse.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `PostSearchRequest`
  - File: `FE/src/lib/validations/search.validations.js`

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích Post Controller
  - File: `BE/src/EVehicle.API/Controllers/PostsController.cs`
  - Endpoints:
    - `GET /api/posts` - Tìm kiếm bài đăng
    - `GET /api/posts/:id` - Chi tiết bài đăng
    - `GET /api/posts/compare` - So sánh sản phẩm

- [ ] **3.2** Kiểm tra filter options endpoint
  - Endpoint: `GET /api/posts/filter-options` (brands, models, etc.)

- [ ] **3.3** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_SearchAndBrowse.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo Search Service
  - File: `FE/src/api/services/search.service.js`
  - Methods: `searchPosts()`, `getPostDetail()`, `comparePosts()`, `getFilterOptions()`

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo SearchBar Component
  - File: `FE/src/components/search/SearchBar.jsx`
  - Search input với autocomplete

- [ ] **5.2** Tạo SearchFilters Component
  - File: `FE/src/components/search/SearchFilters.jsx`
  - Filters: category, brand, model, price, soh, km, year, location

- [ ] **5.3** Tạo SortDropdown Component
  - File: `FE/src/components/search/SortDropdown.jsx`
  - Sort: Giá, Ngày đăng, Độ phổ biến

- [ ] **5.4** Tạo PostGrid Component
  - File: `FE/src/components/search/PostGrid.jsx`
  - Grid hiển thị danh sách bài đăng

- [ ] **5.5** Tạo PostCard Component (Public)
  - File: `FE/src/components/search/PostCard.jsx`
  - Card bài đăng với image, title, price, location

- [ ] **5.6** Tạo PostDetail Component
  - File: `FE/src/components/search/PostDetail.jsx`
  - Chi tiết bài đăng: images, specs, seller info, actions

- [ ] **5.7** Tạo CompareModal Component
  - File: `FE/src/components/search/CompareModal.jsx`
  - So sánh tối đa 3-5 sản phẩm

- [ ] **5.8** Tạo ImageGallery Component
  - File: `FE/src/components/search/ImageGallery.jsx`
  - Gallery ảnh với zoom, slide

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo Search Page
  - File: `FE/src/pages/search/Search.jsx`

- [ ] **6.2** Tạo Post Detail Page
  - File: `FE/src/pages/posts/PostDetail.jsx`

- [ ] **6.3** Tạo Home Page
  - File: `FE/src/pages/Home.jsx`
  - Hiển thị featured posts, categories

- [ ] **6.4** Cấu hình Router
  - Routes: `/search`, `/posts/:id`, `/`

---

## Module 6: Yêu thích (UC18, UC19, UC22)

### 📌 Use Cases
- **UC18**: Thêm vào Yêu thích
- **UC19**: Xóa khỏi Yêu thích
- **UC22**: Xem Danh sách Yêu thích

### 🎯 Mục tiêu
Tạo UI để Member thêm/xóa bài đăng khỏi yêu thích và xem danh sách yêu thích.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [x] **1.1** Đọc và phân tích `FavoriteRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Favorites/FavoriteRequest.cs`
  - Field: postId
  - ✅ Đã phân tích: Backend sử dụng route parameter thay vì request body

- [x] **1.2** Đọc và phân tích `FavoriteResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Favorites/FavoriteResponse.cs`
  - ✅ Đã phân tích: Có PostInfo nested object

- [x] **1.3** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_Favorites.md`
  - ✅ Đã tạo validation schema

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [x] **2.1** Tạo validation schema cho `FavoriteRequest`
  - File: `FE/src/lib/validations/favorite.validations.js`
  - ✅ Đã tạo: favoriteRequestSchema và favoriteListRequestSchema

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [x] **3.1** Đọc và phân tích Favorite Controller
  - File: `BE/src/EVehicle.API/Controllers/FavoritesController.cs`
  - Endpoints:
    - `POST /api/favorites/{postId}` - Thêm vào yêu thích ✅
    - `DELETE /api/favorites/{postId}` - Xóa khỏi yêu thích ✅
    - `GET /api/favorites` - Danh sách yêu thích ✅
    - `GET /api/favorites/{postId}/check` - Kiểm tra đã yêu thích chưa ✅

- [x] **3.2** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_Favorites.md`
  - ✅ Đã tích hợp vào service

#### ✅ Bước 4: Xây dựng API Services

- [x] **4.1** Tạo Favorite Service
  - File: `FE/src/api/services/favorite.service.js`
  - Methods: `addToFavorites()`, `removeFromFavorites()`, `getFavorites()`, `isFavorite()` ✅

#### ✅ Bước 5: Xây dựng Components

- [x] **5.1** Tạo FavoriteButton Component
  - File: `FE/src/components/member/favorite/FavoriteButton.jsx`
  - Button toggle favorite với icon ✅
  - Hỗ trợ cả icon và text mode ✅

- [x] **5.2** Tạo FavoriteList Component
  - File: `FE/src/components/member/favorite/FavoriteList.jsx`
  - Danh sách bài đăng yêu thích với pagination ✅

- [x] **5.3** Tạo FavoriteCard Component
  - File: `FE/src/components/member/favorite/FavoriteCard.jsx`
  - Card bài đăng với nút xóa ✅

#### ✅ Bước 6: Xây dựng Pages

- [x] **6.1** Tạo Favorites Page
  - File: `FE/src/pages/member/Favorites.jsx`
  - ✅ Đã tạo với header và footer như HomePage
  - ✅ Có filters (keyword, category, status, isActive)

- [x] **6.2** Cấu hình Router
  - Route: `/favorites` ✅
  - ✅ Đã tích hợp vào router với PrivateRoute

- [x] **6.3** Tích hợp FavoriteButton vào PostCard
  - File: `FE/src/components/search/PostCard.jsx`
  - ✅ Đã tích hợp vào PostCard

- [x] **6.4** Tích hợp FavoriteButton vào HomePage
  - File: `FE/src/pages/Home.jsx`
  - ✅ Đã tích hợp vào PostCard trong HomePage

- [x] **6.5** Tích hợp FavoriteButton vào PostDetailPage
  - File: `FE/src/pages/posts/PostDetailPage.jsx`
  - ✅ Đã tích hợp vào image gallery và action buttons

---

## Module 7: Đấu giá (UC21)

### 📌 Use Case
- **UC21**: Đấu giá

### 🎯 Mục tiêu
Tạo UI để Member (người mua) đấu giá cho sản phẩm và Member (người bán) tạo bài đăng đấu giá.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `CreateAuctionRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Auctions/CreateAuctionRequest.cs`
  - Fields: postId, startingPrice, buyNowPrice, endTime

- [ ] **1.2** Đọc và phân tích `BidRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Auctions/BidRequest.cs`
  - Fields: auctionId, amount

- [ ] **1.3** Đọc và phân tích `AuctionResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Auctions/AuctionResponse.cs`

- [ ] **1.4** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_Auction.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `BidRequest`
  - File: `FE/src/lib/validations/auction.validations.js`
  - Validate: amount > currentPrice

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích Auction Controller
  - File: `BE/src/EVehicle.API/Controllers/AuctionsController.cs`
  - Endpoints:
    - `GET /api/auctions/:id` - Chi tiết đấu giá
    - `POST /api/auctions/:id/bid` - Đặt giá
    - `GET /api/auctions/:id/bids` - Lịch sử đặt giá
    - `GET /api/auctions` - Danh sách đấu giá

- [ ] **3.2** Kiểm tra WebSocket/SSE cho real-time updates
  - Endpoint: `WS /api/auctions/:id/stream`

- [ ] **3.3** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_Auction.md`

#### ✅ Bước 4: Xây dựng API Services

- [x] **4.1** Tạo Bid Service
  - File: `FE/src/api/services/bid.service.js`
  - Methods: `createBid()`, `getBidsByPostId()` ✅
  - Sử dụng postsService.searchPosts() với `auctionOnly: true` để lấy danh sách đấu giá ✅

- [ ] **4.2** Setup WebSocket client
  - File: `FE/src/api/websocket/auction.ws.js`
  - Real-time updates cho đấu giá (Optional - có thể thêm sau)

#### ✅ Bước 5: Xây dựng Components

- [x] **5.1** Tạo AuctionDetail Component
  - File: `FE/src/components/auction/AuctionDetail.jsx`
  - Hiển thị thông tin đấu giá, countdown timer ✅

- [x] **5.2** Tạo BidForm Component
  - File: `FE/src/components/auction/BidForm.jsx`
  - Form đặt giá ✅

- [x] **5.3** Tạo BidHistory Component
  - File: `FE/src/components/auction/BidHistory.jsx`
  - Lịch sử đặt giá ✅

- [x] **5.4** Tạo CountdownTimer Component
  - File: `FE/src/components/auction/CountdownTimer.jsx`
  - Countdown timer đến khi kết thúc ✅

- [x] **5.5** Tạo AuctionList Component
  - File: `FE/src/components/auction/AuctionList.jsx`
  - Danh sách đấu giá đang diễn ra ✅

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo Auction Detail Page
  - File: `FE/src/pages/auctions/AuctionDetail.jsx`
  - ⚠️ Hiện tại sử dụng PostDetailPage với auction info

- [x] **6.2** Tạo Auctions Page
  - File: `FE/src/pages/auctions/AuctionsPage.jsx`
  - ✅ Đã tạo với search và pagination

- [x] **6.3** Cấu hình Router
  - Routes: `/auctions` ✅
  - ✅ Đã tích hợp vào router

- [x] **6.4** Tích hợp AuctionList vào HomePage
  - File: `FE/src/pages/Home.jsx`
  - ✅ Đã tích hợp section đấu giá vào HomePage (dòng 789-836)
  - ✅ Fetch auction posts với `auctionOnly: true`
  - ✅ Hiển thị AuctionList component
  - ✅ Link đến trang `/auctions`

---

## Module 8: Đặt lịch xem / Môi giới (UC23)

### 📌 Use Case
- **UC23**: Đặt lịch xem / Yêu cầu Môi giới

### 🎯 Mục tiêu
Tạo UI để Member (người mua) đặt lịch xem hoặc yêu cầu môi giới cho sản phẩm.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `ScheduleViewRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Leads/ScheduleViewRequest.cs`
  - Fields: postId, preferredDate, preferredTime, message

- [ ] **1.2** Đọc và phân tích `LeadResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Leads/LeadResponse.cs`

- [ ] **1.3** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_LeadRequest.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `ScheduleViewRequest`
  - File: `FE/src/lib/validations/lead.validations.js`

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích Lead Controller
  - File: `BE/src/EVehicle.API/Controllers/LeadsController.cs`
  - Endpoints:
    - `POST /api/leads/schedule-view` - Đặt lịch xem
    - `POST /api/leads/request-broker` - Yêu cầu môi giới
    - `GET /api/leads/my-leads` - Danh sách Lead của mình

- [ ] **3.2** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_LeadRequest.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo Lead Service
  - File: `FE/src/api/services/lead.service.js`
  - Methods: `scheduleView()`, `requestBroker()`, `getMyLeads()`

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo ScheduleViewForm Component
  - File: `FE/src/components/member/lead/ScheduleViewForm.jsx`
  - Form đặt lịch xem

- [ ] **5.2** Tạo RequestBrokerForm Component
  - File: `FE/src/components/member/lead/RequestBrokerForm.jsx`
  - Form yêu cầu môi giới

- [ ] **5.3** Tạo MyLeadsList Component
  - File: `FE/src/components/member/lead/MyLeadsList.jsx`
  - Danh sách Lead của mình

- [ ] **5.4** Tạo LeadCard Component
  - File: `FE/src/components/member/lead/LeadCard.jsx`
  - Card hiển thị Lead

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo Schedule View Modal
  - File: `FE/src/components/member/lead/ScheduleViewModal.jsx`
  - Modal đặt lịch xem (trigger từ Post Detail Page)

- [ ] **6.2** Tạo My Leads Page
  - File: `FE/src/pages/member/Leads.jsx`

- [ ] **6.3** Cấu hình Router
  - Route: `/member/leads`

---

## Module 9: Gói tin và Credits (UC25, UC26, UC27)

### 📌 Use Cases
- **UC25**: Xem Danh sách Gói tin
- **UC26**: Mua Gói tin
- **UC27**: Xem Số Credits còn lại

### 🎯 Mục tiêu
Tạo UI để Member xem danh sách gói tin, mua gói tin và xem số credits còn lại.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `PackageResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Packages/PackageResponse.cs`

- [ ] **1.2** Đọc và phân tích `PurchasePackageRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Packages/PurchasePackageRequest.cs`
  - Fields: packageId, paymentMethod

- [ ] **1.3** Đọc và phân tích `UserPackageCreditsResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Packages/UserPackageCreditsResponse.cs`

- [ ] **1.4** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_Packages.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `PurchasePackageRequest`
  - File: `FE/src/lib/validations/package.validations.js`

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích Package Controller
  - File: `BE/src/EVehicle.API/Controllers/PackagesController.cs`
  - Endpoints:
    - `GET /api/packages` - Danh sách gói tin
    - `POST /api/packages/:id/purchase` - Mua gói tin
    - `GET /api/packages/my-credits` - Số credits còn lại
    - `GET /api/packages/purchase-history` - Lịch sử mua gói tin

- [ ] **3.2** Kiểm tra payment gateway integration
  - Endpoints: Payment callbacks, webhooks

- [ ] **3.3** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_Packages.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo Package Service
  - File: `FE/src/api/services/package.service.js`
  - Methods: `getPackages()`, `purchasePackage()`, `getMyCredits()`, `getPurchaseHistory()`

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo PackageList Component
  - File: `FE/src/components/member/package/PackageList.jsx`
  - Danh sách gói tin với comparison

- [ ] **5.2** Tạo PackageCard Component
  - File: `FE/src/components/member/package/PackageCard.jsx`
  - Card gói tin với features

- [ ] **5.3** Tạo PurchasePackageModal Component
  - File: `FE/src/components/member/package/PurchasePackageModal.jsx`
  - Modal mua gói tin với payment method selection

- [ ] **5.4** Tạo CreditsDisplay Component
  - File: `FE/src/components/member/package/CreditsDisplay.jsx`
  - Hiển thị số credits còn lại

- [ ] **5.5** Tạo PaymentMethodSelector Component
  - File: `FE/src/components/member/package/PaymentMethodSelector.jsx`
  - Chọn phương thức thanh toán

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo Packages Page
  - File: `FE/src/pages/member/Packages.jsx`

- [ ] **6.2** Tạo My Credits Page
  - File: `FE/src/pages/member/Credits.jsx`

- [ ] **6.3** Cấu hình Router
  - Routes: `/member/packages`, `/member/credits`

---

## Module 10: Thanh toán và Hợp đồng (UC28, UC29, UC30)

### 📌 Use Cases
- **UC28**: Thanh toán Giao dịch Mua bán
- **UC29**: Ký Hợp đồng Số hóa
- **UC30**: Xem Lịch sử Thanh toán

### 🎯 Mục tiêu
Tạo UI để Member thanh toán giao dịch, ký hợp đồng số hóa và xem lịch sử thanh toán.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [x] **1.1** Đọc và phân tích `PaymentCreateRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Orders/PaymentCreateRequest.cs`
  - Fields: orderId, paymentGateway (VNPAY, MOMO)

- [x] **1.2** Đọc và phân tích `PaymentDetailResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Orders/PaymentDetailResponse.cs`
  - ✅ Đã phân tích: Có OrderInfo nested object

- [x] **1.3** Đọc và phân tích `ContractResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Contracts/ContractResponse.cs`
  - ✅ Đã phân tích: Có trạng thái ký (IsBuyerSigned, IsSellerSigned)

- [x] **1.4** Đọc và phân tích `ContractSignRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Contracts/ContractSignRequest.cs`
  - Fields: signature (base64 image hoặc OTP), signType (SIGNATURE, OTP)

- [x] **1.5** Đọc và phân tích `PaymentSearchRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Orders/PaymentSearchRequest.cs`
  - ✅ Đã phân tích: Có filters (paymentType, status, paymentGateway, fromDate, toDate)

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [x] **2.1** Tạo validation schema cho `PaymentCreateRequest`
  - File: `FE/src/lib/validations/payment.validations.js`
  - ✅ Đã tạo: paymentCreateRequestSchema và paymentSearchRequestSchema

- [x] **2.2** Tạo validation schema cho `ContractSignRequest`
  - File: `FE/src/lib/validations/contract.validation.js`
  - ✅ Đã tạo: contractSignRequestSchema

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [x] **3.1** Đọc và phân tích Payment Controller
  - File: `BE/src/EVehicle.API/Controllers/PaymentsController.cs`
  - Endpoints:
    - `GET /api/payments` - Lịch sử thanh toán ✅
    - `GET /api/payments/:id` - Chi tiết payment ✅
  - File: `BE/src/EVehicle.API/Controllers/OrdersController.cs`
    - `POST /api/orders/payment` - Tạo payment ✅
    - `POST /api/orders/payment/webhook` - Webhook payment ✅

- [x] **3.2** Đọc và phân tích Contract Controller
  - File: `BE/src/EVehicle.API/Controllers/ContractsController.cs`
  - Endpoints:
    - `GET /api/contracts/:id` - Chi tiết hợp đồng ✅
    - `POST /api/contracts/:id/sign` - Ký hợp đồng ✅
    - `GET /api/contracts/:id/pdf` - Tải hợp đồng PDF ✅

- [x] **3.3** Kiểm tra payment gateway callbacks
  - Endpoint: `POST /api/orders/payment/webhook` ✅

- [x] **3.4** Tạo document tổng hợp Endpoints
  - ✅ Đã tích hợp vào services

#### ✅ Bước 4: Xây dựng API Services

- [x] **4.1** Tạo Payment Service
  - File: `FE/src/api/services/payment.service.js`
  - Methods: `createPayment()`, `getPaymentById()`, `getPaymentHistory()` ✅
  - ✅ Đã tích hợp với orderService.createPayment()

- [x] **4.2** Tạo Contract Service
  - File: `FE/src/api/services/contract.service.js`
  - Methods: `getContractById()`, `signContract()`, `getContractPdfUrl()` ✅

#### ✅ Bước 5: Xây dựng Components

- [x] **5.1** Tạo PaymentForm Component
  - File: `FE/src/components/member/payment/PaymentForm.jsx`
  - Form thanh toán với payment method selection (VNPAY, MOMO) ✅

- [x] **5.2** Tạo PaymentHistoryList Component
  - File: `FE/src/components/member/payment/PaymentHistoryList.jsx`
  - Danh sách lịch sử thanh toán với filters và pagination ✅

- [x] **5.3** Tạo ContractViewer Component
  - File: `FE/src/components/member/contract/ContractViewer.jsx`
  - Xem hợp đồng, tải PDF, hiển thị trạng thái ký ✅

- [x] **5.4** Tạo ContractSigner Component
  - File: `FE/src/components/member/contract/ContractSigner.jsx`
  - Ký hợp đồng (OTP or digital signature) ✅

- [x] **5.5** Tạo SignatureCanvas Component
  - File: `FE/src/components/member/contract/SignatureCanvas.jsx`
  - Component vẽ chữ ký trên canvas (hỗ trợ mouse và touch) ✅

#### ✅ Bước 6: Xây dựng Pages

- [x] **6.1** Tạo Payment Page
  - File: `FE/src/pages/member/Payment.jsx`
  - ✅ Đã tạo với Header/Footer như HomePage

- [x] **6.2** Tạo PaymentDetail Page
  - File: `FE/src/pages/member/PaymentDetail.jsx`
  - ✅ Đã tạo với Header/Footer như HomePage

- [x] **6.3** Tạo Payment History Page
  - File: `FE/src/pages/member/PaymentHistory.jsx`
  - ✅ Đã tạo với Header/Footer như HomePage, có filters

- [x] **6.4** Tạo Contract Page
  - File: `FE/src/pages/member/Contract.jsx`
  - ✅ Đã tạo với Header/Footer như HomePage

- [x] **6.5** Cấu hình Router
  - Routes: `/payment/:orderId`, `/payments/:id`, `/payment-history`, `/contracts/:contractId` ✅
  - ✅ Đã tích hợp vào router với PrivateRoute

---

## Module 11: Đánh giá và Phản hồi (UC31, UC32, UC33, UC34)

### 📌 Use Cases
- **UC31**: Đánh giá Người bán
- **UC32**: Đánh giá Người mua
- **UC33**: Chỉnh sửa Đánh giá
- **UC34**: Phản hồi Đánh giá

### 🎯 Mục tiêu
Tạo UI để Member đánh giá người mua/bán, chỉnh sửa đánh giá và phản hồi đánh giá.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `CreateReviewRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Reviews/CreateReviewRequest.cs`
  - Fields: transactionId, rating (1-5), comment, reviewType (SELLER/BUYER)

- [ ] **1.2** Đọc và phân tích `UpdateReviewRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Reviews/UpdateReviewRequest.cs`

- [ ] **1.3** Đọc và phân tích `ReviewResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Reviews/ReviewResponse.cs`

- [ ] **1.4** Đọc và phân tích `ReplyReviewRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Reviews/ReplyReviewRequest.cs`

- [ ] **1.5** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_Reviews.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `CreateReviewRequest`
  - File: `FE/src/lib/validations/review.validations.js`
  - Validate: rating (1-5), comment (optional but recommended)

- [ ] **2.2** Tạo validation schema cho `UpdateReviewRequest`
  - File: `FE/src/lib/validations/review.validations.js`

- [ ] **2.3** Tạo validation schema cho `ReplyReviewRequest`
  - File: `FE/src/lib/validations/review.validations.js`

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích Review Controller
  - File: `BE/src/EVehicle.API/Controllers/ReviewsController.cs`
  - Endpoints:
    - `POST /api/reviews` - Tạo đánh giá
    - `PUT /api/reviews/:id` - Cập nhật đánh giá
    - `POST /api/reviews/:id/reply` - Phản hồi đánh giá
    - `GET /api/reviews/user/:userId` - Đánh giá của user
    - `GET /api/reviews/transaction/:transactionId` - Đánh giá của giao dịch

- [ ] **3.2** Kiểm tra time limit cho edit (7 ngày)
  - Logic: Chỉ cho phép edit trong 7 ngày

- [ ] **3.3** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_Reviews.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo Review Service
  - File: `FE/src/api/services/review.service.js`
  - Methods: `createReview()`, `updateReview()`, `replyReview()`, `getUserReviews()`, `getTransactionReviews()`

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo ReviewForm Component
  - File: `FE/src/components/member/review/ReviewForm.jsx`
  - Form đánh giá với star rating và comment

- [ ] **5.2** Tạo StarRating Component
  - File: `FE/src/components/member/review/StarRating.jsx`
  - Component đánh giá sao (1-5)

- [ ] **5.3** Tạo ReviewList Component
  - File: `FE/src/components/member/review/ReviewList.jsx`
  - Danh sách đánh giá

- [ ] **5.4** Tạo ReviewCard Component
  - File: `FE/src/components/member/review/ReviewCard.jsx`
  - Card hiển thị đánh giá với reply

- [ ] **5.5** Tạo ReplyForm Component
  - File: `FE/src/components/member/review/ReplyForm.jsx`
  - Form phản hồi đánh giá

- [ ] **5.6** Tạo EditReviewModal Component
  - File: `FE/src/components/member/review/EditReviewModal.jsx`
  - Modal chỉnh sửa đánh giá (chỉ trong 7 ngày)

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo Review Page (trong Transaction Detail)
  - File: `FE/src/components/member/review/ReviewSection.jsx`
  - Section đánh giá trong transaction detail

- [ ] **6.2** Tạo User Reviews Page
  - File: `FE/src/pages/member/UserReviews.jsx`
  - Xem đánh giá của một user

- [ ] **6.3** Cấu hình Router
  - Route: `/member/reviews/:userId`

---

## Module 12: Chat và Thông báo (UC35, UC36, UC37, UC38)

### 📌 Use Cases
- **UC35**: Gửi Tin nhắn
- **UC36**: Xem Lịch sử Chat
- **UC37**: Xem Danh sách Thông báo
- **UC38**: Đánh dấu Thông báo đã đọc

### 🎯 Mục tiêu
Tạo UI để Member chat với người bán/người mua/Staff và xem thông báo.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `SendMessageRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Messages/SendMessageRequest.cs`
  - Fields: chatRoomId, content, attachments

- [ ] **1.2** Đọc và phân tích `MessageResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Messages/MessageResponse.cs`

- [ ] **1.3** Đọc và phân tích `ChatRoomResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Messages/ChatRoomResponse.cs`

- [ ] **1.4** Đọc và phân tích `NotificationResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Notifications/NotificationResponse.cs`

- [ ] **1.5** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_ChatAndNotification.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `SendMessageRequest`
  - File: `FE/src/lib/validations/message.validations.js`

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích Message Controller
  - File: `BE/src/EVehicle.API/Controllers/MessagesController.cs`
  - Endpoints:
    - `GET /api/messages/chat-rooms` - Danh sách phòng chat
    - `GET /api/messages/chat-rooms/:id` - Chi tiết phòng chat
    - `GET /api/messages/chat-rooms/:id/messages` - Lịch sử tin nhắn
    - `POST /api/messages` - Gửi tin nhắn
    - `POST /api/messages/chat-rooms` - Tạo phòng chat

- [ ] **3.2** Đọc và phân tích Notification Controller
  - File: `BE/src/EVehicle.API/Controllers/NotificationsController.cs`
  - Endpoints:
    - `GET /api/notifications` - Danh sách thông báo
    - `PATCH /api/notifications/:id/read` - Đánh dấu đã đọc
    - `PATCH /api/notifications/read-all` - Đánh dấu tất cả đã đọc

- [ ] **3.3** Kiểm tra WebSocket/SSE cho real-time chat
  - Endpoint: `WS /api/messages/stream`

- [ ] **3.4** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_ChatAndNotification.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo Message Service
  - File: `FE/src/api/services/message.service.js`
  - Methods: `getChatRooms()`, `getChatRoom()`, `getMessages()`, `sendMessage()`, `createChatRoom()`

- [ ] **4.2** Tạo Notification Service
  - File: `FE/src/api/services/notification.service.js`
  - Methods: `getNotifications()`, `markAsRead()`, `markAllAsRead()`

- [ ] **4.3** Setup WebSocket client
  - File: `FE/src/api/websocket/message.ws.js`
  - Real-time chat

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo ChatRoomList Component
  - File: `FE/src/components/member/chat/ChatRoomList.jsx`
  - Danh sách phòng chat

- [ ] **5.2** Tạo ChatRoom Component
  - File: `FE/src/components/member/chat/ChatRoom.jsx`
  - Phòng chat với message list và input

- [ ] **5.3** Tạo MessageList Component
  - File: `FE/src/components/member/chat/MessageList.jsx`
  - Danh sách tin nhắn với scroll to bottom

- [ ] **5.4** Tạo MessageInput Component
  - File: `FE/src/components/member/chat/MessageInput.jsx`
  - Input gửi tin nhắn với file upload

- [ ] **5.5** Tạo MessageBubble Component
  - File: `FE/src/components/member/chat/MessageBubble.jsx`
  - Bubble tin nhắn với timestamp, read status

- [ ] **5.6** Tạo NotificationList Component
  - File: `FE/src/components/member/notification/NotificationList.jsx`
  - Danh sách thông báo

- [ ] **5.7** Tạo NotificationCard Component
  - File: `FE/src/components/member/notification/NotificationCard.jsx`
  - Card thông báo với badge unread

- [ ] **5.8** Tạo NotificationBell Component
  - File: `FE/src/components/member/notification/NotificationBell.jsx`
  - Bell icon với badge count

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo Chat Page
  - File: `FE/src/pages/member/Chat.jsx`
  - Layout: ChatRoomList (sidebar) + ChatRoom (main)

- [ ] **6.2** Tạo Notifications Page
  - File: `FE/src/pages/member/Notifications.jsx`

- [ ] **6.3** Tạo Chat Modal (trigger từ Post Detail)
  - File: `FE/src/components/member/chat/ChatModal.jsx`
  - Modal chat với seller

- [ ] **6.4** Cấu hình Router
  - Routes: `/member/chat`, `/member/notifications`

---

## Module 13: Home Page và Dashboard

### 📌 Use Cases
- Home Page cho Guest và Member
- Dashboard cho Member

### 🎯 Mục tiêu
Tạo Home Page với featured posts, categories và Dashboard cho Member với thống kê cá nhân.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Kiểm tra Home Page data endpoints
  - Endpoints: Featured posts, categories, statistics

- [ ] **1.2** Kiểm tra Dashboard data endpoints
  - Endpoints: Member statistics, recent activities

- [ ] **1.3** Tạo document tổng hợp DTOs
  - File: `FE/docs/member/DTOs_HomeAndDashboard.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Không cần validation cho Home/Dashboard (chủ yếu là GET requests)

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Kiểm tra Home Controller
  - File: `BE/src/EVehicle.API/Controllers/HomeController.cs`
  - Endpoints:
    - `GET /api/home/featured-posts` - Featured posts
    - `GET /api/home/categories` - Categories
    - `GET /api/home/statistics` - Statistics

- [ ] **3.2** Kiểm tra Dashboard Controller
  - File: `BE/src/EVehicle.API/Controllers/DashboardController.cs`
  - Endpoints:
    - `GET /api/member/dashboard` - Member dashboard data

- [ ] **3.3** Tạo document tổng hợp Endpoints
  - File: `FE/docs/member/Endpoints_HomeAndDashboard.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo Home Service
  - File: `FE/src/api/services/home.service.js`
  - Methods: `getFeaturedPosts()`, `getCategories()`, `getStatistics()`

- [ ] **4.2** Tạo Dashboard Service
  - File: `FE/src/api/services/dashboard.service.js`
  - Methods: `getMemberDashboard()`

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo HeroSection Component
  - File: `FE/src/components/home/HeroSection.jsx`
  - Hero section với search bar

- [ ] **5.2** Tạo FeaturedPosts Component
  - File: `FE/src/components/home/FeaturedPosts.jsx`
  - Featured posts carousel

- [ ] **5.3** Tạo Categories Component
  - File: `FE/src/components/home/Categories.jsx`
  - Categories grid

- [ ] **5.4** Tạo StatisticsCard Component
  - File: `FE/src/components/member/dashboard/StatisticsCard.jsx`
  - Card thống kê

- [ ] **5.5** Tạo RecentActivities Component
  - File: `FE/src/components/member/dashboard/RecentActivities.jsx`
  - Recent activities list

- [ ] **5.6** Tạo QuickActions Component
  - File: `FE/src/components/member/dashboard/QuickActions.jsx`
  - Quick actions (Create Post, View Leads, etc.)

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo Home Page
  - File: `FE/src/pages/Home.jsx`
  - Layout: HeroSection + FeaturedPosts + Categories

- [ ] **6.2** Tạo Member Dashboard Page
  - File: `FE/src/pages/member/Dashboard.jsx`
  - Layout: Statistics + Recent Activities + Quick Actions

- [ ] **6.3** Cấu hình Router
  - Routes: `/`, `/member/dashboard`

---

## 📊 Tổng kết Progress

### Module Status

| Module | Use Cases | Status | Progress |
|---|---|---|---|
| Module 1: Authentication | UC01, UC02, UC03 | ✅ Completed | 100% |
| Module 2: Quản lý Hồ sơ | UC04 | ⏳ In Progress | 0% |
| Module 3: Lịch sử Giao dịch | UC05 | ⏳ Pending | 0% |
| Module 4: Quản lý Bài đăng | UC06, UC07, UC08, UC09, UC10, UC13 | ⏳ Pending | 0% |
| Module 5: Tìm kiếm và Xem Bài đăng | UC14, UC15, UC16, UC17, UC20 | ⏳ Pending | 0% |
| Module 6: Yêu thích | UC18, UC19, UC22 | ⏳ Pending | 0% |
| Module 7: Đấu giá | UC21 | ✅ Completed | 90% |
| Module 8: Đặt lịch xem / Môi giới | UC23 | ⏳ Pending | 0% |
| Module 9: Gói tin và Credits | UC25, UC26, UC27 | ⏳ Pending | 0% |
| Module 10: Thanh toán và Hợp đồng | UC28, UC29, UC30 | ✅ Completed | 100% |
| Module 11: Đánh giá và Phản hồi | UC31, UC32, UC33, UC34 | ⏳ Pending | 0% |
| Module 12: Chat và Thông báo | UC35, UC36, UC37, UC38 | ⏳ Pending | 0% |
| Module 13: Home Page và Dashboard | - | ⏳ Pending | 0% |

### Overall Progress: ~23.1% (3/13 modules completed)

---

## 🚀 Next Steps

1. **Priority High**: Module 4 (Quản lý Bài đăng), Module 5 (Tìm kiếm), Module 2 (Quản lý Hồ sơ)
2. **Priority Medium**: Module 8 (Đặt lịch xem), Module 9 (Gói tin), Module 10 (Thanh toán)
3. **Priority Low**: Module 6 (Yêu thích), Module 7 (Đấu giá), Module 11 (Đánh giá), Module 12 (Chat)

---

## 📚 Resources

- [UI Development Guide - Auth](../UI_DEVELOPMENT_GUIDE_AUTH.md)
- [Admin UI Track List](../ADMIN_UI_TRACK_LIST.md)
- [Staff UI Track List](../STAFF_UI_TRACK_LIST.md)
- [Project Structure](../STRUCTURE.md)

---

**Tác giả**: EVehicle Development Team  
**Ngày tạo**: November 9, 2025  
**Version**: 1.0.0

