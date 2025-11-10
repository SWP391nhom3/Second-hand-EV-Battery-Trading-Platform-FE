import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Zap, Battery, CheckCircle, X, Trash2 } from 'lucide-react'
import { getImageUrl } from '@/utils/imageHelper'
import favoriteService from '@/api/services/favorite.service'
import { toast } from 'sonner'
import { useState } from 'react'

/**
 * FavoriteCard Component
 * Card hiển thị bài đăng yêu thích với nút xóa
 * @param {Object} favorite - Favorite object từ API
 * @param {Function} onRemove - Callback khi xóa favorite
 */
export default function FavoriteCard({ favorite, onRemove }) {
  const [loading, setLoading] = useState(false)
  
  // Handle both camelCase and PascalCase property names
  const favoriteId = favorite.favoriteId || favorite.FavoriteId
  const post = favorite.post || favorite.Post

  if (!post) {
    console.warn('FavoriteCard: No post data found in favorite:', favorite)
    return null
  }
  
  // Handle both camelCase and PascalCase for post properties
  const postId = post.postId || post.PostId
  const title = post.title || post.Title
  const price = post.price || post.Price
  const location = post.location || post.Location
  const brand = post.brand || post.Brand
  const model = post.model || post.Model
  const status = post.status || post.Status
  const isActive = post.isActive !== undefined ? post.isActive : (post.IsActive !== undefined ? post.IsActive : true)
  const isSold = post.isSold !== undefined ? post.isSold : (post.IsSold !== undefined ? post.IsSold : false)
  const categoryId = post.categoryId || post.CategoryId
  const thumbnailImageUrl = post.thumbnailImageUrl || post.ThumbnailImageUrl
  const productionYear = post.productionYear || post.ProductionYear

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const isVehicle = categoryId === 1
  const imageUrl = thumbnailImageUrl 
    ? getImageUrl(thumbnailImageUrl) 
    : null

  const handleRemove = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Bạn có chắc chắn muốn xóa bài đăng này khỏi danh sách yêu thích?')) {
      return
    }

    try {
      setLoading(true)
      const response = await favoriteService.removeFromFavorites(postId)
      const success = response.success || response.Success
      const message = response.message || response.Message
      
      if (success) {
        toast.success('Đã xóa khỏi danh sách yêu thích')
        if (onRemove) {
          onRemove(favoriteId)
        }
      } else {
        toast.error(message || 'Không thể xóa khỏi yêu thích')
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.Message ||
                          error.message ||
                          'Đã xảy ra lỗi. Vui lòng thử lại.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getPackageBadge = () => {
    // Priority level can be determined from post data
    // For now, we'll use a default badge
    return { label: 'Basic', className: 'bg-gray-500 text-white' }
  }

  const packageBadge = getPackageBadge()

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden relative">
      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
        onClick={handleRemove}
        disabled={loading}
        title="Xóa khỏi yêu thích"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Link to={`/posts/${postId}`} className="block">
        {/* Image Section */}
        <div className="relative h-56 bg-muted overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
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
              {packageBadge.label}
            </Badge>
          </div>

          {/* Status Badge */}
          {!isActive && (
            <div className="absolute top-3 left-20 z-10">
              <Badge variant="outline" className="bg-white/95 text-muted-foreground">
                <X className="h-3 w-3 mr-1" />
                Đã ẩn
              </Badge>
            </div>
          )}

          {isSold && (
            <div className="absolute top-3 left-20 z-10">
              <Badge variant="outline" className="bg-white/95 text-red-600 border-red-600">
                <X className="h-3 w-3 mr-1" />
                Đã bán
              </Badge>
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <p className="text-xs text-muted-foreground">Giá bán</p>
            <p className="text-lg font-bold text-primary">{formatPrice(price)}</p>
          </div>
        </div>

        {/* Content Section */}
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors pr-8">
            {title}
          </CardTitle>
          <div className="flex items-center gap-3 text-sm mt-2">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {location || 'Chưa cập nhật'}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              Năm {productionYear || 'N/A'}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Brand & Model */}
          <div className="flex items-center gap-2 pb-3 border-b">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Thương hiệu</p>
              <p className="font-semibold text-sm">{brand || 'N/A'}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="font-semibold text-sm">{model || 'N/A'}</p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2 pt-3 border-t">
            {isActive && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Đang bán
              </Badge>
            )}
            {status === 'APPROVED' && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Đã duyệt
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}


