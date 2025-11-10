import { Inbox, Grid3x3, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PostCard from './PostCard'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * AssignedPostList Component for Staff
 * Component hiển thị danh sách bài đăng được gán cho Staff (UC45)
 */
export default function AssignedPostList({
  posts = [],
  loading = false,
  viewMode = 'grid', // 'grid' or 'list'
  onViewDetail,
  onViewModeChange
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-gray-100 p-4 rounded-full mb-4 animate-in zoom-in duration-500">
            <Inbox className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
            Không có bài đăng nào
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            Hiện tại không có bài đăng nào được gán cho bạn. Hãy liên hệ Admin để được gán bài đăng mới.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Tìm thấy {posts.length} bài đăng
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="transition-all duration-200 hover:scale-105"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="transition-all duration-200 hover:scale-105"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Posts Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <PostCard
              key={post.postId || `post-${index}`}
              post={post}
              leadsCount={post.leadsCount || 0}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={post.postId || `post-${index}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDelay: `${index * 30}ms`,
                animationDuration: '300ms',
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-start gap-4">
                {post.imageUrls && post.imageUrls.length > 0 && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={post.imageUrls[0]}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png'
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {post.title || 'N/A'}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="font-medium">{post.brand}</span>
                    {post.model && <span>{post.model}</span>}
                    {post.location && (
                      <span className="text-gray-500">{post.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-bold text-primary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0
                      }).format(post.price || 0)}
                    </span>
                    {post.leadsCount > 0 && (
                      <span className="text-blue-600">
                        {post.leadsCount} Lead{post.leadsCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => onViewDetail(post)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


