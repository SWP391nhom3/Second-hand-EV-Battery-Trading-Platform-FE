import { jwtDecode } from "jwt-decode";

/**
 * ✅ Decode JWT token để lấy thông tin user
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token payload hoặc null nếu invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
};

/**
 * ✅ Kiểm tra token có hết hạn chưa
 * @param {string} token - JWT token
 * @returns {boolean} - true nếu token còn hợp lệ, false nếu đã hết hạn
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("❌ Error checking token expiration:", error);
    return true;
  }
};

/**
 * ✅ Lấy thông tin user từ token
 * @param {string} token - JWT token
 * @returns {object|null} - User info { accountId, email, role } hoặc null
 */
export const getUserFromToken = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded) return null;

    return {
      accountId: decoded.sub || decoded.accountId || null,
      email: decoded.email || decoded.Email || null,
      role: decoded.role || decoded.Role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null,
    };
  } catch (error) {
    console.error("❌ Error getting user from token:", error);
    return null;
  }
};

/**
 * ✅ Validate token (kiểm tra expiration và format)
 * @param {string} token - JWT token
 * @returns {boolean} - true nếu token hợp lệ, false nếu không
 */
export const validateToken = (token) => {
  if (!token || typeof token !== "string") return false;
  if (token.trim() === "") return false;
  if (isTokenExpired(token)) return false;
  return true;
};

