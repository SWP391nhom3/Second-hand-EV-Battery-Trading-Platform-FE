import { useState, useEffect } from 'react'
import { X, Calendar, User, Mail, Phone, MapPin, Package, CheckCircle, XCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getImageUrl, getPlaceholderImage } from '@/utils/imageHelper'
import adminPostService from '@/api/services/adminPost.service'
import LoadingSpinner from './LoadingSpinner'

/**
 * PostDetailModal Component
 * Modal hiển thị chi tiết bài đăng
 */
export default function PostDetailModal({ postId, open, onClose, onApprove, onReject }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open && postId) {
      fetchPostDetail()
    }
    // Reset state when modal closes
    if (!open) {
      setPost(null)
      setError(null)
      setLoading(false)
    }
  }, [open, postId])

  const fetchPostDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminPostService.getPostById(postId)
      if (response.success) {
        setPost(response.data)
      } else {
        setError(response.message || 'Không thể tải chi tiết bài đăng')
      }
    } catch (error) {
      console.error('Error fetching post detail:', error)
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi tải chi tiết bài đăng')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'Chờ duyệt', variant: 'secondary', icon: Calendar },
      APPROVED: { label: 'Đã duyệt', variant: 'default', icon: CheckCircle },
      DENIED: { label: 'Từ chối', variant: 'destructive', icon: XCircle }
    }
    const config = statusConfig[status] || statusConfig.PENDING
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Chi tiết bài đăng</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết và thực hiện các thao tác duyệt/từ chối
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {loading ? (
          <LoadingSpinner 
            size="lg" 
            text="Đang tải chi tiết bài đăng..." 
            className="py-12"
          />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 animate-in fade-in-50 duration-300">
            <div className="text-red-600 mb-4 text-center">{error}</div>
            <Button 
              variant="outline" 
              onClick={fetchPostDetail}
              className="transition-all duration-200 hover:scale-105"
            >
              Thử lại
            </Button>
          </div>
        ) : post ? (
          <div className="space-y-6 pb-4 animate-in fade-in-50 duration-300">
            {/* Header */}
            <div className="flex items-start justify-between animate-in slide-in-from-top-4 duration-300">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                <p className="text-gray-600 mt-1">{post.brand} {post.model}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(post.status || 'PENDING')}
                {/* Show approve/reject buttons if status is PENDING or undefined (pending posts from pending endpoint don't have status field) */}
                {(!post.status || post.status === 'PENDING') && onApprove && onReject && (
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        onApprove(post)
                        onClose()
                      }}
                      className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Duyệt
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        onReject(post)
                        onClose()
                      }}
                      className="transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Từ chối
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Hình ảnh</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {post.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={getImageUrl(url)}
                      alt={`${post.title} - ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = getPlaceholderImage()
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Proof Image */}
            {post.proofImageUrl && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Ảnh bằng chứng SOH/KM</h3>
                <img
                  src={getImageUrl(post.proofImageUrl)}
                  alt="Proof"
                  className="h-48 w-auto rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage()
                  }}
                />
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin cơ bản</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá:</span>
                    <span className="font-semibold text-primary">{formatPrice(post.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Danh mục:</span>
                    <span>{post.categoryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Địa điểm:</span>
                    <span>{post.location || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tình trạng:</span>
                    <span>{post.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Năm sản xuất:</span>
                    <span>{post.productionYear}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông số kỹ thuật</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dung lượng pin:</span>
                    <span>{post.batteryCapacityCurrent} kWh</span>
                  </div>
                  {post.chargeCount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số lần sạc:</span>
                      <span>{post.chargeCount}</span>
                    </div>
                  )}
                  {post.mileage && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số KM:</span>
                      <span>{post.mileage.toLocaleString('vi-VN')} km</span>
                    </div>
                  )}
                  {post.priorityLevel && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mức độ ưu tiên:</span>
                      <Badge variant="outline">Level {post.priorityLevel}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {post.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Mô tả</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{post.description}</p>
              </div>
            )}

            {/* Seller Info */}
            {post.seller && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin người bán</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{post.seller.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{post.seller.email}</span>
                  </div>
                  {post.seller.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{post.seller.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Subscription Info */}
            {post.subscription && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Gói tin đã sử dụng</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tên gói:</span>
                    <span className="font-semibold">{post.subscription.packageName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mức độ ưu tiên:</span>
                    <Badge variant="outline">Level {post.subscription.priorityLevel}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày áp dụng:</span>
                    <span>{formatDate(post.subscription.appliedAt)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Staff Assignment */}
            {post.staffAssignment && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Staff được gán</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tên Staff:</span>
                    <span className="font-semibold">{post.staffAssignment.staffName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{post.staffAssignment.staffEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày gán:</span>
                    <span>{formatDate(post.staffAssignment.assignedAt)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Approval/Rejection Info */}
            {post.approvedBy && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin duyệt</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Người duyệt:</span>
                    <span>{post.approvedBy.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{post.approvedBy.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span>{formatDate(post.approvedAt)}</span>
                  </div>
                </div>
              </div>
            )}

            {post.rejectedBy && (
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin từ chối</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Người từ chối:</span>
                    <span>{post.rejectedBy.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{post.rejectedBy.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span>{formatDate(post.rejectedAt)}</span>
                  </div>
                  {post.rejectionReason && (
                    <div className="mt-2">
                      <span className="text-gray-600 block mb-1">Lý do:</span>
                      <p className="text-red-700 bg-white p-2 rounded border border-red-200">
                        {post.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0 mt-4">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Không tìm thấy bài đăng</div>
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

