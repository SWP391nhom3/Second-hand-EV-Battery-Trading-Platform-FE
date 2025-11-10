import { Activity, Clock } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

/**
 * ActivityTimeline Component
 * Timeline hiển thị hoạt động gần đây
 * Module 7: Dashboard Admin
 */
export default function ActivityTimeline({ activities = [], loading = false, maxItems = 10 }) {
  const getActivityIcon = (type) => {
    const iconMap = {
      post: '📝',
      user: '👤',
      order: '🛒',
      battery: '🔋',
      vehicle: '🚗',
      lead: '📞',
      payment: '💰',
      system: '⚙️'
    }
    return iconMap[type] || '📌'
  }

  const getActivityColor = (type) => {
    const colorMap = {
      post: 'bg-blue-100 text-blue-600',
      user: 'bg-purple-100 text-purple-600',
      order: 'bg-green-100 text-green-600',
      battery: 'bg-yellow-100 text-yellow-600',
      vehicle: 'bg-indigo-100 text-indigo-600',
      lead: 'bg-pink-100 text-pink-600',
      payment: 'bg-emerald-100 text-emerald-600',
      system: 'bg-gray-100 text-gray-600'
    }
    return colorMap[type] || 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
          <Activity className="h-5 w-5 text-gray-400 animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-8 text-gray-500">
          <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Không có hoạt động nào</p>
        </div>
      </div>
    )
  }

  const displayActivities = activities.slice(0, maxItems)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
        <Activity className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity, index) => (
          <div
            key={activity.id || index}
            className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 animate-in fade-in-50 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Timeline dot and line */}
            <div className="relative flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                <span className="text-sm">{getActivityIcon(activity.type)}</span>
              </div>
              {index < displayActivities.length - 1 && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
              )}
            </div>

            {/* Activity content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 mb-1">{activity.message}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatRelativeTime(activity.createdAt || activity.timestamp)}</span>
                {activity.userName && (
                  <>
                    <span>•</span>
                    <span>{activity.userName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Hiển thị {maxItems} hoạt động gần đây nhất
          </p>
        </div>
      )}
    </div>
  )
}

