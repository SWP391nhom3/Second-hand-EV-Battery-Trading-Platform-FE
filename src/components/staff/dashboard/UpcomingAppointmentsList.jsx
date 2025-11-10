import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/utils'

/**
 * UpcomingAppointmentsList Component
 * Hiển thị lịch hẹn sắp tới (tối đa limit items)
 * Module 1: Dashboard Staff (UC39)
 */
export default function UpcomingAppointmentsList({ appointments, isLoading, limit = 5 }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lịch hẹn sắp tới</CardTitle>
          <CardDescription>Danh sách lịch hẹn trong 7 ngày tới</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayAppointments = appointments?.slice(0, limit) || []

  if (displayAppointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lịch hẹn sắp tới</CardTitle>
          <CardDescription>Danh sách lịch hẹn trong 7 ngày tới</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Không có lịch hẹn sắp tới</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Lịch hẹn sắp tới</CardTitle>
          <CardDescription>Danh sách lịch hẹn trong 7 ngày tới</CardDescription>
        </div>
        <Button variant="outline" asChild>
          <Link to="/staff/appointments">
            Xem tất cả
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayAppointments.map((appointment) => (
            <div
              key={appointment.appointmentId}
              className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {appointment.postTitle || 'N/A'}
                  </h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      {appointment.startTime
                        ? formatDateTime(appointment.startTime)
                        : 'N/A'}
                      {appointment.endTime &&
                        ` - ${formatDateTime(appointment.endTime)}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{appointment.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span>
                      <strong>Buyer:</strong> {appointment.buyerName || 'N/A'}
                    </span>
                    <span>
                      <strong>Seller:</strong> {appointment.sellerName || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/staff/appointments/${appointment.appointmentId}`}>
                  Xem chi tiết
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

