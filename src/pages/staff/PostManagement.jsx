import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import PostFilter from '@/components/staff/posts/PostFilter'
import AssignedPostList from '@/components/staff/posts/AssignedPostList'
import PostDetailModal from '@/components/staff/posts/PostDetailModal'
import LeadDetailModal from '@/components/staff/leads/LeadDetailModal'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import staffPostService from '@/api/services/staffPost.service'

/**
 * PostManagement Page for Staff
 * Trang quản lý bài đăng được gán cho Staff (UC45)
 */
export default function PostManagement() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    categoryId: null,
    sortBy: 'createdAt',
    sortDirection: 'desc'
  })
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(12)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Modal states
  const [selectedPost, setSelectedPost] = useState(null)
  const [isPostDetailModalOpen, setIsPostDetailModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [isLeadDetailModalOpen, setIsLeadDetailModalOpen] = useState(false)

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await staffPostService.getAssignedPosts({
        ...filters,
        pageNumber,
        pageSize
      })

      if (response.success && response.data) {
        setPosts(response.data.items || [])
        setTotalCount(response.data.totalCount || 0)
        setTotalPages(response.data.totalPages || 0)
      } else {
        toast.error(response.message || 'Không thể tải danh sách bài đăng')
        setPosts([])
        setTotalCount(0)
        setTotalPages(0)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      
      // Check if it's a 404 or endpoint not found error
      if (error.response?.status === 404 || error.message?.includes('404')) {
        toast.error(
          'Endpoint chưa được tạo trong backend. Vui lòng liên hệ Admin để tạo endpoint /api/staff/posts',
          { duration: 5000 }
        )
      } else {
        toast.error('Đã xảy ra lỗi khi tải danh sách bài đăng')
      }
      
      setPosts([])
      setTotalCount(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [filters, pageNumber])

  // Handle filter change
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    setPageNumber(1) // Reset to first page when filters change
  }

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      status: '',
      categoryId: null,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    })
    setPageNumber(1)
  }

  // Handle view detail
  const handleViewDetail = async (post) => {
    try {
      // Fetch full post detail
      const response = await staffPostService.getPostById(post.postId)
      
      if (response.success && response.data) {
        setSelectedPost(response.data)
        setIsPostDetailModalOpen(true)
      } else {
        toast.error(response.message || 'Không thể tải chi tiết bài đăng')
      }
    } catch (error) {
      console.error('Error fetching post detail:', error)
      toast.error('Đã xảy ra lỗi khi tải chi tiết bài đăng')
    }
  }

  // Handle view lead
  const handleViewLead = (lead) => {
    setSelectedLead(lead)
    setIsLeadDetailModalOpen(true)
  }

  // Handle pagination
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Bài đăng
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách bài đăng được gán cho bạn
          </p>
        </div>
      </div>

      {/* Filter */}
      <PostFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* Posts List */}
      <AssignedPostList
        posts={posts}
        loading={loading}
        viewMode={viewMode}
        onViewDetail={handleViewDetail}
        onViewModeChange={setViewMode}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">
            Hiển thị {(pageNumber - 1) * pageSize + 1} - {Math.min(pageNumber * pageSize, totalCount)} / {totalCount} bài đăng
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={pageNumber === 1 || loading}
              className="transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            <div className="text-sm text-gray-500">
              Trang {pageNumber} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={pageNumber === totalPages || loading}
              className="transition-all duration-200 hover:scale-105"
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isPostDetailModalOpen}
        onClose={() => {
          setIsPostDetailModalOpen(false)
          setSelectedPost(null)
        }}
        onViewLead={handleViewLead}
      />

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isLeadDetailModalOpen}
        onClose={() => {
          setIsLeadDetailModalOpen(false)
          setSelectedLead(null)
        }}
        onUpdateStatus={() => {
          // Handle update status if needed
          setIsLeadDetailModalOpen(false)
        }}
      />
    </div>
  )
}


