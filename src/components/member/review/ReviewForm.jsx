import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import StarRating from './StarRating'
import { ratingCreateRequestSchema } from '@/lib/validations/review.validations'
import { toast } from 'sonner'

/**
 * ReviewForm Component
 * Form đánh giá với star rating và comment
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback khi submit form
 * @param {string} [props.orderId] - ID đơn hàng (nếu có)
 * @param {string} [props.rateeName] - Tên người được đánh giá
 * @param {string} [props.rateeRole] - "SELLER" | "BUYER"
 * @param {boolean} [props.loading=false] - Loading state
 * @param {string} [props.className] - Additional CSS classes
 */
export default function ReviewForm({
  onSubmit,
  orderId,
  rateeName,
  rateeRole,
  loading = false,
  className
}) {
  const [rating, setRating] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(ratingCreateRequestSchema),
    defaultValues: {
      orderId: orderId || '',
      score: 0,
      comment: ''
    }
  })

  const handleRatingChange = (value) => {
    setRating(value)
    setValue('score', value, { shouldValidate: true })
  }

  const handleFormSubmit = (data) => {
    if (rating === 0) {
      toast.error('Vui lòng chọn điểm đánh giá')
      return
    }

    onSubmit({
      ...data,
      score: rating
    })
  }

  const handleReset = () => {
    setRating(0)
    reset()
  }

  const roleLabel = rateeRole === 'SELLER' ? 'người bán' : 'người mua'

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Đánh giá {roleLabel}</CardTitle>
        <CardDescription>
          {rateeName && `Đánh giá cho ${rateeName}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Order ID (hidden if provided) */}
          {orderId && (
            <input type="hidden" {...register('orderId')} value={orderId} />
          )}

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
            {rating === 0 && (
              <p className="text-sm text-muted-foreground">
                Vui lòng chọn điểm đánh giá từ 1 đến 5 sao
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Nhận xét (tùy chọn)</Label>
            <Textarea
              id="comment"
              {...register('comment')}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm, người bán/người mua, giao hàng, thanh toán..."
              rows={5}
              className="resize-none"
            />
            {errors.comment && (
              <p className="text-sm text-destructive">{errors.comment.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Nhận xét sẽ giúp người khác có thêm thông tin để quyết định
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading || rating === 0}
            >
              {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

