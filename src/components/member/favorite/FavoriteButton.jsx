import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import favoriteService from '@/api/services/favorite.service'
import authService from '@/api/services/auth.service'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

/**
 * FavoriteButton Component
 * Button toggle favorite với icon heart
 * @param {string} postId - ID của bài đăng
 * @param {string} variant - Variant của button (ghost, outline, etc.)
 * @param {string} size - Size của button (sm, md, lg, icon)
 * @param {Function} onToggle - Callback khi toggle favorite
 */
export default function FavoriteButton({ 
  postId, 
  variant = 'ghost', 
  size = 'icon',
  onToggle,
  className = ''
}) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()

  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated()

  // Check favorite status on mount
  useEffect(() => {
    if (!postId) {
      console.warn('FavoriteButton: postId is missing', { postId })
      setChecking(false)
      return
    }

    if (!isAuthenticated) {
      setChecking(false)
      return
    }

    const checkFavorite = async () => {
      try {
        setChecking(true)
        console.log('FavoriteButton: Checking favorite status', { postId })
        const response = await favoriteService.isFavorite(postId)
        console.log('FavoriteButton: Check response', response)
        if (response.success) {
          setIsFavorite(response.data === true)
        }
      } catch (error) {
        console.error('FavoriteButton: Error checking favorite status', error)
        console.error('FavoriteButton: Error details', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          postId
        })
        // Silently fail - don't show error if user is not logged in
        setIsFavorite(false)
      } finally {
        setChecking(false)
      }
    }

    checkFavorite()
  }, [postId, isAuthenticated])

  const handleToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Validate postId
    if (!postId) {
      console.error('FavoriteButton: postId is missing', { postId })
      toast.error('Không tìm thấy ID bài đăng')
      return
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng yêu thích')
      navigate('/auth/login')
      return
    }

    try {
      setLoading(true)
      console.log('FavoriteButton: Toggling favorite', { postId, isFavorite })

      if (isFavorite) {
        // Remove from favorites
        console.log('FavoriteButton: Removing from favorites')
        const response = await favoriteService.removeFromFavorites(postId)
        console.log('FavoriteButton: Remove response', response)
        if (response.success) {
          setIsFavorite(false)
          toast.success('Đã xóa khỏi danh sách yêu thích')
          if (onToggle) {
            onToggle(false)
          }
        } else {
          toast.error(response.message || 'Không thể xóa khỏi yêu thích')
        }
      } else {
        // Add to favorites
        console.log('FavoriteButton: Adding to favorites')
        const response = await favoriteService.addToFavorites(postId)
        console.log('FavoriteButton: Add response', response)
        if (response.success) {
          setIsFavorite(true)
          toast.success('Đã thêm vào danh sách yêu thích')
          if (onToggle) {
            onToggle(true)
          }
        } else {
          toast.error(response.message || 'Không thể thêm vào yêu thích')
        }
      }
    } catch (error) {
      console.error('FavoriteButton: Error toggling favorite', error)
      console.error('FavoriteButton: Error details', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        postId
      })
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Don't render if still checking (to avoid flickering)
  if (checking && isAuthenticated) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
      >
        <Heart className="h-4 w-4" />
      </Button>
    )
  }

  // If size is not "icon", show text
  const showText = size !== 'icon'

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleToggle}
      disabled={loading}
      title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      <Heart 
        className={`h-4 w-4 transition-all ${
          isFavorite 
            ? 'fill-red-500 text-red-500' 
            : 'text-muted-foreground hover:text-red-500'
        } ${showText ? 'mr-2' : ''}`} 
      />
      {showText && (
        <span>{isFavorite ? 'Đã lưu' : 'Lưu'}</span>
      )}
    </Button>
  )
}

