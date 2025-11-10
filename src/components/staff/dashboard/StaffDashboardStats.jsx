import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react'

/**
 * StaffDashboardStats Component
 * Hiển thị thống kê tổng quan cho Staff Dashboard
 * Module 1: Dashboard Staff (UC39)
 */
export default function StaffDashboardStats({ statistics, isLoading }) {
  const stats = [
    {
      title: 'Tổng số Lead',
      value: statistics?.totalLeads ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Tổng số Leads được gán'
    },
    {
      title: 'Lead thành công',
      value: statistics?.successfulLeads ?? 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Leads đã thành công'
    },
    {
      title: 'Lead thất bại',
      value: statistics?.failedLeads ?? 0,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Leads đã thất bại'
    },
    {
      title: 'Lịch hẹn sắp tới',
      value: statistics?.upcomingAppointments ?? 0,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Trong 7 ngày tới'
    }
  ]

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

