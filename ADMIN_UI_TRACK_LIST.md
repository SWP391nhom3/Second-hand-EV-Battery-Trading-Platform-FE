# Track List: Xây dựng UI cho Admin Module

> **Tài liệu này liệt kê các task cần thực hiện để implement UI cho Admin Module theo chuẩn 6 bước**

---

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Module 1: Quản lý Bài đăng (UC11, UC12)](#module-1-quản-lý-bài-đăng-uc11-uc12)
3. [Module 2: Quản lý Lead - Gán Staff (UC46)](#module-2-quản-lý-lead---gán-staff-uc46)
4. [Module 3: Quản lý Người dùng (UC47)](#module-3-quản-lý-người-dùng-uc47)
5. [Module 4: Quản lý Gói tin (UC48)](#module-4-quản-lý-gói-tin-uc48)
6. [Module 5: Quản lý Mẫu Hợp đồng (UC49)](#module-5-quản-lý-mẫu-hợp-đồng-uc49)
7. [Module 6: Báo cáo Doanh thu (UC50)](#module-6-báo-cáo-doanh-thu-uc50)
8. [Module 7: Dashboard Admin](#module-7-dashboard-admin)

---

## Tổng quan

### Danh sách Use Case của Admin

| UC | Tên Use Case | Trạng thái Backend | Ưu tiên |
|---|---|---|---|
| UC11 | Duyệt Bài đăng và Gán Staff | ✅ OK | 🔴 High |
| UC12 | Từ chối Bài đăng | ✅ OK | 🔴 High |
| UC46 | Gán Staff cho Lead | ⚠️ Cần kiểm tra | 🔴 High |
| UC47 | Quản lý Người dùng | ✅ OK | 🟡 Medium |
| UC48 | Quản lý Gói tin | ✅ OK | 🟡 Medium |
| UC49 | Quản lý Mẫu Hợp đồng | ✅ OK | 🟢 Low |
| UC50 | Xem Báo cáo Doanh thu | ❌ Chưa có | 🟢 Low |

### Quy trình 6 bước cho mỗi Module

1. **Bước 1**: Phân tích DTOs và Validators
2. **Bước 2**: Xây dựng Validation cho Frontend
3. **Bước 3**: Phân tích Controller và Endpoints
4. **Bước 4**: Xây dựng API Services
5. **Bước 5**: Xây dựng Components
6. **Bước 6**: Xây dựng Pages

---

## Module 1: Quản lý Bài đăng (UC11, UC12)

### 📌 Use Cases
- **UC11**: Duyệt Bài đăng và Gán Staff
- **UC12**: Từ chối Bài đăng

### 🎯 Mục tiêu
Tạo UI để Admin duyệt/từ chối bài đăng chờ duyệt, xem chi tiết bài đăng, và quản lý danh sách bài đăng.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `PostApproveRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/PostApproveRequest.cs`
  - Xác định các field cần thiết
  - Ghi chú validation rules

- [ ] **1.2** Đọc và phân tích `PostRejectRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/PostRejectRequest.cs`
  - Xác định các field (đặc biệt là lý do từ chối)
  - Ghi chú validation rules

- [ ] **1.3** Đọc và phân tích `PendingPostResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/PendingPostResponse.cs`
  - Xác định các field hiển thị trong danh sách

- [ ] **1.4** Đọc và phân tích `PostDetailResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/PostDetailResponse.cs`
  - Xác định các field hiển thị trong chi tiết

- [ ] **1.5** Đọc và phân tích `PendingPostSearchRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/PendingPostSearchRequest.cs`
  - Xác định các filter và pagination params

- [ ] **1.6** Tạo document tổng hợp DTOs
  - File: `FE/docs/admin/DTOs_PostManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `PostApproveRequest`
  - File: `FE/src/validations/post.validation.js`
  - Sử dụng Yup hoặc Zod

- [ ] **2.2** Tạo validation schema cho `PostRejectRequest`
  - File: `FE/src/validations/post.validation.js`
  - Validate lý do từ chối (required, min length)

- [ ] **2.3** Tạo validation schema cho `PendingPostSearchRequest`
  - File: `FE/src/validations/post.validation.js`
  - Validate pagination và filter params

- [ ] **2.4** Test validation schemas

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích `AdminPostsController`
  - File: `BE/src/EVehicle.API/Controllers/AdminPostsController.cs`
  - Endpoints:
    - `GET /api/admin/posts/pending` - Lấy danh sách bài đăng chờ duyệt
    - `GET /api/admin/posts/{id}` - Lấy chi tiết bài đăng
    - `POST /api/admin/posts/{id}/approve` - Duyệt bài đăng
    - `POST /api/admin/posts/{id}/reject` - Từ chối bài đăng
    - `GET /api/admin/posts/approved-rejected` - Lấy danh sách bài đăng đã duyệt/từ chối

- [ ] **3.2** Tạo document tổng hợp Endpoints
  - File: `FE/docs/admin/Endpoints_PostManagement.md`
  - Ghi chú request/response format, error codes

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `adminPost.service.js`
  - File: `FE/src/api/services/adminPost.service.js`
  - Methods:
    - `getPendingPosts(params)` - Lấy danh sách bài đăng chờ duyệt
    - `getPostById(id)` - Lấy chi tiết bài đăng
    - `approvePost(id, data)` - Duyệt bài đăng
    - `rejectPost(id, data)` - Từ chối bài đăng
    - `getApprovedRejectedPosts(params)` - Lấy danh sách bài đăng đã duyệt/từ chối

- [ ] **4.2** Test API services với mock data

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `PostPendingList` component
  - File: `FE/src/components/admin/posts/PostPendingList.jsx`
  - Hiển thị danh sách bài đăng chờ duyệt
  - Có pagination, filter, search
  - Có nút "Xem chi tiết", "Duyệt", "Từ chối"

- [ ] **5.2** Tạo `PostDetailModal` component
  - File: `FE/src/components/admin/posts/PostDetailModal.jsx`
  - Hiển thị chi tiết bài đăng (ảnh, thông tin, thông số kỹ thuật)
  - Có nút "Duyệt", "Từ chối"

- [ ] **5.3** Tạo `PostApproveModal` component
  - File: `FE/src/components/admin/posts/PostApproveModal.jsx`
  - Modal xác nhận duyệt bài đăng
  - Có thể chọn gán Staff (nếu cần)

- [ ] **5.4** Tạo `PostRejectModal` component
  - File: `FE/src/components/admin/posts/PostRejectModal.jsx`
  - Modal nhập lý do từ chối
  - Form validation

- [ ] **5.5** Tạo `PostFilter` component
  - File: `FE/src/components/admin/posts/PostFilter.jsx`
  - Filter theo: trạng thái, loại sản phẩm, ngày đăng, etc.

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `PostManagement` page
  - File: `FE/src/pages/admin/PostManagement.jsx`
  - Tabs: "Chờ duyệt", "Đã duyệt", "Đã từ chối"
  - Sử dụng `PostPendingList` component
  - Integrate với API services

- [ ] **6.2** Tạo route cho PostManagement
  - File: `FE/src/router/index.jsx`
  - Route: `/admin/posts`
  - Protected route (chỉ Admin)

- [ ] **6.3** Update AdminSidebar
  - File: `FE/src/components/admin/AdminSidebar.jsx`
  - Thêm menu item "Quản lý tin đăng"
  - Icon: FileText

- [ ] **6.4** Test toàn bộ flow
  - Test duyệt bài đăng
  - Test từ chối bài đăng
  - Test xem chi tiết
  - Test filter và pagination

---

## Module 2: Quản lý Lead - Gán Staff (UC46)

### 📌 Use Case
- **UC46**: Gán Staff cho Lead

### 🎯 Mục tiêu
Tạo UI để Admin xem danh sách Lead mới và gán Staff cho Lead.

### ⚠️ Lưu ý
- Endpoint gán Staff cho Lead có thể chưa có sẵn ở backend
- Cần kiểm tra và có thể cần tạo endpoint mới
- Hiện tại hệ thống tự động gán Staff khi tạo Lead

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `LeadResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Leads/LeadResponse.cs`
  - Xác định các field hiển thị

- [ ] **1.2** Đọc và phân tích `LeadSearchRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Leads/LeadSearchRequest.cs`
  - Xác định các filter params

- [ ] **1.3** Kiểm tra xem có DTO `LeadAssignStaffRequest` không
  - Nếu chưa có, cần tạo ở backend trước
  - DTO này cần có: `staffId`, `leadId`

- [ ] **1.4** Tạo document tổng hợp DTOs
  - File: `FE/docs/admin/DTOs_LeadManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `LeadAssignStaffRequest`
  - File: `FE/src/validations/lead.validation.js`
  - Validate staffId (required, UUID)

- [ ] **2.2** Tạo validation schema cho `LeadSearchRequest`
  - File: `FE/src/validations/lead.validation.js`

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Kiểm tra `LeadsController` hiện tại
  - File: `BE/src/EVehicle.API/Controllers/LeadsController.cs`
  - Xác định các endpoint có sẵn

- [ ] **3.2** Kiểm tra xem có endpoint gán Staff cho Lead không
  - Nếu chưa có, cần tạo endpoint mới:
    - `PUT /api/admin/leads/{id}/assign-staff`
    - Hoặc `POST /api/admin/leads/{id}/assign-staff`

- [ ] **3.3** Kiểm tra endpoint lấy danh sách Lead cho Admin
  - Cần endpoint: `GET /api/admin/leads` (lấy tất cả Lead, filter theo status NEW)
  - Hoặc sử dụng endpoint hiện có và filter ở frontend

- [ ] **3.4** Tạo document tổng hợp Endpoints
  - File: `FE/docs/admin/Endpoints_LeadManagement.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `adminLead.service.js`
  - File: `FE/src/api/services/adminLead.service.js`
  - Methods:
    - `getLeads(params)` - Lấy danh sách Lead (filter status NEW)
    - `getLeadById(id)` - Lấy chi tiết Lead
    - `assignStaffToLead(leadId, staffId)` - Gán Staff cho Lead

- [ ] **4.2** Tạo `staff.service.js` (nếu chưa có)
  - File: `FE/src/api/services/staff.service.js`
  - Method: `getStaffList()` - Lấy danh sách Staff để chọn

- [ ] **4.3** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `LeadList` component
  - File: `FE/src/components/admin/leads/LeadList.jsx`
  - Hiển thị danh sách Lead (filter status NEW)
  - Có pagination, filter
  - Có nút "Gán Staff"

- [ ] **5.2** Tạo `LeadDetailModal` component
  - File: `FE/src/components/admin/leads/LeadDetailModal.jsx`
  - Hiển thị chi tiết Lead (thông tin Buyer, Post, Status)

- [ ] **5.3** Tạo `AssignStaffModal` component
  - File: `FE/src/components/admin/leads/AssignStaffModal.jsx`
  - Modal chọn Staff để gán
  - Dropdown chọn Staff
  - Form validation

- [ ] **5.4** Tạo `LeadFilter` component
  - File: `FE/src/components/admin/leads/LeadFilter.jsx`
  - Filter theo: status, lead type, ngày tạo

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `LeadManagement` page
  - File: `FE/src/pages/admin/LeadManagement.jsx`
  - Tabs: "Lead mới", "Đã gán Staff", "Tất cả"
  - Sử dụng `LeadList` component
  - Integrate với API services

- [ ] **6.2** Tạo route cho LeadManagement
  - File: `FE/src/router/index.jsx`
  - Route: `/admin/leads`
  - Protected route (chỉ Admin)

- [ ] **6.3** Update AdminSidebar
  - File: `FE/src/components/admin/AdminSidebar.jsx`
  - Thêm menu item "Quản lý Lead"
  - Icon: UserCheck (hoặc tương tự)

- [ ] **6.4** Test toàn bộ flow
  - Test xem danh sách Lead mới
  - Test gán Staff cho Lead
  - Test filter và pagination

---

## Module 3: Quản lý Người dùng (UC47)

### 📌 Use Case
- **UC47**: Quản lý Người dùng

### 🎯 Mục tiêu
Tạo UI để Admin quản lý người dùng: xem danh sách, xem chi tiết, vô hiệu hóa/kích hoạt tài khoản, thay đổi role.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `UserResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Users/UserResponse.cs`

- [ ] **1.2** Đọc và phân tích `UserSearchRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Users/UserSearchRequest.cs`

- [ ] **1.3** Đọc và phân tích `UserUpdateRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Users/UserUpdateRequest.cs`
  - Xác định các field có thể cập nhật (role, status)

- [ ] **1.4** Tạo document tổng hợp DTOs
  - File: `FE/docs/admin/DTOs_UserManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `UserUpdateRequest`
  - File: `FE/src/validations/user.validation.js`
  - Validate role (MEMBER, STAFF, ADMIN)
  - Validate status (ACTIVE, INACTIVE)

- [ ] **2.2** Tạo validation schema cho `UserSearchRequest`
  - File: `FE/src/validations/user.validation.js`

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích `UsersController`
  - File: `BE/src/EVehicle.API/Controllers/UsersController.cs`
  - Endpoints:
    - `GET /api/users` - Lấy danh sách người dùng (Admin only)
    - `GET /api/users/{id}` - Lấy chi tiết người dùng
    - `PUT /api/users/{id}` - Cập nhật người dùng (Admin only)
    - `PATCH /api/users/{id}/toggle-status` - Vô hiệu hóa/kích hoạt (nếu có)

- [ ] **3.2** Tạo document tổng hợp Endpoints
  - File: `FE/docs/admin/Endpoints_UserManagement.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `adminUser.service.js`
  - File: `FE/src/api/services/adminUser.service.js`
  - Methods:
    - `getUsers(params)` - Lấy danh sách người dùng
    - `getUserById(id)` - Lấy chi tiết người dùng
    - `updateUser(id, data)` - Cập nhật người dùng
    - `toggleUserStatus(id)` - Vô hiệu hóa/kích hoạt

- [ ] **4.2** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `UserList` component
  - File: `FE/src/components/admin/users/UserList.jsx`
  - Hiển thị danh sách người dùng
  - Có pagination, filter, search
  - Có nút "Xem chi tiết", "Chỉnh sửa", "Vô hiệu hóa/Kích hoạt"

- [ ] **5.2** Tạo `UserDetailModal` component
  - File: `FE/src/components/admin/users/UserDetailModal.jsx`
  - Hiển thị chi tiết người dùng
  - Hiển thị lịch sử hoạt động (nếu có)

- [ ] **5.3** Tạo `UserEditModal` component
  - File: `FE/src/components/admin/users/UserEditModal.jsx`
  - Modal chỉnh sửa người dùng
  - Form: role, status
  - Form validation

- [ ] **5.4** Tạo `UserFilter` component
  - File: `FE/src/components/admin/users/UserFilter.jsx`
  - Filter theo: role, status, ngày đăng ký, email, phone

- [ ] **5.5** Tạo `UserStatusBadge` component
  - File: `FE/src/components/admin/users/UserStatusBadge.jsx`
  - Hiển thị badge trạng thái (ACTIVE, INACTIVE)

- [ ] **5.6** Tạo `UserRoleBadge` component
  - File: `FE/src/components/admin/users/UserRoleBadge.jsx`
  - Hiển thị badge role (MEMBER, STAFF, ADMIN)

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `UserManagement` page
  - File: `FE/src/pages/admin/UserManagement.jsx`
  - Sử dụng `UserList` component
  - Integrate với API services

- [ ] **6.2** Tạo route cho UserManagement
  - File: `FE/src/router/index.jsx`
  - Route: `/admin/users`
  - Protected route (chỉ Admin)

- [ ] **6.3** Update AdminSidebar
  - File: `FE/src/components/admin/AdminSidebar.jsx`
  - Menu item "Quản lý người dùng" đã có sẵn
  - Kiểm tra route đúng chưa

- [ ] **6.4** Test toàn bộ flow
  - Test xem danh sách người dùng
  - Test xem chi tiết
  - Test cập nhật role
  - Test vô hiệu hóa/kích hoạt
  - Test filter và pagination

---

## Module 4: Quản lý Gói tin (UC48)

### 📌 Use Case
- **UC48**: Quản lý Gói tin

### 🎯 Mục tiêu
Tạo UI để Admin quản lý gói tin: xem danh sách, tạo mới, chỉnh sửa, xóa, kích hoạt/vô hiệu hóa.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `PackageDetailResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Packages/PackageDetailResponse.cs`

- [ ] **1.2** Đọc và phân tích `PackageCreateRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Packages/PackageCreateRequest.cs`

- [ ] **1.3** Đọc và phân tích `PackageUpdateRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Packages/PackageUpdateRequest.cs`

- [ ] **1.4** Đọc và phân tích `PackageSearchRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Packages/PackageSearchRequest.cs`

- [ ] **1.5** Tạo document tổng hợp DTOs
  - File: `FE/docs/admin/DTOs_PackageManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `PackageCreateRequest`
  - File: `FE/src/validations/package.validation.js`
  - Validate: name, price, credits, maxImages, priority, isActive

- [ ] **2.2** Tạo validation schema cho `PackageUpdateRequest`
  - File: `FE/src/validations/package.validation.js`

- [ ] **2.3** Tạo validation schema cho `PackageSearchRequest`
  - File: `FE/src/validations/package.validation.js`

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Đọc và phân tích `PackagesController`
  - File: `BE/src/EVehicle.API/Controllers/PackagesController.cs`
  - Endpoints (Admin):
    - `GET /api/packages/admin` - Lấy danh sách gói tin
    - `GET /api/packages/admin/{id}` - Lấy chi tiết gói tin
    - `POST /api/packages/admin` - Tạo gói tin mới
    - `PUT /api/packages/admin/{id}` - Cập nhật gói tin
    - `PATCH /api/packages/admin/{id}/toggle-status` - Kích hoạt/vô hiệu hóa

- [ ] **3.2** Tạo document tổng hợp Endpoints
  - File: `FE/docs/admin/Endpoints_PackageManagement.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `adminPackage.service.js`
  - File: `FE/src/api/services/adminPackage.service.js`
  - Methods:
    - `getPackages(params)` - Lấy danh sách gói tin
    - `getPackageById(id)` - Lấy chi tiết gói tin
    - `createPackage(data)` - Tạo gói tin mới
    - `updatePackage(id, data)` - Cập nhật gói tin
    - `togglePackageStatus(id)` - Kích hoạt/vô hiệu hóa

- [ ] **4.2** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `PackageList` component
  - File: `FE/src/components/admin/packages/PackageList.jsx`
  - Hiển thị danh sách gói tin
  - Có pagination, filter
  - Có nút "Tạo mới", "Chỉnh sửa", "Xóa", "Kích hoạt/Vô hiệu hóa"

- [ ] **5.2** Tạo `PackageForm` component
  - File: `FE/src/components/admin/packages/PackageForm.jsx`
  - Form tạo/chỉnh sửa gói tin
  - Fields: name, price, credits, maxImages, priority, isActive
  - Form validation

- [ ] **5.3** Tạo `PackageDetailModal` component
  - File: `FE/src/components/admin/packages/PackageDetailModal.jsx`
  - Hiển thị chi tiết gói tin

- [ ] **5.4** Tạo `PackageStatusBadge` component
  - File: `FE/src/components/admin/packages/PackageStatusBadge.jsx`
  - Hiển thị badge trạng thái (ACTIVE, INACTIVE)

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `PackageManagement` page
  - File: `FE/src/pages/admin/PackageManagement.jsx`
  - Sử dụng `PackageList` component
  - Integrate với API services

- [ ] **6.2** Tạo route cho PackageManagement
  - File: `FE/src/router/index.jsx`
  - Route: `/admin/packages`
  - Protected route (chỉ Admin)

- [ ] **6.3** Update AdminSidebar
  - File: `FE/src/components/admin/AdminSidebar.jsx`
  - Thêm menu item "Quản lý gói tin"
  - Icon: Package (hoặc tương tự)

- [ ] **6.4** Test toàn bộ flow
  - Test xem danh sách gói tin
  - Test tạo gói tin mới
  - Test chỉnh sửa gói tin
  - Test xóa gói tin
  - Test kích hoạt/vô hiệu hóa
  - Test filter và pagination

---

## Module 5: Quản lý Mẫu Hợp đồng (UC49)

### 📌 Use Case
- **UC49**: Quản lý Mẫu Hợp đồng

### 🎯 Mục tiêu
Tạo UI để Admin quản lý mẫu hợp đồng: xem danh sách, tạo mới, chỉnh sửa, xóa, gán mẫu cho danh mục.

### ⚠️ Lưu ý
- Endpoint quản lý mẫu hợp đồng có thể chưa đầy đủ
- Cần kiểm tra và có thể cần tạo endpoint mới

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [x] **1.1** Đọc và phân tích `ContractTemplateResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Contracts/ContractTemplateResponse.cs`
  - ✅ Đã phân tích: templateId, templateName, templateContent, categoryId, categoryName, isActive, createdAt

- [x] **1.2** Kiểm tra xem có DTO `ContractTemplateCreateRequest` không
  - ⚠️ **Chưa có** - Cần tạo ở backend trước
  - Frontend đã tạo validation schema sẵn

- [x] **1.3** Kiểm tra xem có DTO `ContractTemplateUpdateRequest` không
  - ⚠️ **Chưa có** - Cần tạo ở backend trước
  - Frontend đã tạo validation schema sẵn

- [x] **1.4** Tạo document tổng hợp DTOs
  - File: `FE/docs/admin/DTOs_ContractTemplateManagement.md`
  - ✅ Đã tạo document

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [x] **2.1** Tạo validation schema cho `ContractTemplateCreateRequest`
  - File: `FE/src/lib/validations/contract.validation.js`
  - ✅ Đã tạo: validate templateName, templateContent, categoryId, isActive

- [x] **2.2** Tạo validation schema cho `ContractTemplateUpdateRequest`
  - File: `FE/src/lib/validations/contract.validation.js`
  - ✅ Đã tạo (dùng chung schema với CreateRequest)

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [x] **3.1** Đọc và phân tích `ContractsController`
  - File: `BE/src/EVehicle.API/Controllers/ContractsController.cs`
  - Endpoint hiện có:
    - `GET /api/contracts/templates` - Lấy danh sách mẫu hợp đồng (STAFF, ADMIN)
  - ✅ Đã phân tích

- [x] **3.2** Kiểm tra xem có endpoint quản lý mẫu hợp đồng không
  - ⚠️ **Chưa có đầy đủ** - Cần các endpoint:
    - `GET /api/admin/contracts/templates` - Lấy danh sách (Admin) - ⚠️ Chưa có (fallback về endpoint hiện có)
    - `GET /api/admin/contracts/templates/{id}` - Lấy chi tiết - ⚠️ Chưa có (fallback về list)
    - `POST /api/admin/contracts/templates` - Tạo mới - ❌ Chưa có
    - `PUT /api/admin/contracts/templates/{id}` - Cập nhật - ❌ Chưa có
    - `DELETE /api/admin/contracts/templates/{id}` - Xóa - ❌ Chưa có
    - `PATCH /api/admin/contracts/templates/{id}/toggle-status` - Toggle status - ❌ Chưa có

- [x] **3.3** Tạo document tổng hợp Endpoints
  - File: `FE/docs/admin/Endpoints_ContractTemplateManagement.md`
  - ✅ Đã tạo document với chi tiết các endpoint cần thiết

#### ✅ Bước 4: Xây dựng API Services

- [x] **4.1** Tạo `adminContractTemplate.service.js`
  - File: `FE/src/api/services/adminContractTemplate.service.js`
  - Methods:
    - ✅ `getContractTemplates(params)` - Lấy danh sách mẫu hợp đồng (có fallback)
    - ✅ `getContractTemplateById(id)` - Lấy chi tiết mẫu hợp đồng (có fallback)
    - ✅ `createContractTemplate(data)` - Tạo mẫu hợp đồng mới
    - ✅ `updateContractTemplate(id, data)` - Cập nhật mẫu hợp đồng
    - ✅ `deleteContractTemplate(id)` - Xóa mẫu hợp đồng
    - ✅ `toggleContractTemplateStatus(id)` - Toggle status

- [ ] **4.2** Test API services
  - ⚠️ Cần test khi backend endpoints sẵn sàng

#### ✅ Bước 5: Xây dựng Components

- [x] **5.1** Tạo `ContractTemplateList` component
  - File: `FE/src/components/admin/contracts/ContractTemplateList.jsx`
  - ✅ Hiển thị danh sách mẫu hợp đồng
  - ✅ Có pagination, filter
  - ✅ Có nút "Chi tiết", "Chỉnh sửa", "Xóa", "Toggle status"

- [x] **5.2** Tạo `ContractTemplateForm` component
  - File: `FE/src/components/admin/contracts/ContractTemplateForm.jsx`
  - ✅ Form tạo/chỉnh sửa mẫu hợp đồng
  - ✅ Fields: templateName, templateContent (textarea), categoryId, isActive
  - ✅ Form validation

- [x] **5.3** Tạo `ContractTemplateDetailModal` component
  - File: `FE/src/components/admin/contracts/ContractTemplateDetailModal.jsx`
  - ✅ Hiển thị chi tiết mẫu hợp đồng
  - ✅ Hiển thị preview nội dung hợp đồng

- [x] **5.4** Tạo `ContractTemplateFilter` component
  - File: `FE/src/components/admin/contracts/ContractTemplateFilter.jsx`
  - ✅ Filter theo keyword, categoryId, isActive
  - ✅ Có debounce cho search

- [x] **5.5** Tạo `ContractTemplateStatusBadge` component
  - File: `FE/src/components/admin/contracts/ContractTemplateStatusBadge.jsx`
  - ✅ Hiển thị badge trạng thái

- [x] **5.6** Tạo `ContractTemplateListSkeleton` component
  - File: `FE/src/components/admin/contracts/ContractTemplateListSkeleton.jsx`
  - ✅ Skeleton loader cho danh sách

- [ ] **5.7** Tạo `ContractTemplateEditor` component (Optional - Rich text editor)
  - ⚠️ **Tạm thời dùng Textarea** - Có thể nâng cấp sau nếu cần
  - Rich text editor cho nội dung hợp đồng
  - Hỗ trợ placeholders ({{buyerName}}, {{sellerName}}, etc.)

#### ✅ Bước 6: Xây dựng Pages

- [x] **6.1** Tạo `ContractTemplateManagement` page
  - File: `FE/src/pages/admin/ContractTemplateManagement.jsx`
  - ✅ Sử dụng `ContractTemplateList` component
  - ✅ Integrate với API services
  - ✅ Có optimistic updates
  - ✅ Có delete confirmation dialog

- [x] **6.2** Tạo route cho ContractTemplateManagement
  - File: `FE/src/router/index.jsx`
  - ✅ Route: `/admin/contract-templates`
  - ✅ Protected route (chỉ Admin)

- [x] **6.3** Update AdminSidebar
  - File: `FE/src/components/admin/AdminSidebar.jsx`
  - ✅ Thêm menu item "Quản lý mẫu hợp đồng"
  - ✅ Icon: FileText

- [ ] **6.4** Test toàn bộ flow
  - ⚠️ Cần test khi backend endpoints sẵn sàng
  - Test xem danh sách mẫu hợp đồng
  - Test tạo mẫu hợp đồng mới
  - Test chỉnh sửa mẫu hợp đồng
  - Test xóa mẫu hợp đồng
  - Test filter và pagination

---

## Module 6: Báo cáo Doanh thu (UC50)

### 📌 Use Case
- **UC50**: Xem Báo cáo Doanh thu

### 🎯 Mục tiêu
Tạo UI để Admin xem báo cáo doanh thu từ gói tin và giao dịch, xuất báo cáo (PDF/Excel).

### ⚠️ Lưu ý
- Endpoint báo cáo doanh thu chưa có sẵn ở backend
- Cần tạo endpoint mới ở backend trước

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Tạo DTO `RevenueReportRequest` (Backend)
  - Fields: startDate, endDate, reportType (PACKAGE, TRANSACTION, ALL)

- [ ] **1.2** Tạo DTO `RevenueReportResponse` (Backend)
  - Fields: totalRevenue, packageRevenue, transactionRevenue, stats, charts data

- [ ] **1.3** Tạo document tổng hợp DTOs
  - File: `FE/docs/admin/DTOs_RevenueReport.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `RevenueReportRequest`
  - File: `FE/src/validations/report.validation.js`
  - Validate: startDate, endDate, reportType

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Tạo `ReportsController` (Backend)
  - File: `BE/src/EVehicle.API/Controllers/ReportsController.cs`
  - Endpoints:
    - `GET /api/admin/reports/revenue` - Lấy báo cáo doanh thu
    - `GET /api/admin/reports/revenue/export` - Xuất báo cáo (PDF/Excel)

- [ ] **3.2** Tạo document tổng hợp Endpoints
  - File: `FE/docs/admin/Endpoints_RevenueReport.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `adminReport.service.js`
  - File: `FE/src/api/services/adminReport.service.js`
  - Methods:
    - `getRevenueReport(params)` - Lấy báo cáo doanh thu
    - `exportRevenueReport(params, format)` - Xuất báo cáo

- [ ] **4.2** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `RevenueReportFilters` component
  - File: `FE/src/components/admin/reports/RevenueReportFilters.jsx`
  - Filter: startDate, endDate, reportType

- [ ] **5.2** Tạo `RevenueStatsCards` component
  - File: `FE/src/components/admin/reports/RevenueStatsCards.jsx`
  - Hiển thị các thẻ thống kê: Tổng doanh thu, Doanh thu gói tin, Doanh thu giao dịch

- [ ] **5.3** Tạo `RevenueChart` component
  - File: `FE/src/components/admin/reports/RevenueChart.jsx`
  - Chart hiển thị doanh thu theo thời gian (sử dụng Chart.js hoặc Recharts)

- [ ] **5.4** Tạo `RevenueTable` component
  - File: `FE/src/components/admin/reports/RevenueTable.jsx`
  - Bảng chi tiết doanh thu

- [ ] **5.5** Tạo `ExportReportButton` component
  - File: `FE/src/components/admin/reports/ExportReportButton.jsx`
  - Nút xuất báo cáo (PDF/Excel)

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `RevenueReport` page
  - File: `FE/src/pages/admin/RevenueReport.jsx`
  - Sử dụng các components trên
  - Integrate với API services

- [ ] **6.2** Tạo route cho RevenueReport
  - File: `FE/src/router/index.jsx`
  - Route: `/admin/reports/revenue`
  - Protected route (chỉ Admin)

- [ ] **6.3** Update AdminSidebar
  - File: `FE/src/components/admin/AdminSidebar.jsx`
  - Thêm menu item "Báo cáo doanh thu"
  - Icon: BarChart3 (hoặc tương tự)

- [ ] **6.4** Test toàn bộ flow
  - Test xem báo cáo doanh thu
  - Test filter theo thời gian
  - Test xuất báo cáo PDF
  - Test xuất báo cáo Excel

---

## Module 7: Dashboard Admin

### 🎯 Mục tiêu
Tạo Dashboard tổng quan cho Admin với các thống kê và biểu đồ.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Kiểm tra xem có DTO `AdminDashboardResponse` không
  - Nếu chưa có, cần tạo ở backend
  - Fields: totalUsers, totalPosts, pendingPosts, totalLeads, revenue, etc.

- [ ] **1.2** Tạo document tổng hợp DTOs
  - File: `FE/docs/admin/DTOs_Dashboard.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Không cần validation (chỉ đọc dữ liệu)

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Tạo endpoint `GET /api/admin/dashboard` (Backend)
  - Trả về thống kê tổng quan

- [ ] **3.2** Tạo document tổng hợp Endpoints
  - File: `FE/docs/admin/Endpoints_Dashboard.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `adminDashboard.service.js`
  - File: `FE/src/api/services/adminDashboard.service.js`
  - Method: `getDashboardData()` - Lấy dữ liệu dashboard

- [ ] **4.2** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `StatsCard` component
  - File: `FE/src/components/admin/dashboard/StatsCard.jsx`
  - Component hiển thị thẻ thống kê (icon, title, value, change)

- [ ] **5.2** Tạo `PendingPostsWidget` component
  - File: `FE/src/components/admin/dashboard/PendingPostsWidget.jsx`
  - Widget hiển thị bài đăng chờ duyệt

- [ ] **5.3** Tạo `RecentLeadsWidget` component
  - File: `FE/src/components/admin/dashboard/RecentLeadsWidget.jsx`
  - Widget hiển thị Lead mới nhất

- [ ] **5.4** Tạo `RevenueChartWidget` component
  - File: `FE/src/components/admin/dashboard/RevenueChartWidget.jsx`
  - Widget hiển thị biểu đồ doanh thu

- [ ] **5.5** Tạo `ActivityTimeline` component
  - File: `FE/src/components/admin/dashboard/ActivityTimeline.jsx`
  - Timeline hiển thị hoạt động gần đây

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Update `Dashboard` page
  - File: `FE/src/pages/admin/Dashboard.jsx`
  - Sử dụng các components trên
  - Integrate với API services
  - Layout grid responsive

- [ ] **6.2** Test toàn bộ flow
  - Test hiển thị dashboard
  - Test các widget
  - Test responsive

---

## 📊 Tổng kết Progress

### Module Status

| Module | Use Case | Backend Status | Frontend Status | Priority |
|---|---|---|---|---|
| Module 1 | UC11, UC12 | ✅ OK | ⏳ Pending | 🔴 High |
| Module 2 | UC46 | ⚠️ Cần kiểm tra | ⏳ Pending | 🔴 High |
| Module 3 | UC47 | ✅ OK | ⏳ Pending | 🟡 Medium |
| Module 4 | UC48 | ✅ OK | ⏳ Pending | 🟡 Medium |
| Module 5 | UC49 | ⚠️ Cần kiểm tra | ✅ Đã hoàn thành (UI) | 🟢 Low |
| Module 6 | UC50 | ❌ Chưa có | ⏳ Pending | 🟢 Low |
| Module 7 | Dashboard | ⚠️ Cần kiểm tra | ⏳ Pending | 🟡 Medium |

### Next Steps

1. **Bắt đầu với Module 1** (Quản lý Bài đăng) - Priority High
2. **Kiểm tra và tạo endpoint cho Module 2** (Gán Staff cho Lead) nếu chưa có
3. **Tiếp tục với Module 3, 4** (Quản lý Người dùng, Gói tin)
4. **Sau đó Module 7** (Dashboard)
5. **Cuối cùng Module 5, 6** (Mẫu Hợp đồng, Báo cáo Doanh thu)

---

## 📝 Notes

- Mỗi module nên được implement theo đúng 6 bước
- Test kỹ từng bước trước khi chuyển sang bước tiếp theo
- Document các DTOs và Endpoints để dễ maintain
- Sử dụng TypeScript nếu có thể để type-safe
- Follow coding conventions và best practices của project

---

**Last Updated**: 2024-12-19
**Version**: 1.0.0

