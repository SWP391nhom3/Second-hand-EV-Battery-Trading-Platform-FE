import { MapPin, Calendar, DollarSign, Eye, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * PostCard Component for Staff
 * Component hiển thị thông tin bài đăng dạng card
 */
export default function PostCard({ post, leadsCount = 0, onViewDetail }) {
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Liên hệ'
    try {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price
      if (isNaN(numPrice)) return 'Liên hệ'
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(numPrice)
    } catch (error) {
      console.error('Error formatting price:', error, price)
      return 'Liên hệ'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date:', error, dateString)
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
    <Card className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
              {post.title || 'N/A'}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(post.status)}
              <Badge variant="outline">
                {getCategoryLabel(post.categoryId)}
              </Badge>
            </div>
          </div>
          {post.imageUrls && post.imageUrls.length > 0 && (
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={post.imageUrls[0]}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-image.png'
                }}
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Price */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="text-lg font-bold text-primary">
            {formatPrice(post.price)}
          </span>
        </div>

        {/* Brand & Model */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">{post.brand}</span>
          {post.model && <span> - {post.model}</span>}
        </div>

        {/* Location */}
        {post.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{post.location}</span>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          {post.productionYear && (
            <div>Năm SX: {post.productionYear}</div>
          )}
          {post.batteryCapacityCurrent && (
            <div>SOH: {post.batteryCapacityCurrent}%</div>
          )}
          {post.mileage !== null && post.mileage !== undefined && (
            <div>KM: {post.mileage.toLocaleString('vi-VN')}</div>
          )}
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(post.createdAt)}</span>
        </div>

        {/* Leads Count */}
        {leadsCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Users className="h-4 w-4" />
            <span>{leadsCount} Lead{leadsCount > 1 ? 's' : ''} đang quan tâm</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-sm"
          onClick={() => onViewDetail(post)}
        >
          <Eye className="h-4 w-4" />
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  )
}


