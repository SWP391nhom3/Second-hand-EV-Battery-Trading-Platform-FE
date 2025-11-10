/**
 * Helper functions for image URLs
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Format image URL from backend response
 * Backend trả về relative path: /uploads/images/xxx.png
 * Cần chuyển thành full URL: http://192.168.31.102:9190/uploads/images/xxx.png
 * 
 * @param {string} relativePath - Relative path from backend (e.g., "/uploads/images/xxx.png")
 * @returns {string} - Full image URL
 */
export const getImageUrl = (relativePath) => {
  if (!relativePath) return null;
  
  // Nếu đã là full URL (http/https), trả về luôn
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Nếu không có leading slash, thêm vào
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  return `${API_BASE_URL}${path}`;
};

/**
 * Get placeholder image URL
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = () => {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20px" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
};

export default {
  getImageUrl,
  getPlaceholderImage
};
