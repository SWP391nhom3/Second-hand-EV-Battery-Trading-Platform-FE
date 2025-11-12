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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { appointmentCreateSchema } from '@/lib/validations/appointment.validation'
import { Loader2 } from 'lucide-react'
import staffLeadService from '@/api/services/staffLead.service'

/**
 * AppointmentCreateModal Component
 * Modal form để tạo Appointment mới (UC41)
 */
export default function AppointmentCreateModal({
  isOpen,
  onClose,
  onSubmit
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [leads, setLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(false)

  const form = useForm({
    resolver: zodResolver(appointmentCreateSchema),
    defaultValues: {
      leadId: '',
      startTime: '',
      endTime: '',
      location: '',
      notes: ''
    }
  })

  // Load danh sách Leads khi modal mở
  useEffect(() => {
    if (isOpen) {
      loadLeads()
      // Reset form
      form.reset({
        leadId: '',
        startTime: '',
        endTime: '',
        location: '',
        notes: ''
      })
    }
  }, [isOpen, form])

  const loadLeads = async () => {
    try {
      setLoadingLeads(true)
      // Lấy Leads được gán và chưa có lịch hẹn (status: CONTACTED, SCHEDULED)
      const response = await staffLeadService.getLeads({
        pageNumber: 1,
        pageSize: 100,
        status: 'CONTACTED' // Chỉ lấy Leads đã liên hệ, chưa lên lịch
      })
      if (response?.success && response?.data?.data) {
        setLeads(response.data.data)
      }
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoadingLeads(false)
    }
  }

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Convert datetime-local to ISO string
      const submitData = {
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        endTime: data.endTime ? new Date(data.endTime).toISOString() : null
      }
      await onSubmit(submitData)
      form.reset()
      onClose()
    } catch (error) {
      console.error('Error creating appointment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format datetime để hiển thị trong input type="datetime-local"
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // Get min datetime (now + 1 hour)
  const getMinDateTime = () => {
    const now = new Date()
    now.setHours(now.getHours() + 1)
    return formatDateTimeLocal(now.toISOString())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo lịch hẹn mới</DialogTitle>
          <DialogDescription>
            Tạo lịch hẹn cho Lead được gán cho bạn
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="leadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={loadingLeads}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingLeads ? "Đang tải..." : "Chọn Lead"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leads.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Không có Lead nào
                        </SelectItem>
                      ) : (
                        leads.map((lead) => (
                          <SelectItem key={lead.leadId} value={lead.leadId}>
                            {lead.postTitle} - {lead.buyerName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Chọn Lead để tạo lịch hẹn
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian bắt đầu *</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? formatDateTimeLocal(field.value) : ''}
                      onChange={(e) => {
                        // Convert to ISO string
                        const value = e.target.value
                        if (value) {
                          const date = new Date(value)
                          field.onChange(date.toISOString())
                        } else {
                          field.onChange('')
                        }
                      }}
                      min={getMinDateTime()}
                    />
                  </FormControl>
                  <FormDescription>
                    Thời gian bắt đầu lịch hẹn (phải trong tương lai)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian kết thúc</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? formatDateTimeLocal(field.value) : ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value) {
                          const date = new Date(value)
                          field.onChange(date.toISOString())
                        } else {
                          field.onChange(null)
                        }
                      }}
                      min={form.watch('startTime') ? formatDateTimeLocal(form.watch('startTime')) : getMinDateTime()}
                    />
                  </FormControl>
                  <FormDescription>
                    Thời gian kết thúc lịch hẹn (tùy chọn, phải sau thời gian bắt đầu)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa điểm *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập địa điểm lịch hẹn..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Địa điểm diễn ra lịch hẹn (tối đa 500 ký tự)
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
                      placeholder="Nhập ghi chú (tùy chọn, tối đa 1000 ký tự)..."
                      className="resize-none"
                      rows={4}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Ghi chú về lịch hẹn này (tùy chọn)
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
              <Button type="submit" disabled={isSubmitting || loadingLeads}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tạo lịch hẹn
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


