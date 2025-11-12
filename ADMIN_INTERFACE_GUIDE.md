# Admin Interface - EVehicle

## 📋 Tổng quan

Admin interface được xây dựng hoàn chỉnh với sidebar navigation, header, và các trang quản lý.

## 🏗️ Cấu trúc

### Components

#### 1. **AdminSidebar** (`src/components/admin/AdminSidebar.jsx`)
- **Chức năng**: Sidebar navigation cho admin với 9 menu items
- **Features**:
  - ✅ Collapsible (thu gọn/mở rộng): `lg:w-64` → `lg:w-20`
  - ✅ Mobile responsive với overlay drawer
  - ✅ Active route highlighting (nền primary)
  - ✅ User info display với avatar
  - ✅ Logout button
  - ✅ Lucide icons cho tất cả menu items
- **Menu Items**:
  1. Dashboard (`/admin`) - BarChart3
  2. Vehicles (`/admin/vehicles`) - Car
  3. Batteries (`/admin/batteries`) - Battery
  4. Users (`/admin/users`) - Users
  5. Staff (`/admin/staff`) - UserCog
  6. Posts (`/admin/posts`) - FileText
  7. Messages (`/admin/messages`) - MessageSquare
  8. Inspections (`/admin/inspections`) - ShieldCheck
  9. Settings (`/admin/settings`) - Settings

#### 2. **AdminHeader** (`src/components/admin/AdminHeader.jsx`)
- **Chức năng**: Header bar cố định ở đầu trang
- **Features**:
  - ✅ Mobile menu button (hiện sidebar trên mobile)
  - ✅ Search input (ẩn trên mobile)
  - ✅ Notification bell với badge đỏ
  - ✅ Fixed position với responsive left offset

### Layouts

#### **AdminLayout** (`src/layouts/AdminLayout.jsx`)
- **Chức năng**: Wrapper layout cho tất cả admin pages
- **Structure**:
  ```jsx
  <div>
    <AdminSidebar />           // Collapsible sidebar
    <AdminHeader />            // Fixed header
    <main className="pt-16 lg:pl-64">  // Content area
      <Outlet />               // Nested routes
    </main>
  </div>
  ```
- **State**: `isSidebarOpen` (control mobile sidebar)

### Pages

#### 1. **Dashboard** (`src/pages/admin/Dashboard.jsx`)
- **Route**: `/admin`
- **Components**:
  - **Stats Grid** (6 cards):
    - Tổng xe điện (1,234, +12.5%)
    - Tổng pin (856, +8.2%)
    - Người dùng (5,678, +15.3%)
    - Bài đăng (2,345, -2.4%)
    - Doanh thu (12.5M, +18.7%)
    - Tăng trưởng (23.8%, +5.2%)
  - **Recent Activity**: 5 hoạt động gần đây
  - **Quick Stats**: Các chỉ số cần xử lý (chờ duyệt, kiểm định, tin nhắn)
  - **System Status**: Trạng thái hệ thống (API, Database, Storage)
- **Design**: 
  - Gradient backgrounds cho stat cards
  - Color-coded icons (blue, green, purple, orange, emerald, pink)
  - Responsive grid layout

#### 2. **VehicleManagement** (`src/pages/admin/VehicleManagement.jsx`)
- **Route**: `/admin/vehicles`
- **Features**:
  - ✅ Search input với icon
  - ✅ Filter button
  - ✅ Add button (Thêm xe mới)
  - ✅ Table với 6 columns: Xe, Năm SX, Giá, Trạng thái, Chủ xe, Thao tác
  - ✅ Status badges (Đang bán, Chờ duyệt, Đã bán)
  - ✅ Pagination controls
  - ✅ Mock data (4 vehicles)

#### 3. **BatteryManagement** (`src/pages/admin/BatteryManagement.jsx`)
- **Route**: `/admin/batteries`
- **Features**:
  - ✅ Search input với icon
  - ✅ Filter button
  - ✅ Add button (Thêm pin mới)
  - ✅ Table với 7 columns: Pin, Dung lượng, Điện áp, Giá, Trạng thái, Chủ sở hữu, Thao tác
  - ✅ Status badges (Đang bán, Chờ kiểm định, Đã bán)
  - ✅ Pagination controls
  - ✅ Mock data (4 batteries)

#### 4-9. **Pending Pages** (TODO)
- Users Management (`/admin/users`)
- Staff Management (`/admin/staff`)
- Post Management (`/admin/posts`)
- Message Management (`/admin/messages`)
- Inspection Management (`/admin/inspections`)
- System Settings (`/admin/settings`)

## 🎨 Design Specifications

### Sidebar
- **Width**: 
  - Desktop expanded: `w-64` (256px)
  - Desktop collapsed: `w-20` (80px)
  - Mobile: Full screen overlay
- **Colors**: 
  - Background: `bg-white`
  - Border: `border-gray-200`
  - Active: `bg-primary text-primary-foreground`
  - Hover: `hover:bg-gray-50`
- **Icons**: `h-5 w-5` (Lucide React)
- **Transitions**: `transition-all duration-300`

### Header
- **Height**: `h-16` (64px)
- **Position**: Fixed top
- **Background**: `bg-white border-b border-gray-200`
- **Z-index**: `z-30`
- **Left offset**: 
  - Desktop: `lg:left-64` (matches sidebar)
  - Mobile: `left-0`

### Content Area
- **Padding**: 
  - Top: `pt-16` (header height)
  - Left: `lg:pl-64` (sidebar width)
  - Inner: `p-4 lg:p-6`
- **Background**: `bg-gray-50`

### Tables
- **Header**: `bg-gray-50 border-b`
- **Rows**: `hover:bg-gray-50`
- **Cells**: `px-6 py-4`
- **Borders**: `divide-y divide-gray-200`

## 🔐 Route Protection

Tất cả admin routes được bảo vệ bởi `PrivateRoute`:

```jsx
<PrivateRoute allowedRoles={['ADMIN']}>
  <AdminLayout />
</PrivateRoute>
```

- Kiểm tra JWT token trong localStorage
- Verify role === 'ADMIN'
- Redirect về `/auth/login` nếu chưa đăng nhập
- Redirect về `/403` nếu không có quyền

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Sidebar luôn hiển thị (collapsible)
- Header có left offset = sidebar width
- Content có left padding = sidebar width
- Menu button ẩn

### Mobile (<1024px)
- Sidebar dạng drawer (ẩn mặc định)
- Header full width
- Content full width
- Menu button hiển thị để mở sidebar
- Overlay bg-black/50 khi sidebar mở

## 🚀 Usage

### Truy cập Admin Interface

1. Đăng nhập với tài khoản ADMIN
2. Navigate đến `/admin`
3. Sidebar tự động active item dựa trên current route
4. Click menu items để chuyển trang

### Mobile Navigation

1. Click menu button (☰) trên header
2. Sidebar slide in từ trái
3. Click menu item hoặc overlay để đóng

### Desktop Collapse

1. Click toggle button (⇄) trên sidebar header
2. Sidebar thu gọn từ 256px → 80px
3. Text labels ẩn, chỉ hiển thị icons
4. Tooltip (future) hiển thị khi hover

## 📝 Next Steps

### Priority 1: Complete Core Management Pages
- [ ] User Management (UC19, UC20, UC21)
- [ ] Staff Management (UC22, UC23)
- [ ] Post Management (UC24, UC25, UC26)

### Priority 2: Data Integration
- [ ] Connect to API endpoints
- [ ] Replace mock data với real API calls
- [ ] Add loading states
- [ ] Add error handling

### Priority 3: CRUD Operations
- [ ] Create modals (Add/Edit)
- [ ] Delete confirmations
- [ ] Form validations
- [ ] Success/error toasts

### Priority 4: Advanced Features
- [ ] Search functionality
- [ ] Filters (status, date range, etc.)
- [ ] Sorting (columns)
- [ ] Pagination (real)
- [ ] Export data (CSV, PDF)

### Priority 5: UI Enhancements
- [ ] Charts/graphs (Dashboard)
- [ ] Tooltips for collapsed sidebar
- [ ] Breadcrumbs navigation
- [ ] Dark mode support

## 🎯 Related Use Cases

Admin interface covers use cases:
- UC19: Xem danh sách người dùng
- UC20: Khóa/Mở tài khoản
- UC21: Xem chi tiết người dùng
- UC22: Quản lý nhân viên
- UC23: Phân quyền
- UC24: Duyệt bài đăng
- UC25: Xóa bài vi phạm
- UC26: Thống kê hệ thống
- UC27: Cấu hình hệ thống

## 🔗 Dependencies

- React Router v6 (routing)
- shadcn/ui components (Button, Input)
- Lucide React (icons)
- authService (user info, logout)
- Tailwind CSS (styling)

---

**Status**: ✅ Layout hoàn chỉnh, Dashboard + 2 management pages implemented, 6 pages còn lại TODO
