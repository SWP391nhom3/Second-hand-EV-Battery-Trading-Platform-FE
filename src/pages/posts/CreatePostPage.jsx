import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight, Save, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import PostImageUploader from '@/components/post/PostImageUploader'
import PostPackageSelector from '@/components/post/PostPackageSelector'
import PostPriceAI from '@/components/post/PostPriceAI'
import postsService from '@/api/services/posts.service'
import { createPostSchema } from '@/lib/validations/post.validation'

/**
 * Trang tạo bài đăng mới
 * UC06: Tạo Bài đăng mới
 * 
 * Luồng:
 * 1. Chọn loại sản phẩm (Xe điện hoặc Pin)
 * 2. Nhập thông tin cơ bản: Tiêu đề, Mô tả, Giá, Địa điểm
 * 3. Nhập thông số kỹ thuật
 * 4. Tải lên hình ảnh sản phẩm và ảnh bằng chứng
 * 5. Gợi ý giá bằng AI
 * 6. Chọn gói tin
 * 7. Kiểm tra credits và gửi để duyệt
 */
const CreatePostPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [proofImages, setProofImages] = useState([])
  const [formData, setFormData] = useState({
    categoryId: null,
    title: '',
    description: '',
    price: '',
    location: '',
    brand: '',
    model: '',
    batteryCapacity: '',
    soh: '',
    chargeCount: '',
    yearOfManufacture: '',
    condition: null, // Changed from '' to null to avoid Select empty value error
    kilometers: '',
    packageType: null,
    // Auction fields
    auctionEnabled: false,
    startingBid: '',
    buyNowPrice: '',
    auctionEndTime: null
  })

  const totalSteps = 4

  // Categories
  const categories = [
    { id: 1, name: 'Xe điện', icon: '🚗' },
    { id: 2, name: 'Pin', icon: '🔋' }
  ]

  // Conditions
  const conditions = [
    'Mới 100%',
    'Đã sử dụng - Như mới',
    'Đã sử dụng - Tốt',
    'Đã sử dụng - Khá',
    'Cần sửa chữa'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        // Step 1: Thông tin cơ bản
        if (!formData.categoryId) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng chọn loại sản phẩm"
          })
          return false
        }
        if (!formData.title || !formData.title.trim() || formData.title.trim().length < 10) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Tiêu đề phải có ít nhất 10 ký tự"
          })
          return false
        }
        if (!formData.description || !formData.description.trim() || formData.description.trim().length < 50) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Mô tả phải có ít nhất 50 ký tự"
          })
          return false
        }
        if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng nhập giá hợp lệ (lớn hơn 0)"
          })
          return false
        }
        // Check if price is too high (optional max validation)
        if (Number(formData.price) > 999999999999) {
          toast({
            variant: "destructive",
            title: "Giá không hợp lệ",
            description: "Giá bán không được vượt quá 999,999,999,999 VNĐ"
          })
          return false
        }
        if (!formData.location || !formData.location.trim()) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng nhập địa điểm"
          })
          return false
        }
        return true

      case 2:
        // Step 2: Thông số kỹ thuật
        if (!formData.brand || !formData.brand.trim()) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng nhập thương hiệu"
          })
          return false
        }
        if (!formData.model || !formData.model.trim()) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng nhập model"
          })
          return false
        }
        if (!formData.batteryCapacity || isNaN(Number(formData.batteryCapacity)) || Number(formData.batteryCapacity) <= 0) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng nhập dung lượng pin hợp lệ (lớn hơn 0)"
          })
          return false
        }
        // Validate battery capacity range (typically 10-200 kWh for EVs)
        const capacity = Number(formData.batteryCapacity)
        if (capacity < 1 || capacity > 500) {
          toast({
            variant: "destructive",
            title: "Dung lượng pin không hợp lệ",
            description: "Dung lượng pin phải từ 1 kWh đến 500 kWh"
          })
          return false
        }
        // Validate SOH if provided
        if (formData.soh && (isNaN(Number(formData.soh)) || Number(formData.soh) < 0 || Number(formData.soh) > 100)) {
          toast({
            variant: "destructive",
            title: "SOH không hợp lệ",
            description: "SOH phải từ 0% đến 100%"
          })
          return false
        }
        // Validate charge count if provided
        if (formData.chargeCount && (isNaN(Number(formData.chargeCount)) || Number(formData.chargeCount) < 0)) {
          toast({
            variant: "destructive",
            title: "Số lần sạc không hợp lệ",
            description: "Số lần sạc phải lớn hơn hoặc bằng 0"
          })
          return false
        }
        if (!formData.yearOfManufacture || isNaN(Number(formData.yearOfManufacture))) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng nhập năm sản xuất hợp lệ"
          })
          return false
        }
        // Validate year range
        const year = Number(formData.yearOfManufacture)
        const currentYear = new Date().getFullYear()
        if (year < 2000 || year > currentYear + 1 || !Number.isInteger(year)) {
          toast({
            variant: "destructive",
            title: "Năm sản xuất không hợp lệ",
            description: `Năm sản xuất phải từ 2000 đến ${currentYear + 1}`
          })
          return false
        }
        if (!formData.condition) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng chọn tình trạng"
          })
          return false
        }
        // Xe điện phải có kilometers
        if (formData.categoryId === 1) {
          if (!formData.kilometers || isNaN(Number(formData.kilometers))) {
            toast({
              variant: "destructive",
              title: "Thiếu thông tin",
              description: "Xe điện phải nhập số KM đã đi"
            })
            return false
          }
          // Validate kilometers is positive
          if (Number(formData.kilometers) < 0) {
            toast({
              variant: "destructive",
              title: "Số KM không hợp lệ",
              description: "Số KM đã đi phải lớn hơn hoặc bằng 0"
            })
            return false
          }
        }
        return true

      case 3:
        // Step 3: Hình ảnh
        if (images.length === 0) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng tải lên ít nhất 1 hình ảnh sản phẩm"
          })
          return false
        }
        if (proofImages.length === 0) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng tải lên ít nhất 1 ảnh bằng chứng SOH/KM"
          })
          return false
        }
        return true

      case 4:
        // Step 4: Gói tin và Đấu giá
        if (!formData.packageType) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng chọn gói tin"
          })
          return false
        }
        
        // Validate auction fields if auction is enabled
        if (formData.auctionEnabled) {
          if (!formData.startingBid || parseFloat(formData.startingBid) <= 0) {
            toast({
              variant: "destructive",
              title: "Thiếu thông tin đấu giá",
              description: "Vui lòng nhập giá khởi điểm đấu giá hợp lệ"
            })
            return false
          }
          
          // Starting bid must be less than or equal to regular price
          if (parseFloat(formData.startingBid) > parseFloat(formData.price)) {
            toast({
              variant: "destructive",
              title: "Giá đấu giá không hợp lệ",
              description: "Giá khởi điểm đấu giá phải nhỏ hơn hoặc bằng giá bán thường"
            })
            return false
          }
          
          // If buyNowPrice is set, it must be greater than starting bid
          if (formData.buyNowPrice && parseFloat(formData.buyNowPrice) <= parseFloat(formData.startingBid)) {
            toast({
              variant: "destructive",
              title: "Giá mua ngay không hợp lệ",
              description: "Giá mua ngay phải lớn hơn giá khởi điểm"
            })
            return false
          }
          
          if (!formData.auctionEndTime) {
            toast({
              variant: "destructive",
              title: "Thiếu thông tin đấu giá",
              description: "Vui lòng chọn thời gian kết thúc đấu giá"
            })
            return false
          }
          
          // Auction end time must be in the future
          const endTime = new Date(formData.auctionEndTime)
          const now = new Date()
          if (endTime <= now) {
            toast({
              variant: "destructive",
              title: "Thời gian đấu giá không hợp lệ",
              description: "Thời gian kết thúc đấu giá phải trong tương lai"
            })
            return false
          }
          
          // Auction must be at least 1 day
          const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000)
          if (endTime < oneDayLater) {
            toast({
              variant: "destructive",
              title: "Thời gian đấu giá quá ngắn",
              description: "Thời gian đấu giá phải ít nhất 1 ngày"
            })
            return false
          }
        }
        
        return true

      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (isDraft = false) => {
    // Validate all steps if not draft
    if (!isDraft) {
      for (let i = 1; i <= totalSteps; i++) {
        if (!validateStep(i)) {
          setCurrentStep(i)
          return
        }
      }
    }

    try {
      setLoading(true)

      // Validate required fields before submitting
      if (!formData.categoryId) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng chọn danh mục"
        })
        setCurrentStep(1)
        setLoading(false)
        return
      }

      if (!formData.title || !formData.title.trim()) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng nhập tiêu đề"
        })
        setCurrentStep(1)
        setLoading(false)
        return
      }

      if (!formData.description || !formData.description.trim()) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng nhập mô tả"
        })
        setCurrentStep(1)
        setLoading(false)
        return
      }

      if (!formData.location || !formData.location.trim()) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng nhập địa điểm"
        })
        setCurrentStep(1)
        setLoading(false)
        return
      }

      if (!formData.brand || !formData.brand.trim()) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng nhập thương hiệu"
        })
        setCurrentStep(2)
        setLoading(false)
        return
      }

      if (!formData.model || !formData.model.trim()) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng nhập model"
        })
        setCurrentStep(2)
        setLoading(false)
        return
      }

      if (!formData.condition) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng chọn tình trạng"
        })
        setCurrentStep(2)
        setLoading(false)
        return
      }

      if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng nhập giá hợp lệ"
        })
        setCurrentStep(1)
        setLoading(false)
        return
      }

      if (!formData.batteryCapacity || isNaN(Number(formData.batteryCapacity)) || Number(formData.batteryCapacity) <= 0) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng nhập dung lượng pin hợp lệ"
        })
        setCurrentStep(2)
        setLoading(false)
        return
      }

      if (!formData.yearOfManufacture || isNaN(Number(formData.yearOfManufacture))) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng nhập năm sản xuất hợp lệ"
        })
        setCurrentStep(2)
        setLoading(false)
        return
      }

      if (!formData.packageType) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng chọn gói tin"
        })
        setCurrentStep(4)
        setLoading(false)
        return
      }

      // Prepare FormData to match backend API
      const submitData = new FormData()
      
      // Add basic info (match backend parameter names) - Ensure values are not null/undefined/empty
      submitData.append('categoryId', String(formData.categoryId))
      submitData.append('title', formData.title.trim())
      submitData.append('description', formData.description.trim())
      submitData.append('price', String(Number(formData.price)))
      submitData.append('location', formData.location.trim())
      
      // Add specifications (match backend parameter names)
      submitData.append('brand', formData.brand.trim())
      submitData.append('model', formData.model.trim())
      submitData.append('batteryCapacityCurrent', String(Number(formData.batteryCapacity)))
      
      if (formData.chargeCount && !isNaN(Number(formData.chargeCount))) {
        submitData.append('chargeCount', String(Number(formData.chargeCount)))
      }
      
      submitData.append('productionYear', String(Number(formData.yearOfManufacture)))
      submitData.append('condition', String(formData.condition))
      
      // mileage chỉ cho xe điện (categoryId = 1)
      if (formData.categoryId === 1 && formData.kilometers && !isNaN(Number(formData.kilometers))) {
        submitData.append('mileage', String(Number(formData.kilometers)))
      }
      
      // packageId (backend expects int packageId)
      submitData.append('packageId', String(formData.packageType))
      
      // Add auction fields
      submitData.append('auctionEnabled', String(formData.auctionEnabled || false))
      if (formData.auctionEnabled) {
        if (formData.startingBid && !isNaN(Number(formData.startingBid))) {
          submitData.append('startingBid', String(Number(formData.startingBid)))
        }
        if (formData.buyNowPrice && !isNaN(Number(formData.buyNowPrice))) {
          submitData.append('buyNowPrice', String(Number(formData.buyNowPrice)))
        }
        if (formData.auctionEndTime) {
          submitData.append('auctionEndTime', new Date(formData.auctionEndTime).toISOString())
        }
      }
      
      // Add images (backend expects 'images' - plural)
      if (images && images.length > 0) {
        images.forEach((image) => {
          submitData.append('images', image)
        })
      }
      
      // Add proof image (backend expects 'proofImage' - singular, optional)
      if (proofImages && proofImages.length > 0) {
        submitData.append('proofImage', proofImages[0])
      }

      // Debug: Log FormData values (for development only)
      console.log('📤 Submitting FormData:')
      console.log('  categoryId:', formData.categoryId)
      console.log('  title:', formData.title.trim())
      console.log('  description:', formData.description.trim())
      console.log('  price:', formData.price)
      console.log('  location:', formData.location.trim())
      console.log('  brand:', formData.brand.trim())
      console.log('  model:', formData.model.trim())
      console.log('  batteryCapacityCurrent:', formData.batteryCapacity)
      console.log('  productionYear:', formData.yearOfManufacture)
      console.log('  condition:', formData.condition)
      console.log('  packageId:', formData.packageType)
      console.log('  images count:', images?.length || 0)
      console.log('  proofImages count:', proofImages?.length || 0)

      // Call API
      const response = await postsService.createPost(submitData)

      console.log('📤 Create post response:', response)

      // Backend trả về { success: true } chứ không phải { isSuccess: true }
      if (response.success) {
        toast({
          title: isDraft ? "Lưu nháp thành công" : "Gửi bài đăng thành công",
          description: isDraft 
            ? "Bài đăng đã được lưu dưới dạng nháp"
            : "Bài đăng của bạn đang chờ duyệt. Chúng tôi sẽ xem xét trong vòng 24h.",
        })
        navigate('/my-posts')
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra')
      }

    } catch (error) {
      console.error('Error creating post:', error)
      console.error('Error response:', error.response?.data)
      
      // Handle validation errors from backend
      // Backend trả về errors dạng object: { "field": ["error message"] }
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        let errorMessages = []
        
        // Nếu errors là object (dictionary)
        if (typeof errors === 'object' && !Array.isArray(errors)) {
          // Convert object to array of error messages
          Object.keys(errors).forEach(field => {
            const fieldErrors = Array.isArray(errors[field]) 
              ? errors[field] 
              : [errors[field]]
            fieldErrors.forEach(msg => {
              errorMessages.push(`${field}: ${msg}`)
            })
          })
        } 
        // Nếu errors là array
        else if (Array.isArray(errors)) {
          errorMessages = errors
        }
        
        if (errorMessages.length > 0) {
          toast({
            variant: "destructive",
            title: "Lỗi xác thực",
            description: errorMessages.join('\n')
          })
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi xác thực",
            description: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường bắt buộc."
          })
        }
      } else if (error.response?.data?.message) {
        // Display single error message
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: error.response.data.message
        })
      } else if (error.response?.data?.title) {
        // Display error title
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: error.response.data.title
        })
      } else {
        // Generic error
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: error.message || 'Không thể tạo bài đăng'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return null
    }
  }

  // Step 1: Thông tin cơ bản
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Category selection */}
      <div className="space-y-2">
        <Label>Loại sản phẩm <span className="text-red-500">*</span></Label>
        <div className="grid grid-cols-2 gap-4">
          {categories.map(cat => (
            <Card
              key={cat.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                formData.categoryId === cat.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : ''
              }`}
              onClick={() => handleInputChange('categoryId', cat.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">{cat.icon}</div>
                <div className="font-semibold">{cat.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Tiêu đề <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="VD: Bán xe VinFast VF8 2023 - Còn mới 99%"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          maxLength={200}
        />
        <p className="text-xs text-gray-500">{formData.title.length}/200 ký tự</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Mô tả chi tiết <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Mô tả chi tiết về sản phẩm: tình trạng, lịch sử sử dụng, lý do bán..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={6}
          maxLength={5000}
        />
        <p className="text-xs text-gray-500">{formData.description.length}/5000 ký tự</p>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">
          Giá bán (VNĐ) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="price"
          type="number"
          placeholder="150000000"
          value={formData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          min="0"
        />
        {formData.price && (
          <p className="text-sm text-gray-600">
            {parseFloat(formData.price).toLocaleString('vi-VN')} VNĐ
          </p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">
          Địa điểm <span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          placeholder="VD: Quận 1, TP.HCM"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
        />
      </div>
    </div>
  )

  // Step 2: Thông số kỹ thuật
  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Brand */}
      <div className="space-y-2">
        <Label htmlFor="brand">
          Thương hiệu <span className="text-red-500">*</span>
        </Label>
        <Input
          id="brand"
          placeholder="VD: VinFast, Tesla, BYD"
          value={formData.brand}
          onChange={(e) => handleInputChange('brand', e.target.value)}
        />
      </div>

      {/* Model */}
      <div className="space-y-2">
        <Label htmlFor="model">
          Model <span className="text-red-500">*</span>
        </Label>
        <Input
          id="model"
          placeholder="VD: VF8, Model 3, Atto 3"
          value={formData.model}
          onChange={(e) => handleInputChange('model', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Battery Capacity */}
        <div className="space-y-2">
          <Label htmlFor="batteryCapacity">
            Dung lượng pin (kWh) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="batteryCapacity"
            type="number"
            placeholder="87.7"
            value={formData.batteryCapacity}
            onChange={(e) => handleInputChange('batteryCapacity', e.target.value)}
            step="0.1"
            min="0"
          />
        </div>

        {/* SOH */}
        <div className="space-y-2">
          <Label htmlFor="soh">SOH (%)</Label>
          <Input
            id="soh"
            type="number"
            placeholder="95"
            value={formData.soh}
            onChange={(e) => handleInputChange('soh', e.target.value)}
            min="0"
            max="100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Charge Count */}
        <div className="space-y-2">
          <Label htmlFor="chargeCount">Số lần sạc</Label>
          <Input
            id="chargeCount"
            type="number"
            placeholder="150"
            value={formData.chargeCount}
            onChange={(e) => handleInputChange('chargeCount', e.target.value)}
            min="0"
          />
        </div>

        {/* Year of Manufacture */}
        <div className="space-y-2">
          <Label htmlFor="yearOfManufacture">
            Năm sản xuất <span className="text-red-500">*</span>
          </Label>
          <Input
            id="yearOfManufacture"
            type="number"
            placeholder="2023"
            value={formData.yearOfManufacture}
            onChange={(e) => handleInputChange('yearOfManufacture', e.target.value)}
            min="2000"
            max={new Date().getFullYear() + 1}
          />
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label htmlFor="condition">
          Tình trạng <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.condition || undefined}
          onValueChange={(value) => handleInputChange('condition', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn tình trạng" />
          </SelectTrigger>
          <SelectContent>
            {conditions.map(condition => (
              <SelectItem key={condition} value={condition}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kilometers - only for vehicles */}
      {formData.categoryId === 1 && (
        <div className="space-y-2">
          <Label htmlFor="kilometers">
            Số KM đã đi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="kilometers"
            type="number"
            placeholder="15000"
            value={formData.kilometers}
            onChange={(e) => handleInputChange('kilometers', e.target.value)}
            min="0"
          />
          {formData.kilometers && (
            <p className="text-sm text-gray-600">
              {parseFloat(formData.kilometers).toLocaleString('vi-VN')} km
            </p>
          )}
        </div>
      )}
    </div>
  )

  // Step 3: Hình ảnh
  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Product Images */}
      <PostImageUploader
        images={images}
        onImagesChange={setImages}
        maxImages={formData.packageType === 'LUXURY' ? 50 : formData.packageType === 'PREMIUM' ? 10 : 5}
        title="Hình ảnh sản phẩm"
        description={`Tải lên tối đa ${formData.packageType === 'LUXURY' ? 50 : formData.packageType === 'PREMIUM' ? 10 : 5} hình ảnh, mỗi ảnh tối đa 5MB`}
      />

      <Separator />

      {/* Proof Images */}
      <PostImageUploader
        images={proofImages}
        onImagesChange={setProofImages}
        maxImages={5}
        title="Ảnh bằng chứng SOH/KM"
        description="Tải lên ảnh chụp màn hình SOH hoặc đồng hồ KM (tối đa 5 ảnh)"
      />

      {/* AI Price Suggestion */}
      <Separator />
      <PostPriceAI
        formData={formData}
        currentPrice={parseFloat(formData.price)}
        onPriceAccept={(price) => handleInputChange('price', price.toString())}
      />
    </div>
  )

  // Step 4: Chọn gói tin
  const renderStep4 = () => (
    <div className="space-y-6">
      <PostPackageSelector
        selectedPackage={formData.packageType}
        onPackageChange={(pkg) => handleInputChange('packageType', pkg)}
      />

      {/* Auction Section */}
      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔨 Chế độ Đấu giá (Tùy chọn)
          </CardTitle>
          <CardDescription>
            Cho phép người mua đấu giá sản phẩm của bạn để có thể đạt giá tốt hơn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enable Auction Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <Label htmlFor="auctionEnabled" className="text-base font-semibold cursor-pointer">
                Bật chế độ đấu giá
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Người mua có thể đặt giá thầu và cạnh tranh với nhau
              </p>
            </div>
            <input
              id="auctionEnabled"
              type="checkbox"
              checked={formData.auctionEnabled}
              onChange={(e) => handleInputChange('auctionEnabled', e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
          </div>

          {/* Auction Fields - Only show when enabled */}
          {formData.auctionEnabled && (
            <div className="space-y-4 pt-4 border-t">
              {/* Starting Bid */}
              <div className="space-y-2">
                <Label htmlFor="startingBid">
                  Giá khởi điểm đấu giá <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startingBid"
                  type="number"
                  placeholder="Ví dụ: 50000000"
                  value={formData.startingBid}
                  onChange={(e) => handleInputChange('startingBid', e.target.value)}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Giá khởi điểm phải nhỏ hơn hoặc bằng giá bán thường ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formData.price || 0)})
                </p>
              </div>

              {/* Buy Now Price */}
              <div className="space-y-2">
                <Label htmlFor="buyNowPrice">
                  Giá mua ngay (Tùy chọn)
                </Label>
                <Input
                  id="buyNowPrice"
                  type="number"
                  placeholder="Ví dụ: 80000000"
                  value={formData.buyNowPrice}
                  onChange={(e) => handleInputChange('buyNowPrice', e.target.value)}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Nếu người mua đặt giá này, họ sẽ thắng ngay lập tức. Để trống nếu không muốn áp dụng.
                </p>
              </div>

              {/* Auction End Time */}
              <div className="space-y-2">
                <Label htmlFor="auctionEndTime">
                  Thời gian kết thúc đấu giá <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="auctionEndTime"
                  type="datetime-local"
                  value={formData.auctionEndTime || ''}
                  onChange={(e) => handleInputChange('auctionEndTime', e.target.value)}
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                />
                <p className="text-xs text-muted-foreground">
                  Thời gian đấu giá phải ít nhất 1 ngày kể từ bây giờ
                </p>
              </div>

              {/* Auction Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Lưu ý về đấu giá:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Người mua có thể đặt giá thầu từ giá khởi điểm trở lên</li>
                  <li>• Giá thầu cao nhất khi hết hạn sẽ thắng</li>
                  <li>• Nếu có giá mua ngay, người mua có thể chọn mua luôn với giá đó</li>
                  <li>• Bạn không thể hủy đấu giá sau khi đã có người đặt giá</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      <div className="container max-w-4xl mx-auto py-8 px-4 flex-1">
        {/* Page Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold">Đăng tin mới</h1>
          <p className="text-gray-600 mt-2">
            Điền thông tin chi tiết để bài đăng của bạn thu hút nhiều người mua hơn
          </p>
        </div>

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step === currentStep
                      ? 'bg-blue-600 text-white'
                      : step < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                <span className="text-xs mt-2 text-center">
                  {step === 1 && 'Thông tin cơ bản'}
                  {step === 2 && 'Thông số kỹ thuật'}
                  {step === 3 && 'Hình ảnh'}
                  {step === 4 && 'Gói tin'}
                </span>
              </div>
              {step < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Bước {currentStep}: {
              currentStep === 1 ? 'Thông tin cơ bản' :
              currentStep === 2 ? 'Thông số kỹ thuật' :
              currentStep === 3 ? 'Hình ảnh và gợi ý giá' :
              'Chọn gói tin'
            }
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Chọn loại sản phẩm và nhập thông tin cơ bản'}
            {currentStep === 2 && 'Nhập các thông số kỹ thuật của sản phẩm'}
            {currentStep === 3 && 'Tải lên hình ảnh và nhận gợi ý giá từ AI'}
            {currentStep === 4 && 'Chọn gói tin phù hợp với nhu cầu của bạn'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={loading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Save draft */}
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Lưu nháp
          </Button>

          {/* Next or Submit */}
          {currentStep < totalSteps ? (
            <Button onClick={nextStep} disabled={loading}>
              Tiếp theo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={() => handleSubmit(false)} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Gửi để duyệt
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">EVehicle</h3>
              <p className="text-sm text-slate-400">
                Sàn giao dịch C2C hàng đầu cho xe điện và pin tại Việt Nam
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Liên kết</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link></li>
                <li><Link to="/posts" className="hover:text-primary transition-colors">Sản phẩm</Link></li>
                <li><Link to="/packages" className="hover:text-primary transition-colors">Gói tin</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/help" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Liên hệ</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Pháp lý</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/terms" className="hover:text-primary transition-colors">Điều khoản</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 mt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 EVehicle Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CreatePostPage
