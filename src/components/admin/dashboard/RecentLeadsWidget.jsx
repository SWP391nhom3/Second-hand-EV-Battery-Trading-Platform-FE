import { useState } from 'react'
import { UserCheck, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { formatRelativeTime } from '@/lib/utils'

/**
 * RecentLeadsWidget Component
 * Widget hiển thị Lead mới nhất
 * Module 7: Dashboard Admin
 */
export default function RecentLeadsWidget({ leads = [], loading = false, maxItems = 5 }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const displayLeads = expanded ? leads : leads.slice(0, maxItems)
  const hasMore = leads.length > maxItems

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'NEW':
        return 'default'
      case 'ASSIGNED':
        return 'secondary'
      case 'CONTACTED':
        return 'secondary'
      case 'SCHEDULED':
        return 'default'
      case 'SUCCESSFUL':
        return 'default'
      case 'FAILED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status) => {
    const statusMap = {
      NEW: 'Mới',
      ASSIGNED: 'Đã gán',
      CONTACTED: 'Đã liên hệ',
      SCHEDULED: 'Đã lên lịch',
      SUCCESSFUL: 'Thành công',
      FAILED: 'Thất bại'
    }
    return statusMap[status] || status
  }

  const getLeadTypeLabel = (leadType) => {
    const typeMap = {
      SCHEDULE_VIEW: 'Đặt lịch xem',
      AUCTION_WINNER: 'Người thắng đấu giá',
      BROKERAGE_REQUEST: 'Yêu cầu môi giới'
    }
    return typeMap[leadType] || leadType
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Lead mới nhất</h2>
          <UserCheck className="h-5 w-5 text-gray-400 animate-pulse" />
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

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Lead mới nhất</h2>
          <UserCheck className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-8 text-gray-500">
          <UserCheck className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Không có Lead mới</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Lead mới nhất</h2>
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {leads.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/leads')}
          className="text-xs"
        >
          Xem tất cả
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {displayLeads.map((lead) => (
          <div
            key={lead.id}
            className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
            onClick={() => navigate(`/admin/leads?view=${lead.id}`)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {lead.buyerName || 'Khách hàng'}
                </p>
                <Badge variant={getStatusBadgeVariant(lead.status)} className="text-xs">
                  {getStatusLabel(lead.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span>{getLeadTypeLabel(lead.leadType)}</span>
                {lead.postTitle && (
                  <>
                    <span>•</span>
                    <span className="truncate">{lead.postTitle}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatRelativeTime(lead.createdAt)}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/admin/leads?view=${lead.id}`)
              }}
              className="ml-2 flex-shrink-0"
            >
              <ArrowRight className="h-4 w-4" />
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
          Xem thêm {leads.length - maxItems} Lead
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

