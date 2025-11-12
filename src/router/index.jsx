import { createBrowserRouter } from 'react-router-dom'

// Layouts
import AdminLayout from '@/layouts/AdminLayout'
import StaffLayout from '@/layouts/StaffLayout'

// Public Pages
import Home from '@/pages/Home'

// Auth Pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Post Pages
import CreatePostPage from '@/pages/posts/CreatePostPage'
import MyPostsPage from '@/pages/posts/MyPostsPage'
import PostDetailPage from '@/pages/posts/PostDetailPage'
import EditPostPage from '@/pages/posts/EditPostPage'
import PostsPage from '@/pages/posts/PostsPage'

// Search Pages
import Search from '@/pages/search/Search'

// Auction Pages
import AuctionsPage from '@/pages/auctions/AuctionsPage'

// Member Pages
import Profile from '@/pages/member/Profile'
import TransactionHistory from '@/pages/member/TransactionHistory'
import Leads from '@/pages/member/Leads'
import Favorites from '@/pages/member/Favorites'
import UserReviews from '@/pages/member/UserReviews'
import PaymentHistory from '@/pages/member/PaymentHistory'
import Payment from '@/pages/member/Payment'
import PaymentDetail from '@/pages/member/PaymentDetail'
import PaymentRedirect from '@/pages/member/PaymentRedirect'
import Contract from '@/pages/member/Contract'
import Contracts from '@/pages/member/Contracts'
import Packages from '@/pages/member/Packages'
import Credits from '@/pages/member/Credits'
import MemberChat from '@/pages/member/Chat'
import MemberNotifications from '@/pages/member/Notifications'

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard'
import VehicleManagement from '@/pages/admin/VehicleManagement'
import BatteryManagement from '@/pages/admin/BatteryManagement'
import PostManagement from '@/pages/admin/PostManagement'
import LeadManagement from '@/pages/admin/LeadManagement'
import UserManagement from '@/pages/admin/UserManagement'
import PackageManagement from '@/pages/admin/PackageManagement'
import ContractTemplateManagement from '@/pages/admin/ContractTemplateManagement'

// Staff Pages
import StaffDashboard from '@/pages/staff/Dashboard'
import StaffLeadManagement from '@/pages/staff/LeadManagement'
import ContractManagement from '@/pages/staff/ContractManagement'
import AppointmentManagement from '@/pages/staff/AppointmentManagement'
import StaffPostManagement from '@/pages/staff/PostManagement'
import StaffChat from '@/pages/staff/Chat'
import StaffNotifications from '@/pages/staff/Notifications'

// Error Pages
import Forbidden from '@/pages/Forbidden'
import ErrorPage from '@/pages/ErrorPage'

// Route Guard
import PrivateRoute from '@/components/auth/PrivateRoute'

/**
 * Router Configuration
 * Cấu hình routing cho toàn bộ app
 */
const router = createBrowserRouter([
  // ========================================
  // PUBLIC ROUTES (Không cần đăng nhập)
  // ========================================
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: '/vehicles',
    element: <div>Vehicle List - TODO</div>
  },
  {
    path: '/vehicles/:id',
    element: <div>Vehicle Detail - TODO</div>
  },
  {
    path: '/batteries',
    element: <div>Battery List - TODO</div>
  },
  {
    path: '/batteries/:id',
    element: <div>Battery Detail - TODO</div>
  },
  {
    path: '/search',
    element: <Search />
  },
  {
    path: '/auctions',
    element: <AuctionsPage />
  },
  {
    path: '/posts',
    element: <PostsPage />
  },

  // ========================================
  // AUTH ROUTES
  // ========================================
  {
    path: '/auth/login',
    element: <Login />
  },
  {
    path: '/auth/register',
    element: <Register />
  },
  {
    path: '/auth/forgot-password',
    element: <div>Forgot Password - TODO</div>
  },

  // ========================================
  // PROTECTED ROUTES (Cần đăng nhập)
  // ========================================
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    )
  },

  // Posts Routes
  {
    path: '/posts/create',
    element: (
      <PrivateRoute>
        <CreatePostPage />
      </PrivateRoute>
    )
  },
  {
    path: '/my-posts',
    element: (
      <PrivateRoute>
        <MyPostsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/posts/:id',
    element: <PostDetailPage />
  },
  {
    path: '/posts/:id/edit',
    element: (
      <PrivateRoute>
        <EditPostPage />
      </PrivateRoute>
    )
  },

  {
    path: '/my-vehicles',
    element: (
      <PrivateRoute>
        <div>My Vehicles - TODO</div>
      </PrivateRoute>
    )
  },
  {
    path: '/my-batteries',
    element: (
      <PrivateRoute>
        <div>My Batteries - TODO</div>
      </PrivateRoute>
    )
  },
  {
    path: '/transactions',
    element: (
      <PrivateRoute>
        <TransactionHistory />
      </PrivateRoute>
    )
  },
  {
    path: '/member/leads',
    element: (
      <PrivateRoute>
        <Leads />
      </PrivateRoute>
    )
  },
  {
    path: '/favorites',
    element: (
      <PrivateRoute>
        <Favorites />
      </PrivateRoute>
    )
  },
  {
    path: '/reviews/:userId',
    element: <UserReviews />
  },
  {
    path: '/packages',
    element: <Packages />
  },
  {
    path: '/member/credits',
    element: (
      <PrivateRoute>
        <Credits />
      </PrivateRoute>
    )
  },
  {
    path: '/payment-history',
    element: (
      <PrivateRoute>
        <PaymentHistory />
      </PrivateRoute>
    )
  },
  {
    path: '/payment/:paymentId/redirect',
    element: (
      <PrivateRoute>
        <PaymentRedirect />
      </PrivateRoute>
    )
  },
  {
    path: '/payment/:orderId',
    element: (
      <PrivateRoute>
        <Payment />
      </PrivateRoute>
    )
  },
  {
    path: '/payments/:id',
    element: (
      <PrivateRoute>
        <PaymentDetail />
      </PrivateRoute>
    )
  },
  {
    path: '/member/contracts',
    element: (
      <PrivateRoute>
        <Contracts />
      </PrivateRoute>
    )
  },
  {
    path: '/contracts/:contractId',
    element: (
      <PrivateRoute>
        <Contract />
      </PrivateRoute>
    )
  },
  {
    path: '/member/chat',
    element: (
      <PrivateRoute>
        <MemberChat />
      </PrivateRoute>
    )
  },
  {
    path: '/member/notifications',
    element: (
      <PrivateRoute>
        <MemberNotifications />
      </PrivateRoute>
    )
  },

  // ========================================
  // ADMIN ROUTES (Chỉ ADMIN)
  // ========================================
  {
    path: '/admin',
    element: (
      <PrivateRoute allowedRoles={['ADMIN']}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: 'vehicles',
        element: <VehicleManagement />
      },
      {
        path: 'batteries',
        element: <BatteryManagement />
      },
      {
        path: 'users',
        element: <UserManagement />
      },
      {
        path: 'staff',
        element: <div>Admin - Staff Management - TODO</div>
      },
      {
        path: 'posts',
        element: <PostManagement />
      },
      {
        path: 'leads',
        element: <LeadManagement />
      },
      {
        path: 'packages',
        element: <PackageManagement />
      },
      {
        path: 'contract-templates',
        element: <ContractTemplateManagement />
      },
      {
        path: 'messages',
        element: <div>Admin - Message Management - TODO</div>
      },
      {
        path: 'inspections',
        element: <div>Admin - Inspection Management - TODO</div>
      },
      {
        path: 'settings',
        element: <div>Admin - System Settings - TODO</div>
      }
    ]
  },

  // ========================================
  // STAFF ROUTES (STAFF only, ADMIN có thể xem)
  // ========================================
  {
    path: '/staff',
    element: (
      <PrivateRoute allowedRoles={['STAFF', 'ADMIN']}>
        <StaffLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <StaffDashboard />
      },
      {
        path: 'leads',
        element: <StaffLeadManagement />
      },
      {
        path: 'appointments',
        element: <AppointmentManagement />
      },
      {
        path: 'posts',
        element: <StaffPostManagement />
      },
      {
        path: 'contracts',
        element: <ContractManagement />
      },
      {
        path: 'chat',
        element: <StaffChat />
      },
      {
        path: 'notifications',
        element: <StaffNotifications />
      }
    ]
  },

  // ========================================
  // ERROR ROUTES
  // ========================================
  {
    path: '/403',
    element: <Forbidden />
  },
  {
    path: '*',
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-xl">Trang không tồn tại</p>
        </div>
      </div>
    )
  }
])

export default router
