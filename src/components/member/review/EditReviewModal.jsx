import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import StarRating from './StarRating'
import { ratingUpdateRequestSchema } from '@/lib/validations/review.validations'
import ratingService from '@/api/services/rating.service'
import { toast } from 'sonner'

/**
 * EditReviewModal Component
 * Modal chỉnh sửa đánh giá (chỉ trong 7 ngày)
 * 
 * @param {Object} props
 * @param {Object} props.review - RatingResponse object
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onClose - Callback khi close modal
 * @param {Function} props.onSuccess - Callback khi edit thành công
 */
export default function EditReviewModal({
  review,
  open,
  onClose,
  onSuccess
}) {
  const [rating, setRating] = useState(review?.score || 0)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(ratingUpdateRequestSchema),
    defaultValues: {
      score: review?.score || 0,
      comment: review?.comment || ''
    }
  })

  useEffect(() => {
    if (review) {
      setRating(review.score || 0)
      reset({
        score: review.score || 0,
        comment: review.comment || ''
      })
    }
  }, [review, reset])

  const handleRatingChange = (value) => {
    setRating(value)
    setValue('score', value, { shouldValidate: true })
  }

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error('Vui lòng chọn điểm đánh giá')
      return
    }

    try {
      setLoading(true)

      const response = await ratingService.updateRating(review.ratingId, {
        ...data,
        score: rating
      })

      if (response.success) {
        toast.success('Cập nhật đánh giá thành công')
        if (onSuccess) {
          onSuccess(response.data)
        }
        onClose()
      } else {
        toast.error(response.message || 'Không thể cập nhật đánh giá')
      }
    } catch (error) {
      console.error('Error updating rating:', error)
      toast.error(
        error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!review) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
          <DialogDescription>
            {review.canEdit
              ? 'Bạn có thể chỉnh sửa đánh giá trong vòng 7 ngày kể từ khi tạo'
              : 'Bạn không thể chỉnh sửa đánh giá này. Đã quá 7 ngày kể từ khi tạo'}
          </DialogDescription>
        </DialogHeader>

        {review.canEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating Selection */}
            <div className="space-y-2">
              <Label htmlFor="rating">
                Điểm đánh giá <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={rating}
                  interactive={true}
                  onRatingChange={handleRatingChange}
                  size={32}
                />
                <span className="text-sm text-muted-foreground">
                  {rating > 0 ? `${rating} / 5 sao` : 'Chọn điểm đánh giá'}
                </span>
              </div>
              {errors.score && (
                <p className="text-sm text-destructive">{errors.score.message}</p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Nhận xét (tùy chọn)</Label>
              <Textarea
                id="comment"
                {...register('comment')}
                placeholder="Chia sẻ trải nghiệm của bạn..."
                rows={5}
                className="resize-none"
              />
              {errors.comment && (
                <p className="text-sm text-destructive">{errors.comment.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading || rating === 0}>
                {loading ? 'Đang cập nhật...' : 'Cập nhật đánh giá'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bạn không thể chỉnh sửa đánh giá này vì đã quá 7 ngày kể từ khi tạo.
            </p>
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

