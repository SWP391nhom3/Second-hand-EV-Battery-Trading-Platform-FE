/**
 * ✅ Session Storage utilities - Data sẽ mất khi đóng browser tab
 * Sử dụng cho session-based storage (thay vì localStorage persistent)
 */

/**
 * Lưu token vào sessionStorage
 */
export const saveToken = (token) => {
  try {
    sessionStorage.setItem("token", token);
    return true;
  } catch (error) {
    console.error("❌ Error saving token to sessionStorage:", error);
    return false;
  }
};

/**
 * Lấy token từ sessionStorage
 */
export const getToken = () => {
  try {
    return sessionStorage.getItem("token");
  } catch (error) {
    console.error("❌ Error getting token from sessionStorage:", error);
    return null;
  }
};

/**
 * Lưu user info vào sessionStorage
 */
export const saveUser = (user) => {
  try {
    sessionStorage.setItem("user", JSON.stringify(user));
    return true;
  } catch (error) {
    console.error("❌ Error saving user to sessionStorage:", error);
    return false;
  }
};

/**
 * Lấy user info từ sessionStorage
 */
export const getUser = () => {
  try {
    const userStr = sessionStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("❌ Error getting user from sessionStorage:", error);
    return null;
  }
};

/**
 * Lưu role vào sessionStorage
 */
export const saveRole = (role) => {
  try {
    sessionStorage.setItem("role", role);
    return true;
  } catch (error) {
    console.error("❌ Error saving role to sessionStorage:", error);
    return false;
  }
};

/**
 * Lấy role từ sessionStorage
 */
export const getRole = () => {
  try {
    return sessionStorage.getItem("role");
  } catch (error) {
    console.error("❌ Error getting role from sessionStorage:", error);
    return null;
  }
};

/**
 * Xóa tất cả auth data từ sessionStorage
 */
export const clearSession = () => {
  try {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
    return true;
  } catch (error) {
    console.error("❌ Error clearing sessionStorage:", error);
    return false;
  }
};

/**
 * Kiểm tra có đang logged in không (dựa trên token)
 */
export const isLoggedIn = () => {
  const token = getToken();
  return token !== null && token.trim() !== "";
};

