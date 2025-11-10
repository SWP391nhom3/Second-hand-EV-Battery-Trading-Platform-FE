import { Eye, Calendar, DollarSign, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LeadStatusBadge from './LeadStatusBadge'
import LeadListSkeleton from './LeadListSkeleton'

/**
 * LeadList Component for Staff
 * Component hiển thị danh sách Leads được gán cho Staff
 */
export default function LeadList({
  leads = [],
  loading,
  onViewDetail,
  onUpdateStatus
}) {
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
            Hiện tại không có Lead nào được gán cho bạn. Hãy liên hệ Admin để được gán Lead mới.
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
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {getLeadTypeLabel(lead.leadType)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <LeadStatusBadge status={lead.status} />
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
                    {/* Chỉ hiển thị nút cập nhật trạng thái nếu Lead chưa thành công hoặc thất bại */}
                    {lead.status && 
                     !['SUCCESSFUL', 'FAILED'].includes(lead.status.toUpperCase()) && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onUpdateStatus(lead)}
                        className="flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        Cập nhật
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

