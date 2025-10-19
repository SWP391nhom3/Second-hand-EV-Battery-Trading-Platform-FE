/**
 * Format number to Vietnamese Dong (VND) currency
 * @param {number} amount - Amount in USD
 * @param {number} exchangeRate - USD to VND exchange rate (default: 24000)
 * @returns {string} Formatted VND string
 */
export const formatVND = (amount, exchangeRate = 24000) => {
  if (typeof amount === 'string') {
    // Remove $ and , from string, then parse
    amount = parseFloat(amount.replace(/[$,]/g, ''));
  }
  
  if (isNaN(amount)) return '0 ₫';
  
  const vndAmount = Math.round(amount * exchangeRate);
  return `${vndAmount.toLocaleString('vi-VN')} ₫`;
};

/**
 * Convert USD string to VND number
 * @param {string|number} usdPrice - Price in USD
 * @param {number} exchangeRate - USD to VND exchange rate
 * @returns {number} VND amount
 */
export const convertUSDtoVND = (usdPrice, exchangeRate = 24000) => {
  if (typeof usdPrice === 'string') {
    usdPrice = parseFloat(usdPrice.replace(/[$,]/g, ''));
  }
  return Math.round(usdPrice * exchangeRate);
};

/**
 * Format capacity with Vietnamese unit
 * @param {number} capacity 
 * @returns {string}
 */
export const formatCapacity = (capacity) => {
  return `${capacity} kWh`;
};

/**
 * Format voltage with Vietnamese unit
 * @param {number} voltage 
 * @returns {string}
 */
export const formatVoltage = (voltage) => {
  return `${voltage}V`;
};

/**
 * Format warranty with Vietnamese text
 * @param {number|string} warranty 
 * @returns {string}
 */
export const formatWarranty = (warranty) => {
  const years = typeof warranty === 'string' ? 
    parseFloat(warranty) : warranty;
  
  if (years === 1) return '1 Năm';
  if (years < 1) {
    const months = Math.round(years * 12);
    return `${months} Tháng`;
  }
  return `${years} Năm`;
};

/**
 * Translate condition to Vietnamese
 * @param {string} condition 
 * @returns {string}
 */
export const translateCondition = (condition) => {
  const conditions = {
    'Excellent': 'Xuất sắc',
    'Very Good': 'Rất tốt',
    'Good': 'Tốt',
    'Fair': 'Khá',
  };
  return conditions[condition] || condition;
};

/**
 * Translate tag to Vietnamese
 * @param {string} tag 
 * @returns {string}
 */
export const translateTag = (tag) => {
  const tags = {
    'Best Seller': 'Bán chạy nhất',
    'Hot Deal': 'Giảm giá sốc',
    'Premium': 'Cao cấp',
    'Featured': 'Nổi bật',
    'Top Rated': 'Đánh giá cao',
    'New Arrival': 'Hàng mới về',
  };
  return tags[tag] || tag;
};
