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
import { Button } from '@/components/ui/button'
import { userUpdateSchema } from '@/lib/validations/user.validation'
import adminUserService from '@/api/services/adminUser.service'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

/**
 * UserEditModal Component
 * Modal chỉnh sửa thông tin người dùng (role, status)
 */
export default function UserEditModal({ user, open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({ role: null, status: null })

  const form = useForm({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      role: undefined,
      status: undefined
    }
  })

  useEffect(() => {
    if (user) {
      const initial = {
        role: user.role || null,
        status: user.status || null
      }
      setInitialValues(initial)
      form.reset({
        role: user.role || undefined,
        status: user.status || undefined
      })
    }
  }, [user, form])

  const onSubmit = async (data) => {
    if (!user) return

    try {
      setLoading(true)
      
      // Only include fields that have changed
      const updateData = {}
      if (data.role && data.role !== initialValues.role) {
        updateData.role = data.role
      }
      if (data.status && data.status !== initialValues.status) {
        updateData.status = data.status
      }

      // Check if there are any changes
      if (Object.keys(updateData).length === 0) {
        toast.warning('Không có thay đổi nào để cập nhật')
        return
      }

      const response = await adminUserService.updateUser(user.userId, updateData)
      
      if (response.success) {
        toast.success('Cập nhật thông tin người dùng thành công')
        onSuccess?.(response.data)
        onOpenChange(false)
      } else {
        toast.error(response.message || 'Không thể cập nhật thông tin người dùng')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật thông tin người dùng')
      console.error('Error updating user:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="animate-fade-in">
        <DialogHeader className="animate-slide-in-right">
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          <DialogDescription>
            Cập nhật role và status của người dùng: {user?.email}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn role (để trống nếu không đổi)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MEMBER">Thành viên (MEMBER)</SelectItem>
                      <SelectItem value="STAFF">Nhân viên (STAFF)</SelectItem>
                      <SelectItem value="ADMIN">Quản trị viên (ADMIN)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn status (để trống nếu không đổi)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Hoạt động (ACTIVE)</SelectItem>
                      <SelectItem value="BANNED">Đã khóa (BANNED)</SelectItem>
                      <SelectItem value="SUSPENDED">Tạm khóa (SUSPENDED)</SelectItem>
                      <SelectItem value="PENDING_VERIFICATION">Chờ xác minh (PENDING_VERIFICATION)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

