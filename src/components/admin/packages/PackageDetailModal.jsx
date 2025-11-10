import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import PackageStatusBadge from './PackageStatusBadge'
import adminPackageService from '@/api/services/adminPackage.service'
import { toast } from 'sonner'
import { Loader2, Package, DollarSign, Star, Image, Calendar, Edit } from 'lucide-react'

/**
 * PackageDetailModal Component
 * Hiển thị chi tiết gói tin
 */
export default function PackageDetailModal({ packageId, open, onOpenChange, onEdit }) {
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && packageId) {
      loadPackageDetail()
    }
  }, [open, packageId])

  const loadPackageDetail = async () => {
    try {
      setLoading(true)
      const response = await adminPackageService.getPackageById(packageId)
      if (response.success) {
        setPackageData(response.data)
      } else {
        toast.error(response.message || 'Không thể tải thông tin gói tin')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải thông tin gói tin')
      console.error('Error loading package detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết gói tin</DialogTitle>
            <DialogDescription>
              Đang tải thông tin gói tin...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-primary/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="text-sm text-gray-500 animate-pulse">Đang tải...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!packageData) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết gói tin</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về gói tin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 animate-fade-in">
          {/* Package Info */}
          <div className="space-y-4 animate-slide-in-right">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-200 hover:scale-105">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {packageData.name}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {packageData.id}</p>
                </div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <PackageStatusBadge isActive={packageData.isActive} />
              </div>
            </div>

            {/* Package Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Giá:</span>
                <span className="font-medium">{formatCurrency(packageData.price)}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Star className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Credits:</span>
                <span className="font-medium">{packageData.creditsCount}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Star className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Mức ưu tiên:</span>
                <span className="font-medium">{packageData.priorityLevel}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Image className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Ảnh tối đa:</span>
                <span className="font-medium">{packageData.maxImages}</span>
              </div>

              <div className="flex items-center gap-3 text-sm md:col-span-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Ngày tạo:</span>
                <span className="font-medium">{formatDate(packageData.createdAt)}</span>
              </div>
            </div>

            {/* Package Description */}
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-900 mb-2">Thông tin gói tin</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tên gói tin:</span>
                  <span className="text-sm font-medium">{packageData.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Giá:</span>
                  <span className="text-sm font-medium">{formatCurrency(packageData.price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Số credits:</span>
                  <span className="text-sm font-medium">{packageData.creditsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mức ưu tiên:</span>
                  <span className="text-sm font-medium">{packageData.priorityLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Số ảnh tối đa:</span>
                  <span className="text-sm font-medium">{packageData.maxImages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trạng thái:</span>
                  <PackageStatusBadge isActive={packageData.isActive} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={() => {
            onEdit(packageData)
            onOpenChange(false)
          }}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

