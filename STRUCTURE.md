# Cấu trúc Thư mục Frontend - EVehicle Marketplace

## Tech Stack
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Date Handling**: date-fns
- **Image Upload**: React Dropzone
- **Charts**: Recharts
- **Animations**: Framer Motion (optional)

## Cấu trúc Thư mục

```
FE/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── images/
│       ├── placeholder-vehicle.png
│       ├── placeholder-battery.png
│       └── no-image.png
│
├── src/
│   ├── api/                          # API Service Layer
│   │   ├── axios.config.js           # Axios instance configuration
│   │   ├── endpoints.js              # API endpoints constants
│   │   └── services/
│   │       ├── auth.service.js       # Authentication API
│   │       ├── user.service.js       # User management API
│   │       ├── post.service.js       # Post/Listing API
│   │       ├── package.service.js    # Package/Credits API
│   │       ├── payment.service.js    # Payment API
│   │       ├── lead.service.js       # Lead management API
│   │       ├── chat.service.js       # Chat API
│   │       ├── notification.service.js
│   │       ├── rating.service.js     # Rating/Review API
│   │       ├── auction.service.js    # Auction/Bid API
│   │       └── admin.service.js      # Admin API
│   │
│   ├── assets/                       # Static assets
│   │   ├── fonts/
│   │   ├── icons/
│   │   ├── images/
│   │   └── styles/
│   │       └── globals.css           # Global CSS + Tailwind imports
│   │
│   ├── components/                   # Reusable components
│   │   ├── ui/                       # shadcn/ui components (auto-generated)
│   │   │   ├── button.jsx            # shadcn Button component
│   │   │   ├── input.jsx             # shadcn Input component
│   │   │   ├── card.jsx              # shadcn Card component
│   │   │   ├── dialog.jsx            # shadcn Dialog/Modal component
│   │   │   ├── dropdown-menu.jsx     # shadcn Dropdown component
│   │   │   ├── select.jsx            # shadcn Select component
│   │   │   ├── textarea.jsx          # shadcn Textarea component
│   │   │   ├── avatar.jsx            # shadcn Avatar component
│   │   │   ├── badge.jsx             # shadcn Badge component
│   │   │   ├── tabs.jsx              # shadcn Tabs component
│   │   │   ├── toast.jsx             # shadcn Toast component
│   │   │   ├── toaster.jsx           # shadcn Toaster component
│   │   │   ├── alert.jsx             # shadcn Alert component
│   │   │   ├── alert-dialog.jsx      # shadcn AlertDialog component
│   │   │   ├── skeleton.jsx          # shadcn Skeleton component
│   │   │   ├── separator.jsx         # shadcn Separator component
│   │   │   ├── scroll-area.jsx       # shadcn ScrollArea component
│   │   │   ├── popover.jsx           # shadcn Popover component
│   │   │   ├── sheet.jsx             # shadcn Sheet component
│   │   │   ├── table.jsx             # shadcn Table component
│   │   │   ├── calendar.jsx          # shadcn Calendar component
│   │   │   ├── checkbox.jsx          # shadcn Checkbox component
│   │   │   ├── radio-group.jsx       # shadcn RadioGroup component
│   │   │   ├── switch.jsx            # shadcn Switch component
│   │   │   ├── slider.jsx            # shadcn Slider component
│   │   │   ├── progress.jsx          # shadcn Progress component
│   │   │   ├── label.jsx             # shadcn Label component
│   │   │   ├── form.jsx              # shadcn Form component (with react-hook-form)
│   │   │   └── sonner.jsx            # shadcn Sonner toast (alternative)
│   │   │
│   │   ├── common/                   # Custom common components
│   │   │   ├── Pagination.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── DataTable.jsx         # Reusable table with sorting/filtering
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   ├── UserMenu.jsx
│   │   │   └── NotificationBell.jsx
│   │   │
│   │   ├── auth/                     # Authentication components
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── SocialLogin.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   ├── post/                     # Post/Listing components
│   │   │   ├── PostCard.jsx          # UC14: Card hiển thị bài đăng
│   │   │   ├── PostGrid.jsx          # Grid layout cho danh sách
│   │   │   ├── PostList.jsx          # List layout cho danh sách
│   │   │   ├── PostDetail.jsx        # UC14: Chi tiết bài đăng
│   │   │   ├── PostForm.jsx          # UC06: Form tạo bài đăng
│   │   │   ├── PostEditForm.jsx      # UC07: Form chỉnh sửa
│   │   │   ├── PostImages.jsx        # Upload/display images
│   │   │   ├── PostImageUploader.jsx # Image uploader với preview
│   │   │   ├── PostSpecifications.jsx # Thông số kỹ thuật
│   │   │   ├── PostStatus.jsx        # Status badge
│   │   │   ├── PostActions.jsx       # Actions menu (edit/delete/bump)
│   │   │   ├── PostBumpButton.jsx    # UC10: Đẩy tin
│   │   │   ├── PostPriceAI.jsx       # UC51: AI Price Suggestion
│   │   │   ├── PostPackageSelector.jsx # Chọn gói tin
│   │   │   └── PostApproval.jsx      # UC11, UC12: Admin approval
│   │   │
│   │   ├── search/                   # Search & Filter components
│   │   │   ├── SearchBar.jsx         # UC15: Search bar
│   │   │   ├── SearchFilters.jsx     # UC16: Filter panel
│   │   │   ├── FilterChips.jsx       # Active filters display
│   │   │   ├── SortDropdown.jsx      # UC17: Sort options
│   │   │   ├── PriceRangeSlider.jsx  # Price filter
│   │   │   ├── LocationFilter.jsx    # Location filter
│   │   │   └── SavedSearches.jsx     # Saved filters
│   │   │
│   │   ├── favorites/                # Favorites/Wishlist
│   │   │   ├── FavoriteButton.jsx    # UC18: Add to favorites
│   │   │   ├── FavoritesList.jsx     # UC22: Favorites list
│   │   │   └── FavoritesGrid.jsx
│   │   │
│   │   ├── comparison/               # Product Comparison
│   │   │   ├── CompareButton.jsx     # Add to compare
│   │   │   ├── CompareBar.jsx        # Compare bar (bottom)
│   │   │   └── CompareTable.jsx      # UC20: Comparison table
│   │   │
│   │   ├── auction/                  # Auction components
│   │   │   ├── AuctionBadge.jsx      # Auction indicator
│   │   │   ├── AuctionTimer.jsx      # Countdown timer
│   │   │   ├── BidForm.jsx           # UC21: Place bid form
│   │   │   ├── BidHistory.jsx        # Bid history list
│   │   │   ├── AuctionSetup.jsx      # Setup auction (seller)
│   │   │   └── AuctionWinner.jsx     # Winner notification
│   │   │
│   │   ├── lead/                     # Lead management
│   │   │   ├── ScheduleViewButton.jsx # UC23: Schedule view button
│   │   │   ├── LeadCard.jsx          # Lead card
│   │   │   ├── LeadList.jsx          # UC40: Lead list (Staff)
│   │   │   ├── LeadDetail.jsx        # Lead details
│   │   │   ├── LeadStatusBadge.jsx   # Status indicator
│   │   │   └── LeadAssignment.jsx    # UC46: Assign staff (Admin)
│   │   │
│   │   ├── appointment/              # Appointment components
│   │   │   ├── AppointmentCard.jsx   # Appointment card
│   │   │   ├── AppointmentForm.jsx   # UC41: Create appointment
│   │   │   ├── AppointmentList.jsx   # UC42: Appointments list
│   │   │   ├── AppointmentCalendar.jsx # Calendar view
│   │   │   └── AppointmentActions.jsx  # Update/Cancel actions
│   │   │
│   │   ├── package/                  # Package & Credits
│   │   │   ├── PackageCard.jsx       # UC25: Package card
│   │   │   ├── PackageList.jsx       # Packages list
│   │   │   ├── PackageComparison.jsx # Compare packages
│   │   │   ├── CreditsDisplay.jsx    # UC27: Credits display
│   │   │   └── PurchaseButton.jsx    # UC26: Purchase button
│   │   │
│   │   ├── payment/                  # Payment components
│   │   │   ├── PaymentForm.jsx       # UC28: Payment form
│   │   │   ├── PaymentMethodSelector.jsx
│   │   │   ├── PaymentHistory.jsx    # UC30: Payment history
│   │   │   ├── PaymentStatus.jsx     # Status indicator
│   │   │   └── PaymentReceipt.jsx    # Receipt/Invoice
│   │   │
│   │   ├── contract/                 # Contract components
│   │   │   ├── ContractPreview.jsx   # Preview contract
│   │   │   ├── ContractSign.jsx      # UC29: Digital signing
│   │   │   ├── ContractTemplate.jsx  # Template display
│   │   │   └── ContractList.jsx      # Contract history
│   │   │
│   │   ├── rating/                   # Rating & Review
│   │   │   ├── RatingStars.jsx       # Star rating display
│   │   │   ├── RatingForm.jsx        # UC31, UC32: Rating form
│   │   │   ├── ReviewCard.jsx        # Review card
│   │   │   ├── ReviewList.jsx        # Reviews list
│   │   │   ├── ReplyForm.jsx         # UC34: Reply to review
│   │   │   └── UserRating.jsx        # User rating summary
│   │   │
│   │   ├── chat/                     # Chat components
│   │   │   ├── ChatWindow.jsx        # UC35: Main chat window
│   │   │   ├── ChatList.jsx          # UC36: Chat rooms list
│   │   │   ├── ChatMessage.jsx       # Message bubble
│   │   │   ├── ChatInput.jsx         # Message input
│   │   │   ├── ChatHeader.jsx        # Chat header
│   │   │   ├── ChatParticipants.jsx  # 3-way chat participants
│   │   │   ├── FileUpload.jsx        # Upload files in chat
│   │   │   └── TypingIndicator.jsx   # Typing indicator
│   │   │
│   │   ├── notification/             # Notification components
│   │   │   ├── NotificationList.jsx  # UC37: Notifications list
│   │   │   ├── NotificationItem.jsx  # UC38: Notification item
│   │   │   ├── NotificationBadge.jsx # Unread count badge
│   │   │   └── NotificationSettings.jsx
│   │   │
│   │   ├── user/                     # User components
│   │   │   ├── UserProfile.jsx       # UC04: User profile
│   │   │   ├── UserAvatar.jsx        # User avatar
│   │   │   ├── UserCard.jsx          # User info card
│   │   │   ├── UserStats.jsx         # User statistics
│   │   │   └── ProfileEdit.jsx       # Edit profile form
│   │   │
│   │   ├── staff/                    # Staff components
│   │   │   ├── StaffDashboard.jsx    # UC39: Staff dashboard
│   │   │   ├── StaffLeadList.jsx     # Lead list for staff
│   │   │   ├── StaffPostList.jsx     # UC45: Assigned posts
│   │   │   ├── StaffAppointments.jsx # Appointments calendar
│   │   │   └── StaffStats.jsx        # Staff statistics
│   │   │
│   │   └── admin/                    # Admin components
│   │       ├── AdminDashboard.jsx    # Admin dashboard
│   │       ├── AdminStats.jsx        # UC50: Statistics
│   │       ├── UserManagement.jsx    # UC47: User management
│   │       ├── PostModeration.jsx    # UC11, UC12: Post approval
│   │       ├── PackageManagement.jsx # UC48: Package management
│   │       ├── ContractTemplates.jsx # UC49: Contract templates
│   │       ├── LeadAssignment.jsx    # UC46: Assign leads
│   │       ├── RevenueReport.jsx     # UC50: Revenue report
│   │       └── SystemSettings.jsx    # System settings
│   │
│   ├── features/                     # Feature-based Redux slices
│   │   ├── auth/
│   │   │   ├── authSlice.js          # Auth state management
│   │   │   └── authAPI.js            # RTK Query endpoints
│   │   ├── posts/
│   │   │   ├── postsSlice.js
│   │   │   └── postsAPI.js
│   │   ├── packages/
│   │   │   ├── packagesSlice.js
│   │   │   └── packagesAPI.js
│   │   ├── leads/
│   │   │   ├── leadsSlice.js
│   │   │   └── leadsAPI.js
│   │   ├── chat/
│   │   │   ├── chatSlice.js
│   │   │   └── chatAPI.js
│   │   ├── notifications/
│   │   │   ├── notificationsSlice.js
│   │   │   └── notificationsAPI.js
│   │   └── ui/
│   │       └── uiSlice.js            # UI state (modals, sidebars, etc.)
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── utils.js                  # cn() helper for className merging
│   │   └── validations.js            # Zod schemas for forms
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.js                # Authentication hook
│   │   ├── useDebounce.js            # Debounce hook
│   │   ├── useLocalStorage.js        # LocalStorage hook
│   │   ├── useIntersectionObserver.js # Infinite scroll
│   │   ├── useSocket.js              # Socket.IO hook
│   │   ├── useNotification.js        # Toast notifications
│   │   ├── usePermissions.js         # Check user permissions
│   │   ├── useMediaQuery.js          # Responsive breakpoints
│   │   └── useOutsideClick.js        # Click outside detection
│   │
│   ├── layouts/                      # Page layouts
│   │   ├── GuestLayout.jsx           # Layout for guests
│   │   ├── MemberLayout.jsx          # Layout for members
│   │   ├── StaffLayout.jsx           # Layout for staff
│   │   ├── AdminLayout.jsx           # Layout for admin
│   │   └── AuthLayout.jsx            # Layout for auth pages
│   │
│   ├── pages/                        # Page components (Route pages)
│   │   ├── Home.jsx                  # Landing page
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx             # UC02: Login page
│   │   │   ├── Register.jsx          # UC01: Register page
│   │   │   ├── ForgotPassword.jsx    # Forgot password
│   │   │   └── ResetPassword.jsx     # Reset password
│   │   │
│   │   ├── posts/
│   │   │   ├── PostsPage.jsx         # UC15: Browse/Search posts
│   │   │   ├── PostDetailPage.jsx    # UC14: Post detail
│   │   │   ├── CreatePostPage.jsx    # UC06: Create post
│   │   │   ├── EditPostPage.jsx      # UC07: Edit post
│   │   │   ├── MyPostsPage.jsx       # UC13: My posts
│   │   │   └── ComparePage.jsx       # UC20: Compare products
│   │   │
│   │   ├── favorites/
│   │   │   └── FavoritesPage.jsx     # UC22: Favorites page
│   │   │
│   │   ├── packages/
│   │   │   ├── PackagesPage.jsx      # UC25: View packages
│   │   │   └── CreditsPage.jsx       # UC27: View credits
│   │   │
│   │   ├── transactions/
│   │   │   ├── TransactionHistory.jsx # UC05: Transaction history
│   │   │   ├── PaymentHistory.jsx    # UC30: Payment history
│   │   │   └── CheckoutPage.jsx      # UC28: Checkout
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfilePage.jsx       # UC04: User profile
│   │   │   ├── EditProfilePage.jsx   # Edit profile
│   │   │   └── PublicProfilePage.jsx # Public profile view
│   │   │
│   │   ├── chat/
│   │   │   └── ChatPage.jsx          # UC35, UC36: Chat page
│   │   │
│   │   ├── notifications/
│   │   │   └── NotificationsPage.jsx # UC37: Notifications
│   │   │
│   │   ├── staff/
│   │   │   ├── StaffDashboardPage.jsx # UC39: Staff dashboard
│   │   │   ├── StaffLeadsPage.jsx    # UC40: Manage leads
│   │   │   ├── StaffPostsPage.jsx    # UC45: Assigned posts
│   │   │   └── StaffAppointmentsPage.jsx # UC42: Appointments
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboardPage.jsx # Admin dashboard
│   │   │   ├── UserManagementPage.jsx # UC47: Users
│   │   │   ├── PostModerationPage.jsx # UC11, UC12: Moderate posts
│   │   │   ├── LeadManagementPage.jsx # UC46: Assign leads
│   │   │   ├── PackageManagementPage.jsx # UC48: Packages
│   │   │   ├── ContractTemplatesPage.jsx # UC49: Templates
│   │   │   └── ReportsPage.jsx       # UC50: Reports
│   │   │
│   │   ├── errors/
│   │   │   ├── NotFound.jsx          # 404 page
│   │   │   ├── Unauthorized.jsx      # 403 page
│   │   │   └── ServerError.jsx       # 500 page
│   │   │
│   │   └── legal/
│   │       ├── TermsOfService.jsx    # Terms of service
│   │       ├── PrivacyPolicy.jsx     # Privacy policy
│   │       └── FAQ.jsx               # FAQ page
│   │
│   ├── routes/                       # Routing configuration
│   │   ├── index.jsx                 # Main router
│   │   ├── guestRoutes.jsx           # Guest routes
│   │   ├── memberRoutes.jsx          # Member routes
│   │   ├── staffRoutes.jsx           # Staff routes
│   │   └── adminRoutes.jsx           # Admin routes
│   │
│   ├── store/                        # Redux store
│   │   ├── index.js                  # Store configuration
│   │   └── rootReducer.js            # Root reducer
│   │
│   ├── utils/                        # Utility functions
│   │   ├── constants.js              # Constants (status, roles, etc.)
│   │   ├── validators.js             # Form validators
│   │   ├── formatters.js             # Format functions (price, date)
│   │   ├── helpers.js                # Helper functions
│   │   ├── storage.js                # LocalStorage/SessionStorage
│   │   ├── permissions.js            # Permission checks
│   │   └── socket.js                 # Socket.IO configuration
│   │
│   ├── App.jsx                       # Main App component
│   ├── main.jsx                      # Entry point
│   └── vite-env.d.ts                 # Vite types
│
├── .env.development                  # Development environment
├── .env.production                   # Production environment
├── .env.example                      # Environment example
├── .eslintrc.cjs                     # ESLint config
├── .gitignore                        # Git ignore
├── .prettierrc                       # Prettier config
├── components.json                   # shadcn/ui configuration
├── index.html                        # HTML entry
├── jsconfig.json                     # JavaScript config (path aliases)
├── package.json                      # Dependencies
├── postcss.config.js                 # PostCSS config
├── tailwind.config.js                # Tailwind config
├── vite.config.js                    # Vite config
└── README.md                         # Project readme
```

## Mapping Use Cases với Components/Pages

### 1. Quản lý Tài khoản (5 UC)
- **UC01**: `pages/auth/Register.jsx` + `components/auth/RegisterForm.jsx`
- **UC02**: `pages/auth/Login.jsx` + `components/auth/LoginForm.jsx`
- **UC03**: `components/auth/SocialLogin.jsx`
- **UC04**: `pages/profile/ProfilePage.jsx` + `components/user/UserProfile.jsx`
- **UC05**: `pages/transactions/TransactionHistory.jsx`

### 2. Quản lý Bài đăng (9 UC)
- **UC06**: `pages/posts/CreatePostPage.jsx` + `components/post/PostForm.jsx`
- **UC07**: `pages/posts/EditPostPage.jsx` + `components/post/PostEditForm.jsx`
- **UC08**: `components/post/PostActions.jsx` (delete action)
- **UC09**: `components/post/PostActions.jsx` (toggle active)
- **UC10**: `components/post/PostBumpButton.jsx`
- **UC11**: `pages/admin/PostModerationPage.jsx` + `components/post/PostApproval.jsx`
- **UC12**: `pages/admin/PostModerationPage.jsx` + `components/post/PostApproval.jsx`
- **UC13**: `pages/posts/MyPostsPage.jsx`
- **UC14**: `pages/posts/PostDetailPage.jsx` + `components/post/PostDetail.jsx`

### 3. Tìm kiếm và Mua hàng (9 UC)
- **UC15**: `pages/posts/PostsPage.jsx` + `components/search/SearchBar.jsx`
- **UC16**: `components/search/SearchFilters.jsx`
- **UC17**: `components/search/SortDropdown.jsx`
- **UC18**: `components/favorites/FavoriteButton.jsx`
- **UC19**: `components/favorites/FavoritesList.jsx` (remove action)
- **UC20**: `pages/posts/ComparePage.jsx` + `components/comparison/CompareTable.jsx`
- **UC21**: `components/auction/BidForm.jsx` + `components/auction/AuctionTimer.jsx`
- **UC22**: `pages/favorites/FavoritesPage.jsx`
- **UC23**: `components/lead/ScheduleViewButton.jsx`

### 4. Gói tin và Credits (3 UC)
- **UC25**: `pages/packages/PackagesPage.jsx` + `components/package/PackageList.jsx`
- **UC26**: `components/package/PurchaseButton.jsx` + `pages/transactions/CheckoutPage.jsx`
- **UC27**: `pages/packages/CreditsPage.jsx` + `components/package/CreditsDisplay.jsx`

### 5. Giao dịch và Thanh toán (3 UC)
- **UC28**: `pages/transactions/CheckoutPage.jsx` + `components/payment/PaymentForm.jsx`
- **UC29**: `components/contract/ContractSign.jsx`
- **UC30**: `pages/transactions/PaymentHistory.jsx`

### 6. Đánh giá và Phản hồi (4 UC)
- **UC31**: `components/rating/RatingForm.jsx` (for seller)
- **UC32**: `components/rating/RatingForm.jsx` (for buyer)
- **UC33**: `components/rating/RatingForm.jsx` (edit mode)
- **UC34**: `components/rating/ReplyForm.jsx`

### 7. Chat và Thông báo (4 UC)
- **UC35**: `pages/chat/ChatPage.jsx` + `components/chat/ChatWindow.jsx`
- **UC36**: `components/chat/ChatList.jsx`
- **UC37**: `pages/notifications/NotificationsPage.jsx`
- **UC38**: `components/notification/NotificationItem.jsx`

### 8. Nghiệp vụ Môi giới (7 UC)
- **UC39**: `pages/staff/StaffDashboardPage.jsx` + `components/staff/StaffDashboard.jsx`
- **UC40**: `pages/staff/StaffLeadsPage.jsx` + `components/lead/LeadList.jsx`
- **UC41**: `components/appointment/AppointmentForm.jsx`
- **UC42**: `pages/staff/StaffAppointmentsPage.jsx`
- **UC43**: `components/contract/ContractPreview.jsx`
- **UC44**: `components/lead/LeadDetail.jsx` (status update)
- **UC45**: `pages/staff/StaffPostsPage.jsx`

### 9. Quản lý Admin (5 UC)
- **UC46**: `pages/admin/LeadManagementPage.jsx` + `components/lead/LeadAssignment.jsx`
- **UC47**: `pages/admin/UserManagementPage.jsx`
- **UC48**: `pages/admin/PackageManagementPage.jsx`
- **UC49**: `pages/admin/ContractTemplatesPage.jsx`
- **UC50**: `pages/admin/ReportsPage.jsx` + `components/admin/RevenueReport.jsx`

### 10. AI Gợi ý Giá (2 UC)
- **UC51**: `components/post/PostPriceAI.jsx`
- **UC52**: Backend service (không có UI component)

## Các Thư viện Chính

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.6.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-slider": "^1.1.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^3.0.0",
    "react-dropzone": "^14.2.0",
    "recharts": "^2.10.0",
    "sonner": "^1.2.0",
    "vaul": "^0.9.0",
    "embla-carousel-react": "^8.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.54.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.1.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

## Conventions và Best Practices

### 1. Naming Conventions
- **Components**: PascalCase (e.g., `PostCard.jsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.js`)
- **Utils**: camelCase (e.g., `formatters.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `POST_STATUS`)

### 2. File Structure
- Mỗi component nên có file riêng
- Group related components vào folders
- Co-locate tests với components (nếu có)

### 3. Component Structure
```jsx
// Imports
import { useState } from 'react';
import { useSelector } from 'react-redux';

// Component
export default function ComponentName({ prop1, prop2 }) {
  // Hooks
  const state = useSelector(selectState);
  const [localState, setLocalState] = useState();
  
  // Handlers
  const handleAction = () => {};
  
  // Effects
  useEffect(() => {}, []);
  
  // Render helpers
  const renderSection = () => {};
  
  // Return JSX
  return (
    <div className="...">
      {/* Content */}
    </div>
  );
}
```

### 4. Tailwind CSS
- Sử dụng Tailwind utilities first
- shadcn/ui components đã được styled với Tailwind
- Sử dụng `cn()` helper từ `lib/utils.js` cho conditional classes
- Tận dụng Tailwind animations với `tailwindcss-animate`

### 5. State Management
- Redux Toolkit cho global state
- RTK Query cho API calls và caching
- Local state (useState) cho UI-only state
- Context API cho theme/localization

### 6. API Calls
- Tất cả API calls qua RTK Query hoặc service layer
- Centralized error handling
- Request/Response interceptors trong axios config

### 7. Socket.IO
- Centralized socket configuration trong `utils/socket.js`
- Custom hook `useSocket` cho components
- Event listeners cleanup trong useEffect

## Environment Variables

```env
# .env.development
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_PAYMENT_GATEWAY_URL=https://sandbox.vnpay.vn
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_MAX_IMAGE_SIZE=5242880
VITE_MAX_IMAGES_PER_POST=10
```

## Scripts Commands

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\""
  }
}
```

## Next Steps

1. **Setup Project**: `npm create vite@latest FE -- --template react`
2. **Install Tailwind**: Follow official Tailwind + Vite guide
3. **Setup shadcn/ui**: 
   ```bash
   npx shadcn-ui@latest init
   ```
4. **Install Dependencies**: Copy package.json and run `npm install`
5. **Add shadcn/ui Components**: 
   ```bash
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add input
   npx shadcn-ui@latest add card
   npx shadcn-ui@latest add dialog
   # ... add other components as needed
   ```
6. **Setup ESLint/Prettier**: Configure code quality tools
7. **Create Base Structure**: Create folders and base components
8. **Configure Redux**: Setup store and slices
9. **Configure Routing**: Setup React Router
10. **API Integration**: Setup Axios and RTK Query
11. **Socket.IO**: Configure real-time communication
12. **Start Development**: Begin implementing features by priority

---

**Lưu ý**: Cấu trúc này được thiết kế để scale và maintain dễ dàng. Bạn có thể bắt đầu với các features cốt lõi (Auth, Posts, Search) và mở rộng dần.
