import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ratingReplyRequestSchema } from '@/lib/validations/review.validations'
import ratingService from '@/api/services/rating.service'
import { toast } from 'sonner'

/**
 * ReplyForm Component
 * Form phản hồi đánh giá
 * 
 * @param {Object} props
 * @param {string} props.ratingId - UUID của đánh giá
 * @param {Function} props.onSuccess - Callback khi reply thành công
 * @param {Function} [props.onCancel] - Callback khi cancel
 * @param {string} [props.className] - Additional CSS classes
 */
export default function ReplyForm({
  ratingId,
  onSuccess,
  onCancel,
  className
}) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(ratingReplyRequestSchema),
    defaultValues: {
      replyContent: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      const response = await ratingService.replyToRating(ratingId, data)

      if (response.success) {
        toast.success('Phản hồi thành công')
        reset()
        if (onSuccess) {
          onSuccess(response.data)
        }
      } else {
        toast.error(response.message || 'Không thể gửi phản hồi')
      }
    } catch (error) {
      console.error('Error replying to rating:', error)
      toast.error(
        error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="replyContent">
          Phản hồi đánh giá <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="replyContent"
          {...register('replyContent')}
          placeholder="Nhập phản hồi của bạn..."
          rows={3}
          className="resize-none"
        />
        {errors.replyContent && (
          <p className="text-sm text-destructive">{errors.replyContent.message}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
        </Button>
      </div>
    </form>
  )
}

