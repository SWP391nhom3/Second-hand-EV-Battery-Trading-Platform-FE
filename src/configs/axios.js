// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://localhost:8080",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;
import axios from "axios";

// Use environment variable for API URL, fallback to default
<<<<<<< HEAD
const apiBaseURL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:8080";
=======
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "https://localhost:5001";
>>>>>>> ac495f09b50575d1b7335d4c8e4877439d1764db

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor: Tự động thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (ưu tiên "token", fallback về "authToken")
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    
    if (token) {
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
