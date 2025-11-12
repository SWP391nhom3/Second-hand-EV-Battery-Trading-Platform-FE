import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Car, 
  Battery, 
  Users, 
  UserCog, 
  FileText, 
  MessageSquare, 
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  LogOut,
  Menu,
  X,
  UserCheck,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import authService from '@/api/services/auth.service'
import { toast } from 'sonner'

/**
 * AdminSidebar Component
 * Sidebar navigation cho admin dashboard
 */
export default function AdminSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const location = useLocation()
  const navigate = useNavigate()

  const user = authService.getUserFromStorage()

  const handleLogout = () => {
    authService.logout()
    toast.success('Đăng xuất thành công!')
    navigate('/auth/login')
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: BarChart3,
      path: '/admin',
      exact: true
    },
    {
      title: 'Quản lý người dùng',
      icon: Users,
      path: '/admin/users'
    },
    {
      title: 'Quản lý tin đăng',
      icon: FileText,
      path: '/admin/posts'
    },
    {
      title: 'Quản lý Lead',
      icon: UserCheck,
      path: '/admin/leads'
    },
    {
      title: 'Quản lý gói tin',
      icon: Package,
      path: '/admin/packages'
    },
    {
      title: 'Quản lý mẫu hợp đồng',
      icon: FileText,
      path: '/admin/contract-templates'
    },
    // {
    //   title: 'Tin nhắn',
    //   icon: MessageSquare,
    //   path: '/admin/messages'
    // },
    // {
    //   title: 'Kiểm định',
    //   icon: ShieldCheck,
    //   path: '/admin/inspections'
    // },
    // {
    //   title: 'Cài đặt',
    //   icon: Settings,
    //   path: '/admin/settings'
    // }
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
              to="/admin" 
              className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Car className="h-6 w-6 text-primary" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold text-gray-900">Admin</span>
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
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {user?.fullName?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullName || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">{user?.role || 'ADMIN'}</p>
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
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
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
