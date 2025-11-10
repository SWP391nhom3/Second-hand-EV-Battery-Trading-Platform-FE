import { useEffect } from 'react'
import { Eye, UserCheck, Calendar, DollarSign, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import LeadListSkeleton from './LeadListSkeleton'

/**
 * LeadList Component
 * Component hiển thị danh sách Lead với smooth animations
 */
export default function LeadList({
  leads = [],
  loading,
  onViewDetail,
  onAssignStaff
}) {
  // Debug log
  useEffect(() => {
    if (leads && leads.length > 0) {
      console.log('📋 LeadList - Received leads:', leads.length)
      console.log('📋 LeadList - First lead sample:', {
        leadId: leads[0]?.leadId,
        postTitle: leads[0]?.postTitle,
        buyerName: leads[0]?.buyerName,
        status: leads[0]?.status
      })
    } else {
      console.log('📋 LeadList - No leads or empty array')
    }
  }, [leads])

  const getStatusBadgeVariant = (status) => {
    if (!status) return 'outline'
    const upperStatus = status.toUpperCase()
    switch (upperStatus) {
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
    if (!status) return 'N/A'
    const statusMap = {
      NEW: 'Mới',
      ASSIGNED: 'Đã gán',
      CONTACTED: 'Đã liên hệ',
      SCHEDULED: 'Đã lên lịch',
      SUCCESSFUL: 'Thành công',
      FAILED: 'Thất bại'
    }
    return statusMap[status.toUpperCase()] || status
  }

  const getLeadTypeLabel = (leadType) => {
    if (!leadType) return 'N/A'
    const typeMap = {
      SCHEDULE_VIEW: 'Đặt lịch xem',
      AUCTION_WINNER: 'Người thắng đấu giá'
    }
    return typeMap[leadType.toUpperCase()] || leadType
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date:', error, dateString)
      return 'N/A'
    }
  }

  const formatPrice = (price) => {
    if (!price && price !== 0) return null
    try {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price
      if (isNaN(numPrice)) return null
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(numPrice)
    } catch (error) {
      console.error('Error formatting price:', error, price)
      return null
    }
  }

  if (loading) {
    return <LeadListSkeleton rows={8} />
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-gray-100 p-4 rounded-full mb-4 animate-in zoom-in duration-500">
            <Inbox className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
            Không có Lead nào
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            Hiện tại không có Lead nào phù hợp với bộ lọc của bạn. Hãy thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bài đăng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người mua
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead, index) => {
              // Validate lead data
              if (!lead || !lead.leadId) {
                console.warn('Invalid lead data:', lead)
                return null
              }
              
              return (
              <tr
                key={lead.leadId || `lead-${index}`}
                className="hover:bg-gray-50 transition-colors duration-200 animate-in fade-in slide-in-from-bottom-2"
                style={{
                  animationDelay: `${index * 30}ms`,
                  animationDuration: '300ms',
                  animationFillMode: 'both'
                }}
              >
                <td className="px-4 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {lead.postTitle || 'N/A'}
                    </p>
                    {lead.postId && (
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {lead.postId.substring(0, 8)}...
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {lead.buyerName || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lead.buyerEmail}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Badge variant="outline" className="text-xs">
                    {getLeadTypeLabel(lead.leadType)}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <div>
                    {lead.staffName ? (
                      <p className="text-sm text-gray-900">{lead.staffName}</p>
                    ) : (
                      <p className="text-sm text-gray-400">Chưa gán</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Badge variant={getStatusBadgeVariant(lead.status)}>
                    {getStatusLabel(lead.status)}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  {lead.finalPrice ? (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(lead.finalPrice)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {formatDate(lead.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(lead)}
                      className="flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:shadow-sm"
                    >
                      <Eye className="h-4 w-4" />
                      Xem
                    </Button>
                    {lead.status && lead.status.toUpperCase() === 'NEW' && !lead.staffId && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onAssignStaff(lead)}
                        className="flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <UserCheck className="h-4 w-4" />
                        Gán Staff
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

