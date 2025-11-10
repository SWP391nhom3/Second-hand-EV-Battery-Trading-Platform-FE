import { useState, useEffect } from 'react'
import { UserCheck, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import adminService from '@/api/services/admin.service'
import { toast } from 'sonner'
import LeadFilter from '@/components/admin/leads/LeadFilter'
import LeadList from '@/components/admin/leads/LeadList'
import LeadDetailModal from '@/components/admin/leads/LeadDetailModal'
import AssignStaffModal from '@/components/admin/leads/AssignStaffModal'
import StatsCardSkeleton from '@/components/admin/leads/StatsCardSkeleton'

/**
 * UC46: Admin Lead Management
 * - Xem danh sách Lead mới
 * - Gán Staff cho Lead
 */
const LeadManagement = () => {
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [leadTypeFilter, setLeadTypeFilter] = useState('ALL')
  
  // Pagination states
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAssignStaffModal, setShowAssignStaffModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    assigned: 0,
    contacted: 0,
    scheduled: 0,
    successful: 0,
    failed: 0
  })

  // Fetch leads
  useEffect(() => {
    fetchLeads()
  }, [pageNumber, statusFilter, leadTypeFilter])

  // Initialize filteredLeads when leads change
  useEffect(() => {
    if (leads.length > 0) {
      console.log('🔄 Lead Management - Leads state updated:', leads.length, 'leads')
      setFilteredLeads(leads)
    }
  }, [leads])

  // Debounced filter leads when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      // Nếu không có search term, dùng leads gốc
      setFilteredLeads(leads)
      return
    }

    const timer = setTimeout(() => {
      filterLeads()
    }, 300) // Debounce 300ms

    return () => clearTimeout(timer)
  }, [searchTerm, leads])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setStatsLoading(true)
      const params = {
        pageNumber,
        pageSize,
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(leadTypeFilter !== 'ALL' && { leadType: leadTypeFilter }),
        sortBy: 'CreatedAt',
        sortOrder: 'DESC'
      }

      const result = await adminService.getLeads(params)
      
      console.log('🔍 Lead Management - Raw API Response:', result)
      console.log('🔍 Lead Management - Response keys:', result ? Object.keys(result) : 'null')
      console.log('🔍 Lead Management - Data is Array?', Array.isArray(result?.data))
      console.log('🔍 Lead Management - Data length:', result?.data?.length)
      
      // PagedResponse<T> structure: { success, message, data: List<T>, pageNumber, pageSize, totalCount, totalPages, ... }
      // Backend trả về PagedResponse<LeadResponse> với data là array trực tiếp
      if (result && result.success === true && Array.isArray(result.data)) {
        const leadsData = result.data
        
        console.log('✅ Lead Management - Success!')
        console.log('✅ Leads Data:', leadsData)
        console.log('✅ Leads Count:', leadsData.length)
        console.log('✅ Total Count:', result.totalCount)
        console.log('✅ Total Pages:', result.totalPages)
        console.log('✅ Page Number:', result.pageNumber)
        console.log('✅ Page Size:', result.pageSize)
        
        // Set state với data từ API
        setLeads(leadsData)
        setTotalCount(result.totalCount ?? 0)
        setTotalPages(result.totalPages ?? Math.ceil((result.totalCount ?? 0) / pageSize))
        
        // Calculate stats từ leads hiện tại (chỉ page hiện tại)
        calculateStats(leadsData, result.totalCount)
      } else if (result && result.success === false) {
        // Error response
        const errorMessage = result.message || 'Không thể tải danh sách Lead'
        console.error('❌ Lead Management - Error:', errorMessage, result)
        toast.error(errorMessage)
        setLeads([])
        setTotalCount(0)
        setTotalPages(0)
      } else {
        // Unexpected response format
        console.error('❌ Lead Management - Unexpected response format:', result)
        console.error('❌ Expected: { success: true, data: [...], totalCount: number, ... }')
        toast.error('Định dạng phản hồi không đúng từ server')
        setLeads([])
        setTotalCount(0)
        setTotalPages(0)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách Lead')
      setLeads([])
    } finally {
      setLoading(false)
      setStatsLoading(false)
    }
  }

  const calculateStats = (leadsData, totalCountFromBackend = 0) => {
    // Tính stats từ leads hiện tại (có thể chỉ là 1 page)
    // Note: Stats chỉ hiển thị từ page hiện tại, không phải tất cả leads
    // Nếu cần stats chính xác, backend nên trả về stats riêng
    const statsData = {
      total: totalCountFromBackend || leadsData.length,
      new: 0,
      assigned: 0,
      contacted: 0,
      scheduled: 0,
      successful: 0,
      failed: 0
    }

    // Tính stats từ data hiện tại (chỉ là 1 page)
    leadsData.forEach(lead => {
      if (!lead || !lead.status) return
      
      switch (lead.status.toUpperCase()) {
        case 'NEW':
          statsData.new++
          break
        case 'ASSIGNED':
          statsData.assigned++
          break
        case 'CONTACTED':
          statsData.contacted++
          break
        case 'SCHEDULED':
          statsData.scheduled++
          break
        case 'SUCCESSFUL':
          statsData.successful++
          break
        case 'FAILED':
          statsData.failed++
          break
      }
    })

    setStats(statsData)
  }

  const filterLeads = () => {
    if (!searchTerm.trim()) {
      setFilteredLeads(leads)
      return
    }

    let filtered = [...leads]

    // Filter by search term
    const term = searchTerm.toLowerCase().trim()
    filtered = filtered.filter(lead => {
      if (!lead) return false
      return (
        lead.postTitle?.toLowerCase().includes(term) ||
        lead.buyerName?.toLowerCase().includes(term) ||
        lead.buyerEmail?.toLowerCase().includes(term) ||
        lead.staffName?.toLowerCase().includes(term)
      )
    })

    console.log('🔍 Lead Management - Filtered leads:', filtered.length, 'from', leads.length)
    setFilteredLeads(filtered)
  }

  const handleViewDetail = (lead) => {
    setSelectedLead(lead)
    setShowDetailModal(true)
  }

  const handleAssignStaff = (lead) => {
    setSelectedLead(lead)
    setShowAssignStaffModal(true)
  }

  const handleAssignStaffSuccess = (updatedLead) => {
    // Update the lead in the list
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.leadId === updatedLead.leadId ? updatedLead : lead
      )
    )
    setSelectedLead(updatedLead)
    // Refresh leads
    fetchLeads()
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setStatusFilter('ALL')
    setLeadTypeFilter('ALL')
    setPageNumber(1)
  }

  const handlePageChange = (newPage) => {
    setPageNumber(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Quản lý Lead</h1>
        <p className="text-gray-600 mt-1">Xem danh sách Lead và gán Staff</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        {statsLoading ? (
          Array.from({ length: 7 }).map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))
        ) : (
          <>
            <div 
              className="bg-white rounded-lg shadow p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in zoom-in-95"
              style={{ animationDelay: '100ms' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng Lead</p>
                  <p className="text-2xl font-bold text-gray-900 transition-all duration-300">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full transition-transform duration-300 hover:scale-110">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in zoom-in-95"
              style={{ animationDelay: '150ms' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mới</p>
                  <p className="text-2xl font-bold text-yellow-600 transition-all duration-300">{stats.new}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full transition-transform duration-300 hover:scale-110">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in zoom-in-95"
              style={{ animationDelay: '200ms' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã gán</p>
                  <p className="text-2xl font-bold text-blue-600 transition-all duration-300">{stats.assigned}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full transition-transform duration-300 hover:scale-110">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in zoom-in-95"
              style={{ animationDelay: '250ms' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã liên hệ</p>
                  <p className="text-2xl font-bold text-purple-600 transition-all duration-300">{stats.contacted}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full transition-transform duration-300 hover:scale-110">
                  <AlertCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in zoom-in-95"
              style={{ animationDelay: '300ms' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã lên lịch</p>
                  <p className="text-2xl font-bold text-indigo-600 transition-all duration-300">{stats.scheduled}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full transition-transform duration-300 hover:scale-110">
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in zoom-in-95"
              style={{ animationDelay: '350ms' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Thành công</p>
                  <p className="text-2xl font-bold text-green-600 transition-all duration-300">{stats.successful}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full transition-transform duration-300 hover:scale-110">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in zoom-in-95"
              style={{ animationDelay: '400ms' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Thất bại</p>
                  <p className="text-2xl font-bold text-red-600 transition-all duration-300">{stats.failed}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full transition-transform duration-300 hover:scale-110">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <LeadFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          leadTypeFilter={leadTypeFilter}
          onLeadTypeFilterChange={setLeadTypeFilter}
          onReset={handleResetFilters}
        />
      </div>

      {/* Leads Table */}
      <div 
        key={`leads-${statusFilter}-${leadTypeFilter}-${pageNumber}`}
        className="animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <LeadList
          leads={searchTerm.trim() ? filteredLeads : leads}
          loading={loading}
          onViewDetail={handleViewDetail}
          onAssignStaff={handleAssignStaff}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2 animate-in fade-in duration-500 delay-400">
          <button
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
          >
            Trước
          </button>
          <span className="px-4 py-2 text-sm text-gray-600 font-medium">
            Trang {pageNumber} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modals */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      <AssignStaffModal
        lead={selectedLead}
        isOpen={showAssignStaffModal}
        onClose={() => setShowAssignStaffModal(false)}
        onSuccess={handleAssignStaffSuccess}
      />
    </div>
  )
}

export default LeadManagement

