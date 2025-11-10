/**
 * StatsCard Component
 * Component hiển thị thẻ thống kê với icon, title, value và change
 * Module 7: Dashboard Admin
 * 
 * @param {string} label - Nhãn hiển thị
 * @param {string|number} value - Giá trị hiển thị
 * @param {string} change - Thay đổi (ví dụ: '+12.5%')
 * @param {'increase'|'decrease'|'neutral'} changeType - Loại thay đổi
 * @param {React.ComponentType} icon - Icon component từ lucide-react
 * @param {'blue'|'green'|'purple'|'orange'|'emerald'|'pink'|'red'} color - Màu sắc
 * @param {Function} onClick - Callback khi click vào card
 */
export default function StatsCard({
  label,
  value,
  change,
  changeType = 'neutral', // 'increase' | 'decrease' | 'neutral'
  icon: Icon,
  color = 'blue', // 'blue' | 'green' | 'purple' | 'orange' | 'emerald' | 'pink' | 'red'
  onClick
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    pink: 'bg-pink-100 text-pink-600',
    red: 'bg-red-100 text-red-600'
  }

  const changeColorClasses = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  }

  const changeIcon = changeType === 'increase' ? '↑' : changeType === 'decrease' ? '↓' : ''

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-gray-200 p-6
        hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer hover:border-primary' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 mb-1 truncate">{label}</p>
          <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-medium ${changeColorClasses[changeType]}`}>
                {changeIcon} {change}
              </span>
              <span className="text-xs text-gray-500">so với tháng trước</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}

