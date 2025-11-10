import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getImageUrl, getPlaceholderImage } from '@/utils/imageHelper'

/**
 * PostApproveModal Component
 * Modal xác nhận duyệt bài đăng
 */
export default function PostApproveModal({ post, open, onClose, onConfirm, loading = false }) {
  if (!post) return null

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleConfirm = () => {
    onConfirm?.(post)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Duyệt bài đăng
          </DialogTitle>
          <DialogDescription>
            Xác nhận duyệt bài đăng này? Staff sẽ được tự động gán khi có người yêu cầu tư vấn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Post Info */}
          <div className="flex gap-4">
            <img
              src={post.thumbnailUrl ? getImageUrl(post.thumbnailUrl) : getPlaceholderImage()}
              alt={post.title}
              className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
              onError={(e) => {
                e.target.src = getPlaceholderImage()
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {post.brand} {post.model}
              </p>
              <p className="text-lg font-bold text-primary mt-2">
                {formatPrice(post.price)}
              </p>
            </div>
          </div>

          {/* Warning */}
          {!post.hasProofImage && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Bài đăng này thiếu ảnh bằng chứng SOH/KM
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Bạn có chắc chắn muốn duyệt bài đăng này?
                </p>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Staff sẽ được tự động gán khi có người yêu cầu tư vấn (tạo Lead).
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận duyệt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

