import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { updateProfileSchema } from '@/lib/validations/user.validation'
import userService from '@/api/services/user.service'
import AvatarUpload from './AvatarUpload'

/**
 * UC04: ProfileForm Component
 * Form để cập nhật thông tin cá nhân
 */
export default function ProfileForm({ 
  initialData, 
  onSuccess 
}) {
  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      address: initialData?.address || '',
      avatarUrl: initialData?.avatarUrl || '',
      idNumber: initialData?.idNumber || ''
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || null)

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)

      // Prepare update data (only include changed fields)
      const updateData = {}
      if (data.fullName !== initialData?.fullName) {
        updateData.fullName = data.fullName || null
      }
      if (data.address !== initialData?.address) {
        updateData.address = data.address || null
      }
      if (data.idNumber !== initialData?.idNumber) {
        updateData.idNumber = data.idNumber || null
      }
      if (avatarUrl !== initialData?.avatarUrl) {
        updateData.avatarUrl = avatarUrl || null
      }

      // Check if there are any changes
      if (Object.keys(updateData).length === 0) {
        toast.info('Không có thay đổi nào để cập nhật')
        return
      }

      const response = await userService.updateProfile(updateData)

      if (response.success) {
        toast.success('Cập nhật thông tin thành công!')
        onSuccess?.(response.data)
      } else {
        toast.error(response.message || 'Cập nhật thông tin thất bại')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex justify-center">
          <AvatarUpload
            currentAvatarUrl={avatarUrl}
            onAvatarChange={setAvatarUrl}
            disabled={isSubmitting}
          />
        </div>

        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập họ và tên"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Tối đa 100 ký tự
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập địa chỉ"
                  rows={3}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Tối đa 500 ký tự
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ID Number */}
        <FormField
          control={form.control}
          name="idNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số CMND/CCCD</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập số CMND/CCCD (9-12 chữ số)"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Số CMND/CCCD phải có 9-12 chữ số
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

