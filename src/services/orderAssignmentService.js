import api from "../configs/axios";

/**
 * Service để quản lý việc gán đơn hàng/yêu cầu cho Staff
 * Hiện tại sử dụng localStorage, nhưng đã chuẩn bị sẵn API calls để tích hợp BE
 */

const STORAGE_KEY = "assignedOrders";

// Mock data - sẽ thay bằng API calls
const mockStaffList = [
  { id: "staff1", name: "Trần Thị Staff", email: "staff@example.com" },
  { id: "staff2", name: "Nguyễn Văn Staff", email: "staff2@example.com" },
  { id: "staff3", name: "Lê Thị Staff", email: "staff3@example.com" },
];

const orderAssignmentService = {
  // ========== API METHODS (Sẵn sàng cho BE) ==========
  
  /**
   * Lấy danh sách staff
   * TODO: Thay bằng API: GET /api/Staff
   */
  getStaffList: async () => {
    try {
      // Uncomment khi có BE:
      // const response = await api.get("/api/Staff");
      // return response.data;
      
      // Mock data tạm thời
      return mockStaffList;
    } catch (error) {
      console.error("Error fetching staff list:", error);
      return mockStaffList; // Fallback to mock
    }
  },

  /**
   * Gán đơn hàng cho staff
   * TODO: Thay bằng API: POST /api/OrderAssignment
   */
  assignOrderToStaff: async (orderId, staffId, assignmentData) => {
    try {
      // Uncomment khi có BE:
      // const response = await api.post("/api/OrderAssignment", {
      //   orderId,
      //   staffId,
      //   ...assignmentData,
      //   assignedAt: new Date().toISOString(),
      // });
      // return response.data;

      // Mock - lưu vào localStorage
      const assignments = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const existingIndex = assignments.findIndex((a) => a.orderId === orderId);

      const assignment = {
        orderId,
        staffId,
        staffName: mockStaffList.find((s) => s.id === staffId)?.name || "Unknown",
        ...assignmentData,
        assignedAt: new Date().toISOString(),
        status: "assigned",
      };

      if (existingIndex >= 0) {
        assignments[existingIndex] = assignment;
      } else {
        assignments.push(assignment);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
      return assignment;
    } catch (error) {
      console.error("Error assigning order:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách đơn hàng đã gán
   * TODO: Thay bằng API: GET /api/OrderAssignment
   */
  getAssignedOrders: async (staffId = null) => {
    try {
      // Uncomment khi có BE:
      // const params = staffId ? { staffId } : {};
      // const response = await api.get("/api/OrderAssignment", { params });
      // return response.data;

      // Mock - đọc từ localStorage
      const assignments = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (staffId) {
        return assignments.filter((a) => a.staffId === staffId);
      }
      return assignments;
    } catch (error) {
      console.error("Error fetching assigned orders:", error);
      return [];
    }
  },

  /**
   * Hủy gán đơn hàng
   * TODO: Thay bằng API: DELETE /api/OrderAssignment/{id}
   */
  unassignOrder: async (orderId) => {
    try {
      // Uncomment khi có BE:
      // await api.delete(`/api/OrderAssignment/${orderId}`);

      // Mock - xóa khỏi localStorage
      const assignments = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const filtered = assignments.filter((a) => a.orderId !== orderId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error("Error unassigning order:", error);
      throw error;
    }
  },

  /**
   * Cập nhật trạng thái đơn hàng đã gán
   * TODO: Thay bằng API: PUT /api/OrderAssignment/{id}/status
   */
  updateAssignmentStatus: async (orderId, status) => {
    try {
      // Uncomment khi có BE:
      // await api.put(`/api/OrderAssignment/${orderId}/status`, { status });

      // Mock - cập nhật localStorage
      const assignments = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const updated = assignments.map((a) =>
        a.orderId === orderId ? { ...a, status } : a
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error("Error updating assignment status:", error);
      throw error;
    }
  },

  // ========== LOCALSTORAGE HELPERS (Tạm thời) ==========
  
  /**
   * Lấy đơn hàng đã gán từ localStorage (cho real-time updates)
   */
  getAssignedOrdersSync: (staffId = null) => {
    const assignments = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (staffId) {
      return assignments.filter((a) => a.staffId === staffId);
    }
    return assignments;
  },

  /**
   * Lắng nghe thay đổi từ localStorage (cho cross-tab communication)
   */
  subscribeToChanges: (callback) => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        callback();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  },
};

export default orderAssignmentService;

