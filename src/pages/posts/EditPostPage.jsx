import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Loader2, Save, X } from 'lucide-react'
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
import postsService from '@/api/services/posts.service'
import { getImageUrl } from '@/utils/imageHelper'

/**
 * Trang chỉnh sửa bài đăng
 * UC07: Chỉnh sửa Bài đăng
 * 
 * Luồng tương tự Create với 4 bước:
 * 1. Thông tin cơ bản
 * 2. Thông số kỹ thuật
 * 3. Hình ảnh
 * 4. Gói tin và Đấu giá
 */
export default function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [post, setPost] = useState(null)
  
  // Existing images from backend (URLs)
  const [existingImages, setExistingImages] = useState([])
  const [existingProofImages, setExistingProofImages] = useState([])
  
  // New images to upload (File objects)
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
    condition: null,
    kilometers: '',
    packageType: null,
    auctionEnabled: false,
    startingBid: '',
    buyNowPrice: '',
    auctionEndTime: null
  })

  const totalSteps = 4
  
  const conditions = [
    'Mới 100%',
    'Đã sử dụng - Như mới',
    'Đã sử dụng - Tốt',
    'Đã sử dụng - Khá',
    'Cần sửa chữa'
  ]

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await postsService.getPostById(id)
      
      console.log('Edit Post - Fetched:', response)
      
      if (response.success && response.data) {
        const postData = response.data
        setPost(postData)
        
        // Pre-fill form data
        setFormData({
          categoryId: postData.categoryId,
          title: postData.title || '',
          description: postData.description || '',
          price: postData.price || '',
          location: postData.location || '',
          brand: postData.brand || '',
          model: postData.model || '',
          batteryCapacity: postData.batteryCapacityCurrent || postData.batteryCapacity || '',
          soh: postData.soh || '',
          chargeCount: postData.chargeCount || '',
          yearOfManufacture: postData.productionYear || postData.yearOfManufacture || '',
          condition: postData.condition || null,
          kilometers: postData.mileage || postData.kilometers || '',
          packageType: postData.packageType || null,
          auctionEnabled: postData.auctionEnabled || false,
          startingBid: postData.startingBid || '',
          buyNowPrice: postData.buyNowPrice || '',
          auctionEndTime: postData.auctionEndTime ? new Date(postData.auctionEndTime).toISOString().slice(0, 16) : null
        })
        
        // Set existing images
        if (postData.imageUrls && postData.imageUrls.length > 0) {
          setExistingImages(postData.imageUrls)
        }
        
        // Set existing proof images
        if (postData.proofImageUrl) {
          setExistingProofImages([postData.proofImageUrl])
        }
      } else {
        throw new Error('Không thể tải thông tin bài đăng')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tải thông tin bài đăng'
      })
      navigate('/my-posts')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        // Step 1: Thông tin cơ bản
        if (!formData.title || formData.title.length < 10) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Tiêu đề phải có ít nhất 10 ký tự"
          })
          return false
        }
        if (!formData.description || formData.description.length < 50) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Mô tả phải có ít nhất 50 ký tự"
          })
          return false
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng nhập giá hợp lệ (lớn hơn 0)"
          })
          return false
        }
        if (parseFloat(formData.price) > 999999999999) {
          toast({
            variant: "destructive",
            title: "Giá không hợp lệ",
            description: "Giá bán không được vượt quá 999,999,999,999 VNĐ"
          })
          return false
        }
        if (!formData.location) {
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
        if (!formData.brand || !formData.model) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng nhập thương hiệu và model"
          })
          return false
        }
        if (!formData.batteryCapacity || parseFloat(formData.batteryCapacity) <= 0) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng nhập dung lượng pin hợp lệ (lớn hơn 0)"
          })
          return false
        }
        const capacity = parseFloat(formData.batteryCapacity)
        if (capacity < 1 || capacity > 500) {
          toast({
            variant: "destructive",
            title: "Dung lượng pin không hợp lệ",
            description: "Dung lượng pin phải từ 1 kWh đến 500 kWh"
          })
          return false
        }
        if (formData.soh && (parseFloat(formData.soh) < 0 || parseFloat(formData.soh) > 100)) {
          toast({
            variant: "destructive",
            title: "SOH không hợp lệ",
            description: "SOH phải từ 0% đến 100%"
          })
          return false
        }
        if (formData.chargeCount && parseFloat(formData.chargeCount) < 0) {
          toast({
            variant: "destructive",
            title: "Số lần sạc không hợp lệ",
            description: "Số lần sạc phải lớn hơn hoặc bằng 0"
          })
          return false
        }
        if (!formData.yearOfManufacture) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng nhập năm sản xuất"
          })
          return false
        }
        const year = parseInt(formData.yearOfManufacture)
        const currentYear = new Date().getFullYear()
        if (year < 2000 || year > currentYear + 1) {
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
        if (formData.categoryId === 1 && !formData.kilometers) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Xe điện phải nhập số KM đã đi"
          })
          return false
        }
        if (formData.categoryId === 1 && parseFloat(formData.kilometers) < 0) {
          toast({
            variant: "destructive",
            title: "Số KM không hợp lệ",
            description: "Số KM đã đi phải lớn hơn hoặc bằng 0"
          })
          return false
        }
        return true

      case 3:
        // Step 3: Hình ảnh - Allow existing images or new uploads
        const totalImages = existingImages.length + images.length
        const totalProofImages = existingProofImages.length + proofImages.length
        
        if (totalImages === 0) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng giữ lại ít nhất 1 hình ảnh sản phẩm hoặc tải lên ảnh mới"
          })
          return false
        }
        if (totalProofImages === 0) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: "Vui lòng giữ lại ảnh bằng chứng hoặc tải lên ảnh mới"
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
        
        if (formData.auctionEnabled) {
          if (!formData.startingBid || parseFloat(formData.startingBid) <= 0) {
            toast({
              variant: "destructive",
              title: "Thiếu thông tin đấu giá",
              description: "Vui lòng nhập giá khởi điểm đấu giá hợp lệ"
            })
            return false
          }
          
          if (parseFloat(formData.startingBid) > parseFloat(formData.price)) {
            toast({
              variant: "destructive",
              title: "Giá đấu giá không hợp lệ",
              description: "Giá khởi điểm đấu giá phải nhỏ hơn hoặc bằng giá bán thường"
            })
            return false
          }
          
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
          
          const endTime = new Date(formData.auctionEndTime)
          const minEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day from now
          if (endTime < minEndTime) {
            toast({
              variant: "destructive",
              title: "Thời gian đấu giá không hợp lệ",
              description: "Thời gian kết thúc đấu giá phải ít nhất 1 ngày kể từ bây giờ"
            })
            return false
          }
        }
        return true

      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return
    }

    try {
      setSaving(true)

      // Convert images to base64
      const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve({
            fileName: file.name,
            fileSize: file.size,
            contentType: file.type,
            fileContent: reader.result.split(',')[1] // Remove data:image/...;base64, prefix
          })
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      // Convert all new images to FileUploadDto format
      const newImageDtos = await Promise.all(
        images.map(img => convertFileToBase64(img))
      )

      // Convert proof images to FileUploadDto format
      const newProofImageDtos = await Promise.all(
        proofImages.map(img => convertFileToBase64(img))
      )

      // Calculate images to delete (old images that were removed)
      const imagesToDelete = post?.imageUrls?.filter(url => 
        !existingImages.includes(url)
      ) || []

      // Prepare JSON request body
      const requestBody = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        brand: formData.brand,
        model: formData.model,
        batteryCapacityCurrent: parseFloat(formData.batteryCapacity),
        chargeCount: formData.chargeCount ? parseInt(formData.chargeCount) : null,
        productionYear: parseInt(formData.yearOfManufacture),
        condition: formData.condition,
        mileage: formData.categoryId === 1 ? parseInt(formData.kilometers) : null,
        auctionEnabled: formData.auctionEnabled,
        startingBid: formData.auctionEnabled && formData.startingBid ? parseFloat(formData.startingBid) : null,
        buyNowPrice: formData.auctionEnabled && formData.buyNowPrice ? parseFloat(formData.buyNowPrice) : null,
        auctionEndTime: formData.auctionEnabled && formData.auctionEndTime ? new Date(formData.auctionEndTime).toISOString() : null,
        newImages: newImageDtos.length > 0 ? newImageDtos : null,
        newProofImage: newProofImageDtos.length > 0 ? newProofImageDtos[0] : null,
        imagesToDelete: imagesToDelete.length > 0 ? imagesToDelete : null
      }

      console.log('Update request body:', requestBody)

      const response = await postsService.updatePost(id, requestBody)
      
      console.log('Update response:', response)

      if (response.success) {
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật bài đăng'
        })
        navigate('/my-posts')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      
      // Check if endpoint not found
      if (error.response?.status === 404 || error.response?.status === 405) {
        toast({
          variant: 'destructive',
          title: 'Chức năng chưa hỗ trợ',
          description: 'API cập nhật bài đăng chưa được triển khai trên backend. Vui lòng liên hệ admin.'
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: error.response?.data?.message || error.response?.data?.title || 'Không thể cập nhật bài đăng'
        })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  const isVehicle = formData.categoryId === 1

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/my-posts')}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Chỉnh sửa bài đăng</h1>
          <p className="text-muted-foreground mt-2">
            Cập nhật thông tin bài đăng của bạn
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentStep >= step
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-xs mt-2 text-center">
                    {step === 1 && 'Thông tin'}
                    {step === 2 && 'Thông số'}
                    {step === 3 && 'Hình ảnh'}
                    {step === 4 && 'Gói tin'}
                  </span>
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      currentStep > step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Thông tin cơ bản */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Nhập thông tin cơ bản về sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category (readonly) */}
              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Input
                  value={isVehicle ? '🚗 Xe điện' : '🔋 Pin'}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tiêu đề <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="VD: Xe điện VinFast VF8 2023 mới 99%"
                />
                <p className="text-xs text-muted-foreground">
                  Tối thiểu 10 ký tự
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Tối thiểu 50 ký tự
                </p>
              </div>

              {/* Price & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="500000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Địa điểm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="VD: Hà Nội"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Thông số kỹ thuật */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Thông số kỹ thuật</CardTitle>
              <CardDescription>
                Nhập các thông số kỹ thuật của sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Brand & Model */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">
                    Thương hiệu <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="VD: VinFast, Tesla..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">
                    Model <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="VD: VF8, Model 3..."
                  />
                </div>
              </div>

              {/* Battery specs */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batteryCapacity">
                    Dung lượng pin (kWh) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="batteryCapacity"
                    type="number"
                    step="0.01"
                    value={formData.batteryCapacity}
                    onChange={(e) => handleInputChange('batteryCapacity', e.target.value)}
                    placeholder="87.7"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soh">SOH (%)</Label>
                  <Input
                    id="soh"
                    type="number"
                    step="0.01"
                    value={formData.soh}
                    onChange={(e) => handleInputChange('soh', e.target.value)}
                    placeholder="95.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chargeCount">Số lần sạc</Label>
                  <Input
                    id="chargeCount"
                    type="number"
                    value={formData.chargeCount}
                    onChange={(e) => handleInputChange('chargeCount', e.target.value)}
                    placeholder="150"
                  />
                </div>
              </div>

              {/* Year, Condition, KM */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">
                    Năm sản xuất <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.yearOfManufacture}
                    onChange={(e) => handleInputChange('yearOfManufacture', e.target.value)}
                    placeholder="2023"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">
                    Tình trạng <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.condition || ''}
                    onValueChange={(val) => handleInputChange('condition', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tình trạng" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isVehicle && (
                  <div className="space-y-2">
                    <Label htmlFor="kilometers">
                      Số KM đã đi <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="kilometers"
                      type="number"
                      value={formData.kilometers}
                      onChange={(e) => handleInputChange('kilometers', e.target.value)}
                      placeholder="15000"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Hình ảnh */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh sản phẩm</CardTitle>
                <CardDescription>
                  Ảnh hiện tại: {existingImages.length} | Ảnh mới: {images.length} (Tối đa 20 ảnh tổng)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Ảnh hiện tại</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {existingImages.map((imgUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={getImageUrl(imgUrl)}
                            alt={`Image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23e5e7eb" width="128" height="128"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="14"%3EError%3C/text%3E%3C/svg%3E'
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setExistingImages(prev => prev.filter((_, i) => i !== index))
                              toast({
                                title: "Đã xóa ảnh",
                                description: "Ảnh sẽ bị xóa khi bạn lưu thay đổi"
                              })
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload new images */}
                {existingImages.length + images.length < 20 && (
                  <div>
                    <Label className="mb-2 block">
                      {existingImages.length > 0 ? 'Thêm ảnh mới' : 'Tải lên ảnh sản phẩm'}
                    </Label>
                    <PostImageUploader
                      images={images}
                      onImagesChange={setImages}
                      maxImages={20 - existingImages.length}
                      title=""
                      description={`Còn có thể tải thêm ${20 - existingImages.length - images.length} ảnh`}
                      required={existingImages.length === 0}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ảnh bằng chứng SOH/KM</CardTitle>
                <CardDescription>
                  Ảnh hiện tại: {existingProofImages.length} | Ảnh mới: {proofImages.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Proof Images */}
                {existingProofImages.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Ảnh bằng chứng hiện tại</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {existingProofImages.map((imgUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={getImageUrl(imgUrl)}
                            alt={`Proof ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23e5e7eb" width="128" height="128"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="14"%3EError%3C/text%3E%3C/svg%3E'
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setExistingProofImages(prev => prev.filter((_, i) => i !== index))
                              toast({
                                title: "Đã xóa ảnh",
                                description: "Ảnh sẽ bị xóa khi bạn lưu thay đổi"
                              })
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload new proof images */}
                <div>
                  <Label className="mb-2 block">
                    {existingProofImages.length > 0 ? 'Thêm ảnh mới' : 'Tải lên ảnh bằng chứng'}
                  </Label>
                  <PostImageUploader
                    images={proofImages}
                    onImagesChange={setProofImages}
                    maxImages={5}
                    title=""
                    description="Ảnh chụp màn hình SOH hoặc đồng hồ KM"
                    required={existingProofImages.length === 0}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Gói tin và Đấu giá */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chọn gói tin</CardTitle>
                <CardDescription>
                  Chọn gói tin phù hợp để bài đăng của bạn được nhiều người xem hơn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PostPackageSelector
                  selectedPackage={formData.packageType}
                  onSelect={(pkg) => handleInputChange('packageType', pkg)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tính năng đấu giá (Tùy chọn)</CardTitle>
                <CardDescription>
                  Cho phép người mua đấu giá sản phẩm của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="auction" className="text-base font-semibold cursor-pointer">
                      Bật chế độ đấu giá
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Người mua có thể đặt giá thầu và cạnh tranh với nhau
                    </p>
                  </div>
                  <input
                    id="auction"
                    type="checkbox"
                    checked={formData.auctionEnabled}
                    onChange={(e) => handleInputChange('auctionEnabled', e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                {formData.auctionEnabled && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startingBid">
                          Giá khởi điểm (VNĐ) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="startingBid"
                          type="number"
                          value={formData.startingBid}
                          onChange={(e) => handleInputChange('startingBid', e.target.value)}
                          placeholder="400000000"
                        />
                        <p className="text-xs text-muted-foreground">
                          Phải nhỏ hơn hoặc bằng giá bán thường
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="buyNowPrice">Giá mua ngay (VNĐ)</Label>
                        <Input
                          id="buyNowPrice"
                          type="number"
                          value={formData.buyNowPrice}
                          onChange={(e) => handleInputChange('buyNowPrice', e.target.value)}
                          placeholder="550000000"
                        />
                        <p className="text-xs text-muted-foreground">
                          Phải lớn hơn giá khởi điểm
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="auctionEndTime">
                        Thời gian kết thúc đấu giá <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="auctionEndTime"
                        type="datetime-local"
                        value={formData.auctionEndTime || ''}
                        onChange={(e) => handleInputChange('auctionEndTime', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Tối thiểu 1 ngày kể từ bây giờ
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || saving}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={saving}>
                Tiếp tục
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
