import { User, Mail, Phone, MapPin, CreditCard, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * UC04: ProfileView Component
 * Component xem thông tin cá nhân (read-only)
 */
export default function ProfileView({ userData }) {
  if (!userData) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có dữ liệu người dùng
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Avatar and Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            {userData.avatarUrl ? (
              <img
                src={userData.avatarUrl}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {userData.fullName || 'Chưa cập nhật'}
              </h3>
              <p className="text-gray-500">{userData.email}</p>
              <div className="mt-2">
                <Badge variant={userData.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {userData.status}
                </Badge>
                <Badge variant="outline" className="ml-2">
                  {userData.role}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="font-medium">{userData.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Địa chỉ</p>
              <p className="font-medium">{userData.address || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identity Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin định danh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Số CMND/CCCD</p>
              <p className="font-medium">
                {userData.idNumber ? '***' + userData.idNumber.slice(-4) : 'Chưa cập nhật'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
              <p className="font-medium">{formatDate(userData.createdAt)}</p>
            </div>
          </div>
          {userData.emailVerified && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email đã xác thực</p>
                <p className="font-medium text-green-600">
                  {formatDate(userData.emailVerifiedAt)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics (if available) */}
      {/* {(userData.totalPosts !== undefined || userData.totalLeads !== undefined) && (
        <Card>
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userData.totalPosts !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Tổng bài đăng</p>
                  <p className="text-2xl font-bold">{userData.totalPosts}</p>
                </div>
              )}
              {userData.activePosts !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Bài đăng đang hoạt động</p>
                  <p className="text-2xl font-bold">{userData.activePosts}</p>
                </div>
              )}
              {userData.totalLeads !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Tổng Lead</p>
                  <p className="text-2xl font-bold">{userData.totalLeads}</p>
                </div>
              )}
              {userData.totalOrders !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold">{userData.totalOrders}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )} */}
    </div>
  )
}


