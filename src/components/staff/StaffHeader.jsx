import { Menu, Search, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import NotificationDropdown from '@/components/staff/notifications/NotificationDropdown'

/**
 * StaffHeader Component
 * Header bar cho staff dashboard
 * Kế thừa cấu trúc từ AdminHeader với các tính năng bổ sung
 */
export default function StaffHeader({ onMenuClick, isCollapsed }) {
  // TODO: Lấy số tin nhắn chưa đọc từ API
  const unreadMessageCount = 0

  return (
    <header className={`h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-30 transition-all duration-300 ${
      isCollapsed ? 'lg:left-20' : 'lg:left-64'
    }`}>
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="hidden md:block relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm Lead, Bài đăng..."
              className="pl-10 h-9 border-gray-300"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Messages Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            asChild
          >
            <Link to="/staff/chat">
              <MessageSquare className="h-5 w-5" />
              {unreadMessageCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  variant="destructive"
                >
                  {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

