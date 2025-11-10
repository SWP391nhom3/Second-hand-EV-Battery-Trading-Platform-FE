import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import StarRating from './StarRating'
import ReplyForm from './ReplyForm'
import EditReviewModal from './EditReviewModal'
import { MessageSquare, Edit } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import authService from '@/api/services/auth.service'
import { cn } from '@/lib/utils'

// Avatar component (fallback if not available)
const Avatar = ({ children, className }) => (
  <div className={cn('h-10 w-10 rounded-full bg-muted flex items-center justify-center', className)}>
    {children}
  </div>
)

const AvatarFallback = ({ children }) => <span className="text-sm font-medium">{children}</span>

/**
 * ReviewCard Component
 * Card hiển thị đánh giá với reply
 * 
 * @param {Object} props
 * @param {Object} props.review - RatingResponse object
 * @param {Function} [props.onReply] - Callback khi reply thành công
 * @param {Function} [props.onEdit] - Callback khi edit thành công
 * @param {boolean} [props.showReplyForm=false] - Hiển thị reply form mặc định
 * @param {string} [props.className] - Additional CSS classes
 */
export default function ReviewCard({
  review,
  onReply,
  onEdit,
  showReplyForm = false,
  className
}) {
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(showReplyForm)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const currentUser = authService.getUserData()
  const isCurrentUserRater = currentUser?.userId === review.raterId
  const isCurrentUserRatee = currentUser?.userId === review.rateeId

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name[0].toUpperCase()
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi
      })
    } catch (error) {
      return dateString
    }
  }

  const handleReplySuccess = (reply) => {
    setIsReplyFormOpen(false)
    if (onReply) {
      onReply(reply)
    }
  }

  const handleEditSuccess = (updatedReview) => {
    setIsEditModalOpen(false)
    if (onEdit) {
      onEdit(updatedReview)
    }
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{getInitials(review.raterName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{review.raterName}</h4>
                <Badge variant="outline" className="text-xs">
                  {review.rateeRole === 'SELLER' ? 'Đánh giá người bán' : 'Đánh giá người mua'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.score} size={16} />
                <span className="text-xs text-muted-foreground">
                  {formatDate(review.createdAt)}
                </span>
                {review.updatedAt && (
                  <span className="text-xs text-muted-foreground">
                    (Đã chỉnh sửa)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {isCurrentUserRater && review.canEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditModalOpen(true)}
              title="Chỉnh sửa đánh giá"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Comment */}
        {review.comment && (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {review.comment}
          </p>
        )}

        {/* Replies */}
        {review.replies && review.replies.length > 0 && (
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            {review.replies.map((reply) => (
              <div key={reply.replyId} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(reply.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{reply.userName}</span>
                      <Badge variant="secondary" className="text-xs">
                        Phản hồi
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(reply.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground pl-10 whitespace-pre-wrap">
                  {reply.replyContent}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Reply Button/Form */}
        {isCurrentUserRatee && review.replies.length === 0 && (
          <div>
            {!isReplyFormOpen ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplyFormOpen(true)}
                className="text-sm"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Phản hồi
              </Button>
            ) : (
              <ReplyForm
                ratingId={review.ratingId}
                onSuccess={handleReplySuccess}
                onCancel={() => setIsReplyFormOpen(false)}
              />
            )}
          </div>
        )}
      </CardContent>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditReviewModal
          review={review}
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </Card>
  )
}

