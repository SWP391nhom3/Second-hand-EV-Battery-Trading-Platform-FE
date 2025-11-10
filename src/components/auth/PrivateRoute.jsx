import { Navigate } from 'react-router-dom'
import authService from '@/api/services/auth.service'

/**
 * PrivateRoute Component
 * Route guard để bảo vệ các route cần authentication
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Component con cần bảo vệ
 * @param {string[]} props.allowedRoles - Danh sách roles được phép truy cập
 * @param {string} props.redirectTo - Đường dẫn redirect nếu không có quyền
 */
export default function PrivateRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/auth/login' 
}) {
  const isAuthenticated = authService.isAuthenticated()
  
  // Nếu chưa đăng nhập, redirect về login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Nếu có yêu cầu role cụ thể
  if (allowedRoles.length > 0) {
    const user = authService.getUserFromStorage()
    
    // Nếu không có user data, redirect về login
    if (!user) {
      return <Navigate to={redirectTo} replace />
    }

    // Kiểm tra role
    if (!allowedRoles.includes(user.role)) {
      // Redirect về trang không có quyền
      return <Navigate to="/403" replace />
    }
  }

  // Có quyền truy cập
  return children
}

/**
 * Usage Examples:
 * 
 * 1. Chỉ cần đăng nhập:
 *    <Route
 *      path="/profile"
 *      element={
 *        <PrivateRoute>
 *          <ProfilePage />
 *        </PrivateRoute>
 *      }
 *    />
 * 
 * 2. Chỉ ADMIN:
 *    <Route
 *      path="/admin/*"
 *      element={
 *        <PrivateRoute allowedRoles={['ADMIN']}>
 *          <AdminLayout />
 *        </PrivateRoute>
 *      }
 *    />
 * 
 * 3. ADMIN hoặc STAFF:
 *    <Route
 *      path="/management/*"
 *      element={
 *        <PrivateRoute allowedRoles={['ADMIN', 'STAFF']}>
 *          <ManagementLayout />
 *        </PrivateRoute>
 *      }
 *    />
 * 
 * 4. Custom redirect:
 *    <Route
 *      path="/dashboard"
 *      element={
 *        <PrivateRoute redirectTo="/auth/login?returnUrl=/dashboard">
 *          <Dashboard />
 *        </PrivateRoute>
 *      }
 *    />
 */
