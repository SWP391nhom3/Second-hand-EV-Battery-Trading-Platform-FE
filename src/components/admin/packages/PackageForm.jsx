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
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { packageCreateSchema, packageUpdateSchema } from '@/lib/validations/package.validation'
import adminPackageService from '@/api/services/adminPackage.service'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

/**
 * PackageForm Component
 * Form tạo/chỉnh sửa gói tin
 */
export default function PackageForm({ packageData, open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!packageData

  const form = useForm({
    resolver: zodResolver(isEdit ? packageUpdateSchema : packageCreateSchema),
    defaultValues: {
      name: '',
      price: 0,
      creditsCount: 0,
      priorityLevel: 1,
      maxImages: 5,
      isActive: true
    }
  })

  useEffect(() => {
    if (packageData) {
      form.reset({
        name: packageData.name || '',
        price: packageData.price || 0,
        creditsCount: packageData.creditsCount || 0,
        priorityLevel: packageData.priorityLevel || 1,
        maxImages: packageData.maxImages || 5,
        isActive: packageData.isActive !== undefined ? packageData.isActive : true
      })
    } else {
      form.reset({
        name: '',
        price: 0,
        creditsCount: 0,
        priorityLevel: 1,
        maxImages: 5,
        isActive: true
      })
    }
  }, [packageData, form])

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      let response
      if (isEdit) {
        response = await adminPackageService.updatePackage(packageData.id, data)
      } else {
        response = await adminPackageService.createPackage(data)
      }

      if (response.success) {
        toast.success(isEdit ? 'Cập nhật gói tin thành công' : 'Tạo gói tin thành công')
        onSuccess?.(response.data)
        onOpenChange(false)
        form.reset()
      } else {
        const errorMessage = response.message || (isEdit ? 'Không thể cập nhật gói tin' : 'Không thể tạo gói tin')
        const errors = response.errors || []
        if (errors.length > 0) {
          errors.forEach((error) => {
            toast.error(error)
          })
        } else {
          toast.error(errorMessage)
        }
      }
    } catch (error) {
      toast.error(isEdit ? 'Đã xảy ra lỗi khi cập nhật gói tin' : 'Đã xảy ra lỗi khi tạo gói tin')
      console.error('Error saving package:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa gói tin' : 'Tạo gói tin mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin gói tin' : 'Điền thông tin để tạo gói tin mới'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên gói tin *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Basic, Premium, Luxury"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tên gói tin chỉ được chứa chữ cái, số và khoảng trắng (tối đa 50 ký tự)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá (VNĐ) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Giá gói tin tính bằng VNĐ (tối đa 1,000,000,000 VNĐ)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creditsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số credits *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Số lượng credits được cấp khi mua gói (tối đa 1000)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priorityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mức độ ưu tiên *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức độ ưu tiên" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                        <SelectItem key={level} value={String(level)}>
                          {level} {level === 3 ? '(Luxury)' : level === 2 ? '(Premium)' : level === 1 ? '(Basic)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Mức độ ưu tiên từ 1 đến 10 (1=Basic, 2=Premium, 3=Luxury)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số ảnh tối đa *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                    />
                  </FormControl>
                  <FormDescription>
                    Số lượng ảnh tối đa cho phép trong bài đăng (tối đa 50)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái kích hoạt *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Đang hoạt động</SelectItem>
                      <SelectItem value="false">Đã vô hiệu hóa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Gói tin sẽ được hiển thị và có thể mua khi được kích hoạt
                  </FormDescription>
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
                {isEdit ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

