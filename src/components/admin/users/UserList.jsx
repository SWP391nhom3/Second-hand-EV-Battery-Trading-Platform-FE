import { useState } from 'react'
import { Button } from '@/components/ui/button'
import UserStatusBadge from './UserStatusBadge'
import UserRoleBadge from './UserRoleBadge'
import UserListSkeleton from './UserListSkeleton'
import { Eye, Edit, User } from 'lucide-react'
import { format } from 'date-fns'

/**
 * UserList Component
 * Hiển thị danh sách người dùng với pagination
 */
export default function UserList({
  users = [],
  loading = false,
  onViewDetail,
  onEdit,
  pagination,
  onPageChange
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  if (loading) {
    return <UserListSkeleton rows={pagination?.pageSize || 10} />
  }

  if (users.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 animate-fade-in">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-fade-in" />
          <p className="text-sm text-gray-500">Không có người dùng nào</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SĐT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr 
                  key={user.userId} 
                  className="hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-200 hover:scale-110 cursor-pointer">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName || user.email}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 transition-colors duration-200">
                          {user.fullName || 'Chưa cập nhật'}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {user.userId.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    {user.emailVerified && (
                      <div className="text-xs text-green-600">Đã xác minh</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phoneNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserStatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetail(user.userId)}
                        className="gap-1 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                        Chi tiết
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(user)}
                        className="gap-1 transition-all duration-200 hover:bg-green-50 hover:text-green-600"
                      >
                        <Edit className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                        Sửa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between animate-fade-in">
          <p className="text-sm text-gray-600 transition-opacity duration-200">
            Hiển thị <span className="font-medium">{pagination.pageNumber * pagination.pageSize - pagination.pageSize + 1}</span>-
            <span className="font-medium">{Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)}</span> trong
            tổng số <span className="font-medium">{pagination.totalCount}</span> người dùng
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber <= 1}
              className="transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="font-medium bg-gray-50"
            >
              {pagination.pageNumber} / {pagination.totalPages}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.pageNumber + 1)}
              disabled={pagination.pageNumber >= pagination.totalPages}
              className="transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

