import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Zap, Battery, TrendingUp, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getImageUrl } from '@/utils/imageHelper'
import FavoriteButton from '@/components/member/favorite/FavoriteButton'

/**
 * PostCard Component (Public)
 * Card hiển thị bài đăng trong danh sách tìm kiếm
 */
export default function PostCard({ post, onCompare, isInCompare = false }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const isVehicle = post.categoryId === 1
  const imageUrl = post.imageUrls && post.imageUrls.length > 0 
    ? getImageUrl(post.imageUrls[0]) 
    : null

  const getPackageBadge = () => {
    const priority = post.priorityLevel || 1
    if (priority >= 3) {
      return { label: 'Luxury', className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white', icon: '👑' }
    } else if (priority >= 2) {
      return { label: 'Premium', className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white', icon: '⭐' }
    }
    return { label: 'Basic', className: 'bg-gray-500 text-white', icon: '📦' }
  }

  const packageBadge = getPackageBadge()

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
      <Link to={`/posts/${post.postId}`} className="block">
        {/* Image Section */}
        <div className="relative h-56 bg-muted overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="20"%3E' + (isVehicle ? 'Xe điện' : 'Pin') + '%3C/text%3E%3C/svg%3E'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isVehicle ? (
                <Zap className="h-24 w-24 text-muted-foreground" />
              ) : (
                <Battery className="h-24 w-24 text-muted-foreground" />
              )}
            </div>
          )}

          {/* Package Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge className={packageBadge.className}>
              {packageBadge.icon} {packageBadge.label}
            </Badge>
          </div>

          {/* Favorite Button */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton 
              postId={post.postId} 
              variant="ghost"
              size="icon"
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            />
          </div>

          {/* Auction Badge */}
          {post.auctionEnabled && (
            <div className="absolute top-3 right-12 z-10">
              <Badge variant="outline" className="bg-white text-orange-600 border-orange-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                Đấu giá
              </Badge>
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <p className="text-xs text-muted-foreground">Giá bán</p>
            <p className="text-lg font-bold text-primary">{formatPrice(post.price)}</p>
          </div>
        </div>

        {/* Content Section */}
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-3 text-sm mt-2">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {post.location || 'Chưa cập nhật'}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              Năm {post.productionYear}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Brand & Model */}
          <div className="flex items-center gap-2 pb-3 border-b">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Thương hiệu</p>
              <p className="font-semibold text-sm">{post.brand}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="font-semibold text-sm">{post.model}</p>
            </div>
          </div>

          {/* Specifications */}
          {isVehicle ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Số km đã đi</p>
                <p className="font-bold text-base">{(post.mileage || 0).toLocaleString()} km</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Tình trạng</p>
                <p className="font-semibold text-sm capitalize">{post.condition || 'N/A'}</p>
              </div>
              {post.batteryCapacityCurrent > 0 && (
                <div className="col-span-2 bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-muted-foreground mb-1">Dung lượng pin</p>
                  <p className="font-bold text-base text-green-700">{post.batteryCapacityCurrent} kWh</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-muted-foreground mb-1">Dung lượng hiện tại</p>
                <p className="font-bold text-base text-blue-700">{post.batteryCapacityCurrent} kWh</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Số lần sạc</p>
                <p className="font-bold text-base">{post.chargeCount || 'N/A'}</p>
              </div>
              <div className="col-span-2 bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Tình trạng</p>
                <p className="font-semibold text-sm capitalize">{post.condition || 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Status Badges */}
          <div className="flex gap-2 pt-3 border-t">
            {post.isActive && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Đang bán
              </Badge>
            )}
            {post.auctionEnabled && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                Đấu giá
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>

      {/* Compare Button */}
      {onCompare && (
        <div className="px-6 pb-4">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onCompare(post.postId)
            }}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isInCompare
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            {isInCompare ? '✓ Đã chọn so sánh' : 'So sánh'}
          </button>
        </div>
      )}
    </Card>
  )
}

