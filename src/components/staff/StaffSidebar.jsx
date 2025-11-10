import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Car, 
  BarChart3,
  UserCheck, 
  Calendar,
  FileText, 
  MessageSquare, 
  Bell,
  ChevronLeft,
  LogOut,
  X,
  FileCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import authService from '@/api/services/auth.service'
import { toast } from 'sonner'

/**
 * StaffSidebar Component
 * Sidebar navigation cho staff dashboard
 * Kế thừa cấu trúc từ AdminSidebar
 */
export default function StaffSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const location = useLocation()
  const navigate = useNavigate()

  const user = authService.getUserFromStorage()

  const handleLogout = () => {
    authService.logout()
    toast.success('Đăng xuất thành công!')
    navigate('/auth/login')
  }

  // Menu items cho Staff dựa trên các UC
  const menuItems = [
    {
      title: 'Dashboard',
      icon: BarChart3,
      path: '/staff',
      exact: true,
      description: 'Tổng quan công việc'
    },
    {
      title: 'Quản lý Lead',
      icon: UserCheck,
      path: '/staff/leads',
      description: 'Danh sách Lead được gán (UC40, UC44)'
    },
    {
      title: 'Quản lý Lịch hẹn',
      icon: Calendar,
      path: '/staff/appointments',
      description: 'Tạo và quản lý lịch hẹn (UC41, UC42)',
      badge: null // Có thể thêm số lịch hẹn sắp tới
    },
    // {
    //   title: 'Quản lý Bài đăng',
    //   icon: FileText,
    //   path: '/staff/posts',
    //   description: 'Bài đăng được gán (UC45)'
    // },
    {
      title: 'Hợp đồng',
      icon: FileCheck,
      path: '/staff/contracts',
      description: 'Soạn thảo hợp đồng (UC43)'
    },
    {
      title: 'Chat',
      icon: MessageSquare,
      path: '/staff/chat',
      description: 'Chat với Buyer và Seller (UC35, UC36)',
      badge: null // Có thể thêm số tin nhắn chưa đọc
    },
    {
      title: 'Thông báo',
      icon: Bell,
      path: '/staff/notifications',
      description: 'Xem thông báo (UC37, UC38)',
      badge: null // Có thể thêm số thông báo chưa đọc
    }
  ]

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <Link 
              to="/staff" 
              className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold text-gray-900">Staff</span>
              )}
            </Link>
            
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Desktop Collapse Button */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft 
                className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>

          {/* User Info */}
          <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'hidden' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user?.fullName?.charAt(0) || 'S'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullName || 'Staff'}
                </p>
                <p className="text-xs text-gray-500">STAFF</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path, item.exact)
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose?.()}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${active 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                    relative
                  `}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                        <Badge 
                          variant={active ? 'secondary' : 'destructive'}
                          className="ml-auto"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className={`w-full justify-start gap-3 ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>Đăng xuất</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

