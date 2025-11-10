import { useState, useEffect } from 'react'
import ReviewCard from './ReviewCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import ratingService from '@/api/services/rating.service'
import { toast } from 'sonner'

/**
 * ReviewList Component
 * Danh sách đánh giá với pagination
 * 
 * @param {Object} props
 * @param {Object} [props.filters] - Filters for search
 * @param {string} [props.filters.rateeId] - UUID người được đánh giá
 * @param {string} [props.filters.orderId] - UUID đơn hàng
 * @param {string} [props.filters.rateeRole] - "SELLER" | "BUYER"
 * @param {number} [props.filters.minScore] - Điểm số tối thiểu
 * @param {number} [props.filters.maxScore] - Điểm số tối đa
 * @param {number} [props.pageSize=10] - Số item mỗi trang
 * @param {Function} [props.onReviewUpdate] - Callback khi review được update
 * @param {string} [props.className] - Additional CSS classes
 */
export default function ReviewList({
  filters = {},
  pageSize = 10,
  onReviewUpdate,
  className
}) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchReviews()
  }, [pageNumber, filters])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await ratingService.getRatings({
        ...filters,
        pageNumber,
        pageSize
      })

      if (response.success) {
        setReviews(response.data.items || [])
        setTotalPages(response.data.totalPages || 1)
        setTotalCount(response.data.totalCount || 0)
      } else {
        setError(response.message || 'Không thể tải danh sách đánh giá')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setError(error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
      toast.error('Không thể tải danh sách đánh giá')
    } finally {
      setLoading(false)
    }
  }

  const handleReplySuccess = (reply) => {
    // Refresh reviews to get updated data
    fetchReviews()
    if (onReviewUpdate) {
      onReviewUpdate()
    }
  }

  const handleEditSuccess = (updatedReview) => {
    // Update the review in the list
    setReviews((prev) =>
      prev.map((review) =>
        review.ratingId === updatedReview.ratingId ? updatedReview : review
      )
    )
    if (onReviewUpdate) {
      onReviewUpdate()
    }
  }

  const handlePageChange = (newPage) => {
    setPageNumber(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && reviews.length === 0) {
    return (
      <div className={className}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-lg">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className={className}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Chưa có đánh giá nào</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.ratingId}
            review={review}
            onReply={handleReplySuccess}
            onEdit={handleEditSuccess}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Hiển thị {reviews.length} / {totalCount} đánh giá
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pageNumber - 1)}
              disabled={pageNumber === 1 || loading}
            >
              Trước
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                let page
                if (totalPages <= 5) {
                  page = index + 1
                } else if (pageNumber <= 3) {
                  page = index + 1
                } else if (pageNumber >= totalPages - 2) {
                  page = totalPages - 4 + index
                } else {
                  page = pageNumber - 2 + index
                }

                return (
                  <Button
                    key={page}
                    variant={pageNumber === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pageNumber + 1)}
              disabled={pageNumber === totalPages || loading}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

