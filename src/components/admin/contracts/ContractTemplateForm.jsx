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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { contractTemplateCreateSchema, contractTemplateUpdateSchema } from '@/lib/validations/contract.validation'
import adminContractTemplateService from '@/api/services/adminContractTemplate.service'
import axiosInstance from '@/api/axios.config'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

/**
 * ContractTemplateForm Component
 * Form tạo/chỉnh sửa mẫu hợp đồng
 */
export default function ContractTemplateForm({ templateData, open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const isEdit = !!templateData

  const form = useForm({
    resolver: zodResolver(isEdit ? contractTemplateUpdateSchema : contractTemplateCreateSchema),
    defaultValues: {
      templateName: '',
      templateContent: '',
      categoryId: null,
      isActive: true
    }
  })

  // Load categories
  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  const loadCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await axiosInstance.get('/categories')
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Không thể tải danh sách danh mục')
    } finally {
      setLoadingCategories(false)
    }
  }

  useEffect(() => {
    if (templateData) {
      form.reset({
        templateName: templateData.templateName || '',
        templateContent: templateData.templateContent || '',
        categoryId: templateData.categoryId || null,
        isActive: templateData.isActive !== undefined ? templateData.isActive : true
      })
    } else {
      form.reset({
        templateName: '',
        templateContent: '',
        categoryId: null,
        isActive: true
      })
    }
  }, [templateData, form])

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      // Convert categoryId to number or null
      const submitData = {
        ...data,
        categoryId: data.categoryId ? parseInt(data.categoryId) : null
      }

      let response
      if (isEdit) {
        response = await adminContractTemplateService.updateContractTemplate(templateData.templateId, submitData)
      } else {
        response = await adminContractTemplateService.createContractTemplate(submitData)
      }

      if (response.success) {
        toast.success(isEdit ? 'Cập nhật mẫu hợp đồng thành công' : 'Tạo mẫu hợp đồng thành công')
        onSuccess?.(response.data)
        onOpenChange(false)
        form.reset()
      } else {
        const errorMessage = response.message || (isEdit ? 'Không thể cập nhật mẫu hợp đồng' : 'Không thể tạo mẫu hợp đồng')
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
      toast.error(isEdit ? 'Đã xảy ra lỗi khi cập nhật mẫu hợp đồng' : 'Đã xảy ra lỗi khi tạo mẫu hợp đồng')
      console.error('Error saving contract template:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa mẫu hợp đồng' : 'Tạo mẫu hợp đồng mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin mẫu hợp đồng' : 'Điền thông tin để tạo mẫu hợp đồng mới'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="templateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên mẫu hợp đồng *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Hợp đồng mua bán xe điện, Hợp đồng mua bán pin"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tên mẫu hợp đồng (tối đa 100 ký tự)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (value === 'none' || value === '') {
                        field.onChange(null)
                      } else {
                        // Convert string to number when selecting a category
                        const numValue = parseInt(value, 10)
                        field.onChange(isNaN(numValue) ? null : numValue)
                      }
                    }}
                    value={field.value ? String(field.value) : 'none'}
                    disabled={loadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục (tùy chọn)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Không có danh mục</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Chọn danh mục áp dụng cho mẫu hợp đồng này (tùy chọn)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="templateContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung mẫu hợp đồng *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập nội dung mẫu hợp đồng. Bạn có thể sử dụng các placeholder như {{buyerName}}, {{sellerName}}, {{productName}}, etc."
                      className="min-h-[300px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Nội dung mẫu hợp đồng với các placeholder như {'{{buyerName}}'}, {'{{sellerName}}'}, {'{{productName}}'}, etc. (tối đa 50000 ký tự)
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
                    Mẫu hợp đồng sẽ được hiển thị và có thể sử dụng khi được kích hoạt
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

