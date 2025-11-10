import { useState } from 'react'
import { Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getImageUrl, getPlaceholderImage } from '@/utils/imageHelper'
import { PostSkeletonList } from './PostSkeleton'
import LoadingSpinner from './LoadingSpinner'

/**
 * PostPendingList Component
 * Hiển thị danh sách bài đăng chờ duyệt
 */
export default function PostPendingList({
  posts = [],
  loading = false,
  onViewDetail,
  onApprove,
  onReject,
  pagination,
  onPageChange
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in-50 duration-300">
        <PostSkeletonList count={5} />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 animate-in fade-in-50 duration-300">
        <Clock className="h-16 w-16 mb-4 text-gray-300 animate-pulse" />
        <p className="text-lg font-medium mb-1">Không có bài đăng nào</p>
        <p className="text-sm text-gray-400">Chưa có bài đăng trong danh mục này</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {/* Posts List */}
      <div className="space-y-3">
        {posts.map((post, index) => (
          <div
            key={post.postId}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 hover:border-primary/20 animate-in fade-in-50 slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <img
                  src={post.thumbnailUrl ? getImageUrl(post.thumbnailUrl) : getPlaceholderImage()}
                  alt={post.title}
                  className="h-24 w-24 md:h-32 md:w-32 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage()
                  }}
                />
              </div>

              {/* Post Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {post.brand} {post.model}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{post.categoryName}</Badge>
                      {!post.hasProofImage && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Thiếu ảnh bằng chứng
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(post.price)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Người bán:</span> {post.sellerName}
                  </p>
                  <p className="text-xs text-gray-500">{post.sellerEmail}</p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail?.(post.postId)}
                    className="gap-2 transition-all duration-200 hover:scale-105"
                  >
                    <Eye className="h-4 w-4" />
                    Xem chi tiết
                  </Button>
                  {/* Show Approve/Reject buttons if callbacks are provided
                      For pending posts (from pending endpoint), status might not exist, so show buttons if callbacks exist
                      For approved/rejected posts, only show if status is PENDING */}
                  {onApprove && onReject && (!post.status || post.status === 'PENDING') && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onApprove?.(post)}
                        className="gap-2 bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Duyệt
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onReject?.(post)}
                        className="gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <XCircle className="h-4 w-4" />
                        Từ chối
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 animate-in fade-in-50 duration-300">
          <div className="text-sm text-gray-600">
            Trang <span className="font-semibold">{pagination.pageNumber}</span> / {pagination.totalPages} 
            <span className="text-gray-400 ml-1">({pagination.totalCount} bài đăng)</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber <= 1}
              className="transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.pageNumber + 1)}
              disabled={pagination.pageNumber >= pagination.totalPages}
              className="transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

