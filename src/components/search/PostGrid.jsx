import React from 'react'
import { Loader2 } from 'lucide-react'
import PostCard from './PostCard'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * PostGrid Component
 * Grid hiển thị danh sách bài đăng
 */
export default function PostGrid({ 
  posts = [], 
  loading = false, 
  onCompare,
  compareList = [],
  className = '' 
}) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${className}`}>
        {[...Array(9)].map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-56 w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Không tìm thấy sản phẩm nào</p>
        <p className="text-muted-foreground text-sm mt-2">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${className}`}>
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          onCompare={onCompare}
          isInCompare={compareList.includes(post.postId)}
        />
      ))}
    </div>
  )
}


