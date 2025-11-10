import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, ImageIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

/**
 * Component upload và preview hình ảnh
 * Hỗ trợ drag & drop và select multiple files
 */
const PostImageUploader = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 20,
  title = "Hình ảnh sản phẩm",
  description = "Tải lên tối đa 20 hình ảnh, mỗi ảnh tối đa 5MB",
  required = true,
  error
}) => {
  const [previews, setPreviews] = useState([])

  const onDrop = (acceptedFiles) => {
    // Kiểm tra số lượng ảnh
    if (images.length + acceptedFiles.length > maxImages) {
      alert(`Chỉ được tải lên tối đa ${maxImages} hình ảnh`)
      return
    }

    // Kiểm tra kích thước file
    const invalidFiles = acceptedFiles.filter(file => file.size > 5 * 1024 * 1024)
    if (invalidFiles.length > 0) {
      alert('Có file vượt quá 5MB. Vui lòng chọn file nhỏ hơn.')
      return
    }

    // Tạo preview URLs
    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    // Update images
    const newImages = [...images, ...acceptedFiles]
    onImagesChange(newImages)
    
    // Update previews
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    // Revoke preview URL
    URL.revokeObjectURL(previews[index].preview)
    
    // Remove from arrays
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    
    onImagesChange(newImages)
    setPreviews(newPreviews)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    multiple: true
  })

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.preview))
    }
  }, [])

  return (
    <div className="space-y-2">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      {/* Dropzone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-gray-400",
            error && "border-red-500"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive 
              ? "Thả hình ảnh vào đây..." 
              : "Kéo thả hình ảnh hoặc click để chọn"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG, WEBP (tối đa 5MB)
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Image previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={preview.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove button */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Index badge */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className="text-sm text-gray-500">
        {images.length}/{maxImages} hình ảnh
      </p>
    </div>
  )
}

export default PostImageUploader
