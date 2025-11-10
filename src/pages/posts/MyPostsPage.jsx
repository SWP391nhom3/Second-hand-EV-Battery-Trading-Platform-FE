import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Filter, Search, Edit, Trash2, Eye, EyeOff, TrendingUp, Loader2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import postsService from '@/api/services/posts.service'
import { getImageUrl } from '@/utils/imageHelper'

/**
 * Trang quản lý bài đăng của user
 * UC13: Xem Danh sách Bài đăng của mình
 * UC07: Chỉnh sửa Bài đăng
 * UC08: Xóa Bài đăng
 * UC09: Tạm ẩn/Hiện Bài đăng
 * UC10: Đẩy tin
 */
const MyPostsPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'ALL', // Changed from '' to 'ALL' to avoid empty value error
    keyword: '',
    pageNumber: 1,
    pageSize: 10
  })
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)

  useEffect(() => {
    loadPosts()
  }, [filters])

  const loadPosts = async () => {
    try {
      setLoading(true)
      
      // Prepare params, exclude status if 'ALL'
      const params = {
        pageNumber: filters.pageNumber,
        pageSize: filters.pageSize
      }
      
      // Only add status if it's not 'ALL'
      if (filters.status && filters.status !== 'ALL') {
        params.status = filters.status
      }
      
      // Add keyword if present
      if (filters.keyword) {
        params.keyword = filters.keyword
      }
      
      const response = await postsService.getMyPosts(params)
      
      console.log('My Posts Response:', response)
      
      if (response.success && response.data) {
        // response.data is already an array, not an object with items property
        const postsArray = Array.isArray(response.data) ? response.data : []
        setPosts(postsArray)
        setTotalPages(response.totalPages || 1)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách bài đăng"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (status) => {
    setFilters(prev => ({ ...prev, status, pageNumber: 1 }))
  }

  const handleSearch = (keyword) => {
    setFilters(prev => ({ ...prev, keyword, pageNumber: 1 }))
  }

  const handleToggleActive = async (postId, currentStatus) => {
    try {
      const response = await postsService.togglePostActive(postId, !currentStatus)
      
      if (response.success) {
        toast({
          title: "Thành công",
          description: currentStatus ? "Đã ẩn bài đăng" : "Đã hiện bài đăng"
        })
        loadPosts()
      }
    } catch (error) {
      console.error('Error toggling post:', error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái bài đăng"
      })
    }
  }

  const handleBumpPost = async (postId) => {
    try {
      const response = await postsService.bumpPost(postId)
      
      if (response.success) {
        toast({
          title: "Đẩy tin thành công",
          description: "Bài đăng của bạn đã được đưa lên đầu danh sách"
        })
        loadPosts()
      }
    } catch (error) {
      console.error('Error bumping post:', error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể đẩy tin"
      })
    }
  }

  const handleDeletePost = async () => {
    if (!postToDelete) return

    try {
      const response = await postsService.deletePost(postToDelete)
      
      if (response.success) {
        toast({
          title: "Xóa thành công",
          description: "Bài đăng đã được xóa"
        })
        setDeleteDialogOpen(false)
        setPostToDelete(null)
        loadPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa bài đăng"
      })
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { label: 'Nháp', variant: 'secondary' },
      PENDING: { label: 'Chờ duyệt', variant: 'warning' },
      APPROVED: { label: 'Đã duyệt', variant: 'success' },
      DENIED: { label: 'Từ chối', variant: 'destructive' },
      EXPIRED: { label: 'Hết hạn', variant: 'secondary' }
    }
    
    const config = statusConfig[status] || statusConfig.DRAFT
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const getPackageBadge = (packageType) => {
    console.log('Package Type:', packageType) // Debug log
    
    const packageConfig = {
      BASIC: { label: '📦 Basic', color: 'bg-gray-100 text-gray-800' },
      PREMIUM: { label: '⭐ Premium', color: 'bg-blue-100 text-blue-800' },
      LUXURY: { label: '👑 Luxury', color: 'bg-amber-100 text-amber-800' }
    }
    
    // Ensure packageType is uppercase and exists
    const normalizedType = packageType?.toUpperCase()
    const config = packageConfig[normalizedType] || packageConfig.BASIC
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      <div className="container mx-auto py-8 px-4 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bài đăng của tôi</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả bài đăng của bạn</p>
        </div>
        <Button onClick={() => navigate('/posts/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Đăng tin mới
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bài đăng..."
                  value={filters.keyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status filter */}
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="DRAFT">Nháp</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="DENIED">Từ chối</SelectItem>
                <SelectItem value="EXPIRED">Hết hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">Chưa có bài đăng nào</p>
            <Button onClick={() => navigate('/posts/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo bài đăng đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => {
            // Get image URL
            const rawImageUrl = post.imageUrls && post.imageUrls.length > 0 
              ? post.imageUrls[0] 
              : post.thumbnailUrl || null
            const imageUrl = rawImageUrl ? getImageUrl(rawImageUrl) : null
            
            return (
            <Card key={post.postId} className="hover:shadow-lg transition-shadow group overflow-hidden">
              {/* Image */}
              <div 
                className="h-48 bg-muted cursor-pointer relative overflow-hidden"
                onClick={() => navigate(`/posts/${post.postId}`)}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23e5e7eb" width="300" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                
                {/* Status badges overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {getStatusBadge(post.status)}
                  {!post.isActive && (
                    <Badge variant="secondary" className="w-fit">Đang ẩn</Badge>
                  )}
                </div>
                
                {/* Package badge overlay */}
                <div className="absolute top-2 right-2">
                  {getPackageBadge(post.packageType)}
                </div>
              </div>

              <CardContent className="p-4">
                {/* Title & Price */}
                <div 
                  className="cursor-pointer mb-3"
                  onClick={() => navigate(`/posts/${post.postId}`)}
                >
                  <h3 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xl font-bold text-blue-600">
                    {post.price?.toLocaleString('vi-VN')} đ
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {post.description}
                </p>

                {/* Meta info */}
                <div className="text-xs text-gray-500 mb-3 space-y-1">
                  <div>📅 {new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
                  {post.viewCount > 0 && (
                    <div>👁 {post.viewCount} lượt xem</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {/* View */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/posts/${post.postId}`)}
                    className="flex-1 min-w-[80px]"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>

                  {/* Toggle active */}
                  {post.status === 'APPROVED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(post.postId, post.isActive)}
                      title={post.isActive ? 'Ẩn bài đăng' : 'Hiện bài đăng'}
                      className="flex-1 min-w-[80px]"
                    >
                      {post.isActive ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Ẩn
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Hiện
                        </>
                      )}
                    </Button>
                  )}

                  {/* Bump */}
                  {post.status === 'APPROVED' && post.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBumpPost(post.postId)}
                      title="Đẩy tin"
                      className="flex-1 min-w-[80px]"
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Đẩy
                    </Button>
                  )}

                  {/* Edit */}
                  {['DRAFT', 'PENDING', 'DENIED'].includes(post.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/posts/${post.postId}/edit`)}
                      className="flex-1 min-w-[80px]"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                  )}

                  {/* Delete */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPostToDelete(post.postId)
                      setDeleteDialogOpen(true)
                    }}
                    className="flex-1 min-w-[80px]"
                  >
                    <Trash2 className="h-4 w-4 mr-1 text-red-600" />
                    Xóa
                  </Button>
                </div>

                {/* Denial reason */}
                {post.status === 'DENIED' && post.denialReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-800">
                      <strong>Lý do từ chối:</strong> {post.denialReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={filters.pageNumber === 1}
            onClick={() => setFilters(prev => ({ ...prev, pageNumber: prev.pageNumber - 1 }))}
          >
            Trước
          </Button>
          <span className="px-4 py-2">
            Trang {filters.pageNumber} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={filters.pageNumber === totalPages}
            onClick={() => setFilters(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }))}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">EVehicle</h3>
              <p className="text-sm text-slate-400">
                Sàn giao dịch C2C hàng đầu cho xe điện và pin tại Việt Nam
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Liên kết</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link></li>
                <li><Link to="/posts" className="hover:text-primary transition-colors">Sản phẩm</Link></li>
                <li><Link to="/packages" className="hover:text-primary transition-colors">Gói tin</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/help" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Liên hệ</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Pháp lý</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/terms" className="hover:text-primary transition-colors">Điều khoản</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 mt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 EVehicle Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MyPostsPage
