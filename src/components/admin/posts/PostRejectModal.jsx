import { useState, useEffect } from 'react'
import { XCircle, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { getImageUrl, getPlaceholderImage } from '@/utils/imageHelper'
import { postRejectSchema } from '@/lib/validations/post.validation'

/**
 * PostRejectModal Component
 * Modal nhập lý do từ chối bài đăng
 */
export default function PostRejectModal({ post, open, onClose, onConfirm, loading = false }) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setRejectionReason('')
      setError('')
    }
  }, [open])

  const handleConfirm = async () => {
    // Validate
    try {
      const validated = postRejectSchema.parse({ rejectionReason })
      setError('')
      onConfirm?.(post, validated.rejectionReason)
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message)
      } else {
        setError('Vui lòng nhập lý do từ chối')
      }
    }
  }

  if (!post) return null

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Từ chối bài đăng
          </DialogTitle>
          <DialogDescription>
            Vui lòng nhập lý do từ chối bài đăng này.
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

          {/* Rejection Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="rejectionReason">
              Lý do từ chối <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              placeholder="Nhập lý do từ chối bài đăng (tối thiểu 10 ký tự)..."
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value)
                setError('')
              }}
              rows={4}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {rejectionReason.length} / 500 ký tự (tối thiểu 10 ký tự)
            </p>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                Lưu ý: Hành động này không thể hoàn tác
              </p>
              <p className="text-xs text-red-700 mt-1">
                Bài đăng sẽ bị từ chối và người bán sẽ nhận được thông báo về lý do từ chối.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || !rejectionReason.trim()}
            variant="destructive"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

