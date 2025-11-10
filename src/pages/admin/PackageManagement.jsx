import { useState, useEffect, useCallback } from 'react'
import { Package, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PackageList from '@/components/admin/packages/PackageList'
import PackageFilter from '@/components/admin/packages/PackageFilter'
import PackageDetailModal from '@/components/admin/packages/PackageDetailModal'
import PackageForm from '@/components/admin/packages/PackageForm'
import adminPackageService from '@/api/services/adminPackage.service'
import { toast } from 'sonner'

/**
 * PackageManagement Page
 * Trang quản lý gói tin (UC48) với smooth loading và optimistic updates
 */
export default function PackageManagement() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [filters, setFilters] = useState({
    keyword: null,
    isActive: null
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Modal states
  const [selectedPackageId, setSelectedPackageId] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)

  // Debounced filter changes - chỉ load khi filter thực sự thay đổi
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
      loadPackages()
      return
    }

    // Debounce filter changes (trừ initial load)
    const timer = setTimeout(() => {
      loadPackages()
    }, 300)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters.keyword, filters.isActive])

  const loadPackages = useCallback(async (showLoading = true) => {
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
      if (filters.isActive !== null && filters.isActive !== undefined) {
        params.isActive = filters.isActive
      }

      const response = await adminPackageService.getPackages(params)
      
      if (response && response.success) {
        // Response structure: { success, message, data: [...], pageNumber, pageSize, totalCount, totalPages }
        const packagesArray = Array.isArray(response.data) ? response.data : []
        
        // Smooth transition khi data thay đổi
        setPackages((prevPackages) => {
          // Giữ lại data cũ trong quá trình transition
          return packagesArray
        })
        
        setPagination({
          pageNumber: response.pageNumber || 1,
          pageSize: response.pageSize || 10,
          totalCount: response.totalCount || 0,
          totalPages: response.totalPages || 1
        })
      } else {
        toast.error(response?.message || 'Không thể tải danh sách gói tin')
        setPackages([])
        setPagination(null)
      }
    } catch (error) {
      console.error('Error loading packages:', error)
      toast.error(error?.response?.data?.message || 'Đã xảy ra lỗi khi tải danh sách gói tin')
      setPackages([])
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
      if (newFilters.isActive !== undefined && newFilters.isActive !== prev.isActive) {
        setCurrentPage(1)
      }
      return updated
    })
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters({
      keyword: null,
      isActive: null
    })
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage)
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleViewDetail = useCallback((packageId) => {
    setSelectedPackageId(packageId)
    setDetailModalOpen(true)
  }, [])

  const handleEdit = useCallback((packageData) => {
    setSelectedPackage(packageData)
    setFormModalOpen(true)
  }, [])

  const handleCreate = useCallback(() => {
    setSelectedPackage(null)
    setFormModalOpen(true)
  }, [])

  // Optimistic update cho toggle status
  const handleToggleStatus = useCallback(async (packageId, currentStatus) => {
    // Optimistic update - update UI trước
    setPackages((prevPackages) =>
      prevPackages.map((pkg) =>
        pkg.id === packageId
          ? { ...pkg, isActive: !currentStatus }
          : pkg
      )
    )

    try {
      const response = await adminPackageService.togglePackageStatus(packageId)
      if (response.success) {
        toast.success(`Đã ${!currentStatus ? 'kích hoạt' : 'vô hiệu hóa'} gói tin thành công`)
        // Reload để đảm bảo data sync
        loadPackages(false) // Không show loading để smooth hơn
      } else {
        // Rollback nếu có lỗi
        setPackages((prevPackages) =>
          prevPackages.map((pkg) =>
            pkg.id === packageId
              ? { ...pkg, isActive: currentStatus }
              : pkg
          )
        )
        toast.error(response.message || 'Không thể thay đổi trạng thái gói tin')
      }
    } catch (error) {
      // Rollback nếu có lỗi
      setPackages((prevPackages) =>
        prevPackages.map((pkg) =>
          pkg.id === packageId
            ? { ...pkg, isActive: currentStatus }
            : pkg
        )
      )
      toast.error('Đã xảy ra lỗi khi thay đổi trạng thái gói tin')
      console.error('Error toggling package status:', error)
    }
  }, [loadPackages])

  const handleFormSuccess = useCallback((updatedPackage) => {
    // Optimistic update nếu là update
    if (updatedPackage?.id) {
      setPackages((prevPackages) =>
        prevPackages.map((pkg) =>
          pkg.id === updatedPackage.id ? updatedPackage : pkg
        )
      )
    }
    // Reload để đảm bảo data sync (silent reload)
    loadPackages(false)
  }, [loadPackages])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in animate-slide-in-right">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 transition-transform duration-200 hover:scale-110" />
            Quản lý gói tin
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý các gói tin trong hệ thống
          </p>
        </div>
        <Button 
          onClick={handleCreate} 
          className="gap-2 transition-all duration-200 hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Tạo gói tin mới
        </Button>
      </div>

      {/* Filters */}
      <div className="animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <PackageFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          isSearching={loading}
        />
      </div>

      {/* Package List with smooth transitions */}
      <div className="animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
        <PackageList
          packages={packages}
          loading={loading}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      <PackageDetailModal
        packageId={selectedPackageId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onEdit={handleEdit}
      />

      <PackageForm
        packageData={selectedPackage}
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}

