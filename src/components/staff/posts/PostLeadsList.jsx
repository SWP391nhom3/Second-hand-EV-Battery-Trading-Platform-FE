import { useState, useEffect } from 'react'
import { Eye, Calendar, User, Mail, DollarSign, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import staffPostService from '@/api/services/staffPost.service'
import LeadStatusBadge from '../leads/LeadStatusBadge'
import { toast } from 'sonner'

/**
 * PostLeadsList Component for Staff
 * Component hiển thị danh sách Leads đang quan tâm bài đăng
 */
export default function PostLeadsList({ postId, onViewLead }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const fetchLeads = async () => {
    if (!postId) return

    setLoading(true)
    try {
      const response = await staffPostService.getPostLeads(postId, {
        pageNumber,
        pageSize
      })

      if (response.success && response.data) {
        setLeads(response.data.items || [])
        setTotalCount(response.data.totalCount || 0)
      } else {
        toast.error(response.message || 'Không thể tải danh sách Leads')
        setLeads([])
        setTotalCount(0)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast.error('Đã xảy ra lỗi khi tải danh sách Leads')
      setLeads([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [postId, pageNumber])

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
      console.error('Error formatting date:', error)
      return 'N/A'
    }
  }

  const formatPrice = (price) => {
    if (!price && price !== 0) return null
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(price)
    } catch (error) {
      console.error('Error formatting price:', error)
      return null
    }
  }

  const getLeadTypeLabel = (leadType) => {
    if (!leadType) return 'N/A'
    const typeMap = {
      SCHEDULE_VIEW: 'Đặt lịch xem',
      AUCTION_WINNER: 'Người thắng đấu giá'
    }
    return typeMap[leadType.toUpperCase()] || leadType
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
          <Inbox className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">
          Chưa có Lead nào quan tâm bài đăng này
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-4">
        Tổng cộng: {totalCount} Lead{totalCount > 1 ? 's' : ''}
      </div>

      {leads.map((lead, index) => (
        <div
          key={lead.leadId || `lead-${index}`}
          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {/* Buyer Info */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {lead.buyerName || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {lead.buyerEmail}
                  </p>
                </div>
              </div>

              {/* Lead Info */}
              <div className="flex items-center gap-4 flex-wrap ml-11">
                <LeadStatusBadge status={lead.status} />
                <Badge variant="outline">
                  {getLeadTypeLabel(lead.leadType)}
                </Badge>
                {lead.finalPrice && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">
                      {formatPrice(lead.finalPrice)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {formatDate(lead.createdAt)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewLead(lead)}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <Eye className="h-4 w-4" />
              Xem
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}


