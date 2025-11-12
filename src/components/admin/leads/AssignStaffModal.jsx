import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import adminService from '@/api/services/admin.service'
import { toast } from 'sonner'
import { leadAssignStaffSchema } from '@/lib/validations/lead.validation'

/**
 * AssignStaffModal Component
 * Modal gán Staff cho Lead
 */
export default function AssignStaffModal({
  lead,
  isOpen,
  onClose,
  onSuccess
}) {
  const [staffId, setStaffId] = useState('')
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingStaff, setLoadingStaff] = useState(false)
  const [errors, setErrors] = useState({})

  // Load staff list when modal opens
  useEffect(() => {
    if (isOpen) {
      loadStaffList()
      // Reset form
      setStaffId('')
      setErrors({})
    }
  }, [isOpen])

  const loadStaffList = async () => {
    try {
      setLoadingStaff(true)
      const result = await adminService.getStaffList()
      
      if (result.success) {
        setStaffList(result.data || [])
      } else {
        toast.error(result.message || 'Không thể tải danh sách Staff')
      }
    } catch (error) {
      console.error('Error loading staff list:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách Staff')
    } finally {
      setLoadingStaff(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    try {
      leadAssignStaffSchema.parse({ staffId })
      setErrors({})
    } catch (error) {
      if (error.errors) {
        const validationErrors = {}
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message
        })
        setErrors(validationErrors)
        return
      }
    }

    if (!staffId) {
      setErrors({ staffId: 'Vui lòng chọn Staff' })
      return
    }

    try {
      setLoading(true)
      const result = await adminService.assignStaffToLead(lead.leadId, staffId)
      
      if (result.success) {
        toast.success(result.message || 'Gán Staff cho Lead thành công')
        onSuccess?.(result.data)
        onClose()
      } else {
        toast.error(result.message || 'Không thể gán Staff cho Lead')
        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch (error) {
      console.error('Error assigning staff:', error)
      toast.error('Có lỗi xảy ra khi gán Staff cho Lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gán Staff cho Lead</DialogTitle>
          <DialogDescription>
            Chọn Staff để gán cho Lead này. Staff sẽ nhận được thông báo và có thể bắt đầu hỗ trợ người mua.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lead Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Bài đăng</p>
            <p className="font-medium">{lead?.postTitle || 'N/A'}</p>
            <p className="text-sm text-gray-600 mt-2">Người mua</p>
            <p className="font-medium">{lead?.buyerName || lead?.buyerEmail || 'N/A'}</p>
          </div>

          {/* Staff Selection */}
          <div className="space-y-2">
            <Label htmlFor="staff">Chọn Staff *</Label>
            <Select
              value={staffId}
              onValueChange={(value) => {
                setStaffId(value)
                setErrors({ ...errors, staffId: null })
              }}
              disabled={loadingStaff || loading}
            >
              <SelectTrigger id="staff" className={errors.staffId ? 'border-red-500' : ''}>
                <SelectValue placeholder={loadingStaff ? 'Đang tải...' : 'Chọn Staff'} />
              </SelectTrigger>
              <SelectContent>
                {staffList.length === 0 ? (
                  <SelectItem value="none" disabled>
                    {loadingStaff ? 'Đang tải...' : 'Không có Staff nào'}
                  </SelectItem>
                ) : (
                  staffList.map((staff) => (
                    <SelectItem key={staff.userId} value={staff.userId}>
                      {staff.fullName || staff.email} {staff.email && `(${staff.email})`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.staffId && (
              <p className="text-sm text-red-500">{errors.staffId}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading || !staffId || staffList.length === 0}
            >
              {loading ? 'Đang xử lý...' : 'Gán Staff'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

