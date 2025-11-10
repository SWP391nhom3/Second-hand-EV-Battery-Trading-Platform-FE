/**
 * StatsCardSkeleton Component
 * Skeleton loader cho stats cards
 */
export default function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 animate-skeleton-pulse"></div>
          <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-16 animate-skeleton-pulse"></div>
        </div>
        <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 p-3 rounded-full animate-skeleton-pulse">
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

