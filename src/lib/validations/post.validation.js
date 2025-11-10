import { z } from 'zod'

/**
 * Validation schema cho tạo bài đăng mới
 * UC06: Tạo Bài đăng mới
 */

// Schema cho thông tin cơ bản
export const postBasicInfoSchema = z.object({
  title: z
    .string()
    .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
    .max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
  
  description: z
    .string()
    .min(50, 'Mô tả phải có ít nhất 50 ký tự')
    .max(5000, 'Mô tả không được vượt quá 5000 ký tự'),
  
  categoryId: z
    .number({
      required_error: 'Vui lòng chọn loại sản phẩm',
      invalid_type_error: 'Loại sản phẩm không hợp lệ'
    })
    .int()
    .positive(),
  
  price: z
    .number({
      required_error: 'Vui lòng nhập giá',
      invalid_type_error: 'Giá phải là số'
    })
    .positive('Giá phải lớn hơn 0')
    .max(10000000000, 'Giá không được vượt quá 10 tỷ'),
  
  location: z
    .string()
    .min(5, 'Địa điểm phải có ít nhất 5 ký tự')
    .max(200, 'Địa điểm không được vượt quá 200 ký tự')
})

// Schema cho thông số kỹ thuật
export const postSpecificationSchema = z.object({
  brand: z
    .string()
    .min(2, 'Thương hiệu phải có ít nhất 2 ký tự')
    .max(100, 'Thương hiệu không được vượt quá 100 ký tự'),
  
  model: z
    .string()
    .min(1, 'Model phải có ít nhất 1 ký tự')
    .max(100, 'Model không được vượt quá 100 ký tự'),
  
  batteryCapacity: z
    .number({
      required_error: 'Vui lòng nhập dung lượng pin',
      invalid_type_error: 'Dung lượng pin phải là số'
    })
    .positive('Dung lượng pin phải lớn hơn 0')
    .max(1000, 'Dung lượng pin không được vượt quá 1000 kWh'),
  
  soh: z
    .number({
      invalid_type_error: 'SOH phải là số'
    })
    .min(0, 'SOH phải từ 0-100')
    .max(100, 'SOH phải từ 0-100')
    .optional()
    .nullable(),
  
  chargeCount: z
    .number({
      invalid_type_error: 'Số lần sạc phải là số'
    })
    .int('Số lần sạc phải là số nguyên')
    .min(0, 'Số lần sạc không thể âm')
    .optional()
    .nullable(),
  
  yearOfManufacture: z
    .number({
      required_error: 'Vui lòng nhập năm sản xuất',
      invalid_type_error: 'Năm sản xuất phải là số'
    })
    .int('Năm sản xuất phải là số nguyên')
    .min(2000, 'Năm sản xuất phải từ 2000 đến nay')
    .max(new Date().getFullYear() + 1, 'Năm sản xuất không hợp lệ'),
  
  condition: z
    .string()
    .min(2, 'Tình trạng phải có ít nhất 2 ký tự')
    .max(50, 'Tình trạng không được vượt quá 50 ký tự'),
  
  // Chỉ cho xe điện
  kilometers: z
    .number({
      invalid_type_error: 'Số KM phải là số'
    })
    .min(0, 'Số KM không thể âm')
    .optional()
    .nullable()
})

// Schema cho hình ảnh
export const postImagesSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, 'Vui lòng tải lên ít nhất 1 hình ảnh')
    .max(20, 'Không được tải lên quá 20 hình ảnh')
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      'Mỗi hình ảnh không được vượt quá 5MB'
    )
    .refine(
      (files) => 
        files.every((file) => 
          ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
        ),
      'Chỉ chấp nhận file JPG, PNG, WEBP'
    ),
  
  proofImages: z
    .array(z.instanceof(File))
    .min(1, 'Vui lòng tải lên ít nhất 1 ảnh bằng chứng SOH/KM')
    .max(5, 'Không được tải lên quá 5 ảnh bằng chứng')
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      'Mỗi hình ảnh không được vượt quá 5MB'
    )
    .refine(
      (files) => 
        files.every((file) => 
          ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
        ),
      'Chỉ chấp nhận file JPG, PNG, WEBP'
    )
})

// Schema cho gói tin
export const postPackageSchema = z.object({
  packageType: z.enum(['BASIC', 'PREMIUM', 'LUXURY'], {
    required_error: 'Vui lòng chọn gói tin',
    invalid_type_error: 'Gói tin không hợp lệ'
  })
})

// Schema cho đấu giá
export const postAuctionSchema = z.object({
  auctionEnabled: z.boolean().default(false),
  
  startingBid: z
    .number({
      invalid_type_error: 'Giá khởi điểm phải là số'
    })
    .positive('Giá khởi điểm phải lớn hơn 0')
    .optional()
    .nullable(),
  
  buyNowPrice: z
    .number({
      invalid_type_error: 'Giá mua ngay phải là số'
    })
    .positive('Giá mua ngay phải lớn hơn 0')
    .optional()
    .nullable(),
  
  auctionEndTime: z
    .date({
      invalid_type_error: 'Thời gian kết thúc không hợp lệ'
    })
    .optional()
    .nullable()
}).refine(
  (data) => {
    // If auction is enabled, startingBid and auctionEndTime are required
    if (data.auctionEnabled) {
      return data.startingBid && data.auctionEndTime
    }
    return true
  },
  {
    message: 'Khi bật đấu giá, bạn phải nhập giá khởi điểm và thời gian kết thúc',
    path: ['startingBid']
  }
).refine(
  (data) => {
    // If buyNowPrice is set, it must be greater than startingBid
    if (data.buyNowPrice && data.startingBid) {
      return data.buyNowPrice > data.startingBid
    }
    return true
  },
  {
    message: 'Giá mua ngay phải lớn hơn giá khởi điểm',
    path: ['buyNowPrice']
  }
).refine(
  (data) => {
    // Auction end time must be in the future (at least 1 day)
    if (data.auctionEndTime) {
      const oneDayLater = new Date(Date.now() + 24 * 60 * 60 * 1000)
      return new Date(data.auctionEndTime) >= oneDayLater
    }
    return true
  },
  {
    message: 'Thời gian đấu giá phải ít nhất 1 ngày kể từ bây giờ',
    path: ['auctionEndTime']
  }
)

// Schema tổng hợp cho tạo bài đăng
export const createPostSchema = postBasicInfoSchema
  .merge(postSpecificationSchema)
  .merge(postImagesSchema)
  .merge(postPackageSchema)
  .merge(postAuctionSchema)
  .refine(
    (data) => {
      // Nếu là xe điện (categoryId = 1), phải có kilometers
      if (data.categoryId === 1 && !data.kilometers) {
        return false
      }
      return true
    },
    {
      message: 'Xe điện phải có thông tin số KM',
      path: ['kilometers']
    }
  )
  .refine(
    (data) => {
      // Starting bid must be less than or equal to regular price
      if (data.auctionEnabled && data.startingBid && data.price) {
        return data.startingBid <= data.price
      }
      return true
    },
    {
      message: 'Giá khởi điểm đấu giá phải nhỏ hơn hoặc bằng giá bán thường',
      path: ['startingBid']
    }
  )

// Schema cho chỉnh sửa bài đăng (images và proofImages là optional)
export const updatePostSchema = postBasicInfoSchema
  .merge(postSpecificationSchema)
  .merge(postImagesSchema.partial({
    images: true,
    proofImages: true
  }))
  .merge(postPackageSchema)
  .merge(postAuctionSchema)
  .refine(
    (data) => {
      // Nếu là xe điện (categoryId = 1), phải có kilometers
      if (data.categoryId === 1 && !data.kilometers) {
        return false
      }
      return true
    },
    {
      message: 'Xe điện phải có thông tin số KM',
      path: ['kilometers']
    }
  )

// ==================== ADMIN POST MANAGEMENT VALIDATION ====================

/**
 * Validation schema cho duyệt bài đăng
 * UC11: Duyệt Bài đăng
 */
export const postApproveSchema = z.object({
  // Không cần field nào, chỉ cần empty object
}).passthrough()

/**
 * Validation schema cho từ chối bài đăng
 * UC12: Từ chối Bài đăng
 */
export const postRejectSchema = z.object({
  rejectionReason: z
    .string({
      required_error: 'Vui lòng nhập lý do từ chối',
      invalid_type_error: 'Lý do từ chối phải là chuỗi'
    })
    .min(10, 'Lý do từ chối phải có ít nhất 10 ký tự')
    .max(500, 'Lý do từ chối không được vượt quá 500 ký tự')
    .trim()
})

/**
 * Validation schema cho tìm kiếm bài đăng chờ duyệt
 */
export const pendingPostSearchSchema = z.object({
  pageNumber: z
    .number({
      invalid_type_error: 'Số trang phải là số'
    })
    .int('Số trang phải là số nguyên')
    .min(1, 'Số trang phải lớn hơn 0')
    .default(1)
    .optional(),

  pageSize: z
    .number({
      invalid_type_error: 'Số lượng items phải là số'
    })
    .int('Số lượng items phải là số nguyên')
    .min(1, 'Số lượng items phải lớn hơn 0')
    .max(100, 'Số lượng items không được vượt quá 100')
    .default(10)
    .optional(),

  keyword: z
    .string()
    .max(200, 'Từ khóa tìm kiếm không được vượt quá 200 ký tự')
    .optional()
    .nullable(),

  categoryId: z
    .number({
      invalid_type_error: 'ID danh mục phải là số'
    })
    .int('ID danh mục phải là số nguyên')
    .positive('ID danh mục phải lớn hơn 0')
    .optional()
    .nullable(),

  brand: z
    .string()
    .max(100, 'Thương hiệu không được vượt quá 100 ký tự')
    .optional()
    .nullable(),

  sortBy: z
    .enum(['createdAt', 'price', 'title'], {
      invalid_type_error: 'Trường sắp xếp không hợp lệ'
    })
    .optional()
    .nullable(),

  sortDirection: z
    .enum(['asc', 'desc'], {
      invalid_type_error: 'Chiều sắp xếp phải là asc hoặc desc'
    })
    .default('asc')
    .optional()
})

/**
 * Validation schema cho tìm kiếm bài đăng đã duyệt/từ chối
 */
export const approvedRejectedPostSearchSchema = z.object({
  pageNumber: z
    .number({
      invalid_type_error: 'Số trang phải là số'
    })
    .int('Số trang phải là số nguyên')
    .min(1, 'Số trang phải lớn hơn 0')
    .default(1)
    .optional(),

  pageSize: z
    .number({
      invalid_type_error: 'Số lượng items phải là số'
    })
    .int('Số lượng items phải là số nguyên')
    .min(1, 'Số lượng items phải lớn hơn 0')
    .max(100, 'Số lượng items không được vượt quá 100')
    .default(10)
    .optional(),

  status: z
    .enum(['APPROVED', 'DENIED'], {
      invalid_type_error: 'Trạng thái phải là APPROVED hoặc DENIED'
    })
    .optional()
    .nullable(),

  keyword: z
    .string()
    .max(200, 'Từ khóa tìm kiếm không được vượt quá 200 ký tự')
    .optional()
    .nullable(),

  categoryId: z
    .number({
      invalid_type_error: 'ID danh mục phải là số'
    })
    .int('ID danh mục phải là số nguyên')
    .positive('ID danh mục phải lớn hơn 0')
    .optional()
    .nullable(),

  brand: z
    .string()
    .max(100, 'Thương hiệu không được vượt quá 100 ký tự')
    .optional()
    .nullable(),

  sortBy: z
    .enum(['createdAt', 'approvedAt', 'rejectedAt', 'price', 'title'], {
      invalid_type_error: 'Trường sắp xếp không hợp lệ'
    })
    .optional()
    .nullable(),

  sortDirection: z
    .enum(['asc', 'desc'], {
      invalid_type_error: 'Chiều sắp xếp phải là asc hoặc desc'
    })
    .default('asc')
    .optional()
})