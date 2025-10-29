import React, { useState } from "react";
import "./HomeStaff.css"; // Đảm bảo đường dẫn này đúng
import {
  Bell,
  User,
  LogOut,
  Home,
  List,
  ChevronDown,
  History,
  BarChart,
  Search,
  Calendar,
  Eye,
  FileText,
  Car,
  DollarSign,
  TrendingUp,
  Clock,
  X,
  Phone,
  Download,
  CheckCircle,
  Image,
  AlertCircle,
} from "lucide-react";

const HomeStaff = () => {
  const [data] = useState([
    {
      id: "REQ-20251001",
      sellerName: "Trần Văn B",
      contractCode: "HD-0952",
      licensePlate: "59A1-123.45",
      salePrice: "35.000.000đ",
      transactionFee: "3% (1.050.000đ)",
      status: "Chờ xử lý",
      dateSent: "21/10/2025",
      priority: "high",
      contractDetails: {
        contractCode: "HD-0952",
        signDate: "18/10/2025",
        seller: "Trần Văn B",
        sellerPhone: "0901234567",
        buyer: "Nguyễn Thị C",
        buyerPhone: "0912345678",
        vehicle: "VinFast Klara S – 2022 – Màu đỏ",
        salePrice: "35.000.000đ",
        transactionFee: "3% (1.050.000đ)",
        totalPayment: "33.950.000đ",
      },
      documents: [
        { name: "File hợp đồng (PDF)", icon: <FileText size={16} /> },
        { name: "Ảnh đăng ký xe", icon: <Image size={16} /> },
        { name: "Ảnh xe thật", icon: <Image size={16} /> },
        { name: "Hóa đơn chuyển tiền", icon: <DollarSign size={16} /> },
      ],
    },
    {
      id: "REQ-20251002",
      sellerName: "Phạm Thị D",
      contractCode: "HD-0953",
      licensePlate: "59B1-678.90",
      salePrice: "40.000.000đ",
      transactionFee: "3% (1.200.000đ)",
      status: "Đã thanh toán",
      dateSent: "20/10/2025",
      priority: "normal",
      contractDetails: {
        contractCode: "HD-0953",
        signDate: "17/10/2025",
        seller: "Phạm Thị D",
        sellerPhone: "0987654321",
        buyer: "Lê Văn E",
        buyerPhone: "0976543210",
        vehicle: "Audi E-tron – 2023 – Màu trắng",
        salePrice: "40.000.000đ",
        transactionFee: "3% (1.200.000đ)",
        totalPayment: "38.800.000đ",
      },
      documents: [
        { name: "File hợp đồng (PDF)", icon: <FileText size={16} /> },
        { name: "Ảnh đăng ký xe", icon: <Image size={16} /> },
        { name: "Ảnh xe thật", icon: <Image size={16} /> },
        { name: "Hóa đơn chuyển tiền", icon: <DollarSign size={16} /> },
      ],
    },
    {
      id: "REQ-20251003",
      sellerName: "Lê Văn F",
      contractCode: "HD-0954",
      licensePlate: "60C1-111.22",
      salePrice: "25.000.000đ",
      transactionFee: "3% (750.000đ)",
      status: "Yêu cầu bổ sung",
      dateSent: "19/10/2025",
      priority: "medium",
      contractDetails: {
        contractCode: "HD-0954",
        signDate: "16/10/2025",
        seller: "Lê Văn F",
        sellerPhone: "0965432109",
        buyer: "Trần Thị G",
        buyerPhone: "0954321098",
        vehicle: "Geely EX5 – 2021 – Màu đen",
        salePrice: "25.000.000đ",
        transactionFee: "3% (750.000đ)",
        totalPayment: "24.250.000đ",
      },
      documents: [
        { name: "File hợp đồng (PDF)", icon: <FileText size={16} /> },
        { name: "Ảnh đăng ký xe", icon: <Image size={16} /> },
      ],
    },
  ]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Yêu cầu mới từ Admin",
      message: "Có 1 hợp đồng mới cần xử lý - HD-0952",
      time: "5 phút trước",
      isNew: true,
    },
    {
      id: 2,
      title: "Cập nhật trạng thái",
      message: "Hợp đồng HD-0953 đã được thanh toán thành công",
      time: "1 giờ trước",
      isNew: true,
    },
    {
      id: 3,
      title: "Nhắc nhở",
      message: "Còn 3 yêu cầu đang chờ xử lý",
      time: "2 giờ trước",
      isNew: false,
    },
    {
      id: 4,
      title: "Thông báo hệ thống",
      message: "Hệ thống sẽ bảo trì vào 23:00 tối nay",
      time: "3 giờ trước",
      isNew: false,
    },
  ];

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  const getStatusConfig = (status) => {
    const configs = {
      "Chờ xử lý": { icon: <Clock size={14} /> },
      "Đã thanh toán": { icon: <CheckCircle size={14} /> },
      "Yêu cầu bổ sung": { icon: <AlertCircle size={14} /> },
    };
    return configs[status] || configs["Chờ xử lý"];
  };

  const getPriorityClass = (priority) => {
    const classes = {
      high: "priority-high",
      medium: "priority-medium",
      normal: "priority-normal",
    };
    return classes[priority] || classes["normal"];
  };

  const getStatusClass = (status) => {
    const classes = {
      "Chờ xử lý": "status-pending",
      "Đã thanh toán": "status-paid",
      "Yêu cầu bổ sung": "status-info",
    };
    return classes[status] || classes["Chờ xử lý"];
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contractCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="staff-container">
      {/* Header */}
      <header className="staff-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-box">{/* Logo để trống */}</div>
              <div className="title-section">
                <h1 className="main-title">EV Battery Hub</h1>
                <p className="subtitle">Hệ thống quản lý thanh toán</p>
              </div>
            </div>
          </div>

          <div className="header-right">
            {/* Notification Bell */}
            <div className="notification-wrapper">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="notification-btn"
              >
                <Bell size={20} />
                {notifications.filter((n) => n.isNew).length > 0 && (
                  <span className="notification-badge"></span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Thông báo</h3>
                    <p>
                      {notifications.filter((n) => n.isNew).length} thông báo
                      mới
                    </p>
                  </div>
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          notification.isNew ? "is-new" : ""
                        }`}
                      >
                        <div className="notification-content">
                          <div
                            className={`notification-dot ${
                              notification.isNew ? "is-new" : ""
                            }`}
                          ></div>
                          <div className="notification-text">
                            <div className="notification-title-row">
                              <h4>{notification.title}</h4>
                              {notification.isNew && (
                                <span className="new-badge">Mới</span>
                              )}
                            </div>
                            <p className="notification-message">
                              {notification.message}
                            </p>
                            <span className="notification-time">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="notification-footer">
                    <button>Xem tất cả thông báo</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="user-menu-wrapper">
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="user-info-box"
              >
                <div className="user-text">
                  <div className="user-name">Nguyễn Văn A</div>
                  <div className="user-role">Staff</div>
                </div>
                <div className="avatar-box">{/* Avatar để trống */}</div>
              </div>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-name">Nguyễn Văn A</div>
                    <div className="user-dropdown-email">
                      nva@evbatteryhub.com
                    </div>
                  </div>
                  <button className="user-dropdown-item">
                    <User size={18} />
                    <span>Hồ sơ cá nhân</span>
                  </button>
                  <button className="user-dropdown-item logout">
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="staff-nav">
          <div className="nav-content">
            <button className="nav-item active">
              <Home size={18} />
              <span>Trang chủ</span>
            </button>

            <div className="nav-item-wrapper">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="nav-item"
              >
                <List size={18} />
                <span>Danh sách yêu cầu</span>
                <ChevronDown
                  size={16}
                  className={showDropdown ? "rotate" : ""}
                />
              </button>

              {showDropdown && (
                <div className="nav-dropdown">
                  <button>Tất cả yêu cầu</button>
                  <button>Yêu cầu chờ xử lý</button>
                  <button>Yêu cầu đã xử lý</button>
                </div>
              )}
            </div>

            <button className="nav-item">
              <History size={18} />
              <span>Lịch sử</span>
            </button>

            <button className="nav-item">
              <BarChart size={18} />
              <span>Báo cáo</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="staff-main">
        <div className="main-grid">
          {/* Main Dashboard */}
          <div className="main-section">
            {/* Search and Filter Bar */}
            <div className="search-filter-card">
              <div className="search-filter-content">
                <div className="search-box">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, mã hợp đồng, biển số..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Chờ xử lý">Chờ xử lý</option>
                  <option value="Đã thanh toán">Đã thanh toán</option>
                  <option value="Yêu cầu bổ sung">Yêu cầu bổ sung</option>
                </select>
              </div>
            </div>

            {/* Request Cards */}
            <div className="requests-section">
              <h2 className="section-title">
                <div className="title-bar"></div>
                Danh sách yêu cầu thanh toán
                <span className="request-count">
                  {filteredData.length} yêu cầu
                </span>
              </h2>

              {filteredData.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Search size={32} />
                  </div>
                  <h3>Không tìm thấy yêu cầu nào</h3>
                  <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              ) : (
                filteredData.map((request) => {
                  const statusConfig = getStatusConfig(request.status);
                  return (
                    <div
                      key={request.id}
                      className={`request-card ${getPriorityClass(
                        request.priority
                      )}`}
                    >
                      <div className="card-content">
                        <div className="card-header">
                          <div className="card-header-left">
                            <div className="card-title-row">
                              <h3 className="card-id">{request.id}</h3>
                              <span
                                className={`status-badge ${getStatusClass(
                                  request.status
                                )}`}
                              >
                                {statusConfig.icon}
                                {request.status}
                              </span>
                            </div>
                            <div className="card-date">
                              <Calendar size={14} />
                              <span>Gửi ngày: {request.dateSent}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleViewDetails(request)}
                            className="detail-btn"
                          >
                            <Eye size={16} />
                            Chi tiết
                          </button>
                        </div>

                        <div className="card-grid">
                          <div className="card-field">
                            <div className="field-label">
                              <User size={14} />
                              Người bán
                            </div>
                            <div className="field-value">
                              {request.sellerName}
                            </div>
                          </div>

                          <div className="card-field">
                            <div className="field-label">
                              <FileText size={14} />
                              Mã hợp đồng
                            </div>
                            <div className="field-value">
                              {request.contractCode}
                            </div>
                          </div>

                          <div className="card-field">
                            <div className="field-label">
                              <Car size={14} />
                              Biển số xe
                            </div>
                            <div className="field-value">
                              {request.licensePlate}
                            </div>
                          </div>

                          <div className="card-field">
                            <div className="field-label">
                              <DollarSign size={14} />
                              Giá bán
                            </div>
                            <div className="field-value price">
                              {request.salePrice}
                            </div>
                          </div>
                        </div>

                        <div className="card-footer">
                          <div className="fee-info">
                            Phí giao dịch: <span>{request.transactionFee}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="stats-section">
            <div className="stats-card">
              <h2 className="stats-title">
                <TrendingUp size={20} />
                Thống kê tháng này
              </h2>

              <div className="stats-list">
                <div className="stat-item primary">
                  <div className="stat-label">Hợp đồng đã xử lý</div>
                  <div className="stat-value">15</div>
                  <div className="stat-trend">
                    <TrendingUp size={12} />
                    +20% so với tháng trước
                  </div>
                </div>

                <div className="stat-item success">
                  <div className="stat-label">Tổng giá trị thanh toán</div>
                  <div className="stat-value">500.000.000đ</div>
                </div>

                <div className="stat-item info">
                  <div className="stat-label">Tổng phí thu về</div>
                  <div className="stat-value">15.000.000đ</div>
                </div>

                <div className="stat-item warning">
                  <div className="stat-label-with-icon">
                    <Clock size={14} />
                    Đang chờ xử lý
                  </div>
                  <div className="stat-value">3</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Chi tiết yêu cầu thanh toán</h2>
                <p className="modal-subtitle">{selectedRequest.id}</p>
              </div>
              <button onClick={handleCloseModal} className="modal-close-btn">
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* Contract Info */}
              <div className="modal-section contract-section">
                <h3 className="section-header">
                  <FileText size={20} />
                  Thông tin hợp đồng
                </h3>

                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-label">
                      <FileText size={12} />
                      Mã hợp đồng
                    </div>
                    <div className="info-value">
                      {selectedRequest.contractDetails.contractCode}
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-label">
                      <Calendar size={12} />
                      Ngày ký
                    </div>
                    <div className="info-value">
                      {selectedRequest.contractDetails.signDate}
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-label">
                      <User size={12} />
                      Người bán
                    </div>
                    <div className="info-value">
                      {selectedRequest.contractDetails.seller}
                    </div>
                    <div className="info-sub">
                      <Phone size={12} />
                      {selectedRequest.contractDetails.sellerPhone}
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-label">
                      <User size={12} />
                      Người mua
                    </div>
                    <div className="info-value">
                      {selectedRequest.contractDetails.buyer}
                    </div>
                    <div className="info-sub">
                      <Phone size={12} />
                      {selectedRequest.contractDetails.buyerPhone}
                    </div>
                  </div>

                  <div className="info-card full-width">
                    <div className="info-label">
                      <Car size={12} />
                      Xe giao dịch
                    </div>
                    <div className="info-value">
                      {selectedRequest.contractDetails.vehicle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="modal-section payment-section">
                <h3 className="section-header">
                  <DollarSign size={20} />
                  Thông tin thanh toán
                </h3>

                <div className="payment-list">
                  <div className="payment-item">
                    <span>Giá bán</span>
                    <span className="payment-value">
                      {selectedRequest.contractDetails.salePrice}
                    </span>
                  </div>

                  <div className="payment-item">
                    <span>Phí giao dịch</span>
                    <span className="payment-value fee">
                      {selectedRequest.contractDetails.transactionFee}
                    </span>
                  </div>

                  <div className="payment-item total">
                    <span>Tổng thanh toán cho người bán</span>
                    <span className="payment-value">
                      {selectedRequest.contractDetails.totalPayment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="modal-section documents-section">
                <h3 className="section-header">
                  <Image size={20} />
                  Tài liệu đính kèm
                </h3>

                <div className="documents-grid">
                  {selectedRequest.documents.map((doc, index) => (
                    <div key={index} className="document-card">
                      <div className="document-icon">{doc.icon}</div>
                      <div className="document-info">
                        <div className="document-name">{doc.name}</div>
                        <div className="document-action">Click để xem</div>
                      </div>
                      <Download size={16} className="download-icon" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="modal-actions">
                <button className="action-btn confirm-btn">
                  <CheckCircle size={20} />
                  Xác nhận hợp lệ
                </button>

                <button className="action-btn request-btn">
                  <Bell size={20} />
                  Yêu cầu bổ sung
                </button>

                <button className="action-btn payment-btn">
                  <DollarSign size={20} />
                  Thực hiện thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeStaff;
