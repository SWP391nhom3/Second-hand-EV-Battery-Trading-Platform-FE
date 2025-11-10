import { useState, useEffect } from 'react'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PostFilter from '@/components/admin/posts/PostFilter'
import PostPendingList from '@/components/admin/posts/PostPendingList'
import PostDetailModal from '@/components/admin/posts/PostDetailModal'
import PostApproveModal from '@/components/admin/posts/PostApproveModal'
import PostRejectModal from '@/components/admin/posts/PostRejectModal'
import adminPostService from '@/api/services/adminPost.service'
import { toast } from 'sonner'

/**
 * PostManagement Page
 * UC11, UC12: Quản lý Bài đăng (Admin)
 */
export default function PostManagement() {
  // State
  const [activeTab, setActiveTab] = useState('pending') // pending, approved, rejected
  const [pendingPosts, setPendingPosts] = useState([])
  const [approvedRejectedPosts, setApprovedRejectedPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: null,
    brand: '',
    sortBy: 'createdAt',
    sortDirection: 'desc'
  })
  const [pendingPagination, setPendingPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  })
  const [approvedRejectedPagination, setApprovedRejectedPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  })

  // Modal states
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  })

  // Load stats on mount
  useEffect(() => {
    loadStats()
  }, [])

  // Fetch data when filters/tab change
  useEffect(() => {
    fetchData()
  }, [activeTab, filters, pendingPagination.pageNumber, approvedRejectedPagination.pageNumber])

  // Load stats for all tabs
  const loadStats = async () => {
    try {
      // Load pending count
      const pendingResponse = await adminPostService.getPendingPosts({
        pageNumber: 1,
        pageSize: 1
      })
      
      // Load approved count
      const approvedResponse = await adminPostService.getApprovedRejectedPosts({
        status: 'APPROVED',
        pageNumber: 1,
        pageSize: 1
      })
      
      // Load rejected count
      const rejectedResponse = await adminPostService.getApprovedRejectedPosts({
        status: 'DENIED',
        pageNumber: 1,
        pageSize: 1
      })

      setStats({
        pendingCount: pendingResponse.success ? (pendingResponse.totalCount || 0) : 0,
        approvedCount: approvedResponse.success ? (approvedResponse.totalCount || 0) : 0,
        rejectedCount: rejectedResponse.success ? (rejectedResponse.totalCount || 0) : 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'pending') {
        await fetchPendingPosts()
      } else {
        await fetchApprovedRejectedPosts()
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingPosts = async () => {
    try {
      const response = await adminPostService.getPendingPosts({
        ...filters,
        pageNumber: pendingPagination.pageNumber,
        pageSize: pendingPagination.pageSize
      })

      if (response.success) {
        setPendingPosts(response.data || [])
        setPendingPagination({
          pageNumber: response.pageNumber || 1,
          pageSize: response.pageSize || 10,
          totalCount: response.totalCount || 0,
          totalPages: response.totalPages || 0
        })
        // Update stats
        setStats(prev => ({
          ...prev,
          pendingCount: response.totalCount || 0
        }))
      } else {
        toast.error(response.message || 'Không thể tải danh sách bài đăng chờ duyệt')
      }
    } catch (error) {
      console.error('Error fetching pending posts:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách bài đăng chờ duyệt')
    }
  }

  const fetchApprovedRejectedPosts = async () => {
    try {
      const status = activeTab === 'approved' ? 'APPROVED' : activeTab === 'rejected' ? 'DENIED' : null
      const response = await adminPostService.getApprovedRejectedPosts({
        ...filters,
        status,
        pageNumber: approvedRejectedPagination.pageNumber,
        pageSize: approvedRejectedPagination.pageSize
      })

      if (response.success) {
        setApprovedRejectedPosts(response.data || [])
        setApprovedRejectedPagination({
          pageNumber: response.pageNumber || 1,
          pageSize: response.pageSize || 10,
          totalCount: response.totalCount || 0,
          totalPages: response.totalPages || 0
        })
        
        // Update stats
        if (activeTab === 'approved') {
          setStats(prev => ({
            ...prev,
            approvedCount: response.totalCount || 0
          }))
        } else if (activeTab === 'rejected') {
          setStats(prev => ({
            ...prev,
            rejectedCount: response.totalCount || 0
          }))
        }
      } else {
        toast.error(response.message || 'Không thể tải danh sách bài đăng')
      }
    } catch (error) {
      console.error('Error fetching approved/rejected posts:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách bài đăng')
    }
  }

  // Handlers
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    // Reset to page 1 when filters change
    setPendingPagination(prev => ({ ...prev, pageNumber: 1 }))
    setApprovedRejectedPagination(prev => ({ ...prev, pageNumber: 1 }))
  }

  const handlePageChange = (pageNumber) => {
    if (activeTab === 'pending') {
      setPendingPagination(prev => ({ ...prev, pageNumber }))
    } else {
      setApprovedRejectedPagination(prev => ({ ...prev, pageNumber }))
    }
  }

  const handleViewDetail = (postId) => {
    setSelectedPostId(postId)
    setShowDetailModal(true)
  }

  const handleApproveClick = (post) => {
    // If post is a string (postId), we need to get the post object from the list
    if (typeof post === 'string') {
      const foundPost = [...pendingPosts, ...approvedRejectedPosts].find(p => p.postId === post)
      if (foundPost) {
        setSelectedPost(foundPost)
      }
    } else {
      setSelectedPost(post)
    }
    setShowApproveModal(true)
    setShowDetailModal(false)
  }

  const handleRejectClick = (post) => {
    // If post is a string (postId), we need to get the post object from the list
    if (typeof post === 'string') {
      const foundPost = [...pendingPosts, ...approvedRejectedPosts].find(p => p.postId === post)
      if (foundPost) {
        setSelectedPost(foundPost)
      }
    } else {
      setSelectedPost(post)
    }
    setShowRejectModal(true)
    setShowDetailModal(false)
  }

  const handleApprove = async (post) => {
    try {
      const response = await adminPostService.approvePost(post.postId)
      
      if (response.success) {
        toast.success('Duyệt bài đăng thành công!')
        setShowApproveModal(false)
        setSelectedPost(null)
        // Refresh data and stats
        await fetchData()
        await loadStats()
      } else {
        const errorMessage = response.errors && response.errors.length > 0
          ? response.errors[0]
          : response.message || 'Không thể duyệt bài đăng'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error approving post:', error)
      toast.error('Có lỗi xảy ra khi duyệt bài đăng')
    }
  }

  const handleReject = async (post, rejectionReason) => {
    try {
      const response = await adminPostService.rejectPost(post.postId, rejectionReason)
      
      if (response.success) {
        toast.success('Từ chối bài đăng thành công!')
        setShowRejectModal(false)
        setSelectedPost(null)
        // Refresh data and stats
        await fetchData()
        await loadStats()
      } else {
        const errorMessage = response.errors && response.errors.length > 0
          ? response.errors[0]
          : response.message || 'Không thể từ chối bài đăng'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error rejecting post:', error)
      toast.error('Có lỗi xảy ra khi từ chối bài đăng')
    }
  }

  const currentPosts = activeTab === 'pending' ? pendingPosts : approvedRejectedPosts
  const currentPagination = activeTab === 'pending' ? pendingPagination : approvedRejectedPagination

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Quản lý Bài đăng</h1>
        </div>
        <p className="text-gray-600">Duyệt và quản lý bài đăng từ người dùng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-all duration-300 animate-in fade-in-50 slide-in-from-top-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600 transition-all duration-300">{stats.pendingCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full transition-transform duration-300 hover:scale-110">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-all duration-300 animate-in fade-in-50 slide-in-from-top-4" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600 transition-all duration-300">{stats.approvedCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full transition-transform duration-300 hover:scale-110">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-all duration-300 animate-in fade-in-50 slide-in-from-top-4" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Từ chối</p>
              <p className="text-2xl font-bold text-red-600 transition-all duration-300">{stats.rejectedCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full transition-transform duration-300 hover:scale-110">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6 animate-in fade-in-50 duration-300">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-all duration-200 relative ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Chờ duyệt ({stats.pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-all duration-200 relative ${
              activeTab === 'approved'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Đã duyệt ({stats.approvedCount})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-all duration-200 relative ${
              activeTab === 'rejected'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Đã từ chối ({stats.rejectedCount})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="animate-in fade-in-50 duration-300">
        <PostFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={() => {
            setFilters({
              keyword: '',
              categoryId: null,
              brand: '',
              sortBy: 'createdAt',
              sortDirection: 'desc'
            })
          }}
        />
      </div>

      {/* Posts List */}
      <div className="mt-6 animate-in fade-in-50 duration-300" key={activeTab}>
        {activeTab === 'pending' ? (
          <PostPendingList
            posts={pendingPosts}
            loading={loading}
            onViewDetail={handleViewDetail}
            onApprove={handleApproveClick}
            onReject={handleRejectClick}
            pagination={pendingPagination}
            onPageChange={handlePageChange}
          />
        ) : (
          <PostPendingList
            posts={approvedRejectedPosts}
            loading={loading}
            onViewDetail={handleViewDetail}
            pagination={approvedRejectedPagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Modals */}
      <PostDetailModal
        postId={selectedPostId}
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedPostId(null)
        }}
        onApprove={(post) => {
          // PostDetailModal passes the full post object
          handleApproveClick(post)
        }}
        onReject={(post) => {
          // PostDetailModal passes the full post object
          handleRejectClick(post)
        }}
      />

      <PostApproveModal
        post={selectedPost}
        open={showApproveModal}
        onClose={() => {
          setShowApproveModal(false)
          setSelectedPost(null)
        }}
        onConfirm={handleApprove}
        loading={false}
      />

      <PostRejectModal
        post={selectedPost}
        open={showRejectModal}
        onClose={() => {
          setShowRejectModal(false)
          setSelectedPost(null)
        }}
        onConfirm={handleReject}
        loading={false}
      />
    </div>
  )
}
