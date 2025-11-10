import { useState } from 'react'
import { Clock, Eye, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '@/lib/utils'

// Helper function để format date ngắn gọn
const formatDateShort = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * PendingPostsWidget Component
 * Widget hiển thị bài đăng chờ duyệt
 * Module 7: Dashboard Admin
 */
export default function PendingPostsWidget({ posts = [], loading = false, maxItems = 5 }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const displayPosts = expanded ? posts : posts.slice(0, maxItems)
  const hasMore = posts.length > maxItems

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Bài đăng chờ duyệt</h2>
          <Clock className="h-5 w-5 text-gray-400 animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Bài đăng chờ duyệt</h2>
          <Clock className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Không có bài đăng chờ duyệt</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Bài đăng chờ duyệt</h2>
          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
            {posts.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/posts')}
          className="text-xs"
        >
          Xem tất cả
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {displayPosts.map((post) => (
          <div
            key={post.id}
            className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
            onClick={() => navigate(`/admin/posts?view=${post.id}`)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate mb-1">
                {post.title}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{formatPrice(post.price)}</span>
                <span>•</span>
                <span>{formatDateShort(post.createdAt)}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/admin/posts?view=${post.id}`)
              }}
              className="ml-2 flex-shrink-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {hasMore && !expanded && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(true)}
          className="w-full mt-3 text-xs"
        >
          Xem thêm {posts.length - maxItems} bài đăng
        </Button>
      )}

      {expanded && hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(false)}
          className="w-full mt-3 text-xs"
        >
          Thu gọn
        </Button>
      )}
    </div>
  )
}

