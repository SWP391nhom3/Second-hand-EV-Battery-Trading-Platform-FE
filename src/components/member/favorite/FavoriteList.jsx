import { useState, useEffect, useMemo } from 'react'
import FavoriteCard from './FavoriteCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertCircle, Heart } from 'lucide-react'
import favoriteService from '@/api/services/favorite.service'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

/**
 * FavoriteList Component
 * Danh sách bài đăng yêu thích với pagination
 * @param {Object} params - Filter parameters
 */
export default function FavoriteList({ 
  filters = {},
  onFiltersChange 
}) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 12,
    totalCount: 0,
    totalPages: 0
  })

  const fetchFavorites = async (pageNumber = 1) => {
    try {
      setLoading(true)
      setError(null)

      // Clean filters: remove undefined values and convert string booleans
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        // Skip undefined and null values
        if (value === undefined || value === null) {
          return acc
        }
        
        // Skip empty strings (except keyword which can be an empty string for search)
        if (value === '' && key !== 'keyword') {
          return acc
        }
        
        // Convert string booleans to actual booleans for isActive
        if (key === 'isActive' && (value === 'true' || value === 'false')) {
          acc[key] = value === 'true'
        } 
        // Convert categoryId string to number if it's a numeric string
        else if (key === 'categoryId' && typeof value === 'string' && !isNaN(value)) {
          acc[key] = parseInt(value, 10)
        } 
        else {
          acc[key] = value
        }
        
        return acc
      }, {})

      const response = await favoriteService.getFavorites({
        pageNumber,
        pageSize: pagination.pageSize,
        ...cleanFilters
      })

      console.log('Favorites API Response:', response) // Debug log

      // Handle both camelCase and PascalCase property names
      const success = response.success || response.Success
      const message = response.message || response.Message
      const data = response.data || response.Data
      const pageNumberResp = response.pageNumber || response.PageNumber
      const pageSizeResp = response.pageSize || response.PageSize
      const totalCount = response.totalCount || response.TotalCount
      const totalPages = response.totalPages || response.TotalPages

      if (success) {
        // PagedResponse structure: data is directly an array, pagination fields are at root level
        const items = Array.isArray(data) ? data : []
        console.log('Favorites items:', items) // Debug log
        
        if (items.length === 0) {
          console.log('No favorites found. Response structure:', {
            success,
            data,
            pageNumber: pageNumberResp,
            totalCount
          })
        }
        
        setFavorites(items)
        setPagination({
          pageNumber: pageNumberResp || pageNumber,
          pageSize: pageSizeResp || pagination.pageSize,
          totalCount: totalCount || 0,
          totalPages: totalPages || 0
        })
      } else {
        const errorMsg = message || 'Không thể tải danh sách yêu thích'
        console.error('Favorites API Error:', errorMsg, response)
        setError(errorMsg)
      }
    } catch (err) {
      console.error('Error fetching favorites:', err)
      console.error('Error response:', err.response)
      console.error('Error response data:', err.response?.data)
      
      // Handle different error response structures
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.Message ||
                          err.message || 
                          'Đã xảy ra lỗi khi tải danh sách yêu thích'
      setError(errorMessage)
      
      // If unauthorized, might need to redirect to login
      if (err.response?.status === 401) {
        console.warn('Unauthorized access to favorites. User might need to login.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Memoize filters to avoid unnecessary re-fetches
  const filtersKey = useMemo(() => {
    return JSON.stringify(filters)
  }, [filters])

  useEffect(() => {
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, pageNumber: 1 }))
    fetchFavorites(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey])

  const handleRemove = (favoriteId) => {
    setFavorites(prev => prev.filter(fav => {
      const id = fav.favoriteId || fav.FavoriteId
      return id !== favoriteId
    }))
    // Update total count
    setPagination(prev => ({
      ...prev,
      totalCount: Math.max(0, prev.totalCount - 1)
    }))
  }

  const handlePageChange = (newPage) => {
    fetchFavorites(newPage)
  }

  if (loading && favorites.length === 0) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Heart className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Chưa có bài đăng yêu thích</h3>
        <p className="text-muted-foreground mb-4">
          Bạn chưa thêm bài đăng nào vào danh sách yêu thích
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Favorites Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((favorite) => {
          // Handle both camelCase and PascalCase
          const favoriteId = favorite.favoriteId || favorite.FavoriteId
          return (
            <FavoriteCard
              key={favoriteId}
              favorite={favorite}
              onRemove={handleRemove}
            />
          )
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.pageNumber - 1)}
            disabled={pagination.pageNumber === 1 || loading}
          >
            Trước
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Trang {pagination.pageNumber} / {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.pageNumber + 1)}
            disabled={pagination.pageNumber === pagination.totalPages || loading}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Loading More */}
      {loading && favorites.length > 0 && (
        <div className="flex justify-center">
          <div className="text-sm text-muted-foreground">Đang tải...</div>
        </div>
      )}
    </div>
  )
}


