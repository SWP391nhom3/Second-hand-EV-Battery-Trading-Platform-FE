import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight, UserCheck } from 'lucide-react'
import LeadStatusBadge from '../leads/LeadStatusBadge'
import { formatDate } from '@/lib/utils'

/**
 * AssignedLeadsList Component
 * Hiển thị danh sách Leads được gán (tối đa limit items)
 * Module 1: Dashboard Staff (UC39)
 */
export default function AssignedLeadsList({ leads, isLoading, limit = 5 }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leads được gán</CardTitle>
          <CardDescription>Danh sách Leads được gán cho bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayLeads = leads?.slice(0, limit) || []

  if (displayLeads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leads được gán</CardTitle>
          <CardDescription>Danh sách Leads được gán cho bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Chưa có Lead nào được gán</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Leads được gán</CardTitle>
          <CardDescription>Danh sách Leads được gán cho bạn</CardDescription>
        </div>
        <Button variant="outline" asChild>
          <Link to="/staff/leads">
            Xem tất cả
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayLeads.map((lead) => (
            <div
              key={lead.leadId}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {lead.postTitle || 'N/A'}
                  </h4>
                  <LeadStatusBadge status={lead.status} />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    <strong>Buyer:</strong> {lead.buyerName || 'N/A'}
                  </span>
                  <span>
                    <strong>Ngày tạo:</strong>{' '}
                    {lead.createdAt ? formatDate(lead.createdAt) : 'N/A'}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/staff/leads/${lead.leadId}`}>
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

