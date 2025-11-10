import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import UserStatusBadge from './UserStatusBadge'
import UserRoleBadge from './UserRoleBadge'
import adminUserService from '@/api/services/adminUser.service'
import { toast } from 'sonner'
import { 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Calendar, 
  CheckCircle2, 
  FileText,
  CreditCard,
  ShoppingCart,
  TrendingUp,
  UserCircle
} from 'lucide-react'

/**
 * UserDetailModal Component
 * Hiển thị chi tiết người dùng
 */
export default function UserDetailModal({ userId, open, onOpenChange, onEdit }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && userId) {
      loadUserDetail()
    } else {
      // Reset user when modal closes
      setUser(null)
    }
  }, [open, userId])

  const loadUserDetail = async () => {
    try {
      setLoading(true)
      const response = await adminUserService.getUserById(userId)
      if (response.success) {
        setUser(response.data)
      } else {
        toast.error(response.message || 'Không thể tải thông tin người dùng')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải thông tin người dùng')
      console.error('Error loading user detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>
              Đang tải thông tin người dùng...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-primary/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="text-sm text-gray-500 animate-pulse">Đang tải...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
          <DialogDescription>
            Chi tiết thông tin tài khoản người dùng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 animate-fade-in">
          {/* Header với Avatar và Badges */}
          <div className="flex items-start gap-6 pb-6 border-b">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center transition-transform duration-200 hover:scale-105 shadow-lg">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName || user.email}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-primary" />
                )}
              </div>
              {user.emailVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {user.fullName || 'Chưa cập nhật tên'}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <UserRoleBadge role={user.role} />
                  <UserStatusBadge status={user.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Thông tin liên hệ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                  {user.emailVerified && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Đã xác minh
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.phoneNumber || 'Chưa cập nhật'}
                  </p>
                </div>
              </div>

              {user.address && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 md:col-span-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.address}
                    </p>
                  </div>
                </div>
              )}

              {user.idNumber && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 md:col-span-2">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <UserCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">CMND/CCCD</p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.idNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Thông tin tài khoản */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Thông tin tài khoản
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Ngày tạo tài khoản</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatShortDate(user.createdAt)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              {user.updatedAt && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Cập nhật lần cuối</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatShortDate(user.updatedAt)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(user.updatedAt)}
                    </p>
                  </div>
                </div>
              )}

              {user.emailVerifiedAt && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Email xác minh lúc</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatShortDate(user.emailVerifiedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Thống kê */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Thống kê
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{user.totalPosts || 0}</p>
                    <p className="text-xs text-gray-600">Tổng bài đăng</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg border border-green-200/50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{user.activePosts || 0}</p>
                    <p className="text-xs text-gray-600">Đang hoạt động</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{user.totalLeads || 0}</p>
                    <p className="text-xs text-gray-600">Tổng Lead</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg border border-orange-200/50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{user.totalOrders || 0}</p>
                    <p className="text-xs text-gray-600">Tổng đơn hàng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="transition-all duration-200 hover:bg-gray-50"
          >
            Đóng
          </Button>
          <Button 
            onClick={() => {
              onEdit(user)
              onOpenChange(false)
            }}
            className="transition-all duration-200 hover:shadow-md"
          >
            Chỉnh sửa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

