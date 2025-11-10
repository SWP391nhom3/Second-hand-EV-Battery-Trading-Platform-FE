import { Skeleton } from '@/components/ui/skeleton'

/**
 * NotificationListSkeleton Component
 * Loading skeleton cho NotificationList
 */
export default function NotificationListSkeleton({ rows = 10 }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-in fade-in duration-300">
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-start gap-3 p-4">
            {/* Icon skeleton */}
            <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
            
            {/* Content skeleton */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-2 w-2 rounded-full flex-shrink-0" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


