import React, { useState, useMemo, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  Edit2,
  Check,
  X,
  FileText,
  Download,
  Mail,
  AlertCircle,
  User,
  Car,
  DollarSign,
  Clock,
  CheckCircle,
  Search,
  Send,
  Package,
} from "lucide-react";
import ContractDetailModal from "./ContractDetailModal";
import SendLinkModal from "./SendLinkModal";
import FeeSelectionModal from "./FeeSelection";
import ConfirmPaymentModal from "./ConfirmPaymentModal";
import orderAssignmentService from "../../services/orderAssignmentService";
import styles from "./StaffDashboard.module.css";

// === MOCK DATA ===
const mockRequests = [
  {
    id: "CF001",
    construct_id: "CF001",
    vehicle: "VinFast VF8",
    year: 2023,
    plateNumber: "30A-12345",
    price: 850000000,
    buyer: {
      member_id: "B001",
      name: "Nguyễn Văn A",
      full_name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "nguyenvana@email.com",
      address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=12",
    },
    seller: {
      member_id: "S001",
      name: "Trần Thị B",
      full_name: "Trần Thị B",
      phone: "0907654321",
      email: "tranthib@email.com",
      address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=5",
    },
    status: "pending",
    costs: [
      { name: "Phí giao dịch xe", amount: 42500000, paidBy: "buyer", required: true },
      { name: "Phí nền tảng", amount: 17000000, paidBy: "buyer", required: true },
      { name: "Phí vận chuyển", amount: 5000000, paidBy: "seller", required: false },
      { name: "Phí đăng kiểm", amount: 3000000, paidBy: "seller", required: false },
    ],
    created_at: "2024-10-25",
    buyer_token: "buyer_token_abc123",
    seller_token: "seller_token_xyz789",
  },
  {
    id: "CF002",
    construct_id: "CF002",
    vehicle: "Tesla Model 3",
    year: 2022,
    plateNumber: "29B-67890",
    price: 1200000000,
    buyer: {
      member_id: "B002",
      name: "Lê Văn C",
      full_name: "Lê Văn C",
      phone: "0912345678",
      email: "levanc@email.com",
      address: "789 Đường Pasteur, Quận 3, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=33",
    },
    seller: {
      member_id: "S002",
      name: "Phạm Thị D",
      full_name: "Phạm Thị D",
      phone: "0923456789",
      email: "phamthid@email.com",
      address: "321 Đường Cách Mạng, Quận 10, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=9",
    },
    status: "contacting",
    costs: [
      { name: "Phí giao dịch xe", amount: 60000000, paidBy: "buyer", required: true },
      { name: "Phí vận chuyển", amount: 5000000, paidBy: "buyer", required: false },
      { name: "Phí nền tảng", amount: 24000000, paidBy: "seller", required: true },
      { name: "Phí đăng kiểm", amount: 3000000, paidBy: "seller", required: false },
    ],
    created_at: "2024-10-20",
    buyer_token: "buyer_token_def456",
    seller_token: "seller_token_uvw123",
  },
  {
    id: "CF003",
    construct_id: "CF003",
    vehicle: "VinFast VF9",
    year: 2024,
    plateNumber: "51C-11111",
    price: 1500000000,
    buyer: {
      member_id: "B003",
      name: "Hoàng Văn E",
      full_name: "Hoàng Văn E",
      phone: "0934567890",
      email: "hoangvane@email.com",
      address: "555 Đường Võ Văn Tần, Quận 3, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=68",
    },
    seller: {
      member_id: "S003",
      name: "Vũ Thị F",
      full_name: "Vũ Thị F",
      phone: "0945678901",
      email: "vuthif@email.com",
      address: "888 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=20",
    },
    status: "waiting_approval",
    costs: [
      { name: "Phí giao dịch xe", amount: 75000000, paidBy: "buyer", required: true },
      { name: "Phí nền tảng", amount: 30000000, paidBy: "buyer", required: true },
      { name: "Phí bảo hiểm chuyển nhượng", amount: 2500000, paidBy: "buyer", required: false },
      { name: "Phí vận chuyển", amount: 5000000, paidBy: "seller", required: false },
      { name: "Phí đăng kiểm", amount: 3000000, paidBy: "seller", required: false },
    ],
    created_at: "2024-10-28",
    buyer_token: "buyer_token_ghi789",
    seller_token: "seller_token_rst456",
  },
];

/** FLOW:
 * 1. pending          -> "Bắt đầu liên hệ"        -> contacting
 * 2. contacting       -> "Gửi form chi phí"       -> waiting_approval
 * 3. waiting_approval -> "Cả 2 duyệt xong"        -> awaiting_meeting
 * 4. awaiting_meeting -> "Soạn HĐ" (gặp mặt OK)   -> completed / failed
 */

// === STATUS CONFIG ===
const statusConfig = {
  pending: { label: "Chờ xử lý", badge: styles.statusPending, step: 0 },
  contacting: { label: "Đang liên hệ", badge: styles.statusContacting, step: 1 },
  waiting_approval: { label: "Chờ xác nhận", badge: styles.statusWaiting, step: 2 },
  awaiting_meeting: { label: "Đang chờ giao dịch", badge: styles.statusAwaiting, step: 3 },
  completed: { label: "Hoàn thành", badge: styles.statusCompleted, step: 4 },
  failed: { label: "Thất bại", badge: styles.statusFailed, step: 4 },
  cancelled: { label: "Hủy", badge: styles.statusCancelled, step: 4 },
};

// Service fees configuration
const serviceFees = [
  {
    service_fee_id: "SF001",
    name: "Phí giao dịch xe",
    percentage: 5,
    icon: Car,
    description: "Phí dịch vụ môi giới giao dịch xe điện",
  },
  {
    service_fee_id: "SF002",
    name: "Phí vận chuyển",
    fixed_amount: 5000000,
    icon: Car,
    description: "Chi phí vận chuyển xe đến địa điểm người mua",
  },
  {
    service_fee_id: "SF003",
    name: "Phí nền tảng",
    percentage: 2,
    icon: FileText,
    description: "Phí sử dụng nền tảng giao dịch",
  },
  {
    service_fee_id: "SF004",
    name: "Phí đăng kiểm",
    fixed_amount: 3000000,
    icon: FileText,
    description: "Chi phí đăng kiểm và kiểm định kỹ thuật",
  },
  {
    service_fee_id: "SF005",
    name: "Phí bảo hiểm chuyển nhượng",
    fixed_amount: 2500000,
    icon: FileText,
    description: "Phí bảo hiểm trong quá trình chuyển nhượng",
  },
];

const calculateFeeAmount = (fee, vehiclePrice) => {
  if (fee.percentage) {
    return (vehiclePrice * fee.percentage) / 100;
  }
  return fee.fixed_amount || 0;
};

// Convert request to contract format for modals
const convertRequestToContract = (request) => {
  return {
    construct_id: request.construct_id || request.id,
    vehicle: {
      vehicle_id: `V${request.id.slice(-3)}`,
      name: request.vehicle,
      year: request.year,
      price: request.price,
      licensePlate: request.plateNumber,
      brand: request.vehicle.split(" ")[0],
      model: request.vehicle.split(" ").slice(1).join(" "),
      mileage: request.mileage || 0,
    },
    buyer: request.buyer,
    seller: request.seller,
    payment_id: `P${request.id.slice(-3)}`,
    status: request.status === "pending" ? "pending_fee_selection" : request.status,
    created_at: request.created_at,
    buyer_token: request.buyer_token,
    seller_token: request.seller_token,
  };
};

// ---------------- Stepper ----------------
const steps = [
  { key: "pending", label: "Chờ xử lý" },
  { key: "contacting", label: "Đang liên hệ" },
  { key: "waiting_approval", label: "Chờ xác nhận" },
  { key: "awaiting_meeting", label: "Đang chờ giao dịch" },
  { key: "done", label: "Hoàn tất" },
];

const FlowStepper = ({ status }) => {
  const activeIdx = Math.min(statusConfig[status]?.step ?? 0, 4);
  return (
    <div className={styles.stepper}>
      {steps.map((s, idx) => {
        const done = idx < activeIdx;
        const active = idx === activeIdx;
        return (
          <div key={s.key} className={styles.stepItem}>
            <div
              className={`${styles.stepDot} ${done ? styles.stepDone : ""} ${active ? styles.stepActive : ""}`}
            >
              {done ? <Check size={14} /> : idx + 1}
            </div>
            <div className={`${styles.stepLabel} ${active ? styles.stepLabelActive : ""}`}>{s.label}</div>
            {idx < steps.length - 1 && (
              <div className={`${styles.stepBar} ${idx < activeIdx ? styles.stepBarDone : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ---------------- Components ----------------
const RequestList = ({ requests, selectedRequest, onSelect, searchTerm, onSearchChange }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h2 className={styles.cardTitle}>Danh sách hợp đồng</h2>
      {/* Search */}
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Tìm theo tên, biển số..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>
    </div>
    <div className={styles.list}>
      {requests.map((r) => (
        <div
          key={r.id}
          onClick={() => onSelect(r)}
          className={`${styles.listItem} ${selectedRequest?.id === r.id ? styles.listItemSelected : ""}`}
        >
          <div className={styles.listItemTop}>
            <div className={styles.listItemId}>{r.id}</div>
            <span className={`${styles.statusBadge} ${statusConfig[r.status]?.badge || styles.statusPending}`}>
              {statusConfig[r.status]?.label || "Chờ xử lý"}
            </span>
          </div>
          <div className={styles.listItemVehicle}>{r.vehicle}</div>
          <div className={styles.listItemPeople}>
            {r.buyer.name} ↔ {r.seller.name}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const VehicleInfo = ({ request }) => {
  const formatCurrency = (n) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  return (
    <div className={styles.card}>
      <h3 className={styles.sectionTitle}>Thông tin xe</h3>
      <div className={styles.grid2}>
        <div>
          <div className={styles.muted}>Tên xe</div>
          <div className={styles.textStrong}>{request.vehicle}</div>
        </div>
        <div>
          <div className={styles.muted}>Năm sản xuất</div>
          <div className={styles.textStrong}>{request.year}</div>
        </div>
        <div>
          <div className={styles.muted}>Biển số</div>
          <div className={styles.textStrong}>{request.plateNumber}</div>
        </div>
        <div>
          <div className={styles.muted}>Giá đề xuất</div>
          <div className={styles.price}>{formatCurrency(request.price)}</div>
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({ title, person, onCall, onZalo }) => (
  <div className={styles.card}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    <div className={styles.vStackSm}>
      <div className={styles.textStrong}>{person.name}</div>
      <div className={styles.muted}>{person.phone}</div>
      <div className={styles.muted}>{person.email}</div>
      <div className={styles.hStackSm}>
        <button
          className={`${styles.btn} ${styles.btnBlueSm}`}
          onClick={() => onCall && onCall(person.phone)}
        >
          <Phone size={14} /> Call
        </button>
        <button
          className={`${styles.btn} ${styles.btnGreenSm}`}
          onClick={() => onZalo && onZalo(person.phone)}
        >
          <MessageCircle size={14} /> Zalo
        </button>
      </div>
    </div>
  </div>
);

const CostTable = ({ costs, onEdit, getTotalCost, formatCurrency }) => (
  <div className={styles.card}>
    <div className={styles.cardToolbar}>
      <h3 className={styles.sectionTitle}>Bảng phân bổ chi phí</h3>
      <button onClick={onEdit} className={`${styles.btn} ${styles.btnGhost}`}>
        <Edit2 size={14} /> Chỉnh sửa
      </button>
    </div>
    <div className={styles.overflowXAuto}>
      <table className={styles.feeTable}>
        <thead className={styles.feeTableHeader}>
          <tr>
            <th className={styles.feeTableHeaderTh}>Loại phí</th>
            <th className={`${styles.feeTableHeaderTh} ${styles.feeTableHeaderThRight}`}>Số tiền</th>
            <th className={`${styles.feeTableHeaderTh} ${styles.feeTableHeaderThCenter}`}>Mua</th>
            <th className={`${styles.feeTableHeaderTh} ${styles.feeTableHeaderThCenter}`}>Bán</th>
            <th className={`${styles.feeTableHeaderTh} ${styles.feeTableHeaderThCenter}`}>Loại</th>
          </tr>
        </thead>
        <tbody className={styles.feeTableBody}>
          {costs.map((c, i) => (
            <tr key={i} className={styles.feeTableRow}>
              <td className={styles.feeTableCell}>
                <div className={styles.feeNameContainer}>
                  {c.name}
                  {c.required && <span className={styles.badgeRequired}>(BẮT BUỘC)</span>}
                </div>
              </td>
              <td className={`${styles.feeTableCell} ${styles.feeAmount}`}>{formatCurrency(c.amount)}</td>
              <td className={styles.feeTableCell}>
                {c.paidBy === "buyer" ? (
                  <div className={styles.checkIconContainer}>
                    <Check className={styles.checkIcon} />
                  </div>
                ) : (
                  <div className={styles.xIconContainer}>
                    <X className={styles.xIcon} />
                  </div>
                )}
              </td>
              <td className={styles.feeTableCell}>
                {c.paidBy === "seller" ? (
                  <div className={styles.checkIconContainer}>
                    <Check className={styles.checkIcon} />
                  </div>
                ) : (
                  <div className={styles.xIconContainer}>
                    <X className={styles.xIcon} />
                  </div>
                )}
              </td>
              <td className={styles.feeTableCell}>{c.required ? "Bắt buộc" : "Tùy chọn"}</td>
            </tr>
          ))}
          <tr className={styles.feeTableFooter}>
            <td className={styles.feeTableFooterCell}>Tổng cộng (mọi phí)</td>
            <td className={`${styles.feeTableFooterCell} ${styles.feeTableFooterCellRight}`}>
              {formatCurrency(getTotalCost(costs))}
            </td>
            <td colSpan={3}></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// ---------------- Main ----------------
export default function StaffDashboard() {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditCostModal, setShowEditCostModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showSendBuyerLink, setShowSendBuyerLink] = useState(false);
  const [showSendSellerLink, setShowSendSellerLink] = useState(false);
  const [editingCosts, setEditingCosts] = useState([]);
  const [meetingChecks, setMeetingChecks] = useState({ buyer: false, seller: false });
  const [costApprovals, setCostApprovals] = useState({ buyer: false, seller: false });
  const [constructFees, setConstructFees] = useState({});
  
  // State cho đơn hàng được gán từ Admin
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("contracts"); // "contracts" hoặc "assigned-orders"
  const currentStaffId = "staff1"; // TODO: Lấy từ authentication

  const formatCurrency = (n) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const getTotalCost = (arr) => arr.reduce((s, c) => s + c.amount, 0);

  const getMandatoryCost = (arr) => arr.filter((c) => c.required).reduce((s, c) => s + c.amount, 0);

  const handleSelectRequest = (r) => {
    setSelectedRequest(r);
    setEditingCosts([...r.costs]);
    setMeetingChecks({ buyer: false, seller: false });
    setCostApprovals({ buyer: false, seller: false });
  };

  const setStatus = (newStatus, msg) => {
    if (!selectedRequest) return;
    setRequests((prev) => prev.map((x) => (x.id === selectedRequest.id ? { ...x, status: newStatus } : x)));
    setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null));
    if (msg) alert(msg);
  };

  // ====== ACTIONS BY STAGE ======
  // 1) pending -> contacting
  const startContacting = () => setStatus("contacting", "Đã chuyển sang ĐANG LIÊN HỆ.");

  // 2) contacting -> waiting_approval (gửi form chi phí)
  const sendCostForm = () => {
    setStatus("waiting_approval", "Đã gửi form chi phí cho 2 bên.");
    setCostApprovals({ buyer: false, seller: false });
  };

  // 3) waiting_approval -> awaiting_meeting (khi cả 2 đã duyệt)
  const proceedToMeeting = () => {
    if (!costApprovals.buyer || !costApprovals.seller) {
      alert("Cần cả Người mua & Người bán đồng ý chi phí trước khi chuyển bước.");
      return;
    }
    setStatus("awaiting_meeting", "Đã chuyển sang ĐANG CHỜ GIAO DỊCH.");
  };

  // 4) awaiting_meeting -> soạn HĐ (mở modal, rồi hoàn tất/ thất bại)
  const handleCreateContract = () => setShowContractModal(true);

  const completeSuccess = () => {
    if (!selectedRequest) return;
    const requiredCosts = selectedRequest.costs.filter((c) => c.required);
    if (requiredCosts.length === 0) {
      alert("Thiếu phí nền tảng bắt buộc trong hợp đồng.");
      return;
    }
    setStatus("completed", "Giao dịch HOÀN THÀNH!");
    setShowContractModal(false);
  };

  const markFailed = () => {
    setStatus("failed", "Giao dịch THẤT BẠI.");
    setShowContractModal(false);
  };

  const cancelDeal = () => {
    if (confirm("Bạn chắc muốn hủy giao dịch này?")) setStatus("cancelled", "Giao dịch đã hủy.");
  };

  const saveCosts = () => {
    if (!selectedRequest) return;
    setRequests((p) => p.map((x) => (x.id === selectedRequest.id ? { ...x, costs: editingCosts } : x)));
    setSelectedRequest((p) => (p ? { ...p, costs: editingCosts } : null));
    if (["waiting_approval"].includes(selectedRequest.status)) {
      setCostApprovals({ buyer: false, seller: false });
    }
    setShowEditCostModal(false);
    alert("Đã cập nhật chi phí!");
  };

  const handleSaveBuyerFees = (feeData) => {
    if (!selectedRequest) return;
    const newCosts = feeData.map((f) => ({
      name: serviceFees.find((sf) => sf.service_fee_id === f.service_fee_id)?.name || "Phí",
      amount: f.fee,
      paidBy: "buyer",
      required: false,
    }));
    setEditingCosts((prev) => [...prev.filter((c) => c.paidBy !== "buyer"), ...newCosts]);
    setShowBuyerModal(false);
  };

  const handleSaveSellerFees = (feeData) => {
    if (!selectedRequest) return;
    const newCosts = feeData.map((f) => ({
      name: serviceFees.find((sf) => sf.service_fee_id === f.service_fee_id)?.name || "Phí",
      amount: f.fee,
      paidBy: "seller",
      required: false,
    }));
    setEditingCosts((prev) => [...prev.filter((c) => c.paidBy !== "seller"), ...newCosts]);
    setShowSellerModal(false);
  };

  const updateCost = (idx, field, value) => {
    const next = [...editingCosts];
    next[idx][field] = value;
    setEditingCosts(next);
  };

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [requests, searchTerm]);

  // Load assigned orders từ Admin
  useEffect(() => {
    const loadAssignedOrders = async () => {
      try {
        // TODO: Uncomment khi có API
        // const orders = await orderAssignmentService.getAssignedOrders(currentStaffId);
        // setAssignedOrders(orders);
        
        // Load từ localStorage tạm thời
        const orders = orderAssignmentService.getAssignedOrdersSync(currentStaffId);
        setAssignedOrders(orders);
      } catch (error) {
        console.error("Error loading assigned orders:", error);
      }
    };

    loadAssignedOrders();

    // Subscribe to storage changes (cross-tab communication)
    const unsubscribe = orderAssignmentService.subscribeToChanges(() => {
      loadAssignedOrders();
    });

    // Poll for updates every 5 seconds
    const interval = setInterval(loadAssignedOrders, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [currentStaffId]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) =>
        ["pending", "contacting", "waiting_approval", "awaiting_meeting"].includes(r.status)
      ).length,
      completed: requests.filter((r) => r.status === "completed").length,
      assignedOrders: assignedOrders.length,
    };
  }, [requests, assignedOrders]);

  // Don't auto-select - let user choose

  // Convert request to contract format
  const selectedContract = selectedRequest ? convertRequestToContract(selectedRequest) : null;

  // Calculate totals for modals
  const buyerTotal = useMemo(() => {
    if (!selectedRequest) return 0;
    return selectedRequest.costs.filter((c) => c.paidBy === "buyer").reduce((s, c) => s + c.amount, 0);
  }, [selectedRequest]);

  const sellerTotal = useMemo(() => {
    if (!selectedRequest) return 0;
    return selectedRequest.costs.filter((c) => c.paidBy === "seller").reduce((s, c) => s + c.amount, 0);
  }, [selectedRequest]);

  // Get current construct fees for modals
  const currentConstructFees = useMemo(() => {
    if (!selectedRequest) return { buyer: [], seller: [] };
    return {
      buyer: selectedRequest.costs
        .filter((c) => c.paidBy === "buyer")
        .map((c) => serviceFees.find((sf) => sf.name === c.name)?.service_fee_id || ""),
      seller: selectedRequest.costs
        .filter((c) => c.paidBy === "seller")
        .map((c) => serviceFees.find((sf) => sf.name === c.name)?.service_fee_id || ""),
    };
  }, [selectedRequest]);

  if (requests.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Staff Dashboard</h1>
          <p className={styles.subTitle}>Tổng quan & xử lý hợp đồng từ Admin</p>
        </div>
        <div className={styles.mainContent}>
          <p>Không có hợp đồng nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Staff Dashboard</h1>
          <p className={styles.subTitle}>Tổng quan & xử lý hợp đồng từ Admin</p>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button
            className={`${styles.btn} ${activeTab === "contracts" ? styles.btnPrimary : styles.btnGhost}`}
            onClick={() => setActiveTab("contracts")}
          >
            <FileText size={16} /> Hợp đồng
          </button>
          <button
            className={`${styles.btn} ${activeTab === "assigned-orders" ? styles.btnPrimary : styles.btnGhost}`}
            onClick={() => setActiveTab("assigned-orders")}
          >
            <Package size={16} /> Đơn hàng được gán
            {assignedOrders.length > 0 && (
              <span style={{ marginLeft: 8, background: "#ff4d4f", color: "white", borderRadius: "10px", padding: "2px 8px", fontSize: 12 }}>
                {assignedOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={`${styles.stat} ${styles.statOrange}`}>
          <div className={styles.statNumber}>{stats.total}</div>
          <div className={styles.statLabel}>Tổng hợp đồng</div>
        </div>
        <div className={`${styles.stat} ${styles.statYellow}`}>
          <div className={styles.statNumber}>{stats.pending}</div>
          <div className={styles.statLabel}>Đang xử lý</div>
        </div>
        <div className={`${styles.stat} ${styles.statGreen}`}>
          <div className={styles.statNumber}>{stats.completed}</div>
          <div className={styles.statLabel}>Hoàn thành</div>
        </div>
      </div>

      {activeTab === "contracts" ? (
        <div className={styles.columns}>
          {/* Left: List */}
          <div className={styles.colLeft}>
            <RequestList
              requests={filteredRequests}
              selectedRequest={selectedRequest}
              onSelect={handleSelectRequest}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          {/* Right: Detail */}
          <div className={styles.colRight}>
          {selectedRequest ? (
            <>
              {/* Stepper */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>Tiến trình giao dịch</div>
                </div>
                <div style={{ padding: "16px" }}>
                  <FlowStepper status={selectedRequest.status} />
                </div>
              </div>

              <VehicleInfo request={selectedRequest} />

              <div className={styles.grid2Gap}>
                <ContactCard
                  title="Người Mua"
                  person={selectedRequest.buyer}
                  onCall={(phone) => window.open(`tel:${phone}`)}
                  onZalo={(phone) => window.open(`https://zalo.me/${phone.replace(/\D/g, "")}`)}
                />
                <ContactCard
                  title="Người Bán"
                  person={selectedRequest.seller}
                  onCall={(phone) => window.open(`tel:${phone}`)}
                  onZalo={(phone) => window.open(`https://zalo.me/${phone.replace(/\D/g, "")}`)}
                />
              </div>

              <CostTable
                costs={selectedRequest.costs}
                onEdit={() => setShowEditCostModal(true)}
                getTotalCost={getTotalCost}
                formatCurrency={formatCurrency}
              />

              {/* Actions by stage */}
              <div className={styles.card}>
                <h3 className={styles.sectionTitle}>Hành động xử lý</h3>
                <div className={styles.vStackSm}>
                  {selectedRequest.status === "pending" && (
                    <button className={`${styles.btn} ${styles.btnPrimaryLg}`} onClick={startContacting}>
                      Bắt đầu liên hệ 
                    </button>
                  )}

                  {selectedRequest.status === "contacting" && (
                    <>
                      <div className={styles.block}>
                        <div className={styles.blockTitle}>
                          <AlertCircle size={16} className={styles.iconWarn} /> Đang liên hệ 2 bên & điền bảng chi phí
                        </div>
                        <div className={styles.muted}>
                          Staff cập nhật chi phí sau khi trao đổi (có thể có người đi cùng 2 bên).
                        </div>
                      </div>
                      <div className={styles.hStackSm}>
                        <button
                          className={`${styles.btn} ${styles.btnGhost}`}
                          onClick={() => setShowEditCostModal(true)}
                        >
                          <Edit2 size={16} /> Chỉnh phí
                        </button>
                        <button className={`${styles.btn} ${styles.btnGreenLg}`} onClick={sendCostForm}>
                          Gửi form chi phí 
                        </button>
                      </div>
                    </>
                  )}

                  {selectedRequest.status === "waiting_approval" && (
                    <div className={styles.vStackSm}>
                      <div className={styles.block}>
                        <div className={styles.blockTitle}>
                          <AlertCircle size={16} className={styles.iconWarn} /> Xác nhận chi phí
                        </div>
                        <label className={styles.checkboxRow}>
                          <input
                            type="checkbox"
                            checked={costApprovals.buyer}
                            onChange={(e) => setCostApprovals((p) => ({ ...p, buyer: e.target.checked }))}
                          />
                          <span>Người mua đồng ý</span>
                        </label>
                        <label className={styles.checkboxRow}>
                          <input
                            type="checkbox"
                            checked={costApprovals.seller}
                            onChange={(e) => setCostApprovals((p) => ({ ...p, seller: e.target.checked }))}
                          />
                          <span>Người bán đồng ý</span>
                        </label>
                      </div>
                      <div className={styles.hStackSm}>
                        <button
                          className={`${styles.btn} ${styles.btnGhost}`}
                          onClick={() => setShowEditCostModal(true)}
                        >
                          <Edit2 size={16} /> Sửa phí (gửi lại)
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnPrimaryLg} ${
                            !(costApprovals.buyer && costApprovals.seller) ? styles.btnDisabled : ""
                          }`}
                          disabled={!(costApprovals.buyer && costApprovals.seller)}
                          onClick={proceedToMeeting}
                        >
                          Xác Nhận
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedRequest.status === "awaiting_meeting" && (
                    <div className={styles.vStackSm}>
                      <div className={styles.block}>
                        <div className={styles.blockTitle}>
                          <AlertCircle size={16} className={styles.iconWarn} /> Hẹn gặp & soạn HĐ
                        </div>
                        <label className={styles.checkboxRow}>
                          <input
                            type="checkbox"
                            checked={meetingChecks.buyer}
                            onChange={(e) => setMeetingChecks((p) => ({ ...p, buyer: e.target.checked }))}
                          />
                          <span>Người mua xác nhận lịch gặp</span>
                        </label>
                        <label className={styles.checkboxRow}>
                          <input
                            type="checkbox"
                            checked={meetingChecks.seller}
                            onChange={(e) => setMeetingChecks((p) => ({ ...p, seller: e.target.checked }))}
                          />
                          <span>Người bán xác nhận lịch gặp</span>
                        </label>
                      </div>
                      <button
                        className={`${styles.btn} ${styles.btnPurpleLg} ${
                          !(meetingChecks.buyer && meetingChecks.seller) ? styles.btnDisabled : ""
                        }`}
                        disabled={!(meetingChecks.buyer && meetingChecks.seller)}
                        onClick={handleCreateContract}
                      >
                        Soạn hợp đồng
                      </button>
                    </div>
                  )}

                  {["pending", "contacting", "waiting_approval", "awaiting_meeting"].includes(
                    selectedRequest.status
                  ) && (
                    <div className={styles.cancelButtonContainer}>
                      <button onClick={cancelDeal} className={`${styles.btn} ${styles.btnDangerSm}`}>
                        Hủy giao dịch
                      </button>
                    </div>
                  )}

                  {selectedRequest.status === "completed" && (
                    <div className={styles.doneText}>Giao dịch đã hoàn thành</div>
                  )}

                  {selectedRequest.status === "failed" && (
                    <div className={styles.doneText} style={{ color: "#b91c1c" }}>
                      Giao dịch thất bại
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.empty}>Chọn một hợp đồng để xem chi tiết</div>
          )}
        </div>
      </div>
      ) : (
        <div className={styles.columns}>
          <div className={styles.colLeft}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Đơn hàng được gán từ Admin</h2>
              </div>
              <div className={styles.list}>
                {assignedOrders.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
                    <Package size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                    <p>Chưa có đơn hàng nào được gán</p>
                  </div>
                ) : (
                  assignedOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className={styles.listItem}
                      onClick={() => {
                        // TODO: Mở modal chi tiết đơn hàng
                        alert(`Chi tiết đơn hàng: ${order.orderId}\nSản phẩm: ${order.productName}\nGiá đề xuất: ${order.offerPrice.toLocaleString()}₫`);
                      }}
                    >
                      <div className={styles.listItemTop}>
                        <div className={styles.listItemId}>{order.orderId}</div>
                        <span className={styles.statusBadge} style={{ background: "#1677ff", color: "white" }}>
                          Đã gán
                        </span>
                      </div>
                      <div className={styles.listItemVehicle}>{order.productName}</div>
                      <div className={styles.listItemPeople}>
                        Giá đề xuất: {order.offerPrice?.toLocaleString()}₫
                      </div>
                      <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                        Gán lúc: {order.assignedAt ? new Date(order.assignedAt).toLocaleString("vi-VN") : "N/A"}
                      </div>
                      <button
                        className={`${styles.btn} ${styles.btnPrimarySm}`}
                        style={{ marginTop: 12, width: "100%" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Xử lý đơn hàng
                          alert(`Xử lý đơn hàng: ${order.orderId}`);
                        }}
                      >
                        Xử lý đơn hàng
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className={styles.colRight}>
            <div className={styles.empty}>
              {selectedRequest ? "Chọn một đơn hàng để xem chi tiết" : "Chọn một đơn hàng từ danh sách để xem chi tiết"}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Cost */}
      {showEditCostModal && selectedRequest && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.modalMd}`}>
            <h3 className={styles.modalTitle}>Chỉnh sửa chi phí</h3>
            <div className={styles.vStackSm}>
              {editingCosts.map((cost, idx) => (
                <div key={idx} className={styles.costRow}>
                  <input
                    className={styles.input}
                    type="text"
                    value={cost.name}
                    onChange={(e) => updateCost(idx, "name", e.target.value)}
                    placeholder="Tên phí"
                  />
                  <input
                    className={styles.input}
                    type="number"
                    value={cost.amount}
                    onChange={(e) => updateCost(idx, "amount", parseInt(e.target.value) || 0)}
                    placeholder="Số tiền"
                  />
                  <div className={styles.payerRow}>
                    <label className={styles.radioRow}>
                      <input
                        type="radio"
                        name={`payer-${idx}`}
                        checked={cost.paidBy === "buyer"}
                        onChange={() => updateCost(idx, "paidBy", "buyer")}
                      />{" "}
                      Người mua
                    </label>
                    <label className={styles.radioRow}>
                      <input
                        type="radio"
                        name={`payer-${idx}`}
                        checked={cost.paidBy === "seller"}
                        onChange={() => updateCost(idx, "paidBy", "seller")}
                      />{" "}
                      Người bán
                    </label>
                    <label className={styles.checkboxRowRight}>
                      <input
                        type="checkbox"
                        checked={!!cost.required}
                        onChange={(e) => updateCost(idx, "required", e.target.checked)}
                      />
                      <span>Phí nền tảng (bắt buộc)</span>
                    </label>
                  </div>
                  <button
                    className={styles.linkDanger}
                    onClick={() => setEditingCosts((p) => p.filter((_, i) => i !== idx))}
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <button
                className={styles.addDashed}
                onClick={() =>
                  setEditingCosts((p) => [...p, { name: "", amount: 0, paidBy: "buyer", required: false }])
                }
              >
                + Thêm phí mới
              </button>
            </div>
            <div className={styles.modalActions}>
              <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setShowEditCostModal(false)}>
                Hủy
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={saveCosts}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Contract */}
      {showContractModal && selectedRequest && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.modalLg}`}>
            <h2 className={styles.contractTitle}>HỢP ĐỒNG MUA BÁN XE ĐIỆN</h2>
            <div className={styles.contractBox}>
              <div className={styles.grid2}>
                <div>
                  <strong>Mã hợp đồng:</strong> HD-2025-{selectedRequest.id}
                </div>
                <div className={styles.tr}>
                  <strong>Ngày:</strong> {new Date().toLocaleDateString("vi-VN")}
                </div>
              </div>
              <div className={styles.vStackXs}>
                <div>
                  <strong>1. Bên bán:</strong> {selectedRequest.seller.name} - SĐT: {selectedRequest.seller.phone}
                </div>
                <div>
                  <strong>2. Bên mua:</strong> {selectedRequest.buyer.name} - SĐT: {selectedRequest.buyer.phone}
                </div>
                <div>
                  <strong>3. Xe:</strong> {selectedRequest.vehicle} ({selectedRequest.year}) - Biển số:{" "}
                  {selectedRequest.plateNumber}
                </div>
                <div>
                  <strong>4. Giá bán:</strong> {formatCurrency(selectedRequest.price)}
                </div>
                <div>
                  <strong>5. Chi phí giao dịch:</strong>
                  <ul className={styles.ul}>
                    {selectedRequest.costs.map((c, idx) => (
                      <li key={idx}>
                        - {c.name}: {formatCurrency(c.amount)} ({c.paidBy === "buyer" ? "Người mua" : "Người bán"}{" "}
                        chịu)
                        {c.required && <span className={styles.badgeRequiredInline}>(BẮT BUỘC)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.contractTotal}>
                  <strong>TỔNG THANH TOÁN (giá + phí bắt buộc):</strong>
                  <span className={styles.totalNumber}>
                    {formatCurrency(selectedRequest.price + getMandatoryCost(selectedRequest.costs))}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.signRow}>
              <div className={styles.signBox}>
                <div className={styles.signSlot}>Chữ ký điện tử</div>
                <div className={styles.textStrong}>{selectedRequest.buyer.name}</div>
                <div className={styles.muted}>(Người mua)</div>
              </div>
              <div className={styles.signBox}>
                <div className={styles.signSlot}>Chữ ký điện tử</div>
                <div className={styles.textStrong}>{selectedRequest.seller.name}</div>
                <div className={styles.muted}>(Người bán)</div>
              </div>
            </div>

            <div className={styles.hStackSm}>
              <button className={`${styles.btn} ${styles.btnGhost}`}>
                <Download size={16} /> Tải PDF
              </button>
              <button className={`${styles.btn} ${styles.btnGhost}`}>
                <Mail size={16} /> Gửi Email/Zalo
              </button>
            </div>

            <div className={styles.modalActions}>
              <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setShowContractModal(false)}>
                Đóng
              </button>
              <button className={`${styles.btn} ${styles.btnGreen}`} onClick={completeSuccess}>
                HOÀN THÀNH
              </button>
              <button className={`${styles.btn} ${styles.btnDangerSm}`} onClick={markFailed}>
                ĐÁNH DẤU THẤT BẠI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Modals */}
      {selectedContract && (
        <>
          <FeeSelectionModal
            isOpen={showBuyerModal}
            onClose={() => setShowBuyerModal(false)}
            contract={selectedContract}
            memberType="buyer"
            currentSelections={currentConstructFees.buyer}
            onSave={handleSaveBuyerFees}
            serviceFees={serviceFees}
            calculateFeeAmount={calculateFeeAmount}
          />

          <FeeSelectionModal
            isOpen={showSellerModal}
            onClose={() => setShowSellerModal(false)}
            contract={selectedContract}
            memberType="seller"
            currentSelections={currentConstructFees.seller}
            onSave={handleSaveSellerFees}
            serviceFees={serviceFees}
            calculateFeeAmount={calculateFeeAmount}
          />

          <SendLinkModal
            isOpen={showSendBuyerLink}
            onClose={() => setShowSendBuyerLink(false)}
            contract={selectedContract}
            memberType="buyer"
          />

          <SendLinkModal
            isOpen={showSendSellerLink}
            onClose={() => setShowSendSellerLink(false)}
            contract={selectedContract}
            memberType="seller"
          />

          <ContractDetailModal
            isOpen={false}
            onClose={() => {}}
            contract={selectedContract}
            constructFees={constructFees}
            serviceFees={serviceFees}
            calculateFeeAmount={calculateFeeAmount}
          />
        </>
      )}
    </div>
  );
}
