import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * StarRating Component
 * Component hiển thị đánh giá sao (1-5)
 * 
 * @param {Object} props
 * @param {number} props.rating - Điểm số (1-5)
 * @param {number} [props.maxRating=5] - Điểm tối đa (default: 5)
 * @param {number} [props.size=20] - Kích thước icon (default: 20)
 * @param {boolean} [props.interactive=false] - Có thể click để chọn không
 * @param {Function} [props.onRatingChange] - Callback khi rating thay đổi (chỉ khi interactive)
 * @param {string} [props.className] - Additional CSS classes
 */
export default function StarRating({
  rating = 0,
  maxRating = 5,
  size = 20,
  interactive = false,
  onRatingChange,
  className
}) {
  const handleStarClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleStarHover = (value) => {
    // Optional: Add hover effect for interactive mode
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= rating

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            disabled={!interactive}
            className={cn(
              'transition-colors',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default'
            )}
            aria-label={`${starValue} sao`}
          >
            <Star
              size={size}
              className={cn(
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-300 text-gray-300',
                interactive && 'hover:fill-yellow-300 hover:text-yellow-300'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

