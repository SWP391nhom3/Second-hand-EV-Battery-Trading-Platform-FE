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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { appointmentUpdateSchema } from '@/lib/validations/appointment.validation'
import { Loader2 } from 'lucide-react'

/**
 * AppointmentUpdateModal Component
 * Modal form để cập nhật Appointment (UC42)
 */
export default function AppointmentUpdateModal({
  appointment,
  isOpen,
  onClose,
  onSubmit
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(appointmentUpdateSchema),
    defaultValues: {
      startTime: '',
      endTime: '',
      location: '',
      notes: '',
      status: ''
    }
  })

  // Reset form khi appointment thay đổi hoặc modal mở
  useEffect(() => {
    if (isOpen && appointment) {
      form.reset({
        startTime: appointment.startTime || '',
        endTime: appointment.endTime || '',
        location: appointment.location || '',
        notes: appointment.notes || '',
        status: appointment.status || ''
      })
    }
  }, [isOpen, appointment, form])

  const handleSubmit = async (data) => {
    if (!appointment) return

    setIsSubmitting(true)
    try {
      // Convert datetime-local to ISO string nếu có
      const submitData = {
        ...data,
        startTime: data.startTime ? new Date(data.startTime).toISOString() : null,
        endTime: data.endTime ? new Date(data.endTime).toISOString() : null
      }
      await onSubmit(appointment.appointmentId, submitData)
      form.reset()
      onClose()
    } catch (error) {
      console.error('Error updating appointment:', error)
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

  // Get min datetime (now)
  const getMinDateTime = () => {
    const now = new Date()
    return formatDateTimeLocal(now.toISOString())
  }

  if (!appointment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật lịch hẹn</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin lịch hẹn
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian bắt đầu</FormLabel>
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
                      min={getMinDateTime()}
                    />
                  </FormControl>
                  <FormDescription>
                    Thời gian bắt đầu lịch hẹn (phải trong tương lai nếu cập nhật)
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
                    Thời gian kết thúc lịch hẹn (phải sau thời gian bắt đầu)
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
                  <FormLabel>Địa điểm</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập địa điểm lịch hẹn..."
                      {...field}
                      value={field.value || ''}
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


