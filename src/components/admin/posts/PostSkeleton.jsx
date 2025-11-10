import { Skeleton } from '@/components/ui/skeleton'

/**
 * PostSkeleton Component
 * Skeleton loader cho bài đăng
 */
export default function PostSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-in fade-in-50 duration-300">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Thumbnail Skeleton */}
        <div className="flex-shrink-0">
          <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-lg" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-6 w-24 ml-auto" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          </div>

          {/* Seller Info Skeleton */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-48" />
          </div>

          {/* Actions Skeleton */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * PostSkeletonList Component
 * Hiển thị nhiều skeleton loaders
 */
export function PostSkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  )
}

