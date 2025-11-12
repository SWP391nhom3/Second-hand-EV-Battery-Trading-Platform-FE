# Track List: Xây dựng UI cho Staff Module

> **Tài liệu này liệt kê các task cần thực hiện để implement UI cho Staff Module theo chuẩn 6 bước**

---

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Module 1: Dashboard Staff (UC39)](#module-1-dashboard-staff-uc39)
3. [Module 2: Quản lý Lead (UC40, UC44)](#module-2-quản-lý-lead-uc40-uc44)
4. [Module 3: Quản lý Lịch hẹn (UC41, UC42)](#module-3-quản-lý-lịch-hẹn-uc41-uc42)
5. [Module 4: Quản lý Bài đăng (UC45)](#module-4-quản-lý-bài-đăng-uc45)
6. [Module 5: Soạn thảo Hợp đồng (UC43)](#module-5-soạn-thảo-hợp-đồng-uc43)
7. [Module 6: Chat (UC35, UC36)](#module-6-chat-uc35-uc36)
8. [Module 7: Thông báo (UC37, UC38)](#module-7-thông-báo-uc37-uc38)

---

## Tổng quan

### Danh sách Use Case của Staff

| UC | Tên Use Case | Trạng thái Backend | Ưu tiên |
|---|---|---|---|
| UC39 | Xem Dashboard Staff | ⚠️ Cần kiểm tra | 🔴 High |
| UC40 | Xem Danh sách Lead được gán | ✅ OK | 🔴 High |
| UC41 | Tạo Lịch hẹn | ✅ OK | 🔴 High |
| UC42 | Quản lý Lịch hẹn | ✅ OK | 🔴 High |
| UC43 | Soạn thảo Hợp đồng | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC44 | Cập nhật Trạng thái Lead | ✅ OK | 🔴 High |
| UC45 | Xem Danh sách Bài đăng được gán | ⚠️ Cần kiểm tra | 🟡 Medium |
| UC35 | Gửi Tin nhắn | ❌ Chưa có | 🟡 Medium |
| UC36 | Xem Lịch sử Chat | ❌ Chưa có | 🟡 Medium |
| UC37 | Xem Danh sách Thông báo | ❌ Chưa có | 🟢 Low |
| UC38 | Đánh dấu Thông báo đã đọc | ❌ Chưa có | 🟢 Low |

### Quy trình 6 bước cho mỗi Module

1. **Bước 1**: Phân tích DTOs và Validators
2. **Bước 2**: Xây dựng Validation cho Frontend
3. **Bước 3**: Phân tích Controller và Endpoints
4. **Bước 4**: Xây dựng API Services
5. **Bước 5**: Xây dựng Components
6. **Bước 6**: Xây dựng Pages

---

## Module 1: Dashboard Staff (UC39)

### 📌 Use Case
- **UC39**: Xem Dashboard Staff

### 🎯 Mục tiêu
Tạo Dashboard để Staff xem tổng quan về các bài đăng được gán, Leads được gán, lịch hẹn sắp tới và thông báo.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Kiểm tra xem có DTO `StaffDashboardResponse` không
  - Nếu chưa có, cần tạo ở backend trước
  - DTO này cần có:
    - `assignedPosts`: Danh sách bài đăng được gán
    - `assignedLeads`: Danh sách Leads được gán
    - `upcomingAppointments`: Danh sách lịch hẹn sắp tới
    - `newLeadNotifications`: Số lượng thông báo Lead mới
    - `statistics`: Thống kê (tổng số Lead, Lead thành công, Lead thất bại)

- [ ] **1.2** Kiểm tra các DTO liên quan
  - `PostResponse` - Thông tin bài đăng
  - `LeadResponse` - Thông tin Lead
  - `AppointmentResponse` - Thông tin lịch hẹn

- [ ] **1.3** Tạo document tổng hợp DTOs
  - File: `FE/docs/staff/DTOs_StaffDashboard.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Kiểm tra xem có cần validation schema cho dashboard không
  - Dashboard chủ yếu là GET requests, không cần validation phức tạp

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Kiểm tra xem có endpoint Dashboard cho Staff không
  - Cần endpoint: `GET /api/staff/dashboard`
  - Hoặc có thể tách thành nhiều endpoint:
    - `GET /api/staff/posts/assigned` - Lấy bài đăng được gán
    - `GET /api/staff/leads/assigned` - Lấy Leads được gán
    - `GET /api/staff/appointments/upcoming` - Lấy lịch hẹn sắp tới

- [ ] **3.2** Kiểm tra xem có endpoint thống kê không
  - Cần endpoint: `GET /api/staff/statistics`
  - Trả về: tổng số Lead, Lead thành công, Lead thất bại, số bài đăng được gán

- [ ] **3.3** Tạo document tổng hợp Endpoints
  - File: `FE/docs/staff/Endpoints_StaffDashboard.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `staff.service.js`
  - File: `FE/src/api/services/staff.service.js`
  - Methods:
    - `getDashboard()` - Lấy dữ liệu dashboard
    - `getStatistics()` - Lấy thống kê
    - `getAssignedPosts(params)` - Lấy danh sách bài đăng được gán
    - `getAssignedLeads(params)` - Lấy danh sách Leads được gán
    - `getUpcomingAppointments(params)` - Lấy lịch hẹn sắp tới

- [ ] **4.2** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `StaffDashboardStats` component
  - File: `FE/src/components/staff/dashboard/StaffDashboardStats.jsx`
  - Hiển thị thống kê: Tổng số Lead, Lead thành công, Lead thất bại
  - Sử dụng Card components

- [ ] **5.2** Tạo `AssignedPostsList` component
  - File: `FE/src/components/staff/dashboard/AssignedPostsList.jsx`
  - Hiển thị danh sách bài đăng được gán (tối đa 5-10 items)
  - Có link đến trang quản lý bài đăng

- [ ] **5.3** Tạo `AssignedLeadsList` component
  - File: `FE/src/components/staff/dashboard/AssignedLeadsList.jsx`
  - Hiển thị danh sách Leads được gán (tối đa 5-10 items)
  - Hiển thị trạng thái Lead
  - Có link đến trang quản lý Lead

- [ ] **5.4** Tạo `UpcomingAppointmentsList` component
  - File: `FE/src/components/staff/dashboard/UpcomingAppointmentsList.jsx`
  - Hiển thị lịch hẹn sắp tới (tối đa 5-10 items)
  - Hiển thị: Thời gian, Địa điểm, Buyer, Seller
  - Có link đến trang quản lý lịch hẹn

- [ ] **5.5** Tạo `NewLeadNotifications` component
  - File: `FE/src/components/staff/dashboard/NewLeadNotifications.jsx`
  - Hiển thị số lượng thông báo Lead mới
  - Có badge số lượng
  - Click vào để xem danh sách Lead mới

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `StaffDashboard` page
  - File: `FE/src/pages/staff/StaffDashboard.jsx`
  - Layout: Grid layout với các sections
  - Sections:
    - Stats cards (tổng số Lead, thành công, thất bại)
    - Assigned Posts list
    - Assigned Leads list
    - Upcoming Appointments list
    - New Lead Notifications

- [ ] **6.2** Tạo route cho StaffDashboard
  - File: `FE/src/router/index.jsx`
  - Route: `/staff/dashboard` hoặc `/staff`
  - Protected route (chỉ Staff)

- [ ] **6.3** Tạo StaffLayout (nếu chưa có)
  - File: `FE/src/layouts/StaffLayout.jsx`
  - Sidebar với menu: Dashboard, Leads, Appointments, Posts, Contracts
  - Header với thông báo và profile

- [ ] **6.4** Tạo StaffSidebar component
  - File: `FE/src/components/staff/StaffSidebar.jsx`
  - Menu items:
    - Dashboard
    - Quản lý Lead
    - Quản lý Lịch hẹn
    - Quản lý Bài đăng
    - Hợp đồng
    - Chat
    - Thông báo

- [ ] **6.5** Test toàn bộ flow
  - Test load dashboard
  - Test hiển thị thống kê
  - Test navigation đến các trang khác

---

## Module 2: Quản lý Lead (UC40, UC44)

### 📌 Use Cases
- **UC40**: Xem Danh sách Lead được gán
- **UC44**: Cập nhật Trạng thái Lead

### 🎯 Mục tiêu
Tạo UI để Staff xem danh sách Leads được gán, xem chi tiết Lead, và cập nhật trạng thái Lead.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `LeadResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Leads/LeadResponse.cs`
  - Xác định các field hiển thị trong danh sách và chi tiết

- [ ] **1.2** Đọc và phân tích `LeadSearchRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Leads/LeadSearchRequest.cs`
  - Xác định các filter params (status, leadType, dateRange)

- [ ] **1.3** Đọc và phân tích `LeadStatusUpdateRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Leads/LeadStatusUpdateRequest.cs`
  - Xác định các field: status, notes
  - Status values: CONTACTED, SCHEDULED, SUCCESSFUL, FAILED

- [ ] **1.4** Tạo document tổng hợp DTOs
  - File: `FE/docs/staff/DTOs_LeadManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `LeadStatusUpdateRequest`
  - File: `FE/src/lib/validations/lead.validations.js`
  - Validate status (required, enum: CONTACTED, SCHEDULED, SUCCESSFUL, FAILED)
  - Validate notes (optional, max length)

- [ ] **2.2** Tạo validation schema cho `LeadSearchRequest`
  - File: `FE/src/lib/validations/lead.validations.js`
  - Validate pagination params
  - Validate filter params (status, leadType, dateRange)

- [ ] **2.3** Test validation schemas

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Kiểm tra `LeadsController` hiện tại
  - File: `BE/src/EVehicle.API/Controllers/LeadsController.cs`
  - Xác định các endpoint có sẵn

- [ ] **3.2** Kiểm tra endpoint lấy Leads của Staff
  - Cần endpoint: `GET /api/staff/leads` (lấy Leads được gán cho Staff hiện tại)
  - Filter theo status, leadType, pagination

- [ ] **3.3** Kiểm tra endpoint lấy chi tiết Lead
  - Cần endpoint: `GET /api/staff/leads/{id}`
  - Chỉ Staff được gán mới có quyền xem

- [ ] **3.4** Kiểm tra endpoint cập nhật trạng thái Lead
  - Cần endpoint: `PUT /api/staff/leads/{id}/status`
  - Hoặc `PATCH /api/staff/leads/{id}/status`
  - Chỉ Staff được gán mới có quyền cập nhật

- [ ] **3.5** Tạo document tổng hợp Endpoints
  - File: `FE/docs/staff/Endpoints_LeadManagement.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `staffLead.service.js`
  - File: `FE/src/api/services/staffLead.service.js`
  - Methods:
    - `getLeads(params)` - Lấy danh sách Leads được gán
    - `getLeadById(id)` - Lấy chi tiết Lead
    - `updateLeadStatus(leadId, data)` - Cập nhật trạng thái Lead

- [ ] **4.2** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `LeadList` component
  - File: `FE/src/components/staff/leads/LeadList.jsx`
  - Hiển thị danh sách Leads được gán
  - Có pagination, filter, sort
  - Hiển thị: Lead ID, Post Title, Buyer Name, Status, Created At
  - Có nút "Xem chi tiết"

- [ ] **5.2** Tạo `LeadDetailModal` component
  - File: `FE/src/components/staff/leads/LeadDetailModal.jsx`
  - Hiển thị chi tiết Lead:
    - Thông tin Lead (ID, Type, Status, Created At)
    - Thông tin Buyer (Name, Email, Phone)
    - Thông tin Post (Title, Price, Images)
    - Thông tin Seller (Name, Email, Phone)
    - Notes (ghi chú của Staff)
  - Có nút "Cập nhật trạng thái"

- [ ] **5.3** Tạo `LeadStatusUpdateModal` component
  - File: `FE/src/components/staff/leads/LeadStatusUpdateModal.jsx`
  - Form cập nhật trạng thái:
    - Dropdown chọn status (CONTACTED, SCHEDULED, SUCCESSFUL, FAILED)
    - Textarea nhập notes (optional)
  - Form validation
  - Submit để cập nhật trạng thái

- [ ] **5.4** Tạo `LeadFilter` component
  - File: `FE/src/components/staff/leads/LeadFilter.jsx`
  - Filter theo:
    - Status (NEW, ASSIGNED, CONTACTED, SCHEDULED, SUCCESSFUL, FAILED)
    - Lead Type (SCHEDULE_VIEW, AUCTION_WINNER)
    - Date Range (Created At)
  - Có nút "Reset" và "Apply"

- [ ] **5.5** Tạo `LeadStatusBadge` component
  - File: `FE/src/components/staff/leads/LeadStatusBadge.jsx`
  - Hiển thị badge với màu sắc khác nhau theo status
  - NEW: gray
  - ASSIGNED: blue
  - CONTACTED: yellow
  - SCHEDULED: orange
  - SUCCESSFUL: green
  - FAILED: red

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `LeadManagement` page
  - File: `FE/src/pages/staff/LeadManagement.jsx`
  - Layout: Filter ở trên, List ở dưới
  - Sử dụng `LeadFilter` và `LeadList` components
  - Integrate với API services

- [ ] **6.2** Tạo route cho LeadManagement
  - File: `FE/src/router/index.jsx`
  - Route: `/staff/leads`
  - Protected route (chỉ Staff)

- [ ] **6.3** Update StaffSidebar
  - File: `FE/src/components/staff/StaffSidebar.jsx`
  - Thêm menu item "Quản lý Lead"
  - Icon: UserCheck (hoặc tương tự)

- [ ] **6.4** Test toàn bộ flow
  - Test xem danh sách Leads
  - Test filter Leads
  - Test xem chi tiết Lead
  - Test cập nhật trạng thái Lead

---

## Module 3: Quản lý Lịch hẹn (UC41, UC42)

### 📌 Use Cases
- **UC41**: Tạo Lịch hẹn
- **UC42**: Quản lý Lịch hẹn

### 🎯 Mục tiêu
Tạo UI để Staff tạo lịch hẹn, xem danh sách lịch hẹn, cập nhật và hủy lịch hẹn.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Đọc và phân tích `AppointmentCreateRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Appointments/AppointmentCreateRequest.cs`
  - Xác định các field: leadId, startTime, endTime, location, notes

- [ ] **1.2** Đọc và phân tích `AppointmentUpdateRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Appointments/AppointmentUpdateRequest.cs`
  - Xác định các field có thể cập nhật

- [ ] **1.3** Đọc và phân tích `AppointmentResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Appointments/AppointmentResponse.cs`
  - Xác định các field hiển thị

- [ ] **1.4** Đọc và phân tích `AppointmentSearchRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Appointments/AppointmentSearchRequest.cs`
  - Xác định các filter params

- [ ] **1.5** Đọc và phân tích `AppointmentStatusUpdateRequest` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Appointments/AppointmentStatusUpdateRequest.cs`
  - Xác định các status có thể cập nhật (CONFIRMED, CANCELED, COMPLETED)

- [ ] **1.6** Tạo document tổng hợp DTOs
  - File: `FE/docs/staff/DTOs_AppointmentManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `AppointmentCreateRequest`
  - File: `FE/src/lib/validations/appointment.validations.js`
  - Validate leadId (required, UUID)
  - Validate startTime (required, must be in future)
  - Validate endTime (optional, must be after startTime)
  - Validate location (required, min length)
  - Validate notes (optional, max length)

- [ ] **2.2** Tạo validation schema cho `AppointmentUpdateRequest`
  - File: `FE/src/lib/validations/appointment.validations.js`

- [ ] **2.3** Tạo validation schema cho `AppointmentStatusUpdateRequest`
  - File: `FE/src/lib/validations/appointment.validations.js`
  - Validate status (required, enum: CONFIRMED, CANCELED, COMPLETED)

- [ ] **2.4** Test validation schemas

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Kiểm tra `AppointmentsController` hiện tại
  - File: `BE/src/EVehicle.API/Controllers/AppointmentsController.cs`
  - Xác định các endpoint có sẵn

- [ ] **3.2** Kiểm tra endpoint tạo Appointment
  - Cần endpoint: `POST /api/staff/appointments`
  - Chỉ Staff được gán Lead mới có quyền tạo

- [ ] **3.3** Kiểm tra endpoint lấy danh sách Appointment
  - Cần endpoint: `GET /api/staff/appointments`
  - Filter theo status, dateRange, pagination
  - Chỉ lấy Appointments của Staff hiện tại

- [ ] **3.4** Kiểm tra endpoint cập nhật Appointment
  - Cần endpoint: `PUT /api/staff/appointments/{id}`
  - Hoặc `PATCH /api/staff/appointments/{id}`

- [ ] **3.5** Kiểm tra endpoint cập nhật trạng thái Appointment
  - Cần endpoint: `PUT /api/staff/appointments/{id}/status`
  - Hoặc `PATCH /api/staff/appointments/{id}/status`

- [ ] **3.6** Kiểm tra endpoint hủy Appointment
  - Cần endpoint: `DELETE /api/staff/appointments/{id}`
  - Hoặc cập nhật status thành CANCELED

- [ ] **3.7** Tạo document tổng hợp Endpoints
  - File: `FE/docs/staff/Endpoints_AppointmentManagement.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `staffAppointment.service.js`
  - File: `FE/src/api/services/staffAppointment.service.js`
  - Methods:
    - `createAppointment(data)` - Tạo lịch hẹn
    - `getAppointments(params)` - Lấy danh sách lịch hẹn
    - `getAppointmentById(id)` - Lấy chi tiết lịch hẹn
    - `updateAppointment(id, data)` - Cập nhật lịch hẹn
    - `updateAppointmentStatus(id, status)` - Cập nhật trạng thái
    - `cancelAppointment(id)` - Hủy lịch hẹn

- [ ] **4.2** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `AppointmentList` component
  - File: `FE/src/components/staff/appointments/AppointmentList.jsx`
  - Hiển thị danh sách lịch hẹn
  - Có pagination, filter, sort
  - Hiển thị: Date/Time, Location, Buyer, Seller, Status
  - Có nút "Xem chi tiết", "Cập nhật", "Hủy"

- [ ] **5.2** Tạo `AppointmentCreateModal` component
  - File: `FE/src/components/staff/appointments/AppointmentCreateModal.jsx`
  - Form tạo lịch hẹn:
    - Dropdown chọn Lead (chỉ hiển thị Leads được gán và chưa có lịch hẹn)
    - Date/Time picker cho startTime
    - Date/Time picker cho endTime (optional)
    - Input location
    - Textarea notes (optional)
  - Form validation
  - Submit để tạo lịch hẹn

- [ ] **5.3** Tạo `AppointmentUpdateModal` component
  - File: `FE/src/components/staff/appointments/AppointmentUpdateModal.jsx`
  - Form cập nhật lịch hẹn:
    - Date/Time picker cho startTime
    - Date/Time picker cho endTime
    - Input location
    - Textarea notes
  - Form validation
  - Submit để cập nhật lịch hẹn

- [ ] **5.4** Tạo `AppointmentDetailModal` component
  - File: `FE/src/components/staff/appointments/AppointmentDetailModal.jsx`
  - Hiển thị chi tiết lịch hẹn:
    - Thông tin lịch hẹn (Date/Time, Location, Status)
    - Thông tin Lead (Lead ID, Post Title)
    - Thông tin Buyer (Name, Email, Phone)
    - Thông tin Seller (Name, Email, Phone)
    - Notes
  - Có nút "Cập nhật", "Hủy", "Đánh dấu hoàn thành"

- [ ] **5.5** Tạo `AppointmentFilter` component
  - File: `FE/src/components/staff/appointments/AppointmentFilter.jsx`
  - Filter theo:
    - Status (CONFIRMED, CANCELED, COMPLETED)
    - Date Range (StartTime)
    - Lead ID
  - Có nút "Reset" và "Apply"

- [ ] **5.6** Tạo `AppointmentCalendar` component (Optional)
  - File: `FE/src/components/staff/appointments/AppointmentCalendar.jsx`
  - Hiển thị lịch hẹn dạng calendar view
  - Sử dụng thư viện react-calendar hoặc fullcalendar
  - Click vào event để xem chi tiết

- [ ] **5.7** Tạo `AppointmentStatusBadge` component
  - File: `FE/src/components/staff/appointments/AppointmentStatusBadge.jsx`
  - Hiển thị badge với màu sắc khác nhau theo status
  - CONFIRMED: blue
  - CANCELED: red
  - COMPLETED: green

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `AppointmentManagement` page
  - File: `FE/src/pages/staff/AppointmentManagement.jsx`
  - Layout: Tabs (List View, Calendar View)
  - List View: Filter + List
  - Calendar View: Calendar component
  - Có nút "Tạo lịch hẹn mới"
  - Sử dụng `AppointmentFilter`, `AppointmentList`, `AppointmentCalendar` components
  - Integrate với API services

- [ ] **6.2** Tạo route cho AppointmentManagement
  - File: `FE/src/router/index.jsx`
  - Route: `/staff/appointments`
  - Protected route (chỉ Staff)

- [ ] **6.3** Update StaffSidebar
  - File: `FE/src/components/staff/StaffSidebar.jsx`
  - Thêm menu item "Quản lý Lịch hẹn"
  - Icon: Calendar (hoặc tương tự)

- [ ] **6.4** Test toàn bộ flow
  - Test tạo lịch hẹn
  - Test xem danh sách lịch hẹn
  - Test filter lịch hẹn
  - Test cập nhật lịch hẹn
  - Test hủy lịch hẹn
  - Test calendar view (nếu có)

---

## Module 4: Quản lý Bài đăng (UC45)

### 📌 Use Case
- **UC45**: Xem Danh sách Bài đăng được gán

### 🎯 Mục tiêu
Tạo UI để Staff xem danh sách bài đăng được Admin gán cho mình và xem danh sách Leads đang quan tâm bài đăng.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Kiểm tra xem có DTO `AssignedPostResponse` không
  - Nếu chưa có, có thể sử dụng `PostResponse` hiện có
  - Cần thêm field: `assignedLeads` - Danh sách Leads đang quan tâm bài đăng

- [ ] **1.2** Đọc và phân tích `PostResponse` DTO
  - File: `BE/src/EVehicle.Application/DTOs/Posts/PostResponse.cs`
  - Xác định các field hiển thị

- [ ] **1.3** Kiểm tra xem có DTO `PostSearchRequest` không
  - File: `BE/src/EVehicle.Application/DTOs/Posts/PostSearchRequest.cs`
  - Xác định các filter params

- [ ] **1.4** Tạo document tổng hợp DTOs
  - File: `FE/docs/staff/DTOs_PostManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Kiểm tra xem có cần validation schema cho Post search không
  - Post search chủ yếu là GET requests, không cần validation phức tạp

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Kiểm tra xem có endpoint lấy bài đăng được gán cho Staff không
  - Cần endpoint: `GET /api/staff/posts/assigned`
  - Chỉ lấy bài đăng được gán cho Staff hiện tại
  - Filter theo status, pagination

- [ ] **3.2** Kiểm tra endpoint lấy chi tiết bài đăng
  - Cần endpoint: `GET /api/staff/posts/{id}`
  - Chỉ Staff được gán mới có quyền xem

- [ ] **3.3** Kiểm tra endpoint lấy Leads của bài đăng
  - Cần endpoint: `GET /api/staff/posts/{id}/leads`
  - Lấy danh sách Leads đang quan tâm bài đăng

- [ ] **3.4** Tạo document tổng hợp Endpoints
  - File: `FE/docs/staff/Endpoints_PostManagement.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `staffPost.service.js`
  - File: `FE/src/api/services/staffPost.service.js`
  - Methods:
    - `getAssignedPosts(params)` - Lấy danh sách bài đăng được gán
    - `getPostById(id)` - Lấy chi tiết bài đăng
    - `getPostLeads(postId, params)` - Lấy danh sách Leads của bài đăng

- [ ] **4.2** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `AssignedPostList` component
  - File: `FE/src/components/staff/posts/AssignedPostList.jsx`
  - Hiển thị danh sách bài đăng được gán
  - Có pagination, filter
  - Hiển thị: Title, Price, Status, Created At, Số lượng Leads
  - Có nút "Xem chi tiết"

- [ ] **5.2** Tạo `PostDetailModal` component
  - File: `FE/src/components/staff/posts/PostDetailModal.jsx`
  - Hiển thị chi tiết bài đăng:
    - Thông tin bài đăng (Title, Description, Price, Images)
    - Thông tin sản phẩm (Brand, Model, Specifications)
    - Thông tin người bán (Name, Email, Phone)
    - Danh sách Leads đang quan tâm (có link đến Lead detail)

- [ ] **5.3** Tạo `PostLeadsList` component
  - File: `FE/src/components/staff/posts/PostLeadsList.jsx`
  - Hiển thị danh sách Leads đang quan tâm bài đăng
  - Hiển thị: Lead ID, Buyer Name, Status, Created At
  - Có link đến Lead detail

- [ ] **5.4** Tạo `PostFilter` component
  - File: `FE/src/components/staff/posts/PostFilter.jsx`
  - Filter theo:
    - Status (APPROVED, SOLD)
    - Date Range (Created At)
    - Search by title

- [ ] **5.5** Tạo `PostCard` component
  - File: `FE/src/components/staff/posts/PostCard.jsx`
  - Hiển thị thông tin bài đăng dạng card
  - Có image, title, price, status
  - Có badge số lượng Leads

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `PostManagement` page
  - File: `FE/src/pages/staff/PostManagement.jsx`
  - Layout: Filter + List/Grid
  - Toggle view: List view / Grid view
  - Sử dụng `PostFilter` và `AssignedPostList` components
  - Integrate với API services

- [ ] **6.2** Tạo route cho PostManagement
  - File: `FE/src/router/index.jsx`
  - Route: `/staff/posts`
  - Protected route (chỉ Staff)

- [ ] **6.3** Update StaffSidebar
  - File: `FE/src/components/staff/StaffSidebar.jsx`
  - Thêm menu item "Quản lý Bài đăng"
  - Icon: FileText (hoặc tương tự)

- [ ] **6.4** Test toàn bộ flow
  - Test xem danh sách bài đăng được gán
  - Test filter bài đăng
  - Test xem chi tiết bài đăng
  - Test xem Leads của bài đăng

---

## Module 5: Soạn thảo Hợp đồng (UC43)

### 📌 Use Case
- **UC43**: Soạn thảo Hợp đồng

### 🎯 Mục tiêu
Tạo UI để Staff soạn thảo hợp đồng mua bán từ mẫu, điền thông tin, và gửi cho cả hai bên để ký.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Kiểm tra xem có DTO `ContractTemplateResponse` không
  - File: `BE/src/EVehicle.Application/DTOs/Contracts/ContractTemplateResponse.cs`
  - Xác định các field: templateId, name, content, placeholders

- [ ] **1.2** Kiểm tra xem có DTO `ContractCreateRequest` không
  - File: `BE/src/EVehicle.Application/DTOs/Contracts/ContractCreateRequest.cs`
  - Xác định các field: leadId, templateId, content, variables

- [ ] **1.3** Kiểm tra xem có DTO `ContractResponse` không
  - File: `BE/src/EVehicle.Application/DTOs/Contracts/ContractResponse.cs`
  - Xác định các field hiển thị

- [ ] **1.4** Tạo document tổng hợp DTOs
  - File: `FE/docs/staff/DTOs_ContractManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `ContractCreateRequest`
  - File: `FE/src/lib/validations/contract.validations.js`
  - Validate leadId (required, UUID)
  - Validate templateId (required, UUID)
  - Validate content (required, min length)
  - Validate variables (optional, object)

- [ ] **2.2** Test validation schemas

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Kiểm tra `ContractsController` hiện tại
  - File: `BE/src/EVehicle.API/Controllers/ContractsController.cs`
  - Xác định các endpoint có sẵn

- [ ] **3.2** Kiểm tra endpoint lấy danh sách mẫu hợp đồng
  - Cần endpoint: `GET /api/staff/contract-templates`
  - Filter theo category (XE_DIEN, PIN)

- [ ] **3.3** Kiểm tra endpoint lấy chi tiết mẫu hợp đồng
  - Cần endpoint: `GET /api/staff/contract-templates/{id}`

- [ ] **3.4** Kiểm tra endpoint tạo hợp đồng
  - Cần endpoint: `POST /api/staff/contracts`
  - Chỉ Staff được gán Lead mới có quyền tạo

- [ ] **3.5** Kiểm tra endpoint xuất PDF hợp đồng
  - Cần endpoint: `GET /api/staff/contracts/{id}/pdf`
  - Hoặc `POST /api/staff/contracts/{id}/export-pdf`

- [ ] **3.6** Kiểm tra endpoint gửi hợp đồng để ký
  - Cần endpoint: `POST /api/staff/contracts/{id}/send-for-signature`
  - Gửi hợp đồng cho Buyer và Seller

- [ ] **3.7** Tạo document tổng hợp Endpoints
  - File: `FE/docs/staff/Endpoints_ContractManagement.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `staffContract.service.js`
  - File: `FE/src/api/services/staffContract.service.js`
  - Methods:
    - `getContractTemplates(category)` - Lấy danh sách mẫu hợp đồng
    - `getContractTemplateById(id)` - Lấy chi tiết mẫu hợp đồng
    - `createContract(data)` - Tạo hợp đồng
    - `getContractById(id)` - Lấy chi tiết hợp đồng
    - `exportContractToPdf(id)` - Xuất PDF hợp đồng
    - `sendContractForSignature(id)` - Gửi hợp đồng để ký

- [ ] **4.2** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `ContractTemplateSelector` component
  - File: `FE/src/components/staff/contracts/ContractTemplateSelector.jsx`
  - Hiển thị danh sách mẫu hợp đồng
  - Filter theo category
  - Có nút "Chọn mẫu"

- [ ] **5.2** Tạo `ContractEditor` component
  - File: `FE/src/components/staff/contracts/ContractEditor.jsx`
  - Rich text editor để chỉnh sửa nội dung hợp đồng
  - Tự động điền thông tin: Buyer, Seller, Post, Lead
  - Hiển thị placeholders và cho phép thay thế
  - Preview hợp đồng

- [ ] **5.3** Tạo `ContractCreateModal` component
  - File: `FE/src/components/staff/contracts/ContractCreateModal.jsx`
  - Form tạo hợp đồng:
    - Dropdown chọn Lead (chỉ hiển thị Leads được gán và đã chốt giao dịch)
    - Dropdown chọn mẫu hợp đồng
    - ContractEditor để chỉnh sửa nội dung
    - Preview hợp đồng
  - Form validation
  - Submit để tạo hợp đồng

- [ ] **5.4** Tạo `ContractDetailModal` component
  - File: `FE/src/components/staff/contracts/ContractDetailModal.jsx`
  - Hiển thị chi tiết hợp đồng:
    - Thông tin hợp đồng (ID, Status, Created At)
    - Thông tin Lead (Lead ID, Post Title)
    - Thông tin Buyer và Seller
    - Nội dung hợp đồng (có thể xem PDF)
  - Có nút "Xuất PDF", "Gửi để ký", "Xem trạng thái ký"

- [ ] **5.5** Tạo `ContractList` component
  - File: `FE/src/components/staff/contracts/ContractList.jsx`
  - Hiển thị danh sách hợp đồng đã tạo
  - Hiển thị: Contract ID, Lead ID, Status, Created At
  - Có nút "Xem chi tiết"

- [ ] **5.6** Tạo `ContractStatusBadge` component
  - File: `FE/src/components/staff/contracts/ContractStatusBadge.jsx`
  - Hiển thị badge với màu sắc khác nhau theo status
  - DRAFT: gray
  - SENT: blue
  - SIGNED: green
  - REJECTED: red

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `ContractManagement` page
  - File: `FE/src/pages/staff/ContractManagement.jsx`
  - Layout: List + Detail
  - Có nút "Tạo hợp đồng mới"
  - Sử dụng `ContractList` và `ContractDetailModal` components
  - Integrate với API services

- [ ] **6.2** Tạo route cho ContractManagement
  - File: `FE/src/router/index.jsx`
  - Route: `/staff/contracts`
  - Protected route (chỉ Staff)

- [ ] **6.3** Update StaffSidebar
  - File: `FE/src/components/staff/StaffSidebar.jsx`
  - Thêm menu item "Hợp đồng"
  - Icon: FileText (hoặc tương tự)

- [ ] **6.4** Test toàn bộ flow
  - Test chọn mẫu hợp đồng
  - Test tạo hợp đồng
  - Test chỉnh sửa hợp đồng
  - Test xuất PDF hợp đồng
  - Test gửi hợp đồng để ký

---

## Module 6: Chat (UC35, UC36)

### 📌 Use Cases
- **UC35**: Gửi Tin nhắn
- **UC36**: Xem Lịch sử Chat

### 🎯 Mục tiêu
Tạo UI để Staff chat với Buyer và Seller trong phòng chat 3 người.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Kiểm tra xem có DTO `ChatRoomResponse` không
  - Xác định các field: roomId, participants, lastMessage, unreadCount

- [ ] **1.2** Kiểm tra xem có DTO `MessageResponse` không
  - Xác định các field: messageId, senderId, senderName, content, type, createdAt

- [ ] **1.3** Kiểm tra xem có DTO `MessageCreateRequest` không
  - Xác định các field: roomId, content, type (TEXT, IMAGE, FILE)

- [ ] **1.4** Tạo document tổng hợp DTOs
  - File: `FE/docs/staff/DTOs_ChatManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Tạo validation schema cho `MessageCreateRequest`
  - File: `FE/src/lib/validations/chat.validations.js`
  - Validate roomId (required, UUID)
  - Validate content (required, min length, max length)
  - Validate type (required, enum: TEXT, IMAGE, FILE)

- [ ] **2.2** Test validation schemas

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Kiểm tra xem có `ChatController` không
  - Nếu chưa có, cần tạo ở backend

- [ ] **3.2** Kiểm tra endpoint lấy danh sách phòng chat
  - Cần endpoint: `GET /api/staff/chat/rooms`
  - Chỉ lấy phòng chat của Staff hiện tại

- [ ] **3.3** Kiểm tra endpoint lấy lịch sử tin nhắn
  - Cần endpoint: `GET /api/staff/chat/rooms/{id}/messages`
  - Pagination support

- [ ] **3.4** Kiểm tra endpoint gửi tin nhắn
  - Cần endpoint: `POST /api/staff/chat/messages`
  - Hoặc sử dụng WebSocket để real-time chat

- [ ] **3.5** Kiểm tra WebSocket support
  - Cần WebSocket endpoint để real-time chat
  - Hoặc sử dụng SignalR

- [ ] **3.6** Tạo document tổng hợp Endpoints
  - File: `FE/docs/staff/Endpoints_ChatManagement.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `staffChat.service.js`
  - File: `FE/src/api/services/staffChat.service.js`
  - Methods:
    - `getChatRooms()` - Lấy danh sách phòng chat
    - `getChatRoomById(id)` - Lấy chi tiết phòng chat
    - `getMessages(roomId, params)` - Lấy lịch sử tin nhắn
    - `sendMessage(data)` - Gửi tin nhắn
    - `markAsRead(roomId)` - Đánh dấu đã đọc

- [ ] **4.2** Setup WebSocket/SignalR client
  - File: `FE/src/api/services/staffChat.service.js`
  - Connect to WebSocket/SignalR server
  - Listen for new messages
  - Send messages via WebSocket

- [ ] **4.3** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `ChatRoomList` component
  - File: `FE/src/components/staff/chat/ChatRoomList.jsx`
  - Hiển thị danh sách phòng chat
  - Hiển thị: Participants, Last message, Unread count, Time
  - Click để chọn phòng chat

- [ ] **5.2** Tạo `ChatMessageList` component
  - File: `FE/src/components/staff/chat/ChatMessageList.jsx`
  - Hiển thị danh sách tin nhắn
  - Hiển thị: Sender, Content, Time
  - Auto scroll to bottom
  - Infinite scroll để load more messages

- [ ] **5.3** Tạo `ChatMessageInput` component
  - File: `FE/src/components/staff/chat/ChatMessageInput.jsx`
  - Input để nhập tin nhắn
  - Nút gửi tin nhắn
  - Nút upload file/image
  - Emoji picker (optional)

- [ ] **5.4** Tạo `ChatWindow` component
  - File: `FE/src/components/staff/chat/ChatWindow.jsx`
  - Combine `ChatMessageList` và `ChatMessageInput`
  - Handle real-time messages via WebSocket
  - Auto mark as read when viewing

- [ ] **5.5** Tạo `ChatLayout` component
  - File: `FE/src/components/staff/chat/ChatLayout.jsx`
  - Layout: Sidebar (ChatRoomList) + Main (ChatWindow)
  - Responsive design

- [ ] **5.6** Tạo `MessageBubble` component
  - File: `FE/src/components/staff/chat/MessageBubble.jsx`
  - Hiển thị tin nhắn dạng bubble
  - Different styles for sent/received messages
  - Support for text, image, file messages

- [ ] **5.7** Tạo `ChatRoomHeader` component
  - File: `FE/src/components/staff/chat/ChatRoomHeader.jsx`
  - Hiển thị thông tin phòng chat (Participants, Lead info)
  - Có nút "Xem chi tiết Lead"

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `Chat` page
  - File: `FE/src/pages/staff/Chat.jsx`
  - Sử dụng `ChatLayout` component
  - Integrate với API services và WebSocket
  - Handle real-time messages

- [ ] **6.2** Tạo route cho Chat
  - File: `FE/src/router/index.jsx`
  - Route: `/staff/chat`
  - Protected route (chỉ Staff)

- [ ] **6.3** Update StaffSidebar
  - File: `FE/src/components/staff/StaffSidebar.jsx`
  - Thêm menu item "Chat"
  - Icon: MessageSquare (hoặc tương tự)
  - Badge hiển thị số tin nhắn chưa đọc

- [ ] **6.4** Test toàn bộ flow
  - Test xem danh sách phòng chat
  - Test gửi tin nhắn
  - Test nhận tin nhắn real-time
  - Test upload file/image
  - Test mark as read

---

## Module 7: Thông báo (UC37, UC38)

### 📌 Use Cases
- **UC37**: Xem Danh sách Thông báo
- **UC38**: Đánh dấu Thông báo đã đọc

### 🎯 Mục tiêu
Tạo UI để Staff xem danh sách thông báo và đánh dấu đã đọc.

### 📝 Track List

#### ✅ Bước 1: Phân tích DTOs và Validators

- [ ] **1.1** Kiểm tra xem có DTO `NotificationResponse` không
  - Xác định các field: notificationId, type, title, content, isRead, createdAt

- [ ] **1.2** Kiểm tra xem có DTO `NotificationSearchRequest` không
  - Xác định các filter params (type, isRead, dateRange)

- [ ] **1.3** Tạo document tổng hợp DTOs
  - File: `FE/docs/staff/DTOs_NotificationManagement.md`

#### ✅ Bước 2: Xây dựng Validation cho Frontend

- [ ] **2.1** Kiểm tra xem có cần validation schema không
  - Notification chủ yếu là GET requests, không cần validation phức tạp

#### ✅ Bước 3: Phân tích Controller và Endpoints

- [ ] **3.1** Kiểm tra xem có `NotificationsController` không
  - Nếu chưa có, cần tạo ở backend

- [ ] **3.2** Kiểm tra endpoint lấy danh sách thông báo
  - Cần endpoint: `GET /api/staff/notifications`
  - Filter theo type, isRead, pagination

- [ ] **3.3** Kiểm tra endpoint đánh dấu đã đọc
  - Cần endpoint: `PUT /api/staff/notifications/{id}/read`
  - Hoặc `PATCH /api/staff/notifications/{id}/read`

- [ ] **3.4** Kiểm tra endpoint đánh dấu tất cả đã đọc
  - Cần endpoint: `PUT /api/staff/notifications/read-all`

- [ ] **3.5** Kiểm tra endpoint đếm thông báo chưa đọc
  - Cần endpoint: `GET /api/staff/notifications/unread-count`

- [ ] **3.6** Kiểm tra WebSocket support cho real-time notifications
  - Cần WebSocket endpoint để nhận thông báo real-time

- [ ] **3.7** Tạo document tổng hợp Endpoints
  - File: `FE/docs/staff/Endpoints_NotificationManagement.md`

#### ✅ Bước 4: Xây dựng API Services

- [ ] **4.1** Tạo `staffNotification.service.js`
  - File: `FE/src/api/services/staffNotification.service.js`
  - Methods:
    - `getNotifications(params)` - Lấy danh sách thông báo
    - `getNotificationById(id)` - Lấy chi tiết thông báo
    - `markAsRead(id)` - Đánh dấu đã đọc
    - `markAllAsRead()` - Đánh dấu tất cả đã đọc
    - `getUnreadCount()` - Lấy số lượng thông báo chưa đọc

- [ ] **4.2** Setup WebSocket/SignalR client cho notifications
  - File: `FE/src/api/services/staffNotification.service.js`
  - Listen for new notifications

- [ ] **4.3** Test API services

#### ✅ Bước 5: Xây dựng Components

- [ ] **5.1** Tạo `NotificationList` component
  - File: `FE/src/components/staff/notifications/NotificationList.jsx`
  - Hiển thị danh sách thông báo
  - Hiển thị: Type icon, Title, Content, Time, Read status
  - Click để xem chi tiết
  - Có nút "Đánh dấu đã đọc"

- [ ] **5.2** Tạo `NotificationItem` component
  - File: `FE/src/components/staff/notifications/NotificationItem.jsx`
  - Hiển thị một thông báo
  - Different styles for read/unread
  - Click để đánh dấu đã đọc và xem chi tiết

- [ ] **5.3** Tạo `NotificationFilter` component
  - File: `FE/src/components/staff/notifications/NotificationFilter.jsx`
  - Filter theo:
    - Type (LEAD, APPOINTMENT, MESSAGE, SYSTEM)
    - Read status (All, Read, Unread)
    - Date Range

- [ ] **5.4** Tạo `NotificationDropdown` component
  - File: `FE/src/components/staff/notifications/NotificationDropdown.jsx`
  - Dropdown hiển thị thông báo mới nhất (5-10 items)
  - Badge hiển thị số thông báo chưa đọc
  - Click để xem tất cả thông báo
  - Real-time update khi có thông báo mới

- [ ] **5.5** Tạo `NotificationBadge` component
  - File: `FE/src/components/staff/notifications/NotificationBadge.jsx`
  - Badge hiển thị số thông báo chưa đọc
  - Hiển thị trong header/sidebar

- [ ] **5.6** Tạo `NotificationTypeIcon` component
  - File: `FE/src/components/staff/notifications/NotificationTypeIcon.jsx`
  - Hiển thị icon khác nhau theo type
  - LEAD: UserCheck
  - APPOINTMENT: Calendar
  - MESSAGE: MessageSquare
  - SYSTEM: Bell

#### ✅ Bước 6: Xây dựng Pages

- [ ] **6.1** Tạo `Notifications` page
  - File: `FE/src/pages/staff/Notifications.jsx`
  - Layout: Filter + List
  - Sử dụng `NotificationFilter` và `NotificationList` components
  - Integrate với API services
  - Real-time update khi có thông báo mới

- [ ] **6.2** Tạo route cho Notifications
  - File: `FE/src/router/index.jsx`
  - Route: `/staff/notifications`
  - Protected route (chỉ Staff)

- [ ] **6.3** Update StaffLayout/StaffHeader
  - File: `FE/src/layouts/StaffLayout.jsx` hoặc `FE/src/components/staff/StaffHeader.jsx`
  - Thêm `NotificationDropdown` component vào header
  - Hiển thị `NotificationBadge` trong sidebar

- [ ] **6.4** Update StaffSidebar
  - File: `FE/src/components/staff/StaffSidebar.jsx`
  - Thêm menu item "Thông báo"
  - Icon: Bell (hoặc tương tự)
  - Badge hiển thị số thông báo chưa đọc

- [ ] **6.5** Test toàn bộ flow
  - Test xem danh sách thông báo
  - Test filter thông báo
  - Test đánh dấu đã đọc
  - Test đánh dấu tất cả đã đọc
  - Test nhận thông báo real-time
  - Test notification dropdown trong header

---

## 📝 Tổng kết

### Thứ tự ưu tiên thực hiện

1. **🔴 High Priority**:
   - Module 1: Dashboard Staff (UC39)
   - Module 2: Quản lý Lead (UC40, UC44)
   - Module 3: Quản lý Lịch hẹn (UC41, UC42)

2. **🟡 Medium Priority**:
   - Module 4: Quản lý Bài đăng (UC45)
   - Module 5: Soạn thảo Hợp đồng (UC43)
   - Module 6: Chat (UC35, UC36)

3. **🟢 Low Priority**:
   - Module 7: Thông báo (UC37, UC38)

### Checklist tổng thể

- [ ] Setup StaffLayout và StaffSidebar
- [ ] Setup routing cho Staff module
- [ ] Setup API services cho Staff module
- [ ] Implement Module 1: Dashboard Staff
- [ ] Implement Module 2: Quản lý Lead
- [ ] Implement Module 3: Quản lý Lịch hẹn
- [ ] Implement Module 4: Quản lý Bài đăng
- [ ] Implement Module 5: Soạn thảo Hợp đồng
- [ ] Implement Module 6: Chat
- [ ] Implement Module 7: Thông báo
- [ ] Test toàn bộ Staff module
- [ ] Documentation

---

**Tác giả**: EVehicle Development Team  
**Ngày tạo**: November 9, 2025  
**Version**: 1.0.0

