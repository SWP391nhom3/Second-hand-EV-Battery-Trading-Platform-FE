import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Crown, Sparkles, Star, AlertCircle, GitCompare } from 'lucide-react'
import Header from '@/components/layout/Header'
import SearchBar from '@/components/search/SearchBar'
import SearchFilters from '@/components/search/SearchFilters'
import SortDropdown from '@/components/search/SortDropdown'
import PostGrid from '@/components/search/PostGrid'
import CompareModal from '@/components/search/CompareModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import postsService from '@/api/services/posts.service'

/**
 * PostsPage Component
 * Trang hiển thị danh sách bài đăng theo package type (premium, basic, luxury)
 * URL: /posts?package=premium
 */
export default function PostsPage() {
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

  // Get package type from URL params (premium, basic, luxury)
  const packageParam = searchParams.get('package')?.toUpperCase() || 'PREMIUM'
  const validPackages = ['PREMIUM', 'BASIC', 'LUXURY']
  const packageType = validPackages.includes(packageParam) ? packageParam : 'PREMIUM'

  // Package configuration
  const packageConfig = {
    PREMIUM: {
      name: 'Premium',
      icon: Sparkles,
      badge: '⭐ Premium',
      description: 'Danh sách sản phẩm Premium - Ưu tiên hiển thị cao với nhiều tính năng nổi bật',
      gradient: 'from-blue-500 to-purple-500',
      bgGradient: 'from-blue-50 to-purple-50',
      borderColor: 'border-purple-200'
    },
    BASIC: {
      name: 'Basic',
      icon: Star,
      badge: '📦 Basic',
      description: 'Danh sách sản phẩm Basic - Sản phẩm chất lượng với giá tốt',
      gradient: 'from-gray-500 to-gray-600',
      bgGradient: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-300'
    },
    LUXURY: {
      name: 'Luxury',
      icon: Crown,
      badge: '👑 Luxury',
      description: 'Danh sách sản phẩm Luxury - Sản phẩm cao cấp với vị trí hiển thị TOP',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      borderColor: 'border-orange-200'
    }
  }

  const config = packageConfig[packageType]
  const PackageIcon = config.icon

  // Extract filters from URL params
  const getFiltersFromParams = () => {
    return {
      packageType: packageType,
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
      sortBy: searchParams.get('sortBy') || 'priorityLevel',
      sortDirection: searchParams.get('sortDirection') || 'desc'
    }
  }

  const sortPostsForDisplay = (items, sortBy, sortDirection) => {
    if (!Array.isArray(items)) {
      return []
    }

    const direction = (sortDirection || 'desc').toString().toLowerCase() === 'asc' ? 1 : -1
    const normalizedSortBy = (sortBy || 'priorityLevel').toString().toLowerCase()

    const getPriority = (post) => {
      const value = Number(post?.priorityLevel)
      return Number.isFinite(value) ? value : 0
    }

    const getDate = (post) => {
      const dateValue = post?.approvedAt || post?.createdAt || post?.updatedAt
      const timestamp = dateValue ? new Date(dateValue).getTime() : 0
      return Number.isFinite(timestamp) ? timestamp : 0
    }

    const getPrice = (post) => {
      const value = Number(post?.price)
      return Number.isFinite(value) ? value : 0
    }

    const compareDates = (a, b) => {
      const diff = getDate(a) - getDate(b)
      if (diff !== 0) {
        return diff * direction
      }
      return (getPriority(a) - getPriority(b)) * direction
    }

    const sorted = [...items].sort((a, b) => {
      switch (normalizedSortBy) {
        case 'prioritylevel': {
          const priorityDiff = getPriority(a) - getPriority(b)
          if (priorityDiff !== 0) {
            return priorityDiff * direction
          }
          return compareDates(a, b)
        }
        case 'price': {
          const priceDiff = getPrice(a) - getPrice(b)
          if (priceDiff !== 0) {
            return priceDiff * direction
          }
          return compareDates(a, b)
        }
        case 'approvedat':
        case 'createdat': {
          const dateDiff = getDate(a) - getDate(b)
          if (dateDiff !== 0) {
            return dateDiff * direction
          }
          return (getPriority(a) - getPriority(b)) * direction
        }
        default: {
          return compareDates(a, b)
        }
      }
    })

    return sorted
  }

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters = getFiltersFromParams()

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
        const postsData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.items)
            ? response.data.items
            : []
        const sortedPosts = sortPostsForDisplay(postsData, filters.sortBy, filters.sortDirection)
        setPosts(sortedPosts)
        setTotalCount(response.totalCount || 0)
        setCurrentPage(response.pageNumber || 1)
        setTotalPages(response.totalPages || 1)
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
    
    // Preserve package type
    newParams.set('package', packageType.toLowerCase())
    
    // Update all filter params
    Object.keys(newFilters).forEach(key => {
      if (key === 'packageType') return // Skip packageType, use package param instead
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
    newParams.set('package', packageType.toLowerCase())
    newParams.set('pageNumber', '1')
    newParams.set('pageSize', '12')
    setSearchParams(newParams)
  }

  // Handle sort change
  const handleSortChange = (sortValue) => {
    const [sortBy, sortDirection] = sortValue.split(':')
    const newParams = new URLSearchParams(searchParams)
    newParams.set('package', packageType.toLowerCase())
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
    newParams.set('package', packageType.toLowerCase())
    newParams.set('pageNumber', newPage.toString())
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle package type change
  const handlePackageChange = (newPackage) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('package', newPackage.toLowerCase())
    newParams.set('pageNumber', '1')
    // Keep other filters
    setSearchParams(newParams)
  }

  const filters = getFiltersFromParams()
  const sortValue = `${filters.sortBy || 'priorityLevel'}:${filters.sortDirection || 'desc'}`

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Package Header */}
        <div className={`mb-6 p-6 rounded-lg bg-gradient-to-r ${config.bgGradient} border-2 ${config.borderColor}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${config.gradient} text-white`}>
                <PackageIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Gói {config.name}
                </h1>
                <p className="text-muted-foreground">
                  {config.description}
                </p>
              </div>
            </div>
            <Badge className={`bg-gradient-to-r ${config.gradient} text-white px-4 py-2 text-lg`}>
              {config.badge}
            </Badge>
          </div>

          {/* Package Type Tabs */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {Object.keys(packageConfig).map((pkg) => {
              const pkgConfig = packageConfig[pkg]
              const isActive = packageType === pkg
              return (
                <Button
                  key={pkg}
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => handlePackageChange(pkg)}
                  className={isActive ? `bg-gradient-to-r ${pkgConfig.gradient} text-white hover:opacity-90` : ''}
                >
                  {pkgConfig.badge}
                </Button>
              )
            })}
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleFiltersReset}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Sort and Results Count */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Tìm thấy <span className="font-semibold text-foreground">{totalCount}</span> sản phẩm {config.name.toLowerCase()}
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
            {!loading && totalCount > 0 && (
              <div className="border-t pt-6 mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Pagination Info */}
                  <div className="text-sm text-muted-foreground text-center sm:text-left">
                    Hiển thị <span className="font-semibold text-foreground">
                      {(currentPage - 1) * (filters.pageSize || 12) + 1}
                    </span>
                    {' - '}
                    <span className="font-semibold text-foreground">
                      {Math.min(currentPage * (filters.pageSize || 12), totalCount)}
                    </span>
                    {' trong tổng số '}
                    <span className="font-semibold text-foreground">{totalCount}</span>
                    {' sản phẩm'}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1 flex-wrap justify-center">
                      {/* First Page */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(1)}
                        className="hidden md:flex"
                        title="Trang đầu"
                      >
                        Đầu
                      </Button>

                      {/* Previous Page */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        title="Trang trước"
                      >
                        ‹
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {(() => {
                          const pages = []
                          const maxPagesToShow = 5
                          let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
                          let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

                          if (endPage - startPage < maxPagesToShow - 1) {
                            startPage = Math.max(1, endPage - maxPagesToShow + 1)
                          }

                          // First page
                          if (startPage > 1) {
                            pages.push(
                              <Button
                                key={1}
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(1)}
                                className="hidden md:flex"
                              >
                                1
                              </Button>
                            )
                            if (startPage > 2) {
                              pages.push(
                                <span key="ellipsis-start" className="px-2 text-muted-foreground hidden md:inline">
                                  ...
                                </span>
                              )
                            }
                          }

                          // Page numbers
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <Button
                                key={i}
                                variant={currentPage === i ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(i)}
                                className={currentPage === i ? 'font-bold' : ''}
                              >
                                {i}
                              </Button>
                            )
                          }

                          // Last page
                          if (endPage < totalPages) {
                            if (endPage < totalPages - 1) {
                              pages.push(
                                <span key="ellipsis-end" className="px-2 text-muted-foreground hidden md:inline">
                                  ...
                                </span>
                              )
                            }
                            pages.push(
                              <Button
                                key={totalPages}
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(totalPages)}
                                className="hidden md:flex"
                              >
                                {totalPages}
                              </Button>
                            )
                          }

                          return pages
                        })()}
                      </div>

                      {/* Next Page */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        title="Trang sau"
                      >
                        ›
                      </Button>

                      {/* Last Page */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className="hidden md:flex"
                        title="Trang cuối"
                      >
                        Cuối
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && totalCount === 0 && (
              <div className="border-t pt-12 mt-6 text-center">
                <p className="text-muted-foreground text-lg">
                  Không tìm thấy sản phẩm nào với bộ lọc hiện tại
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleFiltersReset}
                >
                  Xóa bộ lọc và xem tất cả
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

