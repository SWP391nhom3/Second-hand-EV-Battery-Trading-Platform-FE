import { useState, useEffect, useCallback } from 'react'
import { FileText, Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ContractTemplateList from '@/components/admin/contracts/ContractTemplateList'
import ContractTemplateFilter from '@/components/admin/contracts/ContractTemplateFilter'
import ContractTemplateDetailModal from '@/components/admin/contracts/ContractTemplateDetailModal'
import ContractTemplateForm from '@/components/admin/contracts/ContractTemplateForm'
import adminContractTemplateService from '@/api/services/adminContractTemplate.service'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

/**
 * ContractTemplateManagement Page
 * Trang quản lý mẫu hợp đồng (UC49) với smooth loading và optimistic updates
 */
export default function ContractTemplateManagement() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [filters, setFilters] = useState({
    keyword: null,
    categoryId: null,
    isActive: null
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Modal states
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState(null)

  // Debounced filter changes - chỉ load khi filter thực sự thay đổi
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
      loadTemplates()
      return
    }

    // Debounce filter changes (trừ initial load)
    const timer = setTimeout(() => {
      loadTemplates()
    }, 300)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters.keyword, filters.categoryId, filters.isActive])

  const loadTemplates = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      }
      
      // Chỉ gửi filter khi có giá trị (không phải null/undefined)
      const params = {
        pageNumber: currentPage,
        pageSize: pageSize
      }
      
      if (filters.keyword) {
        params.keyword = filters.keyword
      }
      if (filters.categoryId !== null && filters.categoryId !== undefined) {
        params.categoryId = filters.categoryId
      }
      if (filters.isActive !== null && filters.isActive !== undefined) {
        params.isActive = filters.isActive
      }

      const response = await adminContractTemplateService.getContractTemplates(params)
      
      if (response && response.success) {
        // Response structure từ BE:
        // {
        //   success: true,
        //   data: {
        //     pageNumber: 1,
        //     pageSize: 10,
        //     totalCount: 3,
        //     totalPages: 1,
        //     data: [...] // mảng templates
        //   }
        // }
        
        const pagedData = response.data
        
        // Lấy mảng templates từ data.data
        const templatesArray = Array.isArray(pagedData?.data) 
          ? pagedData.data 
          : (Array.isArray(response.data) ? response.data : [])
        
        // Smooth transition khi data thay đổi
        setTemplates(templatesArray)
        
        // Set pagination từ data object
        if (pagedData && typeof pagedData === 'object' && 'pageNumber' in pagedData) {
          setPagination({
            pageNumber: pagedData.pageNumber || 1,
            pageSize: pagedData.pageSize || 10,
            totalCount: pagedData.totalCount || templatesArray.length,
            totalPages: pagedData.totalPages || 1
          })
        } else if (response.pageNumber !== undefined) {
          // Fallback: nếu pagination ở root level (old format)
          setPagination({
            pageNumber: response.pageNumber || 1,
            pageSize: response.pageSize || 10,
            totalCount: response.totalCount || templatesArray.length,
            totalPages: response.totalPages || 1
          })
        } else {
          // Nếu không có pagination trong response, tạo pagination giả từ data
          setPagination({
            pageNumber: 1,
            pageSize: templatesArray.length,
            totalCount: templatesArray.length,
            totalPages: 1
          })
        }
      } else {
        toast.error(response?.message || 'Không thể tải danh sách mẫu hợp đồng')
        setTemplates([])
        setPagination(null)
      }
    } catch (error) {
      console.error('Error loading contract templates:', error)
      toast.error(error?.response?.data?.message || 'Đã xảy ra lỗi khi tải danh sách mẫu hợp đồng')
      setTemplates([])
      setPagination(null)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [currentPage, filters, pageSize])

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters }
      // Reset page về 1 khi filter thay đổi (trừ khi chỉ là keyword search)
      if (newFilters.categoryId !== undefined && newFilters.categoryId !== prev.categoryId) {
        setCurrentPage(1)
      }
      if (newFilters.isActive !== undefined && newFilters.isActive !== prev.isActive) {
        setCurrentPage(1)
      }
      return updated
    })
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters({
      keyword: null,
      categoryId: null,
      isActive: null
    })
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage)
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleViewDetail = useCallback((templateId) => {
    setSelectedTemplateId(templateId)
    setDetailModalOpen(true)
  }, [])

  const handleEdit = useCallback((templateData) => {
    setSelectedTemplate(templateData)
    setFormModalOpen(true)
  }, [])

  const handleCreate = useCallback(() => {
    setSelectedTemplate(null)
    setFormModalOpen(true)
  }, [])

  const handleDelete = useCallback((templateId) => {
    setTemplateToDelete(templateId)
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!templateToDelete) return

    try {
      const response = await adminContractTemplateService.deleteContractTemplate(templateToDelete)
      if (response.success) {
        toast.success('Xóa mẫu hợp đồng thành công')
        setDeleteDialogOpen(false)
        setTemplateToDelete(null)
        // Reload để đảm bảo data sync
        loadTemplates(false)
      } else {
        toast.error(response.message || 'Không thể xóa mẫu hợp đồng')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi xóa mẫu hợp đồng')
      console.error('Error deleting contract template:', error)
    }
  }, [templateToDelete, loadTemplates])

  // Optimistic update cho toggle status
  const handleToggleStatus = useCallback(async (templateId, currentStatus) => {
    // Optimistic update - update UI trước
    setTemplates((prevTemplates) =>
      prevTemplates.map((t) =>
        t.templateId === templateId
          ? { ...t, isActive: !currentStatus }
          : t
      )
    )

    try {
      const response = await adminContractTemplateService.toggleContractTemplateStatus(templateId)
      if (response.success) {
        toast.success(`Đã ${!currentStatus ? 'kích hoạt' : 'vô hiệu hóa'} mẫu hợp đồng thành công`)
        // Reload để đảm bảo data sync
        loadTemplates(false) // Không show loading để smooth hơn
      } else {
        // Rollback nếu có lỗi
        setTemplates((prevTemplates) =>
          prevTemplates.map((t) =>
            t.templateId === templateId
              ? { ...t, isActive: currentStatus }
              : t
          )
        )
        toast.error(response.message || 'Không thể thay đổi trạng thái mẫu hợp đồng')
      }
    } catch (error) {
      // Rollback nếu có lỗi
      setTemplates((prevTemplates) =>
        prevTemplates.map((t) =>
          t.templateId === templateId
            ? { ...t, isActive: currentStatus }
            : t
        )
      )
      toast.error('Đã xảy ra lỗi khi thay đổi trạng thái mẫu hợp đồng')
      console.error('Error toggling contract template status:', error)
    }
  }, [loadTemplates])

  const handleFormSuccess = useCallback((updatedTemplate) => {
    // Optimistic update nếu là update
    if (updatedTemplate?.templateId) {
      setTemplates((prevTemplates) =>
        prevTemplates.map((t) =>
          t.templateId === updatedTemplate.templateId ? updatedTemplate : t
        )
      )
    }
    // Reload để đảm bảo data sync (silent reload)
    loadTemplates(false)
  }, [loadTemplates])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in animate-slide-in-right">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 transition-transform duration-200 hover:scale-110" />
            Quản lý mẫu hợp đồng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý các mẫu hợp đồng trong hệ thống (UC49)
          </p>
        </div>
        <Button 
          onClick={handleCreate} 
          className="gap-2 transition-all duration-200 hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Tạo mẫu hợp đồng mới
        </Button>
      </div>

      {/* Filters */}
      <div className="animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <ContractTemplateFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          isSearching={loading}
        />
      </div>

      {/* Template List with smooth transitions */}
      <div className="animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
        <ContractTemplateList
          templates={templates}
          loading={loading}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      <ContractTemplateDetailModal
        templateId={selectedTemplateId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onEdit={handleEdit}
      />

      <ContractTemplateForm
        templateData={selectedTemplate}
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Xác nhận xóa mẫu hợp đồng
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mẫu hợp đồng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

