import axios from "axios";
import { getToken } from "../utils/sessionStorage";
import { validateToken, isTokenExpired } from "../utils/jwt";

// Use environment variable for API URL, fallback to default
const apiBaseURL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:8080";

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// ✅ Request interceptor: Tự động thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    // Lấy token từ sessionStorage (ưu tiên), fallback về localStorage
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (token) {
      // ✅ Validate token trước khi gửi
      if (!validateToken(token)) {
        console.warn("⚠️ Token không hợp lệ hoặc đã hết hạn, sẽ clear session");
        // Clear invalid token
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        // Redirect về login nếu không phải trang login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(new Error("Token không hợp lệ"));
      }

      // Thêm token vào Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response interceptor: Xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Nếu token hết hạn hoặc không hợp lệ, xóa token và redirect về login
    if (error.response?.status === 401) {
      // Clear tất cả auth data
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      // Thông báo các component khác
      try {
        window.dispatchEvent(new Event("authChanged"));
      } catch (e) {
        console.warn("Could not dispatch authChanged event:", e);
      }

      // Chỉ redirect nếu không phải trang login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
