import { useState, useEffect, useCallback } from 'react'
import { Users } from 'lucide-react'
import UserList from '@/components/admin/users/UserList'
import UserFilter from '@/components/admin/users/UserFilter'
import UserDetailModal from '@/components/admin/users/UserDetailModal'
import UserEditModal from '@/components/admin/users/UserEditModal'
import adminUserService from '@/api/services/adminUser.service'
import { toast } from 'sonner'

/**
 * UserManagement Page
 * Trang quản lý người dùng (UC47)
 */
export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [filters, setFilters] = useState({
    keyword: null,
    role: null,
    status: null
  })
  const [searchKeyword, setSearchKeyword] = useState('') // Local state for search input
  const [isSearching, setIsSearching] = useState(false) // Track if search is being debounced
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // Modal states
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Debounce search keyword
  useEffect(() => {
    if (searchKeyword) {
      setIsSearching(true)
    }
    
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        keyword: searchKeyword || null
      }))
      setCurrentPage(1) // Reset to first page when search changes
      setIsSearching(false)
    }, 500) // 500ms delay

    return () => {
      clearTimeout(timer)
      setIsSearching(false)
    }
  }, [searchKeyword])

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      
      // Chỉ gửi filter khi có giá trị (không phải null/undefined)
      const params = {
        pageNumber: currentPage,
        pageSize: pageSize
      }
      
      if (filters.keyword) {
        params.keyword = filters.keyword
      }
      if (filters.role) {
        params.role = filters.role
      }
      if (filters.status) {
        params.status = filters.status
      }

      const response = await adminUserService.getUsers(params)
      
      if (response && response.success) {
        // Response structure: { success, message, data: [...], pageNumber, pageSize, totalCount, totalPages }
        const usersArray = Array.isArray(response.data) ? response.data : []
        
        setUsers(usersArray)
        setPagination({
          pageNumber: response.pageNumber || 1,
          pageSize: response.pageSize || 10,
          totalCount: response.totalCount || 0,
          totalPages: response.totalPages || 1
        })
      } else {
        toast.error(response?.message || 'Không thể tải danh sách người dùng')
        setUsers([])
        setPagination(null)
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error(error?.response?.data?.message || 'Đã xảy ra lỗi khi tải danh sách người dùng')
      setUsers([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, filters.keyword, filters.role, filters.status])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleFilterChange = (newFilters) => {
    // Nếu là keyword, cập nhật searchKeyword thay vì filters trực tiếp
    if (newFilters.hasOwnProperty('keyword')) {
      setSearchKeyword(newFilters.keyword || '')
    } else {
      setFilters((prev) => ({ ...prev, ...newFilters }))
      setCurrentPage(1) // Reset to first page when filter changes
    }
  }

  const handleResetFilters = () => {
    setSearchKeyword('')
    setFilters({
      keyword: null,
      role: null,
      status: null
    })
    setCurrentPage(1)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleViewDetail = (userId) => {
    setSelectedUserId(userId)
    setDetailModalOpen(true)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleEditSuccess = (updatedUser) => {
    // Update user in list
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.userId === updatedUser.userId ? updatedUser : u
      )
    )
    loadUsers() // Reload to get latest data
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-in-right">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-6 w-6 transition-transform duration-200 hover:scale-110" />
          Quản lý người dùng
        </h1>
        <p className="text-gray-600 mt-1">
          Quản lý tất cả người dùng trong hệ thống
        </p>
      </div>

      {/* Filters */}
      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <UserFilter
          filters={{ ...filters, keyword: searchKeyword }}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          isSearching={isSearching}
        />
      </div>

      {/* User List */}
      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <UserList
          users={users}
          loading={loading || isSearching}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      <UserDetailModal
        userId={selectedUserId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onEdit={handleEdit}
      />

      <UserEditModal
        user={selectedUser}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}

