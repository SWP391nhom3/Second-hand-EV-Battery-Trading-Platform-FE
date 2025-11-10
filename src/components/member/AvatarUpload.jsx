import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import userService from '@/api/services/user.service'

/**
 * UC04: AvatarUpload Component
 * Component upload ảnh đại diện với preview
 */
export default function AvatarUpload({ 
  currentAvatarUrl, 
  onAvatarChange,
  disabled = false 
}) {
  const [preview, setPreview] = useState(currentAvatarUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to server
    try {
      setIsUploading(true)
      const response = await userService.uploadAvatar(file)
      
      if (response.success && response.data?.avatarUrl) {
        setPreview(response.data.avatarUrl)
        onAvatarChange?.(response.data.avatarUrl)
        toast.success('Cập nhật ảnh đại diện thành công!')
      } else {
        toast.error(response.message || 'Cập nhật ảnh đại diện thất bại')
        setPreview(currentAvatarUrl || null)
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Có lỗi xảy ra khi upload ảnh')
      setPreview(currentAvatarUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onAvatarChange?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-4xl">
              <Upload className="h-12 w-12" />
            </div>
          )}
        </div>
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {preview ? 'Thay đổi ảnh' : 'Chọn ảnh'}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <p className="text-xs text-gray-500 text-center">
        Định dạng: JPG, PNG. Kích thước tối đa: 5MB
      </p>
    </div>
  )
}


