import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle, GitCompare } from 'lucide-react'
import Header from '@/components/layout/Header'
import SearchBar from '@/components/search/SearchBar'
import SearchFilters from '@/components/search/SearchFilters'
import SortDropdown from '@/components/search/SortDropdown'
import PostGrid from '@/components/search/PostGrid'
import CompareModal from '@/components/search/CompareModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import postsService from '@/api/services/posts.service'
import { validateSearchParams } from '@/lib/validations/search.validations'

/**
 * Search Page
 * Trang tìm kiếm và xem danh sách bài đăng
 */
export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [compareList, setCompareList] = useState([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  // Extract filters from URL params
  const getFiltersFromParams = () => {
    return {
      keyword: searchParams.get('keyword') || null,
      categoryId: searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId'), 10) : null,
      brand: searchParams.get('brand') || null,
      model: searchParams.get('model') || null,
      location: searchParams.get('location') || null,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null,
      minProductionYear: searchParams.get('minProductionYear') ? parseInt(searchParams.get('minProductionYear'), 10) : null,
      maxProductionYear: searchParams.get('maxProductionYear') ? parseInt(searchParams.get('maxProductionYear'), 10) : null,
      minBatteryCapacity: searchParams.get('minBatteryCapacity') ? parseFloat(searchParams.get('minBatteryCapacity')) : null,
      maxBatteryCapacity: searchParams.get('maxBatteryCapacity') ? parseFloat(searchParams.get('maxBatteryCapacity')) : null,
      minMileage: searchParams.get('minMileage') ? parseInt(searchParams.get('minMileage'), 10) : null,
      maxMileage: searchParams.get('maxMileage') ? parseInt(searchParams.get('maxMileage'), 10) : null,
      condition: searchParams.get('condition') || null,
      auctionOnly: searchParams.get('auctionOnly') === 'true' ? true : searchParams.get('auctionOnly') === 'false' ? false : null,
      pageNumber: searchParams.get('pageNumber') ? parseInt(searchParams.get('pageNumber'), 10) : 1,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize'), 10) : 12,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortDirection: searchParams.get('sortDirection') || 'desc'
    }
  }

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters = getFiltersFromParams()
      
      // Validate params
      try {
        validateSearchParams(filters)
      } catch (validationError) {
        console.warn('Validation warning:', validationError.message)
      }

      // Build query params
      const queryParams = {}
      Object.keys(filters).forEach(key => {
        const value = filters[key]
        if (value !== null && value !== undefined && value !== '') {
          queryParams[key] = value
        }
      })

      const response = await postsService.searchPosts(queryParams)

      // PagedResponse structure: { success, data: [...], pageNumber, pageSize, totalCount, totalPages }
      if (response.success && response.data) {
        // response.data is already an array, not an object with items property
        const postsData = Array.isArray(response.data) ? response.data : [];
        setPosts(postsData);
        setTotalCount(response.totalCount || 0);
        setCurrentPage(response.pageNumber || 1);
        setTotalPages(response.totalPages || 1);
      } else {
        setError(response.message || 'Không thể tải danh sách sản phẩm')
      }
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError(err.message || 'Đã xảy ra lỗi khi tải danh sách sản phẩm')
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: err.message || 'Không thể tải danh sách sản phẩm'
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch posts when URL params change
  useEffect(() => {
    fetchPosts()
  }, [searchParams])

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    const newParams = new URLSearchParams(searchParams)
    
    // Update all filter params
    Object.keys(newFilters).forEach(key => {
      const value = newFilters[key]
      if (value !== null && value !== undefined && value !== '') {
        newParams.set(key, value.toString())
      } else {
        newParams.delete(key)
      }
    })

    // Reset to first page
    newParams.set('pageNumber', '1')
    setSearchParams(newParams)
  }

  // Handle filter reset
  const handleFiltersReset = () => {
    const newParams = new URLSearchParams()
    newParams.set('pageNumber', '1')
    newParams.set('pageSize', '12')
    setSearchParams(newParams)
  }

  // Handle sort change
  const handleSortChange = (sortValue) => {
    const [sortBy, sortDirection] = sortValue.split(':')
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sortBy', sortBy)
    newParams.set('sortDirection', sortDirection)
    newParams.set('pageNumber', '1')
    setSearchParams(newParams)
  }

  // Handle compare
  const handleCompare = (postId) => {
    if (compareList.includes(postId)) {
      setCompareList(compareList.filter(id => id !== postId))
    } else {
      if (compareList.length >= 5) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Chỉ có thể so sánh tối đa 5 sản phẩm'
        })
        return
      }
      setCompareList([...compareList, postId])
    }
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('pageNumber', newPage.toString())
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filters = getFiltersFromParams()
  const sortValue = `${filters.sortBy}:${filters.sortDirection}`

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Compare Button */}
        {compareList.length >= 2 && (
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setShowCompareModal(true)}>
              <GitCompare className="h-4 w-4 mr-2" />
              So sánh {compareList.length} sản phẩm
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleFiltersReset}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort and Results Count */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Tìm thấy <span className="font-semibold text-foreground">{totalCount}</span> sản phẩm
                </p>
              </div>
              <SortDropdown value={sortValue} onChange={handleSortChange} />
            </div>

            {/* Posts Grid */}
            {error ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Đã xảy ra lỗi</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={fetchPosts}>Thử lại</Button>
                </CardContent>
              </Card>
            ) : (
              <PostGrid
                posts={posts}
                loading={loading}
                onCompare={handleCompare}
                compareList={compareList}
              />
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Trước
                </Button>
                <div className="flex items-center gap-2">
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = index + 1
                    } else if (currentPage <= 3) {
                      pageNum = index + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + index
                    } else {
                      pageNum = currentPage - 2 + index
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Sau
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      <CompareModal
        open={showCompareModal}
        onOpenChange={setShowCompareModal}
        postIds={compareList}
      />
    </div>
  )
}

