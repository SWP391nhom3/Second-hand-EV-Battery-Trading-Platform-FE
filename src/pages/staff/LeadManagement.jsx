import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import LeadFilter from '@/components/staff/leads/LeadFilter'
import LeadList from '@/components/staff/leads/LeadList'
import LeadDetailModal from '@/components/staff/leads/LeadDetailModal'
import LeadStatusUpdateModal from '@/components/staff/leads/LeadStatusUpdateModal'
import staffLeadService from '@/api/services/staffLead.service'

/**
 * LeadManagement Page
 * Quản lý Lead cho Staff - UC40, UC44
 * Module 2: Quản lý Lead
 */
export default function LeadManagement() {
  const [leads, setLeads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [leadTypeFilter, setLeadTypeFilter] = useState('ALL')

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    loadLeads()
  }, [pageNumber, pageSize, statusFilter, leadTypeFilter])

  const loadLeads = async () => {
    try {
      setIsLoading(true)

      const params = {
        pageNumber,
        pageSize,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        leadType: leadTypeFilter !== 'ALL' ? leadTypeFilter : undefined,
        sortBy: 'CreatedAt',
        sortOrder: 'DESC'
      }

      const response = await staffLeadService.getLeads(params)

      if (response?.success && response?.data) {
        setLeads(response.data.data || [])
        setTotalCount(response.data.totalCount || 0)
      } else {
        toast.error(response?.message || 'Không thể tải danh sách Lead')
      }
    } catch (error) {
      console.error('Error loading leads:', error)
      toast.error('Không thể tải danh sách Lead. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetail = (lead) => {
    setSelectedLead(lead)
    setIsDetailModalOpen(true)
  }

  const handleUpdateStatus = (lead) => {
    setSelectedLead(lead)
    setIsStatusUpdateModalOpen(true)
  }

  const handleStatusUpdate = async (leadId, data) => {
    try {
      const response = await staffLeadService.updateLeadStatus(leadId, data)

      if (response?.success) {
        toast.success('Cập nhật trạng thái Lead thành công')
        setIsStatusUpdateModalOpen(false)
        setSelectedLead(null)
        loadLeads()
      } else {
        toast.error(response?.message || 'Không thể cập nhật trạng thái Lead')
        throw new Error(response?.message || 'Update failed')
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
      toast.error(
        error?.response?.data?.message ||
          'Không thể cập nhật trạng thái Lead. Vui lòng thử lại.'
      )
      throw error
    }
  }

  const handleFilterReset = () => {
    setSearchTerm('')
    setStatusFilter('ALL')
    setLeadTypeFilter('ALL')
    setPageNumber(1)
  }

  // Filter leads by search term (client-side filtering)
  const filteredLeads = leads.filter((lead) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      (lead.buyerName && lead.buyerName.toLowerCase().includes(searchLower)) ||
      (lead.buyerEmail && lead.buyerEmail.toLowerCase().includes(searchLower)) ||
      (lead.postTitle && lead.postTitle.toLowerCase().includes(searchLower))
    )
  })

  const totalPages = Math.ceil(totalCount / pageSize)
  const displayLeads = searchTerm ? filteredLeads : leads

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Lead</h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách Lead được gán cho bạn (UC40, UC44)
          </p>
        </div>
      </div>

      {/* Filter */}
      <LeadFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        leadTypeFilter={leadTypeFilter}
        onLeadTypeFilterChange={setLeadTypeFilter}
        onReset={handleFilterReset}
      />

      {/* Lead List */}
      <LeadList
        leads={displayLeads}
        loading={isLoading}
        onViewDetail={handleViewDetail}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Pagination */}
      {!isLoading && totalCount > 0 && !searchTerm && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow px-4 py-3">
          <div className="text-sm text-gray-700">
            Hiển thị{' '}
            <span className="font-medium">
              {(pageNumber - 1) * pageSize + 1}
            </span>{' '}
            đến{' '}
            <span className="font-medium">
              {Math.min(pageNumber * pageSize, totalCount)}
            </span>{' '}
            trong tổng số <span className="font-medium">{totalCount}</span> Lead
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
              disabled={pageNumber === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            <div className="text-sm text-gray-700">
              Trang {pageNumber} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPageNumber((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={pageNumber === totalPages || isLoading}
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedLead(null)
        }}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Status Update Modal */}
      <LeadStatusUpdateModal
        lead={selectedLead}
        isOpen={isStatusUpdateModalOpen}
        onClose={() => {
          setIsStatusUpdateModalOpen(false)
          setSelectedLead(null)
        }}
        onSubmit={handleStatusUpdate}
      />
    </div>
  )
}

