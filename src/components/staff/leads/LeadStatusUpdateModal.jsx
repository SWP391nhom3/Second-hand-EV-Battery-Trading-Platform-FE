import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { leadStatusUpdateSchema } from '@/lib/validations/lead.validation'
import { Loader2 } from 'lucide-react'

/**
 * LeadStatusUpdateModal Component
 * Modal form để cập nhật trạng thái Lead (UC44)
 */
export default function LeadStatusUpdateModal({
  lead,
  isOpen,
  onClose,
  onSubmit
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(leadStatusUpdateSchema),
    defaultValues: {
      status: '',
      notes: ''
    }
  })

  // Reset form khi lead thay đổi hoặc modal mở
  useEffect(() => {
    if (isOpen && lead) {
      form.reset({
        status: lead.status || '',
        notes: lead.notes || ''
      })
    }
  }, [isOpen, lead, form])

  const handleSubmit = async (data) => {
    if (!lead) return

    setIsSubmitting(true)
    try {
      await onSubmit(lead.leadId, data)
      form.reset()
      onClose()
    } catch (error) {
      console.error('Error updating lead status:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusLabel = (status) => {
    const statusMap = {
      CONTACTED: 'Đã liên hệ',
      SCHEDULED: 'Đã lên lịch',
      SUCCESSFUL: 'Thành công',
      FAILED: 'Thất bại'
    }
    return statusMap[status] || status
  }

  // Lấy danh sách trạng thái hợp lệ dựa trên trạng thái hiện tại
  const getAvailableStatuses = () => {
    if (!lead || !lead.status) {
      // Nếu không có trạng thái hiện tại, trả về tất cả
      return ['CONTACTED', 'SCHEDULED', 'SUCCESSFUL', 'FAILED']
    }

    const currentStatus = lead.status.toUpperCase()

    // Nếu Lead đã ở trạng thái SCHEDULED, chỉ cho phép chuyển về CONTACTED
    if (currentStatus === 'SCHEDULED') {
      return ['CONTACTED']
    }

    // Nếu Lead đã ở trạng thái CONTACTED, chỉ cho phép chuyển về SUCCESSFUL hoặc FAILED
    if (currentStatus === 'CONTACTED') {
      return ['SUCCESSFUL', 'FAILED']
    }

    // Các trạng thái khác (NEW, ASSIGNED) có thể chuyển sang CONTACTED hoặc SCHEDULED
    return ['CONTACTED', 'SCHEDULED']
  }

  const availableStatuses = getAvailableStatuses()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái Lead</DialogTitle>
          <DialogDescription>
            {lead?.status?.toUpperCase() === 'SCHEDULED' 
              ? 'Lead đã lên lịch. Bạn chỉ có thể chuyển về "Đã liên hệ".'
              : lead?.status?.toUpperCase() === 'CONTACTED'
              ? 'Lead đã liên hệ. Bạn chỉ có thể chuyển về "Thành công" hoặc "Thất bại".'
              : 'Cập nhật trạng thái và ghi chú cho Lead này'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableStatuses.includes('CONTACTED') && (
                        <SelectItem value="CONTACTED">
                          {getStatusLabel('CONTACTED')}
                        </SelectItem>
                      )}
                      {availableStatuses.includes('SCHEDULED') && (
                        <SelectItem value="SCHEDULED">
                          {getStatusLabel('SCHEDULED')}
                        </SelectItem>
                      )}
                      {availableStatuses.includes('SUCCESSFUL') && (
                        <SelectItem value="SUCCESSFUL">
                          {getStatusLabel('SUCCESSFUL')}
                        </SelectItem>
                      )}
                      {availableStatuses.includes('FAILED') && (
                        <SelectItem value="FAILED">
                          {getStatusLabel('FAILED')}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {lead?.status?.toUpperCase() === 'SCHEDULED'
                      ? 'Chỉ có thể chuyển về "Đã liên hệ"'
                      : lead?.status?.toUpperCase() === 'CONTACTED'
                      ? 'Chỉ có thể chuyển về "Thành công" hoặc "Thất bại"'
                      : 'Chọn trạng thái mới cho Lead này'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập ghi chú (tùy chọn, tối đa 2000 ký tự)..."
                      className="resize-none"
                      rows={4}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Ghi chú về Lead này (tùy chọn)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cập nhật
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

