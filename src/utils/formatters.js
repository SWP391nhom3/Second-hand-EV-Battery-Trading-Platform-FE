/**
 * Utility functions for formatting data
 */

/**
 * Format số tiền sang định dạng VND
 * @param {number} amount - Số tiền cần format
 * @returns {string} Số tiền đã format (VD: "100.000.000 ₫")
 */
export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) {
    return '0 ₫'
  }
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format date sang định dạng dễ đọc
 * @param {string|Date} date - Date cần format
 * @returns {string} Date đã format (VD: "13/11/2024")
 */
export const formatDate = (date) => {
  if (!date) {
    return 'N/A'
  }
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return 'N/A'
    }
    
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'N/A'
  }
}

/**
 * Format datetime sang định dạng đầy đủ
 * @param {string|Date} datetime - Datetime cần format
 * @returns {string} Datetime đã format (VD: "13/11/2024 14:30")
 */
export const formatDateTime = (datetime) => {
  if (!datetime) {
    return 'N/A'
  }
  
  try {
    const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime
    
    if (isNaN(dateObj.getTime())) {
      return 'N/A'
    }
    
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return 'N/A'
  }
}

/**
 * Format số với dấu phân cách hàng nghìn
 * @param {number} number - Số cần format
 * @returns {string} Số đã format (VD: "1.000.000")
 */
export const formatNumber = (number) => {
  if (number == null || isNaN(number)) {
    return '0'
  }
  
  return new Intl.NumberFormat('vi-VN').format(number)
}

/**
 * Format phần trăm
 * @param {number} value - Giá trị (0-100 hoặc 0-1)
 * @param {number} decimals - Số chữ số thập phân
 * @returns {string} Phần trăm đã format (VD: "85.5%")
 */
export const formatPercent = (value, decimals = 1) => {
  if (value == null || isNaN(value)) {
    return '0%'
  }
  
  // Nếu value > 1, giả định đã là phần trăm
  // Nếu value <= 1, nhân với 100
  const percent = value > 1 ? value : value * 100
  
  return `${percent.toFixed(decimals)}%`
}

/**
 * Rút gọn text với ellipsis
 * @param {string} text - Text cần rút gọn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} Text đã rút gọn
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text
  }
  
  return text.substring(0, maxLength) + '...'
}

/**
 * Format file size
 * @param {number} bytes - Kích thước file (bytes)
 * @returns {string} File size đã format (VD: "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format thời gian còn lại (relative time)
 * @param {string|Date} date - Date để tính
 * @returns {string} Thời gian còn lại (VD: "2 giờ trước")
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now - dateObj) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Vừa xong'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} phút trước`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} giờ trước`
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ngày trước`
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `${months} tháng trước`
    } else {
      const years = Math.floor(diffInSeconds / 31536000)
      return `${years} năm trước`
    }
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return 'N/A'
  }
}

/**
 * Format phone number
 * @param {string} phone - Số điện thoại
 * @returns {string} Phone đã format (VD: "0912 345 678")
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A'
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format: 0912 345 678
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  
  return phone
}

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
  truncateText,
  formatFileSize,
  formatRelativeTime,
  formatPhoneNumber
}
