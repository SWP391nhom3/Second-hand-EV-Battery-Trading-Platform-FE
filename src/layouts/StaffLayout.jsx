import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import StaffSidebar from '@/components/staff/StaffSidebar'
import StaffHeader from '@/components/staff/StaffHeader'

/**
 * StaffLayout Component
 * Layout wrapper cho tất cả trang staff
 * Kế thừa từ AdminLayout với cấu trúc tương tự
 * Bao gồm: Sidebar (collapsible) + Header + Main Content
 */
export default function StaffLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <StaffSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Header */}
      <StaffHeader 
        onMenuClick={() => setIsSidebarOpen(true)}
        isCollapsed={isCollapsed}
      />

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

