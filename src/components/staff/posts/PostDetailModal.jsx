import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Battery,
  Gauge,
  Package,
  FileText,
  Users,
  Eye
} from 'lucide-react'
import PostLeadsList from './PostLeadsList'

/**
 * PostDetailModal Component for Staff
 * Modal hiển thị chi tiết bài đăng được gán cho Staff
 */
export default function PostDetailModal({
  post,
  isOpen,
  onClose,
  onViewLead
}) {
  if (!post) return null

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Liên hệ'
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(price)
    } catch (error) {
      console.error('Error formatting price:', error)
      return 'Liên hệ'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'N/A'
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      APPROVED: { label: 'Đã duyệt', variant: 'default' },
      SOLD: { label: 'Đã bán', variant: 'secondary' },
      PENDING: { label: 'Chờ duyệt', variant: 'outline' },
      DENIED: { label: 'Từ chối', variant: 'destructive' }
    }
    const statusInfo = statusMap[status] || { label: status, variant: 'outline' }
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    )
  }

  const getCategoryLabel = (categoryId) => {
    const categoryMap = {
      1: 'Xe điện',
      2: 'Pin'
    }
    return categoryMap[categoryId] || 'N/A'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Chi tiết bài đăng
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về bài đăng được gán cho bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status và Category */}
          <div className="flex gap-2 flex-wrap items-center">
            {getStatusBadge(post.status)}
            <Badge variant="outline">
              {getCategoryLabel(post.categoryId)}
            </Badge>
            {post.priorityLevel && (
              <Badge variant="outline">
                Priority: {post.priorityLevel === 3 ? 'Luxury' : post.priorityLevel === 2 ? 'Premium' : 'Basic'}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Images */}
          {post.imageUrls && post.imageUrls.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Hình ảnh</h3>
                <div className="grid grid-cols-3 gap-4">
                  {post.imageUrls.slice(0, 6).map((url, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={url}
                        alt={`${post.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.png'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Thông tin bài đăng */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Thông tin bài đăng
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tiêu đề</p>
                <p className="font-medium">{post.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Post ID</p>
                <p className="font-mono text-sm">{post.postId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Giá
                </p>
                <p className="font-bold text-primary text-lg">
                  {formatPrice(post.price)}
                </p>
              </div>
              {post.location && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Địa điểm
                  </p>
                  <p className="font-medium">{post.location}</p>
                </div>
              )}
            </div>
            {post.description && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Mô tả</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {post.description}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Thông tin sản phẩm */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thông tin sản phẩm</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Thương hiệu</p>
                <p className="font-medium">{post.brand || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{post.model || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Năm sản xuất</p>
                <p className="font-medium">{post.productionYear || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tình trạng</p>
                <p className="font-medium">{post.condition || 'N/A'}</p>
              </div>
              {post.batteryCapacityCurrent && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Battery className="h-4 w-4" />
                    Dung lượng pin (SOH)
                  </p>
                  <p className="font-medium">{post.batteryCapacityCurrent}%</p>
                </div>
              )}
              {post.mileage !== null && post.mileage !== undefined && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Gauge className="h-4 w-4" />
                    Số KM đã đi
                  </p>
                  <p className="font-medium">
                    {post.mileage.toLocaleString('vi-VN')} km
                  </p>
                </div>
              )}
              {post.chargeCount && (
                <div>
                  <p className="text-sm text-gray-500">Số lần sạc</p>
                  <p className="font-medium">{post.chargeCount}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Thông tin người bán */}
          {post.seller && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin người bán
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tên</p>
                    <p className="font-medium">{post.seller.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="font-medium">{post.seller.email || 'N/A'}</p>
                  </div>
                  {post.seller.phoneNumber && (
                    <div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        Số điện thoại
                      </p>
                      <p className="font-medium">{post.seller.phoneNumber}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Thông tin Staff Assignment */}
          {post.staffAssignment && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin Staff được gán
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tên Staff</p>
                    <p className="font-medium">{post.staffAssignment.staffName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{post.staffAssignment.staffEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Ngày gán
                    </p>
                    <p className="font-medium">
                      {formatDate(post.staffAssignment.assignedAt)}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Thông tin Subscription */}
          {post.subscription && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Thông tin gói tin
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Gói tin</p>
                    <p className="font-medium">{post.subscription.packageName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mức độ ưu tiên</p>
                    <p className="font-medium">
                      {post.subscription.priorityLevel === 3 ? 'Luxury' : 
                       post.subscription.priorityLevel === 2 ? 'Premium' : 'Basic'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Ngày áp dụng
                    </p>
                    <p className="font-medium">
                      {formatDate(post.subscription.appliedAt)}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Danh sách Leads */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Leads đang quan tâm
            </h3>
            <PostLeadsList
              postId={post.postId}
              onViewLead={onViewLead}
            />
          </div>

          <Separator />

          {/* Thông tin thời gian */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Thông tin thời gian
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Thời gian tạo</p>
                <p className="font-medium">{formatDate(post.createdAt)}</p>
              </div>
              {post.approvedAt && (
                <div>
                  <p className="text-sm text-gray-500">Thời gian duyệt</p>
                  <p className="font-medium">{formatDate(post.approvedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


